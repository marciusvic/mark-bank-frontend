import { ChildrenProps } from "../types/types";
import AuthProvider from "./auth-context";
import TransactionProvider from "./transaction-context";
import UserProvider from "./user-context";
export function ContextManager({ children }: ChildrenProps) {
  return (
    <>
      <AuthProvider>
        <UserProvider>
          <TransactionProvider>{children}</TransactionProvider>
        </UserProvider>
      </AuthProvider>
    </>
  );
}
