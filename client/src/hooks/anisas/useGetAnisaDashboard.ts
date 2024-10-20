import { useQuery } from "@tanstack/react-query";
import { getNonPaidAnisa } from "../../services/apiAnisa";

const useGetAnisaDashboard = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["anisaDashboard"],
    queryFn: () => getNonPaidAnisa(),
  });

  const anisaDashboard = data;

  return {
    anisaDashboard,
    isPending,
    error,
  };
};

export default useGetAnisaDashboard;
