import axios from "axios";
import { API_BASE_URL } from "@/config";
import { Props, FailureRequest } from "@/types";
import { z } from "zod";

export const seasons = z.array(Props);

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof seasons>;
}
export type ResponseData = SuccessRequets | FailureRequest;

export default {
  state: {},
  getters: {},
  mutation: {},
  actions: {
    loadSeason(): Promise<ResponseData> {
      return axios.get(`${API_BASE_URL}/seasons`).then((response) => {
        return seasons.safeParse(response.data.items);
      });
    },
  },
};
