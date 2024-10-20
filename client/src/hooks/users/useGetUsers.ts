import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/apiUser";
import { PAGE_SIZE } from "../../utils/constants";
import { useSearchParams } from "react-router-dom";

export const useUsers = (search: string, sortBy: string, role: string) => {
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const { data, isPending } = useQuery({
    queryKey: ["users", page, search, sortBy, role],
    queryFn: () => getUsers(page, sortBy, search, PAGE_SIZE, role),
  });
  const totalClient = data?.count || 0;
  const count = Math.ceil(totalClient / PAGE_SIZE);

  const users = data?.data || [];
  return { isPending, users, count };
};
