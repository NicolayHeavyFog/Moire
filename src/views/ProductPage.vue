<template>
  <div class="content__top">
    <ul class="breadcrumbs">
      <li class="breadcrumbs__item">
        <router-link :to="{ name: 'home' }" class="breadcrumbs__link"
          >Каталог</router-link
        >
      </li>
      <li class="breadcrumbs__item">
        <span class="breadcrumbs__link"> Носки </span>
      </li>
      <li class="breadcrumbs__item" v-if="productFullDataLoad">
        <span class="breadcrumbs__link"> {{ productFullData.title }} </span>
      </li>
    </ul>
  </div>
  <div class="content__load" v-if="!productFullDataLoad">
    <BaseLoaderCircle />
  </div>
  <section class="item" v-else>
    <div class="item__pics pics">
      <div class="pics__wrapper">
        <BaseLoaderCircle v-if="!picIsLoad" class="pic-load" />
        <img
          ref="img"
          :src="product.imageSet[0].img"
          width="570"
          height="570"
          :alt="product.title"
        />
      </div>
      <ul class="pics__list">
        <li
          class="pics__item"
          v-for="(image, index) of product.imageSet"
          :key="index"
        >
          <button
            class="pics__link pics__button"
            :class="image.colorId === colorId ? 'pics__link--current' : ''"
            @click="colorId = image.colorId"
          >
            <img width="98" height="98" :src="image.img" :alt="product.title" />
          </button>
        </li>
      </ul>
    </div>
    <BaseNotification
      :condition="statusProduct.productIsAdded"
      :text-header="`Моя корзина, ${totalAmount} ${declensionWord(
        totalAmount
      )}`"
      :description="'Товар был успешно добавлен в корзину'"
    >
      <template v-slot:img>
        <img
          :alt="product.title"
          class="cart-mention__image"
          :src="
            chosenGalleryItem
              ? chosenGalleryItem[0].file.url
              : 'https://hb.bizmrg.com/ex-press/images/content/original/image-not-found-e6ed8dc1475cac69ba6604c3783544aa86064b6e.png'
          "
        />
      </template>
      <template v-slot:text>
        <div class="cart-mention__description">
          <span class="cart-mention__price">
            {{ numberFormat(currentAddedProduct.price) }} ₽</span
          >
          <span class="cart-mention__title">
            Товар "{{ currentAddedProduct.product.title }}"</span
          >
          <span class="cart-mention__quntity">
            Количество:
            {{ currentAddedProduct.quantity }}
          </span>
        </div>
      </template>
      <template v-slot:footer>
        <div class="cart-mention__total">
          <span>
            Всего:
            {{
              numberFormat(
                currentAddedProduct.quantity * currentAddedProduct.price
              )
            }}
            ₽</span
          >
        </div>
      </template>
    </BaseNotification>

    <div class="item__info">
      <span class="item__code">Артикул: {{ product.id }}</span>
      <h2 class="item__title">{{ product.title }}</h2>
      <div class="item__form">
        <form
          class="form"
          action="#"
          method="POST"
          @submit.prevent="
            addProductToCart({
              productId: product.id,
              colorId,
              sizeId,
              quantity,
            })
          "
        >
          <div class="item__row item__row--center">
            <div class="form__counter">
              <button
                type="button"
                :disabled="quantity <= 1"
                @click.prevent="--quantity"
                aria-label="Убрать один товар"
              >
                <svg width="12" height="12" fill="currentColor">
                  <use xlink:href="#icon-minus"></use>
                </svg>
              </button>

              <input type="number" v-model="quantity" name="count" />

              <button
                type="button"
                @click.prevent="++quantity"
                aria-label="Добавить один товар"
              >
                <svg width="12" height="12" fill="currentColor">
                  <use xlink:href="#icon-plus"></use>
                </svg>
              </button>
            </div>

            <b class="item__price"> {{ numberFormat(product.price) }} ₽ </b>
          </div>

          <div class="item__row">
            <BaseCharacteristicProduct
              :characteristics="reassemblyColors(product.colors)"
              v-model:param="colorId"
            />

            <BaseCharacteristicProduct
              :characteristics="product.sizes"
              v-model:param="sizeId"
            />
          </div>
          <BaseButton
            :text="'В корзину'"
            :class="statusProduct.productIsAdditing ? 'button--loading' : ''"
            class="item__button button button--primery"
            :disabled="!sizeId || !colorId || statusProduct.productIsAdditing"
            type="submit"
          />
        </form>
      </div>
    </div>

    <div class="item__desc">
      <ul class="tabs">
        <li class="tabs__item">
          <a
            class="tabs__link"
            href="#"
            @click.prevent="currentTab = 1"
            :class="currentTab === 1 ? 'tabs__link--current' : ''"
          >
            Информация о товаре
          </a>
        </li>
        <li class="tabs__item">
          <a
            class="tabs__link"
            href="#"
            @click.prevent="currentTab = 2"
            :class="currentTab === 2 ? 'tabs__link--current' : ''"
          >
            Доставка и возврат
          </a>
        </li>
      </ul>

      <div class="item__content" v-if="currentTab === 1">
        <h3>Состав:</h3>
        <p>
          <span v-for="(material, index) of product.materials" :key="index">
            {{ material.title }} <br />
          </span>
        </p>
        <h3>Сезон:</h3>
        <p>
          <span v-for="(season, index) of product.seasons" :key="index">
            {{ season.title }} <br />
          </span>
        </p>
        <h3>Уход:</h3>

        <p>
          Машинная стирка при макс. 30ºC короткий отжим<br />
          Гладить при макс. 110ºC<br />
          Не использовать машинную сушку<br />
          Отбеливать запрещено<br />
          Не подвергать химчистке<br />
        </p>
      </div>
      <div class="item__content" v-if="currentTab === 2">
        <h3>Доставка:</h3>

        <p>
          1. Курьерская доставка по Москве и Московской области – 290 ₽<br />
          2.Самовывоз из магазина. Список и адреса магазинов Вы можете
          посмотреть здесь<br />
        </p>

        <h3>Возврат:</h3>

        <p>
          Любой возврат должен быть осуществлен в течение Возвраты в магазине
          БЕСПЛАТНО.<br />
          Вы можете вернуть товары в любой магазин. Магазин должен быть
          расположен в стране, в которой Вы осуществили покупку. БЕСПЛАТНЫЙ
          возврат в Пункт выдачи заказов.<br />
          Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов,
          позвоните по телефону 8 800 600 90 09<br />
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import numberFormat from "@/helpers/numberFormat";
import BaseButton from "@/components/BaseButton.vue";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import BaseCharacteristicProduct from "@/components/BaseCharacteristicProduct.vue";
import BaseNotification from "@/components/BaseNotification.vue";
import { useRoute } from "vue-router";
import useProductItem from "@/hooks/useProductItem";
import mutateProductData from "@/helpers/mutateProductData";
import declensionWord from "@/helpers/declensionWord";
import useOrder from "@/hooks/useOrder";
export default defineComponent({
  components: {
    BaseLoaderCircle,
    BaseCharacteristicProduct,
    BaseButton,
    BaseNotification,
  },
  setup() {
    const $route = useRoute();
    const {
      productFullData,
      productFullDataLoad,
      loadFullDataProduct,
      reassemblyColors,
      picIsLoad,
      img,
      checkLoad,
      addProductToCart,
      statusProduct,
      colorId,
      sizeId,
      loaderCircle,
      chosenGalleryItem,
      chooseImage,

      currentAddedProduct,
    } = useProductItem();
    const { totalAmount } = useOrder();

    const currentTab = ref<number>(1);
    const quantity = ref<number>(1);

    loadFullDataProduct(+$route.params.id);

    const product = computed(() => {
      if (!productFullData.value) return null;
      else return mutateProductData(productFullData.value);
    });

    watch(img, () => {
      if (img.value) {
        picIsLoad.value = false;
        checkLoad();
      }
    });

    watch(colorId, () => {
      if (product.value) chooseImage(product.value.colors);
    });

    let timeout: number | undefined;
    watch(statusProduct, () => {
      if (statusProduct.productIsAdded) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          statusProduct.productIsAdded = null;
        }, 3000);
      }
    });

    return {
      productFullData,
      picIsLoad,
      productFullDataLoad,
      reassemblyColors,
      product,
      numberFormat,
      colorId,
      sizeId,
      img,
      currentTab,
      quantity,
      addProductToCart,
      loaderCircle,
      statusProduct,
      chosenGalleryItem,
      totalAmount,
      declensionWord,

      currentAddedProduct,
    };
  },
});
</script>

<style lang="scss" scoped>
.pics__link--current {
  border-color: #e02d71 !important;
}

.content__load {
  width: 100%;
  height: 600px;
}

.pics__button {
  margin: 0;
  background-color: transparent;
  padding: 0;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
}

.item__pics {
  height: fit-content;
}

.pics__wrapper {
  position: relative;
  height: 570px;

  img {
    height: 100%;
  }
}

.pic-load {
  position: absolute;
  width: 570px;
  height: 570px;
  background-color: #fff;
}

.show-loave-to,
.show-enter-from {
  transform: translate(400px);
}

.show-leave-active,
.show-enter-active {
  transition: transform 0.3s ease-in-out;
}

.show-enter-to,
.show-leave-from {
  transform: translate(0);
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
