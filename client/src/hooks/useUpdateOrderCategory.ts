import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderCategory as ApiupdateOrderCategory } from "../services/apiOrderCategory";
import toast from "react-hot-toast";
import { OrderCategory } from "../types/ordersTypes";

const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, dataForm }: { id: string; dataForm: OrderCategory }) => {
      return toast.promise(ApiupdateOrderCategory(id, dataForm), {
        loading: "Updating Category",
        success: "Category updated successfully",
        error: (err) => err?.response?.data.msg,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ordercategory"],
      });
    },
  });
  return { updateCategory, isUpdating };
};

export default useUpdateCategory;
