import { Order } from "../types/ordersTypes";
import ApiResponse from "../utils/ApiResponse";

export const getAllOrders = async (date: string) => {
  try {
    const { data } = await ApiResponse.get(`/order/all`, {
      params: {
        date,
      },
    });
    return {
      data: JSON.parse(data.data),
      count: data.count,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrders = async (
  search: string,
  sortBy: string,
  filter: string,
  page: number,
  PAGE_SIZE: number
) => {
  const data = await ApiResponse(`/order`, {
    params: {
      search,
      sortBy,
      filter,
      page,
      PAGE_SIZE,
    },
  });
  return data;
};

export const getOrder = async (id: string) => {
  try {
    const { data } = await ApiResponse.get(`/order/` + id);
    return {
      data: JSON.parse(data.data),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOrderOptions = async () => {
  try {
    const { data } = await ApiResponse.get(`/order/options`);
    return {
      orderCategory: JSON.parse(data.orderCategory),
      client: JSON.parse(data.client),
      anisa: JSON.parse(data.anisa),
    };
  } catch (error) {
    console.log(error);
  }
};

export const addOrder = async (order: Order) => {
  try {
    const { data } = await ApiResponse.post(`/order`, order);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateOrder = async (id: string, order: any) => {
  try {
    const { data } = await ApiResponse.put(`order/` + id, order);

    return JSON.parse(data.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const doneOrder = async (id: string) => {
  try {
    const { data } = await ApiResponse.put(`/order/done/` + id);
    return JSON.parse(data.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const PayAnisa = async (payed: {
  orderID?: string;
  anisaID: string;
  type: string;
}) => {
  try {
    const { data } = await ApiResponse.put(
      `/order/pay/` + payed.anisaID,
      payed
    );
    return JSON.parse(data.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const acceptOrder = async (id: string) => {
  try {
    const { data } = await ApiResponse.put(`/order/accept/` + id);
    return JSON.parse(data.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const cancelOrder = async (id: string) => {
  try {
    const { data } = await ApiResponse.put(`/order/cancel/` + id);
    return JSON.parse(data.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
