import { useState, useEffect } from 'react';

let dirtyCallback: (() => void) | null = null;

export function useDirtyTracker() {
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = () => {
    console.log("✅ markDirty() called - isDirty set to true");
    setIsDirty(true);
    if (dirtyCallback) dirtyCallback();
  };

  const resetDirty = () => setIsDirty(false);

  const onDirty = (callback: () => void) => {
    dirtyCallback = callback;
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return { isDirty, markDirty, resetDirty, onDirty };
}

