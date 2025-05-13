import { ChildrenProps } from "../types/types";
import AuthProvider from "./auth-context";
import TransactionProvider from "./transaction-context";
export function ContextManager({ children }: ChildrenProps) {
  return (
    <>
      <AuthProvider>
        <TransactionProvider>{children}</TransactionProvider>
      </AuthProvider>
    </>
  );
}
