import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnisa as deleteAnisaApi } from "../../services/apiAnisa";
import toast from "react-hot-toast";

const useDeleteAnisa = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteAnisa, isPending: isDeleting } = useMutation({
    mutationFn: ({ anisaID }: { anisaID: string }) =>
      toast.promise(deleteAnisaApi({ anisaID }), {
        loading: "deleting...",
        success: "Anisa delete successfully",
        error: "Anisa delete failed",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anisa"] });
    },
  });

  return { deleteAnisa, isDeleting };
};
export default useDeleteAnisa;
