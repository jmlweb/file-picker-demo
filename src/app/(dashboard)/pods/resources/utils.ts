export function formatFileSize(bytes: number | undefined): string {
  if (bytes === undefined) return '-';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 4);
  const size = (bytes / Math.pow(1024, exponent)).toFixed(2);
  
  return `${size} ${units[exponent]}`;
}