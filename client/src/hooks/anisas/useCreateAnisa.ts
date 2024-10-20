import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnisa as createAnisaApi } from "../../services/apiAnisa.ts";
import toast from "react-hot-toast";

export const useCreateAnisa = () => {
  const queryClient = useQueryClient();

  const { mutate: createAnisa, isPending } = useMutation({
    mutationFn: createAnisaApi,
    onSuccess: () => {
      toast.success("New Anisa successfully created");
      queryClient.invalidateQueries({ queryKey: ["Anisas"] });
    },
  });

  return { createAnisa, isPending };
};
