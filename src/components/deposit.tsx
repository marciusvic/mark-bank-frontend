import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useTransaction } from "@/context/transaction-context";
import { ETransactionType } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function Deposit() {
  const { currentUser } = useAuth();
  const { createTransaction } = useTransaction();
  const depositSchema = z.object({
    amount: z
      .number({
        invalid_type_error: "O valor deve ser um número",
      })
      .positive({ message: "O valor deve ser positivo" })
      .min(1, { message: "O valor mínimo é 1" }),
  });

  type DepositFormValues = z.infer<typeof depositSchema>;

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(data: DepositFormValues) {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }
      const payload = {
        type: ETransactionType.DEPOSIT,
        amount: data.amount,
        receiverId: currentUser.id,
        userId: currentUser.id,
      };
      await createTransaction(payload);
      form.reset();
      alert("Depósito realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao realizar o depósito:", error);
    }
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Depósito</CardTitle>
          <CardDescription>
            Insira os detalhes para realizar um depósito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o valor"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Depositar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
