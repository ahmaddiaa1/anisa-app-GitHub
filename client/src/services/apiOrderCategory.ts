import { OrderCategory } from "../types/ordersTypes";
import ApiResponse from "../utils/ApiResponse";

export const getAllOrderCategories = async (date: string) => {
  try {
    const { data } = await ApiResponse.get("orderCategory/all", {
      params: { date },
    });
    return JSON.parse(data.data);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getOrderCategories = async (
  filter = "all",
  sortBy = "createdAt-desc",
  limit = 10,
  page = 1
) => {
  try {
    const { data } = await ApiResponse.get("orderCategory", {
      params: { filter, sortBy, limit, page },
    });
    return { data: JSON.parse(data.data), count: data.count };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getOrderCategory = async (id: string) => {
  try {
    const { data } = await ApiResponse.get(`orderCategory/${id}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createOrderCategory = async (dataForm: OrderCategory) => {
  try {
    const { data } = await ApiResponse.post("orderCategory", dataForm);
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const updateOrderCategory = async (
  id: string,
  dataForm: OrderCategory
) => {
  try {
    const { data } = await ApiResponse.put(`orderCategory/${id}`, dataForm);
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
