import {useMutation} from "@tanstack/react-query";
import {deleteChild as deleteChildApi} from "../services/apiClient.ts";

export const useDeleteChild = () => {
    const { mutate:deleteChild, isPending } = useMutation({
        mutationFn: ({childId} : {
            childId: string;
        }) => deleteChildApi(childId),
    });

    return { deleteChild, isPending };
};