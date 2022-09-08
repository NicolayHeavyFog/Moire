import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Props, FailureRequest } from "@/types";
import { z } from "zod";

export const materials = z.array(Props);

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof materials>;
}
export type ResponseData = SuccessRequets | FailureRequest;

export default {
  state: {},
  getters: {},
  mutation: {},
  actions: {
    loadMaterial(): Promise<ResponseData> {
      return axios.get(`${API_BASE_URL}/materials`).then((response) => {
        return materials.safeParse(response.data.items);
      });
    },
  },
};
