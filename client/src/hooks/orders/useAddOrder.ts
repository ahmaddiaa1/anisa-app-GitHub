import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "../../types/ordersTypes";
import { addOrder } from "../../services/apiOrder";
import toast from "react-hot-toast";

const useAddOrder = () => {
  const queryClient = useQueryClient();

  const { mutate: CreateOrder, isPending } = useMutation({
    mutationFn: (order: Order) =>
      toast.promise(addOrder(order), {
        loading: "Creating Order...",
        success: "Order Created",
        error: (err) => err.response.data.msg,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return { CreateOrder, isPending };
};
export default useAddOrder;
