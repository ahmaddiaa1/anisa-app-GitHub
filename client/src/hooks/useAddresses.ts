import {useQuery} from "@tanstack/react-query";
import {getAddresses} from "../services/apiAddress.ts";

export const useAddresses = () => {
    const {data, isPending} = useQuery({
        queryKey: ["addresses"],
        queryFn: getAddresses,
    })

    const addresses = data || [];

    return {addresses, isPending};
};