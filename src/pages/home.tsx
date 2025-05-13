import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Deposit } from "@/components/deposit";

export default function HomePage() {
  return (
    <div className="w-full h-full bg-gray-50">
      <Tabs defaultValue="deposit" className="w-full h-full items-center">
        <TabsList>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="deposit">Depósito</TabsTrigger>
        </TabsList>
        <TabsContent className="w-full h-fit items-start" value="deposit">
          <Deposit />
        </TabsContent>
      </Tabs>
    </div>
  );
}
