<template>
  <div class="content__top">
    <div class="content__row">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info" v-if="!statusLoading.isLoading">
        {{ pagination.total }} {{ declensionWord(pagination.total) }}
      </span>
    </div>
  </div>

  <div class="content__catalog">
    <ProductsFilter
      v-model:price-from="priceFrom"
      v-model:price-to="priceTo"
      v-model:properties="props"
      v-model:category-id="categoryId"
      v-model:limit="limit"
    />
    <section class="catalog">
      <BaseLoaderCircle v-if="statusLoading.isLoading" />
      <ul class="catalog__list" v-if="!statusLoading.isLoading">
        <ProductsItem
          :product="product"
          v-for="product of products"
          :key="product.id"
        />
      </ul>

      <BasePagination
        v-if="!statusLoading.isLoading"
        v-model:page="page"
        :pages="pagination.pages"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useListProduct } from "@/hooks/useListProduct";
import declensionWord from "@/helpers/declensionWord";
import BaseLoaderCircle from "@/components/BaseLoaderCircle.vue";
import ProductsFilter from "@/components/ProductsFilter.vue";
import BasePagination from "@/components/BasePagination.vue";
import ProductsItem from "@/components/ProductsItem.vue";
import useProductFilter from "@/hooks/useProductFilter";
import { Properties } from "@/types";
export default defineComponent({
  components: {
    BaseLoaderCircle,
    ProductsFilter,
    BasePagination,
    ProductsItem,
  },
  setup() {
    const { needUpdate, fillUpFields } = useProductFilter();
    const { products, pagination, statusLoading, loadProduct } =
      useListProduct();
    const limit = ref<number>(9);
    const page = ref<number>(1);
    const priceFrom = ref<number>(0);
    const priceTo = ref<number>(0);
    const categoryId = ref<number>(0);
    const props = ref<{ [key: string]: number[] } | null>(null);

    loadProduct(fillUpFields({}));

    watch(priceFrom, () => {
      needUpdate.value = true;
    });

    watch(priceTo, () => {
      needUpdate.value = true;
    });

    watch(categoryId, () => {
      needUpdate.value = true;
    });

    watch(
      props,
      () => {
        needUpdate.value = true;
      },
      { deep: true }
    );

    watch(page, () => {
      needUpdate.value = true;
    });

    watch(limit, () => {
      needUpdate.value = true;
    });

    watch(needUpdate, () => {
      if (needUpdate.value) {
        const fields: Properties = {
          priceFrom: priceFrom.value,
          priceTo: priceTo.value,
          categoryId: categoryId.value,
          props: props.value,
          l: limit.value,
          p: page.value,
        };
        loadProduct(fillUpFields(fields));
        needUpdate.value = false;
      }
    });

    return {
      page,
      needUpdate,
      declensionWord,
      products,
      pagination,
      statusLoading,
      priceFrom,
      priceTo,
      categoryId,
      props,
      limit,
    };
  },
});
</script>

<style scoped>
.catalog {
  min-height: 1200px;
}
.button--second {
  background-color: black;
}
</style>
