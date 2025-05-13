import { useMemo } from "react";
import api from "./api";

export function useAuthService() {
  const services = useMemo(() => {
    return {
      register: async (name: string, email: string, password: string) => {
        return api.post("/auth/register", { name, email, password });
      },
      login: async (email: string, password: string) => {
        return api.post("/auth/login", { email, password });
      },
    };
  }, []);
  return services;
}
