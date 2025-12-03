import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onNewTask?: () => void;
  onFocusSearch?: () => void;
  onToggleTheme?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({
  onNewTask,
  onFocusSearch,
  onToggleTheme,
  onEscape,
}: KeyboardShortcuts) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (event.key === 'Escape' && onEscape) {
      onEscape();
      return;
    }

    if (isInput) return;

    switch (event.key.toLowerCase()) {
      case 'n':
        event.preventDefault();
        onNewTask?.();
        break;
      case '/':
        event.preventDefault();
        onFocusSearch?.();
        break;
      case 'd':
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          onToggleTheme?.();
        }
        break;
    }
  }, [onNewTask, onFocusSearch, onToggleTheme, onEscape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
