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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { useTransaction } from "@/context/transaction-context";
import { useUser } from "@/context/user-context";
import { ETransactionType } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Transfer() {
  const { currentUser } = useAuth();
  const { createTransaction } = useTransaction();
  const { allUsers } = useUser();

  const transferSchema = z.object({
    amount: z
      .number({
        invalid_type_error: "O valor deve ser um número",
      })
      .positive({ message: "O valor deve ser positivo" })
      .min(1, { message: "O valor mínimo é 1" }),
    receiverId: z.string().min(1, { message: "O destinatário é obrigatório" }),
  });

  type TransferFormValues = z.infer<typeof transferSchema>;

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 0,
      receiverId: "",
    },
  });

  async function onSubmit(data: TransferFormValues) {
    try {
      if (!currentUser) {
        throw new Error("Usuário não autenticado");
      }
      const payload = {
        type: ETransactionType.TRANSFER,
        amount: data.amount,
        senderId: currentUser.id,
        receiverId: data.receiverId,
        userId: currentUser.id,
      };
      await createTransaction(payload);
      form.reset();
      alert("Transferência realizada com sucesso!");
    } catch (error) {
      alert("Erro ao realizar a transferência");
      console.error("Erro ao realizar a transferência:", error);
    }
  }

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Transferência</CardTitle>
          <CardDescription>
            Insira os detalhes para realizar uma transferência
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
              <FormField
                control={form.control}
                name="receiverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatário</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o destinatário" />
                        </SelectTrigger>
                        <SelectContent>
                          {allUsers
                            .filter((user) => user.id !== currentUser?.id)
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Transferir
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
