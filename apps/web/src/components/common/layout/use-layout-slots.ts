import { type ReactNode, useContext } from 'react';
import { LayoutSlotsContext } from './layout-slots-context';
import type { LayoutSlotName, LayoutSlotsState } from './types';

export const useLayoutSlotsContext = () => {
  const context = useContext(LayoutSlotsContext);
  if (!context) {
    throw new Error('useLayoutSlotsContext must be used within a LayoutSlotsProvider');
  }
  return context;
};

export const useLayoutSlot = (name: LayoutSlotName): ReactNode => {
  const context = useContext(LayoutSlotsContext);
  return context?.slots[name] ?? null;
};

export const useLayoutSlots = (): LayoutSlotsState => {
  const context = useContext(LayoutSlotsContext);
  return context?.slots ?? {};
};
