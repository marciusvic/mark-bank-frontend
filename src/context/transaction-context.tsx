import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { useTransactionService } from "@/services/transaction-service";
import { Transaction, CreateTransactionDto } from "@/types/transaction";
import { ChildrenProps } from "@/types/types";

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  getTransaction: (id: string) => Promise<Transaction | null>;
  fetchTransactions: () => Promise<void>;
  createTransaction: (transaction: CreateTransactionDto) => Promise<void>;
  reverseTransaction: (id: string) => Promise<void>;
  getAllTransactions: () => Promise<Transaction[]>;
}

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  loading: false,
  getTransaction: async () => null,
  fetchTransactions: async () => {},
  createTransaction: async () => {},
  reverseTransaction: async () => {},
  getAllTransactions: async () => [],
});

export default function TransactionProvider({ children }: ChildrenProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    createTransaction,
    getAllTransactions,
    getTransaction,
    getTransactions,
    reverseT,
  } = useTransactionService();
  const { isAuthenticated } = useAuth();

  async function fetchTransactions() {
    setLoading(true);
    try {
      const response = await getTransactions();
      const data = response.data;
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllTransactions(): Promise<Transaction[]> {
    setLoading(true);
    try {
      const response = await getAllTransactions();
      const { data } = response;
      return data;
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const response = await getTransaction(id);
      const { data } = response;
      return data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  }

  async function newTransaction(transaction: CreateTransactionDto) {
    setLoading(true);
    try {
      await createTransaction(transaction);
      await fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  }

  async function reverseTransaction(id: string) {
    setLoading(true);
    try {
      await reverseT(id);
      await fetchTransactions();
    } catch (error) {
      console.error("Error reversing transaction:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        getTransaction: getTransactionById,
        fetchTransactions,
        createTransaction: newTransaction,
        reverseTransaction,
        getAllTransactions: fetchAllTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
}
