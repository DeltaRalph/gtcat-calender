import { useEffect } from 'react';
import { ViewMode } from '../types/calendar';

interface ShortcutHandlers {
  onToday: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToggleSidebar: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
}

export function useKeyboardShortcuts({
  onToday,
  onPrevWeek,
  onNextWeek,
  onToggleSidebar,
  onViewModeChange,
  onOpenAddModal,
  onOpenSettings,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is currently typing in an input, textarea or modal form, ignore shortcuts!
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check key
      const key = e.key.toLowerCase();

      if (key === 't') {
        e.preventDefault();
        onToday();
      } else if (key === 'b') {
        e.preventDefault();
        onToggleSidebar();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrevWeek();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNextWeek();
      } else if (key === 'c') {
        e.preventDefault();
        onOpenAddModal();
      } else if (key === '1') {
        e.preventDefault();
        onViewModeChange('matrix');
      } else if (key === '2') {
        e.preventDefault();
        onViewModeChange('agenda');
      } else if (key === '3') {
        e.preventDefault();
        onViewModeChange('cards');
      } else if (key === ',') {
        e.preventDefault();
        onOpenSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onToday,
    onPrevWeek,
    onNextWeek,
    onToggleSidebar,
    onViewModeChange,
    onOpenAddModal,
    onOpenSettings,
  ]);
}
