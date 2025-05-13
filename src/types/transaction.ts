import { User } from "./user";

export enum ETransactionType {
  DEPOSIT = "DEPOSIT",
  TRANSFER = "TRANSFER",
}

export interface Transaction {
  id: string;
  type: ETransactionType;
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
  type: ETransactionType;
  amount: number;
  senderId?: string;
  receiverId: string;
  userId: string;
}
