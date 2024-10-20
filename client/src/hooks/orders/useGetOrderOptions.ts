import { useQuery } from "@tanstack/react-query";
import { getOrderOptions } from "../../services/apiOrder";

const useGetOrderOptions = () => {
  const { data, isPending } = useQuery({
    queryKey: ["orderSelectOptions"],
    queryFn: getOrderOptions,
  });
  const orderCategory = data?.orderCategory;
  const client = data?.client;
  const anisa = data?.anisa;
  return { isPending, orderCategory, client, anisa };
};
export default useGetOrderOptions;
