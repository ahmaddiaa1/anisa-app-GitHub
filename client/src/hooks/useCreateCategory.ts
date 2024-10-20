import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createOrderCategory as createOrderCategoryApi } from "../services/apiOrderCategory";
import { OrderCategory } from "../types/ordersTypes";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationFn: (Category: OrderCategory) =>
      toast.promise(createOrderCategoryApi(Category), {
        loading: "Creating new Category",
        success: "New Category created successfully",
        error: (err) => err?.response?.data.msg,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordercategory"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error("An error occurred while creating the Category");
      }
    },
  });

  return { createCategory, isCreating };
};
