import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../services/apiClient.ts";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants.ts";

export const useClients = (
  search: string,
  sortBy: string,
  filterValue: string
) => {
  const [searchParams] = useSearchParams();

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { data, isPending } = useQuery({
    queryKey: ["clients", search, page, sortBy, filterValue],
    queryFn: () => getClients(search, page, PAGE_SIZE, sortBy, filterValue),
  });

  const clients = data?.client || [];
  const totalClient = data?.TotalClients || 0;
  const pageCount = Math.ceil(totalClient / PAGE_SIZE);

  return { clients, isPending, totalClient, pageCount };
};
