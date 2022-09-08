import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Category, FailureRequest } from "@/types";
import { z } from "zod";

export const categories = z.array(Category);

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof categories>;
}
export type ResponseData = SuccessRequets | FailureRequest;

export default {
  state: {},
  getters: {},
  mutation: {},
  actions: {
    loadCategory(): Promise<ResponseData> {
      return axios.get(`${API_BASE_URL}/productCategories`).then((response) => {
        return categories.safeParse(response.data.items);
      });
    },
  },
};
