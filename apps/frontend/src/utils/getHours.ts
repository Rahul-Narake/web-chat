export function getHourAndMinute(dateString: string): string {
  const date = new Date(dateString);
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}`;
}
