import ApiResponse, { baseURL } from "../utils/ApiResponse";

export const getAnisas = async (
  page: number,
  sortBy: string,
  search: string,
  pageSize: number,
  filterBy: string
) => {
  try {
    const { data } = await ApiResponse.get(`anisa`, {
      params: {
        page,
        sortBy,
        search,
        pageSize,
        filterBy,
      },
    });

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getNonPaidAnisa = async () => {
  try {
    const { data } = await ApiResponse.get(`anisa/paid`);

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getSingleAnisa = async (id: string) => {
  try {
    const { data } = await ApiResponse.get("/anisa/" + id);

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAnisa = async (form: any) => {
  try {
    const { data } = await ApiResponse.post("/anisa", form);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAnisa = async (anisaID: string, form: FormData) => {
  try {
    const { data } = await ApiResponse.put("/anisa/" + anisaID, form);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyAnisa = async ({ anisaID }: { anisaID: string }) => {
  try {
    const res = await ApiResponse.put(`/anisa/verify/${anisaID}`);

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const blacklistAnisa = async (anisaID: string) => {
  try {
    const res = await ApiResponse.put(`/anisa/blacklist/${anisaID}`);

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const downloadAnisaPdf = async (id: string) => {
  const url = `${baseURL}public/pdfs/anisa_${id}_images.pdf`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank"; // Open in a new tab
  link.download = `anisa_${id}_images.pdf`; // This attribute is optional when opening in a new tab
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const deleteAnisa = async ({ anisaID }: { anisaID: string }) => {
  try {
    const res = await ApiResponse.delete(`/anisa/${anisaID}`);

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
