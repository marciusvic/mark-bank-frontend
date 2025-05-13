import { User } from "./user";

export type TransactionType = "DEPOSIT" | "TRANSFER";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  userId: string;
  user: User;
  senderId?: string | null;
  sender?: User | null;
  receiverId: string;
  receiver: User;
  reversed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  senderId?: string;
  receiverId: string;
  reversed: boolean;
  createdAt: Date;
  userId: string;
}
