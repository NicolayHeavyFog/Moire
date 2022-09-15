<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="product of cartProducts" :key="product.id">
        <h3>{{ product.product.title }}</h3>
        <b>{{ product.quantity }} x {{ numberFormat(product.price) }} ₽</b>
        <span>Артикул: {{ product.id }}</span>
        <span>Цвет: {{ product.color.color.title }}</span>
        <span>Размер: {{ product.size.title }}</span>
        <span
          >Итого: {{ numberFormat(product.quantity * product.price) }} ₽</span
        >
      </li>
    </ul>

    <div class="cart__total">
      <p>
        Доставка:
        <b>{{ priceDelivery !== "0" ? priceDelivery + " ₽" : "бесплатно" }}</b>
      </p>
      <p>
        Итого: <b>{{ numberFormat(totalAmount) }}</b>
        {{ declensionWord(totalAmount) }} на сумму
        <b>{{ numberFormat(totalPrice + Number(priceDelivery)) }} ₽</b>
      </p>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ItemCart } from "@/types";
import { z } from "zod";
import numberFormat from "@/helpers/numberFormat";
import declensionWord from "@/helpers/declensionWord";

export default defineComponent({
  props: {
    cartProducts: {
      required: true,
      type: Object as PropType<z.infer<typeof ItemCart>[]>,
    },
    totalAmount: {
      // required: true,
      type: Number,
    },
    priceDelivery: {
      required: false,
      default: "0",
      type: String,
    },
    totalPrice: {
      required: true,
      type: Number,
    },
  },
  setup() {
    return {
      numberFormat,
      declensionWord,
    };
  },
});
</script>

<style lang="scss" scoped>
.cart {
  &__order {
    grid-template-columns: 1fr 100px;
  }
  &__orders {
    max-height: 600px;
    overflow: scroll;
  }
}
</style>
