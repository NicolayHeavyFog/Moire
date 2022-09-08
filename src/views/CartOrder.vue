<template>
  <div class="content__top">
    <ul class="breadcrumbs">
      <li class="breadcrumbs__item">
        <router-link :to="{ name: 'home' }" class="breadcrumbs__link"
          >Каталог</router-link
        >
      </li>
      <li class="breadcrumbs__item">
        <router-link :to="{ name: 'cart' }" class="breadcrumbs__link"
          >Корзина</router-link
        >
      </li>
      <li class="breadcrumbs__item">
        <span class="breadcrumbs__link"> Оформление заказа </span>
      </li>
    </ul>

    <div class="content__row">
      <h1 class="content__title">Оформление заказа</h1>
    </div>
  </div>

  <section class="cart">
    <form
      class="cart__form form"
      action="#"
      method="POST"
      @submit.prevent="
        makeOrder({
          formData,
          paymentTypeId: currentPaymentId,
          deliveryTypeId: currentDeliveryId,
        })
      "
    >
      <div class="cart__field">
        <div class="cart__data">
          <BaseFormText
            v-model="formData.name"
            :error="formError.name"
            :title="'ФИО'"
            :placeholder="'Введите ваше полное имя'"
          />

          <BaseFormText
            v-model="formData.address"
            :error="formError.address"
            :title="'Адрес доставки'"
            :placeholder="'Введите ваш адрес'"
          />

          <BaseFormText
            v-model="formData.phone"
            :error="formError.phone"
            :title="'Телефон'"
            :placeholder="'Введите ваш телефон'"
          />

          <BaseFormText
            v-model="formData.email"
            :error="formError.email"
            :title="'Email'"
            :placeholder="'Введи ваш Email'"
          />

          <BaseFormTextarea
            :title="'Комментарий к заказу'"
            :error="formError.comment"
            v-model="formData.comment"
            :placeholder="'Ваши пожелания'"
          />
        </div>

        <div class="cart__options">
          <h3 class="cart__title">Доставка</h3>
          <BaseLoaderCircle v-if="statusAvailableDeliveries.loading" />
          <ul
            class="cart__options options"
            v-if="statusAvailableDeliveries.loaded"
          >
            <li
              class="options__item"
              v-for="(delivery, index) in availableDeliveries"
              :key="index"
            >
              <label class="options__label">
                <input
                  class="options__radio sr-only"
                  type="radio"
                  name="delivery"
                  :value="delivery.id"
                  v-model="currentDeliveryId"
                />
                <span class="options__value">
                  {{ delivery.title }}
                  <b>{{
                    delivery.price === "0" ? "бесплатно" : delivery.price
                  }}</b>
                </span>
              </label>
            </li>
          </ul>
          <BaseLoaderCircle
            v-if="statusAvailablePayments.loading && currentDeliveryId"
          />
          <div v-if="statusAvailablePayments.loaded">
            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li
                class="options__item"
                v-for="(payment, index) of availablePayments"
                :key="index"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="payment.id"
                    v-model="currentPaymentId"
                  />
                  <span class="options__value"> {{ payment.title }} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <CartBlock
        :cart-products="cartProducts"
        :price-delivery="currentPrice"
        :total-amount="totalAmount"
        :total-price="totalPrice"
      >
        <BaseButton
          :disabled="!totalAmount"
          :text="'Оформить заказ'"
          class="cart__button button button--primery"
          type="submit"
        />
      </CartBlock>
      <div class="cart__error form__error-block" v-if="error">
        <h4>Заявка не отправлена!</h4>
        <p>
          Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите
          страницу.
        </p>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import BaseFormText from "@/components/BaseFormText.vue";
import BaseFormTextarea from "@/components/BaseFormTextarea.vue";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import BaseButton from "@/components/BaseButton.vue";
import CartBlock from "@/components/CartBlock.vue";
import { FormFields } from "@/types";
import useOrder from "@/hooks/useOrder";
import numberFormat from "@/helpers/numberFormat";
import declensionWord from "@/helpers/declensionWord";

export default defineComponent({
  components: {
    BaseFormText,
    BaseFormTextarea,
    CartBlock,
    BaseButton,
    BaseLoaderCircle,
  },
  setup() {
    const {
      formData,
      formError,
      cartProducts,
      totalAmount,
      totalPrice,

      getAvailableDeliveries,
      availableDeliveries,
      statusAvailableDeliveries,

      getAvailablePayments,
      availablePayments,
      statusAvailablePayments,

      makeOrder,
      error,
    } = useOrder();

    const currentDeliveryId = ref<number | null>(null);
    const currentPrice = ref<string | undefined>("0");
    const currentPaymentId = ref<number | null>(null);

    getAvailableDeliveries();

    watch(currentDeliveryId, () => {
      if (availableDeliveries.value) {
        currentPrice.value = availableDeliveries.value.find(
          (delivery: { id: number; price: string; title: string }) =>
            delivery.id === currentDeliveryId.value
        )?.price;
      }

      if (currentDeliveryId.value) {
        getAvailablePayments(currentDeliveryId.value);
      }
    });

    return {
      formData,
      formError,
      cartProducts,
      numberFormat,
      declensionWord,
      totalAmount,
      totalPrice,

      currentDeliveryId,
      statusAvailableDeliveries,
      availableDeliveries,

      currentPaymentId,
      statusAvailablePayments,
      availablePayments,

      currentPrice,

      makeOrder,
      error,
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
