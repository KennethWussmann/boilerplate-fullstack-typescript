import { type ReactNode, useEffect } from 'react';
import type { LayoutSlotName } from './types';
import { useLayoutSlotsContext } from './use-layout-slots';

export type SlotContentProps = {
  name: LayoutSlotName;
  children: ReactNode;
};

export const SlotContent = ({ name, children }: SlotContentProps) => {
  const { setSlot, clearSlot } = useLayoutSlotsContext();

  useEffect(() => {
    setSlot(name, children);
    return () => clearSlot(name);
  }, [name, children, setSlot, clearSlot]);

  return null;
};
