export function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateRange(start, end) {
  if (!start || !end) return '';
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function daysBetween(d1, d2) {
  const ms = Math.abs(
    new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()) -
    new Date(d1.getFullYear(), d1.getMonth(), d1.getDate())
  );
  return Math.round(ms / (1000 * 60 * 60 * 24));
}