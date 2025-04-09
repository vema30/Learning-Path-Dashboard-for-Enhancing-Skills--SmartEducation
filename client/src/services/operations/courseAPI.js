import { apiConnector } from "../apiconnector";
import { categoriesEndpoints } from "../apis";

const { CREATE_CATEGORY_API } = categoriesEndpoints;

export const createCategory = async (data, token) => {
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
