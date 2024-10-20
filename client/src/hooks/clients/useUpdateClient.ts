import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClient as updateClientApi } from "../../services/apiClient.ts";
import { clientWithOutID } from "../../types/types.ts";
import toast from "react-hot-toast";

export const useUpdateClient = (id: string) => {
  const queryClient = useQueryClient();

  const { mutate: updateClient, isPending } = useMutation({
    mutationFn: ({ id, client }: { id: string; client: clientWithOutID }) =>
      toast.promise(updateClientApi(id, client), {
        loading: "Updating client...",
        success: "Client updated successfully",
        error: (err) => err?.response?.data.msg || "Failed to update client",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", id] });
    },
  });

  return { updateClient, isPending };
};
