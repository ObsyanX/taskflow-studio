// Web Crypto API utilities for diary encryption

/**
 * Generate a random salt for key derivation
 */
export function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return arrayBufferToBase64(salt);
}

/**
 * Generate a random IV for AES-GCM encryption
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * Derive an encryption key from PIN using PBKDF2
 */
async function deriveKey(pin: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const pinData = encoder.encode(pin);
  const saltData = base64ToArrayBuffer(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinData as BufferSource,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltData as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Hash a PIN using SHA-256 for verification
 */
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToBase64(new Uint8Array(hashBuffer));
}

/**
 * Encrypt data using AES-GCM
 */
export async function encryptData(data: string, pin: string, salt: string): Promise<{ encrypted: string; iv: string }> {
  const key = await deriveKey(pin, salt);
  const iv = generateIV();
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    encodedData as BufferSource
  );

  return {
    encrypted: arrayBufferToBase64(new Uint8Array(encryptedBuffer as ArrayBuffer)),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(encryptedData: string, iv: string, pin: string, salt: string): Promise<string> {
  const key = await deriveKey(pin, salt);
  const ivData = base64ToArrayBuffer(iv);
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivData as BufferSource },
    key,
    encryptedBuffer as BufferSource
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Convert ArrayBuffer to Base64 string
 */
function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
