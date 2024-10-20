import { useQuery } from "@tanstack/react-query";
import { getSingleAnisa } from "../../services/apiAnisa";

export const useGetSingleAnisa = (id: string) => {
  const { data, isPending: fetchData } = useQuery({
    queryKey: ["anisas", id],
    queryFn: () => getSingleAnisa(id),
  });
  const anisaDetails = data;

  return { fetchData, anisaDetails };
};
