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

export const formatFecha = (fecha: string): string => {
  if (!fecha || typeof fecha !== "string") return "";
  if (fecha.includes("-")) return fecha; // Ya está OK
  if (!fecha.includes("/")) return fecha; // No formato válido, lo dejamos

  const partes = fecha.split("/");
  if (partes.length !== 3) return ""; // <-- chequeo extra

  const [day, month, year] = partes;
  if (!day || !month || !year) return ""; // <-- chequeo seguro

  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
};
