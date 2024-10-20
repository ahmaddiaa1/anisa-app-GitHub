import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../services/apiOrder.ts";
import { useSearchParams } from "react-router-dom";
import { subDays } from "date-fns";

export const useGetAllOrders = () => {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { data, isPending } = useQuery({
    queryKey: ["dashboard", numDays],
    queryFn: () => getAllOrders(queryDate),
  });

  const orders = data?.data;
  const count = data?.count;

  return { orders, isPending, count, numDays };
};
