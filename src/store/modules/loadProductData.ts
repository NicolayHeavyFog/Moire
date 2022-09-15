import axios from "axios";
import { API_BASE_URL } from "@/config";
import { ActionContext } from "vuex";
import { RootState } from "@/store/index";
import { FailureRequest, Product } from "@/types";
import { z } from "zod";

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof Product>;
}
export type ResponseData = SuccessRequets | FailureRequest;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

export default {
  state: {},
  getters: {},
  mutation: {},
  actions: {
    loadProductData(
      context: ActionContext<State, RootState>,
      id: string
    ): Promise<ResponseData> {
      return axios.get(`${API_BASE_URL}/products/${id}`).then((response) => {
        return Product.safeParse(response.data);
      });
    },
  },
};
