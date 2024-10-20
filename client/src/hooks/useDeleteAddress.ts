import { useMutation } from "@tanstack/react-query";
import { deleteAddress as deleteAddressApi } from "../services/apiClient.ts";

export const useDeleteAddress = () => {
  const { mutate: deleteAddress, isPending } = useMutation({
    mutationFn: deleteAddressApi,
  });

  return { deleteAddress, isPending };
};
