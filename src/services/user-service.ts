import { useMemo } from "react";
import api from "./api";

export function useUserService() {
  const services = useMemo(() => {
    return {
      getUsers: async () => {
        return api.get("/user/");
      },
    };
  }, []);
  return services;
}
