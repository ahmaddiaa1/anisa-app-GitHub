import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser as createUserApi } from "../../services/apiUser.ts";
import toast from "react-hot-toast";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createUser, isPending };
};
