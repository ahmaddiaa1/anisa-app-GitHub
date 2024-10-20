import { useQuery } from "@tanstack/react-query";
import { getAnisas } from "../../services/apiAnisa";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export const useAnisa = ({
  sortBy,
  search,
  filterValue,
}: {
  sortBy: string;
  search: string;
  filterValue: string;
}) => {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { data, isPending } = useQuery({
    queryKey: ["anisas", page, sortBy, search, filterValue],
    queryFn: () => getAnisas(page, sortBy, search, PAGE_SIZE, filterValue),
  });

  const totalClient = data?.TotalClients || 0;
  const count = Math.ceil(totalClient / PAGE_SIZE);
  const anisas = data || [];
  return { isPending, anisas, count };
};
