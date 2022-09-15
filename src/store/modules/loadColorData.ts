import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Props, FailureRequest } from "@/types";
import { z } from "zod";

export const colors = z.array(Props);

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof colors>;
}
export type ResponseData = SuccessRequets | FailureRequest;

export default {
  actions: {
    loadColors(): Promise<ResponseData> {
      return axios.get(`${API_BASE_URL}/colors`).then((response) => {
        return colors.safeParse(response.data.items);
      });
    },
  },
};
