import { Ref, ref } from "vue";
import { useStore } from "vuex";
import { CartProduct } from "@/types";
import { z } from "zod";

interface returnValues {
  currentQuntity: Ref<number>;
  deleteProduct: () => void;
  updateQunatity: (q: number) => void;
  picIsLoad: Ref<boolean>;
  inputQunatity: () => void;
}

interface Props {
  product: z.infer<typeof CartProduct>;
}

export default function useCartItem(
  props: Props,
  picIsLoad: Ref<boolean>
): returnValues {
  const $store = useStore();
  const currentQuntity = ref<number>(props.product.quantity);
  function deleteProduct() {
    picIsLoad.value = false;
    $store.dispatch("cart/deleteProductFromCart", props.product.id).then(() => {
      picIsLoad.value = true;
    });
  }
  function updateQunatity(q: number) {
    picIsLoad.value = false;
    $store
      .dispatch("cart/updateQuantityProduct", {
        basketItemId: props.product.id,
        quantity: q,
      })
      .then(() => {
        picIsLoad.value = true;
      });
  }

  function inputQunatity() {
    // eslint-disable-next-line prefer-const
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (currentQuntity.value >= 1) {
        picIsLoad.value = false;
        $store
          .dispatch("cart/updateQuantityProduct", {
            basketItemId: props.product.id,
            quantity: currentQuntity.value,
          })
          .then(() => {
            picIsLoad.value = true;
          });
      }
    }, 500);
  }

  return {
    picIsLoad,
    currentQuntity,
    deleteProduct,
    updateQunatity,
    inputQunatity,
  };
}
