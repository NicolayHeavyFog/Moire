<template>
  <li class="cart__item product">
    <div class="product__pic">
      <BaseLoaderCircle class="loading-circle" v-if="!picIsLoad" />
      <img
        :class="picIsLoad ? 'active' : 'hidden'"
        ref="img"
        :src="product.image"
        width="120"
        height="120"
        alt="Название товара"
      />
    </div>
    <h3 class="product__title">{{ product.product.title }}</h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i
          :style="`background-color: ${setColor(product.color.color.code)};`"
        ></i>
        {{ product.color.color.title }}
      </span>
    </p>
    <p class="product__info product__info--size">
      Размер:
      <span>
        {{ product.size.title }}
      </span>
    </p>
    <span class="product__code"> Артикул: {{ product.id }} </span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        :disabled="currentQuntity <= 1"
        @click="updateQunatity(--currentQuntity)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input
        type="text"
        v-model.number="currentQuntity"
        @input="inputQunatity()"
        name="count"
      />

      <button
        type="button"
        aria-label="Добавить один товар"
        @click="updateQunatity(++currentQuntity)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price"> {{ numberFormat(product.price) }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      @click="deleteProduct()"
      aria-label="Удалить товар из корзины"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted } from "vue";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import numberFormat from "@/helpers/numberFormat";
import useCharacteristicProduct from "@/hooks/useCharacteristicProduct";
import useProductItem from "@/hooks/useProductItem";
import { CartProduct } from "@/types";
import useCartItem from "@/hooks/useCartItem";
import { z } from "zod";

interface Props {
  product: z.infer<typeof CartProduct>;
}

export default defineComponent({
  props: {
    product: {
      required: true,
      type: Object as PropType<z.infer<typeof CartProduct>>,
    },
  },
  components: {
    BaseLoaderCircle,
  },
  setup(props: Props) {
    const { setColor } = useCharacteristicProduct();
    const { checkLoad, img, picIsLoad } = useProductItem();
    const { deleteProduct, currentQuntity, updateQunatity, inputQunatity } =
      useCartItem(props, picIsLoad);

    onMounted(() => {
      checkLoad();
    });

    return {
      numberFormat,
      setColor,
      deleteProduct,
      currentQuntity,
      updateQunatity,
      img,
      picIsLoad,
      inputQunatity,
    };
  },
});
</script>

<style scoped>
.product {
  grid-template-rows: repeat(4, min-content);
}
.product__info--size {
  grid-column: 2/3;
  grid-row: 3/4;
}

.product__code {
  grid-row: 4/5;
}

.product__pic {
  grid-row: 1/5;
}

.loading-circle {
  position: absolute;
  background: white;
  z-index: 1;
}

.cart__item {
  position: relative;
}

.active {
  opacity: 1;
}

.hidden {
  opacity: 0;
}
</style>
