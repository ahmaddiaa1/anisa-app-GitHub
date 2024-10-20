import ApiResponse from "../utils/ApiResponse";
import { UserProps } from "../types/types.ts";

export const getUsers = async (
  page: number,
  sortBy: string,
  search: string,
  PAGE_SIZE: number,
  role: string
) => {
  try {
    const { data } = await ApiResponse.get(`/auth/users`, {
      params: {
        page,
        sortBy,
        search,
        PAGE_SIZE,
        role,
      },
    });
    return { data: JSON.parse(data.data), count: data.count };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const { data } = await ApiResponse.get(`auth/user/${id}`);

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUser = async (user: UserProps) => {
  try {
    const { data } = await ApiResponse.post(`auth/create-user`, user);

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const { data } = await ApiResponse.post(`auth/login`, {
      email,
      password,
    });

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data } = await ApiResponse(`auth/current-user`);

  return JSON.parse(data.data);
}

export const updateUser = async (id: string, user: UserProps) => {
  try {
    const { data } = await ApiResponse.put(`auth/update/${id}`, user);

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCancelUser = async (id: string) => {
  try {
    const { data } = await ApiResponse.put(`auth/update-cancel/${id}`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await ApiResponse.delete(`auth/delete/${id}`);

    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const { data } = await ApiResponse.post(`auth/logout`);
    return JSON.parse(data.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
