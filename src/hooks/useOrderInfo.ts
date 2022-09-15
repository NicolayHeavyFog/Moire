import { onMounted, ref, Ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Order, ItemCart, FailureRequest, ErrorOrderNotFound } from "@/types";
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

function getTotalAmount(basketItems: z.infer<typeof ItemCart>[]) {
  return basketItems.reduce((acc, currentItem) => {
    return acc + currentItem.quantity;
  }, 0);
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
                orderData.value = response.data;
                orderProductTotalAmount.value = getTotalAmount(
                  orderData.value.basket.items
                );
                orderInfoStatus.loading = false;
                orderInfoStatus.loaded = true;
              } else if (isOrderNotFound(response.data)) {
                orderInfoStatus.textError = response.data.data.error.message;
                orderInfoStatus.loaded = false;
              }
            }
            orderInfoStatus.loading = false;
          }
        );
    }
    if (orderData.value) {
      orderProductTotalAmount.value = getTotalAmount(
        orderData.value.basket.items
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
