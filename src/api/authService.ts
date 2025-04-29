// src/api/authService.ts
import instance from "./axiosInstance";
import { LoginRequest } from "../types/auth";

export const login = async (credentials: LoginRequest) => {
  const response = await instance.post("/Auth/login", credentials);
  const data = response.data;

  if (data.parTokens?.bearerToken) {
    localStorage.setItem("token", data.parTokens.bearerToken);
  }

  return data;
};

///DATOS DEL USUARIO PARA PRUEBAS
//usuario: cesar.lezca46c4
//contrasena: 123456
