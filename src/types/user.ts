export interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  role: "ADMIN" | "USER";
}
