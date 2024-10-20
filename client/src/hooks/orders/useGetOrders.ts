import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../services/apiOrder";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { Order } from "../../types/ordersTypes";

export const useGetOrders = (
  search: string,
  sortBy: string,
  filter: string
) => {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { data, isPending } = useQuery({
    queryKey: ["orders", page, sortBy, filter, search],
    queryFn: () => getOrders(search, sortBy, filter, page, PAGE_SIZE),
  });
  let orders = data?.data?.data || "[]";
  orders ? ((orders = JSON.parse(orders)) as Order[]) : [];
  const count = data?.data?.count || 0;

  return { orders, isPending, count };
};
