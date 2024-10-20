import apiResponse from "../utils/ApiResponse.ts";

export const getAddresses = async () => {
  try {
    const { data } = await apiResponse.get("address");
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAddress = async (address: { address: string }) => {
  try {
    const { data } = await apiResponse.post("address", address);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAddresses = async (id: string) => {
  try {
    const { data } = await apiResponse.delete(`address/${id}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
