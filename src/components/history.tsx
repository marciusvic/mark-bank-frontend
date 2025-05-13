import { useTransaction } from "@/context/transaction-context";
import { Card, CardContent, CardTitle } from "./ui/card";
import { ETransactionType } from "@/types/transaction";
import { format } from "date-fns";
import { useUser } from "@/context/user-context";

export function History() {
  const { transactions } = useTransaction();
  const { allUsers } = useUser();

  function getUserName(userId: string) {
    const user = allUsers.find((user) => user.id === userId);
    return user ? user.name : "Usuário desconhecido";
  }
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md flex items-center">
        <CardTitle className="text-2xl font-bold">
          Histórico de transferências
        </CardTitle>
        <CardContent className="w-full">
          {transactions.length === 0 ? (
            <div className="text-center text-gray-500">
              Nenhuma transação encontrada.
            </div>
          ) : (
            <ul className="w-full items-start space-y-2">
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="w-fit p-4 border rounded-md"
                >
                  <div>
                    <strong>Tipo:</strong>{" "}
                    {transaction.type === ETransactionType.TRANSFER
                      ? "Transferência"
                      : "Depósito"}
                  </div>
                  {transaction.type === ETransactionType.TRANSFER && (
                    <div>
                      <strong>Destinatário:</strong>{" "}
                      {getUserName(transaction.receiverId)}
                    </div>
                  )}
                  <div>
                    <strong>Valor:</strong> R${transaction.amount}
                  </div>
                  <div>
                    <strong>Data e hora:</strong>{" "}
                    {format(transaction.createdAt, "HH:mm dd/MM/yyyy")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
