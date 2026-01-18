import { createContext, type ReactNode, useCallback, useState } from 'react';
import type { LayoutSlotName, LayoutSlotsContextValue, LayoutSlotsState } from './types';

export const LayoutSlotsContext = createContext<LayoutSlotsContextValue | null>(null);

export const LayoutSlotsProvider = ({ children }: { children: ReactNode }) => {
  const [slots, setSlots] = useState<LayoutSlotsState>({});

  const setSlot = useCallback((name: LayoutSlotName, content: ReactNode) => {
    setSlots((prev) => ({ ...prev, [name]: content }));
  }, []);

  const clearSlot = useCallback((name: LayoutSlotName) => {
    setSlots((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  return (
    <LayoutSlotsContext.Provider value={{ slots, setSlot, clearSlot }}>
      {children}
    </LayoutSlotsContext.Provider>
  );
};
