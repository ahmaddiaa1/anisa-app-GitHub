import {useMutation} from "@tanstack/react-query";
import {deleteNote as deleteNoteApi} from "../services/apiClient.ts";

export const useDeleteNote = () => {
    const {mutate: deleteNote, isPending} = useMutation(
        {
            mutationFn: deleteNoteApi,
        }
    );

    return {deleteNote, isPending};
};