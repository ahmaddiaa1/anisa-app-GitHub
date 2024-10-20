import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiUser.ts";

export const useUser = () => {
  const { isPending, data: user } = useQuery({
    queryKey: ["admin"],
    queryFn: getCurrentUser,
  });

  const role = user?.role;

  const moderator = role === "moderator";
  const supervisor = role === "supervisor";
  const notModerator = role !== "moderator";
  const notAdmin = role !== "admin";

  return {
    isPending,
    user,
    role,
    moderator,
    supervisor,
    notModerator,
    notAdmin,
  };
};
