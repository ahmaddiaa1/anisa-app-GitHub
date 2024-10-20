import {getUser} from "../services/apiUser.ts";
import {useQuery} from "@tanstack/react-query";

export const useSingleUser = (id: string) => {
    const {isPending, data: user} = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUser(id),
    });

    return {isPending, user};
};