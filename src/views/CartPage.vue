<template>
  <div class="content__top">
    <ul class="breadcrumbs">
      <li class="breadcrumbs__item">
        <router-link class="breadcrumbs__link" :to="{ name: 'home' }">
          Каталог
        </router-link>
      </li>
      <li class="breadcrumbs__item">
        <span class="breadcrumbs__link"> Корзина </span>
      </li>
    </ul>

    <div class="content__row">
      <h1 class="content__title">Корзина</h1>
      <span class="content__info">
        {{ totalAmount }} {{ declensionWord(totalAmount) }}
      </span>
    </div>
  </div>

  <section class="cart">
    <BaseLoaderCircle v-if="statusCart.loading" />
    <form class="cart__form form" action="#" method="POST" v-else>
      <div class="cart__field">
        <ul class="cart__list">
          <CartItem
            v-for="product of cartProducts"
            :key="product.id"
            :product="product"
          />
        </ul>
      </div>

      <div class="cart__block">
        <p class="cart__desc">
          Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
        </p>
        <p class="cart__price" v-if="totalPrice">
          Итого: <span>{{ numberFormat(totalPrice) }} ₽</span>
        </p>
        <router-link v-slot="{ navigate }" :to="{ name: 'order' }" custom>
          <button
            class="cart__button button button--primery"
            type="button"
            :disabled="!totalAmount"
            @click="navigate"
          >
            Оформить заказ
          </button>
        </router-link>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import declensionWord from "@/helpers/declensionWord";
import numberFormat from "@/helpers/numberFormat";
import CartItem from "@/components/CartItem.vue";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import { CartProduct } from "@/types";
import { z } from "zod";
export default defineComponent({
  components: {
    CartItem,
    BaseLoaderCircle,
  },
  setup() {
    const $store = useStore();
    const totalAmount = computed(() => {
      return $store.getters["cart/getTotalAmount"];
    });
    const cartProducts = computed(() => {
      return $store.getters["cart/getCartProduct"].map(
        (product: z.infer<typeof CartProduct>) => {
          const image: string = product.color.gallery
            ? product.color.gallery[0].file.url
            : "https://hb.bizmrg.com/ex-press/images/content/original/image-not-found-e6ed8dc1475cac69ba6604c3783544aa86064b6e.png";
          return {
            ...product,
            image,
          };
        }
      );
    });
    const statusCart = computed(() => {
      return $store.getters["cart/getStatusCart"];
    });
    const totalPrice = computed(() => {
      return $store.getters["cart/getCartProduct"].reduce(
        (acc: number, product: z.infer<typeof CartProduct>) => {
          return acc + product.price * product.quantity;
        },
        0
      );
    });

    return {
      totalAmount,
      declensionWord,
      cartProducts,
      totalPrice,
      numberFormat,
      statusCart,
    };
  },
});
</script>

<style scoped>
.cart__list {
  position: relative;
}
</style>
