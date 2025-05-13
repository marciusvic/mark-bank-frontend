import { useMemo } from "react";
import api from "./api";
import { CreateTransactionDto } from "@/types/transaction";

export function useTransactionService() {
  const services = useMemo(() => {
    return {
      getTransactions: async () => {
        return api.get("/transaction");
      },
      getTransaction: async (id: string) => {
        return api.get(`/transaction/${id}`);
      },
      createTransaction: async (transaction: CreateTransactionDto) => {
        return api.post("/transaction", transaction);
      },
      getAllTransactions: async () => {
        return api.get("/transaction/allTransactions");
      },
      reverseT: async (id: string) => {
        return api.patch(`/transaction/${id}`);
      },
    };
  }, []);
  return services;
}
