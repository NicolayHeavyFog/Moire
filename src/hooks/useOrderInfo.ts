import { onMounted, ref, Ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Order, FailureRequest, ErrorOrderNotFound } from "@/types";
import { z } from "zod";

interface returnValues {
  orderData: Ref<z.infer<typeof Order> | null>;
  orderInfoStatus: {
    loading: boolean;
    loaded: boolean;
    textError: null | string;
  };
  orderProductTotalAmount: Ref<number | null>;
}

function isOrder(value: unknown): value is z.infer<typeof Order> {
  return Order.safeParse(value).success;
}

function isOrderNotFound(
  value: unknown
): value is z.infer<typeof ErrorOrderNotFound> {
  return ErrorOrderNotFound.safeParse(value).success;
}

export default function useOrderInfo(): returnValues {
  const $store = useStore();
  const $route = useRoute();
  const orderData: Ref<z.infer<typeof Order> | null> = ref(null);
  const orderProductTotalAmount: Ref<number | null> = ref(null);
  const orderInfoStatus: {
    loading: boolean;
    loaded: boolean;
    textError: null | string;
  } = reactive({
    loading: true,
    loaded: false,
    textError: null,
  });

  onMounted(() => {
    orderData.value = $store.getters["order/orderInfo"];
    if (!orderData.value) {
      orderInfoStatus.loading = true;
      orderInfoStatus.loaded = false;
      $store
        .dispatch("order/getOrderById", +$route.params.id)
        .then(
          (
            response:
              | { success: true; data: z.infer<typeof Order> }
              | { success: true; data: z.infer<typeof ErrorOrderNotFound> }
              | FailureRequest
          ) => {
            if (response.success) {
              if (isOrder(response.data)) {
                console.log("its ok");
                orderData.value = response.data;
                orderInfoStatus.loaded = true;
              } else if (isOrderNotFound(response.data)) {
                console.log("is error");
                orderInfoStatus.textError = response.data.data.error.message;
                orderInfoStatus.loaded = false;
              }
            }
          }
        );
      orderInfoStatus.loading = false;
    }
    if (orderData.value) {
      orderProductTotalAmount.value = orderData.value.basket.items.reduce(
        (acc, currentItem) => {
          return acc + currentItem.quantity;
        },
        0
      );
      orderInfoStatus.loading = false;
      orderInfoStatus.loaded = true;
    }
  });

  return {
    orderData,
    orderInfoStatus,
    orderProductTotalAmount,
  };
}
