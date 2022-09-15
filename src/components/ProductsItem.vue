<template>
  <li class="catalog__item">
    <BaseLoaderCircle ref="loaderCircle" />
    <ProductStatus
      ref="productAddedIndicator"
      :status="statusProduct.productIsAdded"
    />
    <div class="catalog__pic">
      <BaseLoaderCircle v-if="!picIsLoad" />
      <router-link
        :to="{ name: 'product', params: { id: product.id } }"
        :class="picIsLoad ? 'active' : 'hidden'"
      >
        <img ref="img" :src="product.imageSet[0]" :alt="product.title"
      /></router-link>
    </div>

    <h3 class="catalog__title">
      <a href="#" @click.prevent=""> {{ product.title }} </a>
    </h3>

    <span class="catalog__price"> {{ numberFormat(product.price) }} ₽ </span>

    <div class="item__line">
      <BaseCharacteristicProduct
        :characteristics="reassemblyColors(product.colors)"
        v-model:param="colorId"
      />

      <BaseCharacteristicProduct
        v-if="productFullDataLoad"
        :characteristics="productFullData.sizes"
        v-model:param="sizeId"
        :key="product.id"
      />
    </div>
    <BaseButton
      class="button button--primery"
      :disabled="!sizeId || !colorId"
      @click="
        addProductToCart({
          productId: product.id,
          colorId,
          sizeId,
          quantity: 1,
        })
      "
    />

    <!-- <BaseNotification
      :condition="statusProduct.productIsAdded"
      :text-header="`Моя корзина, ${totalAmount} ${declensionWord(
        totalAmount
      )}`"
      :description="'Товар был успешно добавлен в корзину'"
    >
      <template v-slot:img>
        <img
          ref="img"
          :src="product.imageSet[0]"
          class="cart-mention__image"
          :alt="product.title"
        />
      </template>
      <template v-slot:text>
        <div class="cart-mention__description">
          <span class="cart-mention__price">
            {{ numberFormat(product.price) }} ₽</span
          >
          <span class="cart-mention__title"> Товар "{{ product.title }}"</span>
          <span class="cart-mention__quntity">
            Количество:
            {{
              getCurrentProductFromCart(product.id, colorId, sizeId).quantity
            }}
          </span>
        </div>
      </template>
      <template v-slot:footer>
        <div class="cart-mention__total">
          <span>
            Всего:
            {{
              numberFormat(
                getCurrentProductFromCart(product.id, colorId, sizeId)
                  .quantity * product.price
              )
            }}
            ₽</span
          >
        </div>
      </template>
    </BaseNotification> -->
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, watch } from "vue";
import { Product } from "@/types";
import numberFormat from "@/helpers/numberFormat";
import BaseButton from "@/components/BaseButton.vue";
import ProductStatus from "@/components/ProductStatus.vue";
import useProductItem from "@/hooks/useProductItem";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import BaseCharacteristicProduct from "@/components/BaseCharacteristicProduct.vue";
import BaseNotification from "@/components/BaseNotification.vue";
import { Gallery } from "@/types";
import useProductStatus from "@/hooks/useProductStatus";
import useOrder from "@/hooks/useOrder";
import declensionWord from "@/helpers/declensionWord";

import { z } from "zod";
export default defineComponent({
  components: {
    BaseButton,
    BaseLoaderCircle,
    BaseCharacteristicProduct,
    ProductStatus,
    // BaseNotification,
  },
  props: {
    product: {
      type: Object as PropType<z.infer<typeof Product>>,
      required: true,
    },
  },
  setup(props) {
    const {
      img,
      picIsLoad,
      checkLoad,
      loadFullDataProduct,
      reassemblyColors,
      productFullData,
      productFullDataLoad,
      addProductToCart,
      statusProduct,
      colorId,
      sizeId,
      loaderCircle,
      chosenGalleryItem,
      chooseImage,
    } = useProductItem();
    const { totalAmount } = useOrder();
    const { handlerStatus } = useProductStatus();

    const productAddedIndicator = ref<any | null>(null);

    onMounted(() => {
      checkLoad();
      if (loaderCircle.value && productAddedIndicator.value) {
        loaderCircle.value.$el.style.display = "none";
        productAddedIndicator.value.$el.style.display = "none";
      }
    });

    watch(colorId, () => {
      chooseImage(props.product.colors);
      loadFullDataProduct(props.product.id);
    });

    watch(
      statusProduct,
      () => {
        if (statusProduct.productIsAdditing) {
          loaderCircle.value.$el.style.display = "flex";
          loaderCircle.value.$el.classList.add("active");
        } else {
          loaderCircle.value.$el.style.display = "none";
          loaderCircle.value.$el.classList.remove("active");
        }
        handlerStatus({ statusProduct, productAddedIndicator }, false);
      },
      { deep: true }
    );

    return {
      img,
      numberFormat,
      picIsLoad,
      reassemblyColors,
      colorId,
      chosenGalleryItem,
      productFullData,
      productFullDataLoad,
      sizeId,
      addProductToCart,
      statusProduct,
      loaderCircle,
      productAddedIndicator,
      totalAmount,
      declensionWord,
    };
  },
});
</script>

<style lang="scss" scoped>
.catalog__item {
  position: relative;
  height: 602px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: flex-start;
}

.catalog__item .ti-btn {
  margin-top: auto;
  justify-self: end;
}

.catalog__title {
  height: 50px;
}

.active {
  opacity: 1;
}

.hidden {
  opacity: 0;
}

.item__line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.cart-mention {
  &__image {
    width: 100px;
    height: 100%;
    margin-right: 10px;
    margin-top: auto;
    margin-bottom: auto;
  }

  &__description {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-weight: 600;
    margin-bottom: 10px;
  }

  &__price {
    font-weight: 600;
    font-size: 20px;
    color: red;
    margin-bottom: 15px;
  }
}
</style>
