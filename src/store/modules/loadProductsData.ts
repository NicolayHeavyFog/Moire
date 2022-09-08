import axios from "axios";
import { API_BASE_URL } from "@/config";
import { ProductsData, RequestFields, FailureRequest } from "@/types";
import { ActionContext } from "vuex";
import { RootState } from "@/store/index";
import { z } from "zod";

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof ProductsData>;
}
export type ResponseData = SuccessRequets | FailureRequest;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    loadProductsData(
      context: ActionContext<State, RootState>,
      requestFields: RequestFields
    ): Promise<ResponseData> {
      return axios
        .get(`${API_BASE_URL}/products`, {
          params: {
            ...requestFields,
          },
        })
        .then((response) => {
          console.log(ProductsData.safeParse(response.data));
          return ProductsData.safeParse(response.data);
        });
    },
  },
};
