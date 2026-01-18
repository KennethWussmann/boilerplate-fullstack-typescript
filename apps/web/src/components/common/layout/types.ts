import type { ReactNode } from 'react';

export type LayoutSlotName = 'toolbar' | 'title' | 'subtitle';

export type LayoutSlotsState = Partial<Record<LayoutSlotName, ReactNode>>;

export type LayoutSlotsContextValue = {
  slots: LayoutSlotsState;
  setSlot: (name: LayoutSlotName, content: ReactNode) => void;
  clearSlot: (name: LayoutSlotName) => void;
};
