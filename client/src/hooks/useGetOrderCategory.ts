import { useQuery } from "@tanstack/react-query";
import { getOrderCategories } from "../services/apiOrderCategory";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constants";

export const useGetOrderCategorys = (filter: string, sortBy: string) => {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { data, isPending: isLoading } = useQuery({
    queryKey: ["ordercategory", filter, sortBy, page],
    queryFn: () => getOrderCategories(filter, sortBy, PAGE_SIZE, page),
  });
  const count = data?.count;
  const orderCategory = data?.data;
  return { orderCategory, isLoading, count };
};
