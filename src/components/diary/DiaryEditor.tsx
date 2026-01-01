import React, { memo, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DiaryFont } from './DiaryFontSelector';

interface DiaryEditorProps {
  content: string;
  font: DiaryFont;
  fontSize: number;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const DiaryEditor = memo(function DiaryEditor({
  content,
  font,
  fontSize,
  onChange,
  placeholder = 'Dear diary...',
}: DiaryEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);
  const lastContentRef = useRef(content);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && content !== lastContentRef.current) {
      // Preserve cursor position when content changes externally
      const selection = window.getSelection();
      const hadFocus = document.activeElement === editorRef.current;
      
      editorRef.current.innerHTML = content || '';
      lastContentRef.current = content;
      
      // Restore focus if it was focused
      if (hadFocus && selection) {
        editorRef.current.focus();
        // Move cursor to end
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [content]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (isComposingRef.current) return;
    
    const newContent = editorRef.current?.innerHTML || '';
    if (newContent !== lastContentRef.current) {
      lastContentRef.current = newContent;
      onChange(newContent);
    }
  }, [onChange]);

  // Handle composition events for IME support
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    handleInput();
  }, [handleInput]);

  // Handle paste to strip formatting except basic styles
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Allow basic formatting shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          break;
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className={cn(
          'diary-editor',
          'min-h-[350px] w-full',
          'outline-none border-none',
          'text-foreground/90',
          'leading-relaxed',
          // Smooth text rendering
          'antialiased',
          // Empty state styling
          'empty:before:content-[attr(data-placeholder)]',
          'empty:before:text-muted-foreground/40',
          'empty:before:pointer-events-none'
        )}
        style={{
          fontFamily: font.family,
          fontSize: `${fontSize}px`,
          lineHeight: `${Math.max(fontSize * 1.6, 28)}px`,
          caretColor: 'hsl(var(--foreground) / 0.7)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          wordSpacing: '0.05em',
          letterSpacing: '0.01em',
        }}
      />
    </motion.div>
  );
});
