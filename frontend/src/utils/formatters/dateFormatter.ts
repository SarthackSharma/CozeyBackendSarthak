import { format, isValid, parse, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  try {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate) ? format(parsedDate, 'dd MMM yyyy') : '';
  } catch {
    return '';
  }
};

export const formatDateTime = (dateTime: string | Date): string => {
  try {
    if (!dateTime) return '';
    const parsedDate = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
    return isValid(parsedDate) ? format(parsedDate, 'dd MMM yyyy, HH:mm') : '';
  } catch {
    return '';
  }
};

export const formatDateForInput = (date: string | Date): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export const isValidDate = (date: string | Date): boolean => {
  if (!date) return false;
  
  try {
    if (date instanceof Date) {
      return isValid(date);
    }
    
    // Try parsing as ISO date first
    const isoDate = parseISO(date);
    if (isValid(isoDate)) {
      return true;
    }
    
    // Try different date formats
    const formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd-MM-yyyy', 'MMMM d, yyyy'];
    return formats.some(fmt => {
      try {
        const parsed = parse(date, fmt, new Date());
        return isValid(parsed);
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
};

export const addDays = (date: string | Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getDateRange = (startDate: string | Date, endDate: string | Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}; 