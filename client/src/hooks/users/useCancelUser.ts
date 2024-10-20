import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCancelUser } from "../../services/apiUser.ts";
import toast from "react-hot-toast";

export const useCancelUser = () => {
  const queryClient = useQueryClient();

  const { mutate: cancelUser, isPending } = useMutation({
    mutationFn: (id: string) =>
      toast.promise(updateCancelUser(id), {
        loading: "Canceling user...",
        success: "User canceled successfully",
        error: "Failed to cancel user",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { cancelUser, isPending };
};
