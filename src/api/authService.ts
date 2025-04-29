import axios from "axios";
import {
  LoginRequest,
  LoginSuccessResponse,
  CambioContrasenaResponse,
} from "../types/auth";

const API_URL = "https://TU_BACKEND_URL_AQUI/api"; // Cambia por tu URL real

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await axios.post<
      LoginSuccessResponse | CambioContrasenaResponse
    >(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error("Credenciales incorrectas.");
    } else {
      throw new Error("Error al conectar con el servidor.");
    }
  }
};
