import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnisa as updateAnisaApi } from "../../services/apiAnisa.ts";
import toast from "react-hot-toast";

export const useUpdateAnisa = (editID: string) => {
  const queryClient = useQueryClient();
  const { mutate: updateAnisa, isPending } = useMutation({
    mutationFn: ({ id, anisa }: { id: string; anisa: FormData }) =>
      toast.promise(updateAnisaApi(id, anisa), {
        loading: "Updating...",
        success: "Anisa updated successfully ",
        error: (err) => {
          return err?.response?.data.msg || "Failed to update Anisa";
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anisas"] });
      queryClient.invalidateQueries({ queryKey: ["anisas", editID] });
    },
  });

  return { updateAnisa, isPending };
};
