import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  doneOrder as ApiDoneOrder,
  PayAnisa as ApiPayAnisa,
} from "../../services/apiOrder";
import { acceptOrder as ApiAcceptOrder } from "../../services/apiOrder";
import { cancelOrder as ApicancelOrder } from "../../services/apiOrder";

export const useEndOrder = () => {
  const queryClient = useQueryClient();
  const { mutate: doneOrder, isPending } = useMutation({
    mutationFn: (id: string) =>
      toast.promise(ApiDoneOrder(id), {
        loading: "Ending Order...",
        success: "Order Ended",
        error: (err) => err.response.data.msg,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["order"] }),
  });
  return { doneOrder, ending: isPending };
};

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();
  const { mutate: acceptOrder, isPending } = useMutation({
    mutationFn: (id: string) =>
      toast.promise(ApiAcceptOrder(id), {
        loading: "Accepting Order...",
        success: "Order Accepted",
        error: (err) => err.response.data.msg,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["order"] }),
  });
  return { acceptOrder, accepting: isPending };
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { mutate: cancelOrder, isPending } = useMutation({
    mutationFn: (id: string) =>
      toast.promise(ApicancelOrder(id), {
        loading: "Canelling Order...",
        success: "Order Cancelled",
        error: (err) => err.response.data.msg,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["order"] }),
  });
  return { cancelOrder, cancelling: isPending };
};

export const usePayAnisa = () => {
  const queryClient = useQueryClient();
  const { mutate: PayAnisa, isPending } = useMutation({
    mutationFn: (data: { orderID?: string; anisaID: string; type: string }) =>
      toast.promise(ApiPayAnisa(data), {
        loading: "Paying Anisa...",
        success: "Anisa Paid",
        error: (err) => err.response.data.msg,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["anisaDashboard"] }),
  });
  return { PayAnisa, PayingAnisa: isPending };
};
