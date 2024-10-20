// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { deleteClients } from "../../services/apiClient.ts";
//
// export const useDeleteClient = () => {
//   const queryClient = useQueryClient();
//   const { mutate: deleteClient, isPending } = useMutation({
//     mutationFn: deleteCustomer,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["customers"] });
//     },
//   });
//
//   return { deleteClient, isPending };
// };
