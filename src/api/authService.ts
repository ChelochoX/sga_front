// src/api/authService.ts
import instance from "./axiosInstance";
import { LoginRequest, ChangePasswordRequest } from "../types/auth";

export const login = async (credentials: LoginRequest) => {
  const response = await instance.post("/Auth/login", credentials);
  const data = response.data;

  if (data.parTokens?.bearerToken) {
    localStorage.setItem("token", data.parTokens.bearerToken);
  }
  return data;
};

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await instance.post("/Auth/cambiar-contrasena", data);
  return response.data;
};

///DATOS DEL USUARIO PARA PRUEBAS
//usuario: cesar.lezca46c4
//contrasena: 123456
