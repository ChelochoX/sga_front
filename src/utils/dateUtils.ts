// Formatea objeto Date a 'yyyy-MM-dd'
export function formatDateToYYYYMMDD(date: Date | null): string | null {
  if (!date) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Devuelve el string de hoy en formato 'yyyy-MM-dd'
export function getTodayYYYYMMDD(): string {
  const today = new Date();
  return formatDateToYYYYMMDD(today)!;
}
