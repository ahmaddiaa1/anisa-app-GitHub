import { getClient } from "../../services/apiClient.ts";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../types/types.ts";

export const useClient = (clientId: string) => {
  const { isPending, data } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId),
  });
  const client = (data as client) || {};
  return { isPending, client };
};
