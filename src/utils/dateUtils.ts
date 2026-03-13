// Convierte Date o string a formato yyyy-MM-dd
export function formatDateToYYYYMMDD(
  date: Date | string | null | undefined,
): string | null {
  if (!date) return null;

  let dateObj: Date | null = null;

  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === "string") {
    // Si ya viene yyyy-MM-dd, devolver directo
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Si viene con T tipo ISO: 2026-03-13T00:00:00
    if (date.includes("T")) {
      const isoParts = date.split("T");
      const isoDate = isoParts[0];

      if (isoDate && /^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
        return isoDate;
      }
    }

    // Si viene dd/MM/yyyy
    if (date.includes("/")) {
      const partes = date.split("/");

      if (partes.length === 3) {
        const day = partes[0];
        const month = partes[1];
        const year = partes[2];

        if (day && month && year) {
          return `${year.padStart(4, "0")}-${month.padStart(
            2,
            "0",
          )}-${day.padStart(2, "0")}`;
        }
      }

      return null;
    }

    dateObj = new Date(date);
  }

  if (!dateObj || isNaN(dateObj.getTime())) return null;

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

// Devuelve la fecha de hoy en formato yyyy-MM-dd
export function getTodayYYYYMMDD(): string {
  const today = new Date();
  return formatDateToYYYYMMDD(today) ?? "";
}

// Alias reutilizable si ya se usa en otras pantallas
export const formatFecha = (fecha: string): string => {
  return formatDateToYYYYMMDD(fecha) ?? "";
};

// Convierte una fecha a formato visual dd/MM/yyyy
export function formatDateToDisplay(fecha: string | null | undefined): string {
  if (!fecha) return "";

  const normalized = formatDateToYYYYMMDD(fecha);
  if (!normalized) return "";

  const partes = normalized.split("-");
  if (partes.length !== 3) return normalized;

  const year = partes[0];
  const month = partes[1];
  const day = partes[2];

  if (!year || !month || !day) return normalized;

  return `${day}/${month}/${year}`;
}
