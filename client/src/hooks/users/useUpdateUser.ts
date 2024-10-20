import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "../../services/apiUser.ts";
import toast from "react-hot-toast";
import { UserProps } from "../../types/types.ts";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UserProps }) =>
      updateUserApi(id, user),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { updateUser, isPending };
};
