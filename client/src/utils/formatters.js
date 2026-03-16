import { format, parseISO } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'h:mm a');
  } catch {
    return '';
  }
}
