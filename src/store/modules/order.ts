import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/config";
import { ActionContext } from "vuex";
import { RootState } from "@/store/index";
import {
  FailureRequest,
  FormFields,
  Delivery,
  Order,
  Payment,
  ErrorOrder,
  ErrorOrderNotFound,
} from "@/types";
import { z } from "zod";

const Deliveries = z.array(Delivery);
const Payments = z.array(Payment);

interface ErrorGetByIdRequest {
  success: true;
  data: z.infer<typeof ErrorOrderNotFound>;
}

export interface SuccessRequetsOrder {
  success: true;
  data: z.infer<typeof Order>;
}

export interface ErrorRequestOrder {
  success: true;
  data: z.infer<typeof ErrorOrder>;
  err: true;
}

type ResponseData = SuccessRequetsOrder | FailureRequest | ErrorRequestOrder;

interface SuccessRequetsDeliveries {
  success: true;
  data: z.infer<typeof Deliveries>;
}

type ResponseDeliveriesData = SuccessRequetsDeliveries | FailureRequest;

interface SuccessRequestPayment {
  success: true;
  data: z.infer<typeof Payments>;
}

type ResponsePaymentsData = SuccessRequestPayment | FailureRequest;

interface State {
  orderInfo: z.infer<typeof Order>;
}

export default {
  namespaced: true,
  state() {
    return {
      orderInfo: null,
    };
  },
  getters: {
    orderInfo(state: State) {
      return state.orderInfo;
    },
  },
  mutations: {
    orderInfoUpdate(state: State, newOrderInfo: z.infer<typeof Order>) {
      state.orderInfo = newOrderInfo;
    },
  },
  actions: {
    makeOrder(
      context: ActionContext<State, RootState>,
      value: {
        formData: FormFields;
        paymentTypeId: number;
        deliveryTypeId: number;
      }
    ): Promise<ResponseData> {
      return axios
        .post(
          `${API_BASE_URL}/orders`,
          {
            ...value.formData,
            paymentTypeId: value.paymentTypeId,
            deliveryTypeId: value.deliveryTypeId,
          },
          {
            params: {
              userAccessKey: context.rootState.userAccessKey,
            },
          }
        )
        .then((response) => {
          const r = Order.safeParse(response.data);

          // this.$store.commit("resetCart");
          // this.$store.commit("updateOrderInfo", response.data);
          // this.$router.push({
          //   name: "orderInfo",
          //   params: { id: response.data.id },
          // });
          return r;
        })
        .catch((error) => {
          const e = ErrorOrder.safeParse(error.response);
          return { ...e, err: true };
        });
      // .catch((error) => {
      //   this.formError = error.response.data.error.request || {};
      //   this.formErrorMessage = error.response.data.error.message;
      // });
    },
    typesOfDelivery(): Promise<ResponseDeliveriesData> {
      return axios.get(`${API_BASE_URL}/deliveries`).then((response) => {
        const r = Deliveries.safeParse(response.data);
        if (r.success) {
          console.log("Успешно получены способы доставки");
        } else {
          console.log("Ошибка в получении типов доставки");
        }
        return r;
      });
    },
    typesOfPayment(
      contenxt: ActionContext<State, RootState>,
      deliveryTypeId: number
    ): Promise<ResponsePaymentsData> {
      return axios
        .get(`${API_BASE_URL}/payments`, {
          params: { deliveryTypeId },
        })
        .then((response) => {
          const r = Payments.safeParse(response.data);
          if (r.success) {
            console.log("Успешно получены способы оплаты");
          } else {
            console.log("Ошибка в получении способов оплаты");
          }
          return r;
        });
    },

    getOrderById(
      context: ActionContext<State, RootState>,
      orderId: number
    ): Promise<SuccessRequetsOrder | ErrorGetByIdRequest | FailureRequest> {
      return axios
        .get(`${API_BASE_URL}/orders/${orderId}`, {
          params: {
            userAccessKey: context.rootState.userAccessKey,
            orderId: orderId,
          },
        })
        .then((response) => {
          const r = Order.safeParse(response.data);
          if (r.success) {
            console.log("заказ по id был получен успешно");
          } else {
            console.log("заказ по id не был получен");
          }
          return r;
        })
        .catch((e: AxiosError) => {
          const r = ErrorOrderNotFound.safeParse(e.response);
          if (r.success) {
            console.log("по такому id заказ найти не удалось");
          }
          return r;
        });
    },
  },
};
