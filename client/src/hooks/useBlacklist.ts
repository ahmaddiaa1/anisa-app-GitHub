import toast from "react-hot-toast";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {blacklistClient} from "../services/apiClient.ts";
import {blacklistAnisa} from "../services/apiAnisa.ts";

export const useBlacklistClient = () => {
    const queryClient = useQueryClient();

    const {mutate: blacklist, isPending} = useMutation({
        mutationFn: (id: string) => blacklistClient(id),
        onSuccess: () => {
            toast.success("Client blacklisted successfully");
            queryClient.invalidateQueries({queryKey: ["clients"]});
        },
    });

    return {blacklist, isPending};
};

export const useBlacklistAnisa = () => {
    const queryClient = useQueryClient();

    const {mutate: blacklist, isPending} = useMutation({
        mutationFn: (id: string) => blacklistAnisa(id),
        onSuccess: () => {
            toast.success("Anisa blacklisted successfully");
            queryClient.invalidateQueries({queryKey: ["anisas"]});
        },
    });

    return {blacklist, isPending};
};
