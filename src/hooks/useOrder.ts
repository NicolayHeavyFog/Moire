import { computed, ComputedRef, ref, Ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  ItemCart,
  Delivery,
  Payment,
  FailureRequest,
  FormFields,
  ErrorOrder,
  Order,
} from "@/types";
import { ErrorRequestOrder, SuccessRequetsOrder } from "@/store/modules/order";
import { z } from "zod";

const errorResponse = z
  .object({
    success: z.boolean(),
    data: ErrorOrder,
    err: z.boolean(),
  })
  .strict();

const successResponse = z
  .object({
    success: z.boolean(),
    data: Order,
  })
  .strict();

function isErrorResponse(value: unknown): value is ErrorRequestOrder {
  return errorResponse.safeParse(value).success;
}

function isSuccessResponse(value: unknown): value is SuccessRequetsOrder {
  return successResponse.safeParse(value).success;
}

interface returnValues {
  cartProducts: ComputedRef<[] | z.infer<typeof ItemCart>[]>;
  totalAmount: ComputedRef<number>;
  totalPrice: ComputedRef<number>;
  formData: {
    name: string;
    address: string;
    phone: string;
    email: string;
    comment: string;
  };
  formError: Partial<{
    name: string;
    address: string;
    phone: string;
    email: string;
    comment: string;
  }>;

  availableDeliveries: Ref<z.infer<typeof Delivery>[] | null>;
  availablePayments: Ref<z.infer<typeof Payment>[] | null>;

  statusAvailableDeliveries: {
    loaded: boolean;
    loading: boolean;
  };
  statusAvailablePayments: {
    loaded: boolean;
    loading: boolean;
  };

  getAvailableDeliveries: () => void;
  getAvailablePayments: (deliveryTypeId: number) => void;

  makeOrder(value: {
    formData: FormFields;
    paymentTypeId: number;
    deliveryTypeId: number;
  }): void;
  error: Ref<boolean>;
}

export default function useOrder(): returnValues {
  const $store = useStore();
  const $router = useRouter();
  const statusAvailableDeliveries = reactive({
    loaded: false,
    loading: true,
  });
  const statusAvailablePayments = reactive({
    loaded: false,
    loading: true,
  });
  const formData: FormFields = reactive({
    name: "",
    address: "",
    phone: "",
    email: "",
    comment: "",
  });
  const error = ref<boolean>(false);
  const formError: Partial<FormFields> = reactive({});
  const availableDeliveries = ref<z.infer<typeof Delivery>[] | null>(null);
  const availablePayments = ref<z.infer<typeof Payment>[] | null>(null);
  const cartProducts: ComputedRef<[] | z.infer<typeof ItemCart>[]> = computed(
    () => {
      return $store.getters["cart/getCartProduct"];
    }
  );
  const totalAmount: ComputedRef<number> = computed(() => {
    return $store.getters["cart/getTotalAmount"];
  });

  const totalPrice: ComputedRef<number> = computed(() => {
    return $store.getters["cart/getTotalPrice"];
  });

  function getAvailableDeliveries(): void {
    statusAvailableDeliveries.loading = true;
    $store
      .dispatch("order/typesOfDelivery")
      .then(
        (
          response:
            | { success: boolean; data: z.infer<typeof Delivery>[] }
            | FailureRequest
        ) => {
          if (response.success) {
            availableDeliveries.value = response.data;
          } else {
            console.log("Ошибка в получении категории из useOrder");
          }
          statusAvailableDeliveries.loading = false;
          statusAvailableDeliveries.loaded = true;
        }
      );
  }

  function getAvailablePayments(deliveryTypeId: number): void {
    statusAvailablePayments.loading = true;
    statusAvailablePayments.loaded = false;
    $store
      .dispatch("order/typesOfPayment", deliveryTypeId)
      .then(
        (
          response:
            | { success: boolean; data: z.infer<typeof Payment>[] }
            | FailureRequest
        ) => {
          if (response.success) {
            availablePayments.value = response.data;
          } else {
            console.log("Произошла ошибка");
          }
          statusAvailablePayments.loading = false;
          statusAvailablePayments.loaded = true;
        }
      );
  }

  function makeOrder(value: {
    formData: FormFields;
    paymentTypeId: number;
    deliveryTypeId: number;
  }): void {
    $store.dispatch("order/makeOrder", value).then(
      (
        response:
          | {
              success: true;
              data: z.infer<typeof ErrorOrder>;
              err: true;
            }
          | { success: boolean; data: z.infer<typeof Order> }
          | FailureRequest
      ) => {
        formError.address = "";
        formError.email = "";
        formError.name = "";
        formError.phone = "";
        error.value = false;
        if (isErrorResponse(response)) {
          const r = response.data.data.error.request;
          if (r.address) formError.address = r.address;
          if (r.email) formError.email = r.email;
          if (r.name) formError.name = r.name;
          if (r.phone) formError.phone = r.phone;
          error.value = true;
        }

        if (isSuccessResponse(response)) {
          const r = response.data;
          $store.commit("order/orderInfoUpdate", r);
          $store.commit("cart/resetCart");
          $router.push({ name: "order-info", params: { id: r.id } });
        }
      }
    );
  }

  return {
    cartProducts,
    totalAmount,
    totalPrice,
    formData,
    formError,

    availableDeliveries,
    availablePayments,

    statusAvailablePayments,
    statusAvailableDeliveries,

    getAvailableDeliveries,
    getAvailablePayments,

    makeOrder,
    error,
  };
}
