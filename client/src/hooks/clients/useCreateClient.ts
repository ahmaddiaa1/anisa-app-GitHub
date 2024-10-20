import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient as createClientApi } from "../../services/apiClient.ts";
import toast from "react-hot-toast";

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  const { mutate: createClient, isPending } = useMutation({
    mutationFn: (client: FormData) =>
      toast.promise(createClientApi(client), {
        loading: "Creating new client",
        success: "New client created successfully",
        error: (err) => err?.response?.data.msg,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  return { createClient, isPending };
};
