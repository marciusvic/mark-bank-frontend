export interface User {
  id: number;
  email: string;
  name: string;
  balance: number;
  role: "ADMIN" | "USER";
}
