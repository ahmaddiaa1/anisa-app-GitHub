import { getAllOrderCategories } from "../services/apiOrderCategory.ts";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { subDays } from "date-fns";

export const useGetAllOrderCategories = () => {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { data: orderCategories, isPending } = useQuery({
    queryKey: ["orderCategories", numDays],
    queryFn: () => getAllOrderCategories(queryDate),
  });

  return { orderCategories, isPending };
};
