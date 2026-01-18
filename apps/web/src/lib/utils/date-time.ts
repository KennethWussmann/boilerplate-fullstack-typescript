import { format } from 'date-fns';

export const formatDateTimeLong = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd HH:mm:ss');
};
