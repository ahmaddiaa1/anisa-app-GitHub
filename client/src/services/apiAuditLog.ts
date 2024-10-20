import ApiResponse from "../utils/ApiResponse";
import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import {PAGE_SIZE} from "../utils/constants.ts";

export const getAuditLogs = async (
    page = 1,
    limit = 10,
    actionType = "",
    sortBy = "createdAt-desc"
) => {
    const {data} = await ApiResponse("auditlog", {
        params: {page, limit, actionType, sortBy},
    });
    return {
        data: JSON.parse(data.data),
        totalItems: data.totalItems,
    };
};

export const getAllAuditLogs = async () => {
    try {
        const {data} = await ApiResponse.get("auditlog/all");
        return JSON.parse(data.data);
    } catch (error) {
        console.error(error);
        throw error
    }
};


export const useAllAuditLogs = () => {
    const {data, isPending} = useQuery({
        queryKey: ["all-auditLogs"],
        queryFn: getAllAuditLogs,
    });

    return {isPending, auditLogs: data || []};
};


export const useAuditLogs = (actionType: string, sortBy: string) => {
    const [searchParams] = useSearchParams();
    const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

    const {data, isPending} = useQuery({
        queryKey: ["auditLogs", page, actionType, sortBy],
        queryFn: () => getAuditLogs(page, PAGE_SIZE, actionType, sortBy),
    });
    const auditLogs = data?.data || [];
    const totalLogs = data?.totalItems || 0;

    return {isPending, auditLogs, totalLogs};
};
