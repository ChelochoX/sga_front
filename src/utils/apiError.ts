export interface NormalizedApiError {
  message: string;
  fieldErrors: Record<string, string>;
  statusCode?: number;
}

export const normalizeApiError = (error: any): NormalizedApiError => {
  const responseData = error?.response?.data;
  const statusCode = error?.response?.status;

  if (!responseData) {
    return {
      message: "Ocurrió un error inesperado al procesar la solicitud.",
      fieldErrors: {},
      statusCode,
    };
  }

  // Caso 1: backend custom
  // {
  //   "Success": false,
  //   "Data": null,
  //   "Errors": ["La cédula ya está registrada."],
  //   "StatusCode": 400,
  //   "Message": null
  // }
  if (Array.isArray(responseData.Errors) && responseData.Errors.length > 0) {
    const firstError =
      typeof responseData.Errors[0] === "string"
        ? responseData.Errors[0]
        : "Ocurrió un error al procesar la solicitud.";

    const fieldErrors: Record<string, string> = {};
    const normalizedMessage = firstError.toLowerCase();

    if (
      normalizedMessage.includes("cédula") ||
      normalizedMessage.includes("cedula")
    ) {
      fieldErrors.cedula = firstError;
    }

    if (
      normalizedMessage.includes("email") ||
      normalizedMessage.includes("correo")
    ) {
      fieldErrors.email = firstError;
    }

    if (normalizedMessage.includes("ruc")) {
      fieldErrors.ruc = firstError;
    }

    if (
      normalizedMessage.includes("teléfono") ||
      normalizedMessage.includes("telefono")
    ) {
      fieldErrors.telefono = firstError;
    }

    return {
      message: firstError,
      fieldErrors,
      statusCode: responseData.StatusCode ?? statusCode,
    };
  }

  // Caso 2: ValidationProblemDetails de .NET
  // {
  //   "title": "...",
  //   "errors": {
  //     "campo": ["mensaje"]
  //   }
  // }
  if (responseData.errors && typeof responseData.errors === "object") {
    const fieldErrors: Record<string, string> = {};

    Object.entries(responseData.errors).forEach(([key, value]) => {
      const messages = Array.isArray(value) ? value : [String(value)];
      const cleanKey = key.replace("$.", "");

      if (cleanKey.toLowerCase() !== "request") {
        fieldErrors[cleanKey] = messages[0];
      }
    });

    return {
      message:
        responseData.title ||
        "Se encontraron errores de validación al procesar la solicitud.",
      fieldErrors,
      statusCode: responseData.status ?? statusCode,
    };
  }

  // Caso 3: message / Message / title
  return {
    message:
      responseData.Message ||
      responseData.message ||
      responseData.title ||
      "Ocurrió un error al procesar la solicitud.",
    fieldErrors: {},
    statusCode: responseData.StatusCode ?? responseData.status ?? statusCode,
  };
};
