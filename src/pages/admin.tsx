import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";
import { useTransaction } from "@/context/transaction-context";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReverse, setLoadingReverse] = useState(false);
  const { getAllTransactions, reverseTransaction } = useTransaction();

  async function fetchTransactions() {
    setLoading(true);
    try {
      const response = await getAllTransactions();
      setAllTransactions(response);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReverseTransaction(id: string) {
    setLoadingReverse(true);
    try {
      await reverseTransaction(id);
    } catch (error) {
      console.error("Error reversing transaction:", error);
    } finally {
      setLoadingReverse(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);
  return (
    <div className="w-full h-full bg-gray-50">
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">Area de ADMIN</h1>
        <p>
          Voce pode reverter algumas transferencias feitas por outros usuários
        </p>
      </div>
      <div className="flex items-start justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-2xl font-bold">Histórico de transferências</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : allTransactions.length === 0 ? (
            <div className="text-center text-gray-500">
              Nenhuma transação encontrada.
            </div>
          ) : (
            <ul className="w-full items-start space-y-2">
              {allTransactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="w-fit p-4 border rounded-md"
                >
                  <div>
                    <strong>Tipo:</strong>{" "}
                    {transaction.type === "TRANSFER"
                      ? "Transferência"
                      : "Depósito"}
                  </div>
                  {transaction.type === "TRANSFER" && (
                    <div>
                      <strong>Destinatário:</strong> {transaction.receiver.name}
                    </div>
                  )}
                  <div>
                    <strong>Valor:</strong> R${transaction.amount}
                  </div>
                  <div>
                    <strong>Data e hora:</strong>{" "}
                    {new Date(transaction.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Revertida:</strong>{" "}
                    {transaction.reversed ? "Sim" : "Não"}
                  </div>
                  <Button
                    disabled={loadingReverse || transaction.reversed}
                    onClick={() => handleReverseTransaction(transaction.id)}
                  >
                    Reverter transação
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
