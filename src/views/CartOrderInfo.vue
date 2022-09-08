<template>
  <div class="content__top">
    <ul class="breadcrumbs">
      <li class="breadcrumbs__item">
        <router-link class="breadcrumbs__link" :to="{ name: 'home' }">
          Каталог
        </router-link>
      </li>
      <li class="breadcrumbs__item">
        <router-link class="breadcrumbs__link" :to="{ name: 'cart' }"
          >Корзина</router-link
        >
      </li>
      <li class="breadcrumbs__item">
        <span class="breadcrumbs__link"> Оформление заказа </span>
      </li>
    </ul>

    <h1 class="content__title" v-if="orderInfoStatus.loaded">
      Заказ оформлен <span>№ {{ orderData.id }}</span>
    </h1>
  </div>

  <section class="cart">
    <BaseLoaderCircle v-if="orderInfoStatus.loading" />
    <div
      class="cart__not-found"
      v-if="!orderInfoStatus.loaded && orderInfoStatus.textError"
    >
      <h1>Ошибка</h1>
      <p>{{ orderInfoStatus.textError }}</p>
    </div>

    <form
      class="cart__form form"
      action="#"
      method="POST"
      v-if="orderInfoStatus.loaded"
    >
      <div class="cart__field">
        <p class="cart__message">
          Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
          письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
          в&nbsp;течение часа для уточнения деталей доставки.
        </p>

        <ul class="dictionary">
          <li class="dictionary__item">
            <span class="dictionary__key"> Получатель </span>
            <span class="dictionary__value"> {{ orderData.name }} </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key"> Адрес доставки </span>
            <span class="dictionary__value">
              {{ orderData.address }}
            </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key"> Телефон </span>
            <span class="dictionary__value"> {{ orderData.phone }} </span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key"> Email </span>
            <span class="dictionary__value"> {{ orderData.email }}</span>
          </li>
          <li class="dictionary__item">
            <span class="dictionary__key"> Способ оплаты </span>
            <span class="dictionary__value">{{ orderData.paymentType }} </span>
          </li>
        </ul>
      </div>

      <CartBlock
        v-if="orderInfoStatus.loaded"
        :cart-products="orderData.basket.items"
        :price-delivery="orderData.deliveryType.price"
        :total-amount="orderProductTotalAmount"
        :total-price="orderData.totalPrice"
      />
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import CartBlock from "@/components/CartBlock.vue";

import useOrderInfo from "@/hooks/useOrderInfo";

export default defineComponent({
  components: { BaseLoaderCircle, CartBlock },
  setup() {
    const { orderData, orderInfoStatus, orderProductTotalAmount } =
      useOrderInfo();

    return {
      orderData,
      orderInfoStatus,
      orderProductTotalAmount,
    };
  },
});
</script>

<style lang="scss" scoped>
.cart__not-found {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
