import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateOrder as ApiUpdateOrder } from "../../services/apiOrder";

const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const { mutate: updateOrder, isPending } = useMutation({
    mutationFn: ({ id, order }: { id: string; order: any }) =>
      toast.promise(ApiUpdateOrder(id, order), {
        loading: "Updating Order...",
        success: "Order Updated",
        error: "error",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
  return { updateOrder, isPending };
};
export default useUpdateOrder;
