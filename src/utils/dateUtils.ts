// Formatea objeto Date a 'yyyy-MM-dd'
export function formatDateToYYYYMMDD(
  date: Date | string | null | undefined
): string | null {
  if (!date) return null;
  let dateObj: Date | null = null;
  if (date instanceof Date) dateObj = date;
  else if (typeof date === "string") dateObj = new Date(date);
  if (!dateObj || isNaN(dateObj.getTime())) return null;
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Devuelve el string de hoy en formato 'yyyy-MM-dd'
export function getTodayYYYYMMDD(): string {
  const today = new Date();
  return formatDateToYYYYMMDD(today)!;
}
