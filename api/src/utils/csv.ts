export function escapeCsv(value: string | number | Date | null | undefined): string {
  const raw = value instanceof Date ? value.toISOString() : value ?? '';
  const text = String(raw);

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}
