import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../../services/apiOrder";

export const useGetSingleOrder = (id: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });
  const orderDetails = data?.data;

  return { isPending, orderDetails };
};
