import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Deposit } from "@/components/deposit";
import { History } from "@/components/history";
import Transfer from "@/components/transfer";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const { currentUser } = useAuth();
  return (
    <div className="w-full h-full bg-gray-50">
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">
          Bem-vindo ao sistema de transferências!
        </h1>
        {currentUser && (
          <p className="text-lg text-gray-700 mt-2">
            Saldo atual: <strong>R$ {currentUser.balance.toFixed(2)}</strong>
          </p>
        )}
      </div>
      <Tabs defaultValue="history" className="w-full h-full items-center">
        <TabsList>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="deposit">Depósito</TabsTrigger>
          <TabsTrigger value="transfer">Transferência</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full h-fit items-start" value="history">
          <History />
        </TabsContent>
        <TabsContent className="w-full h-fit items-start" value="deposit">
          <Deposit />
        </TabsContent>
        <TabsContent className="w-full h-fit items-start" value="transfer">
          <Transfer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
