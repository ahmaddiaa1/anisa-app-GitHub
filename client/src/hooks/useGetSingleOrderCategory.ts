import { useQuery } from "@tanstack/react-query";
import { getOrderCategory } from "../services/apiOrderCategory";

const useGetOrderCategory = (id: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["orderCategory", id],
    queryFn: () => getOrderCategory(id),
  });
  return { data, isPending, error };
};
export default useGetOrderCategory;
