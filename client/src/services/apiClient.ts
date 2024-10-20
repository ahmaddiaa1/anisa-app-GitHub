import { clientWithOutID } from "../types/types.ts";
import ApiResponse, { baseURL } from "../utils/ApiResponse.ts";
import apiResponse from "../utils/ApiResponse.ts";

export const getClients = async (
  search = "",
  page = 1,
  limit = 10,
  sortBy: string,
  filterBy: string
) => {
  try {
    const { data } = await ApiResponse.get(`client`, {
      params: {
        search,
        page,
        limit,
        sortBy,
        filterBy,
      },
    });

    return {
      client: JSON.parse(data.data),
      TotalClients: data.totalItems,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClient = async (clientId: string) => {
  try {
    const { data } = await ApiResponse.get(`client/${clientId}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createClient = async (client: FormData) => {
  try {
    const { data } = await ApiResponse.post("client/create", client);

    console.log("data", data);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateClient = async (id: string, client: clientWithOutID) => {
  try {
    const { data } = await ApiResponse.put(`client/${id}`, client);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyClient = async (id: string) => {
  try {
    const { data } = await ApiResponse.put(`client/verify/${id}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const blacklistClient = async (id: string) => {
  try {
    const { data } = await apiResponse.put(`client/blacklist/${id}`);
    return JSON.parse(data.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const downloadPdf = async (id: string) => {
  const url = `${baseURL}public/pdfs/client_${id}_images.pdf`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank"; // Open in a new tab
  link.download = `client_${id}_images.pdf`; // This attribute is optional when opening in a new tab
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const deleteChild = async (childId: string) => {
  try {
    const { data } = await ApiResponse.delete(`client/child/${childId}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const { data } = await ApiResponse.delete(`client/note/${noteId}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAddress = async (addressId: string) => {
  try {
    const { data } = await ApiResponse.delete(`client/address/${addressId}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
