import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteAddresses as deleteAddressesApi} from "../services/apiAddress.ts";
import toast from "react-hot-toast";


export const useDeleteAddresses = () => {
    const queryClient = useQueryClient();

    const {mutate: deleteAddresses, isPending} = useMutation({
        mutationFn: deleteAddressesApi,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["addresses"]});
            toast.success("Address deleted successfully");
        }
    })

    return {deleteAddresses, isPending};
};