<template>
  <router-link
    class="header__cart"
    :to="{ name: 'cart' }"
    aria-label="Корзина с товарами"
  >
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{
      amount
    }}</span>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const $store = useStore();
    const amount = computed(() => {
      return $store.getters["cart/getTotalAmount"];
    });

    return {
      amount,
    };
  },
});
</script>
