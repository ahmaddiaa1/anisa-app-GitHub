import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createAddress as createAddressApi} from "../services/apiAddress.ts";
import toast from "react-hot-toast";

export const useCreateAddress = () => {

    const queryClient = useQueryClient();

    const {mutate: createAddress, isPending} = useMutation({
        mutationFn: createAddressApi,
        onSuccess: () => {
            toast.success("Address created successfully");
            queryClient.invalidateQueries({queryKey: ["addresses"]});
        }
    })

    return {createAddress, isPending};
};