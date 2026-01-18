import type { ReactNode } from 'react';
import type { LayoutSlotName } from './types';
import { useLayoutSlot } from './use-layout-slots';

export type SlotTargetProps = {
  name: LayoutSlotName;
  fallback?: ReactNode;
};

export const SlotTarget = ({ name, fallback }: SlotTargetProps) => {
  const content = useLayoutSlot(name);
  return <>{content ?? fallback}</>;
};
