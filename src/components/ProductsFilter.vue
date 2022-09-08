<template>
  <aside class="filter">
    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit()"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceStart"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceEnd"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block" v-if="!loadingCategories">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            name="category"
            v-model.number="currentCategory"
            value="0"
          >
            <option value="0">Все категории</option>
            <option
              v-for="category in categoriesArr"
              :value="category.id"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block" v-if="!loadingMaterials">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in materialsArr"
            :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                @input="setProp('materialIds', material.id)"
                ref="refElem"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block" v-if="!loadingSeasons">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season of seasonsArr"
            :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                @change="setProp('seasonsIds', season.id)"
                ref="refElem"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>{{ season.productsCount }}</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block" v-if="!loadingColors">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors colors--black">
          <li class="colors__item" v-for="color of colorsArr" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="checkbox"
                name="collection"
                :value="color.id"
                @change="setProp('colorIds', color.id)"
                ref="refElem"
              />
              <span
                class="colors__value"
                :style="`background-color: ${setColor(color.code)}`"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>
      <BaseButton
        :text="'Применить'"
        class="filter__submit button button--primery"
        type="submit"
      />
      <BaseButton
        :text="'Сбросить'"
        class="filter__reset button button--second"
        type="button"
        @click="toReset()"
      />
    </form>

    <div class="choose-pages">
      <span class="choose-pages__header">Количество товаров на странице:</span>
      <ul class="choose-pages__list">
        <li v-for="item of ['9', '16']" :key="item">
          <BaseButton
            @click.prevent="currentLimit = item"
            :text="item"
            class="button filter__submit choose-pages__button button button--second"
          />
        </li>
      </ul>
    </div>
  </aside>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  SetupContext,
  reactive,
  watch,
} from "vue";
import useProductFilter from "@/hooks/useProductFilter";
import BaseButton from "@/components/BaseButton.vue";
import useCharacteristicProduct from "@/hooks/useCharacteristicProduct";

interface Props {
  priceFrom: number;
  priceTo: number;
  properties: { [key: string]: number[] } | null;
  categoryId: number;
}

export default defineComponent({
  props: {
    priceFrom: {
      type: Number,
      default: 0,
    },
    priceTo: {
      type: Number,
      default: 0,
    },
    properties: {
      type: Object as PropType<{ [key: string]: number[] } | null>,
      default: null,
    },
    categoryId: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 9,
    },
  },
  components: { BaseButton },
  emits: [
    "update:priceFrom",
    "update:priceTo",
    "update:properties",
    "update:categoryId",
    "update:limit",
  ],
  setup(props: Props, context: SetupContext) {
    const {
      loadingCategories,
      loadingMaterials,
      loadingSeasons,
      loadingColors,

      loadMaterial,
      loadCategory,
      loadSeason,
      loadColors,

      categoriesArr,
      materialsArr,
      seasonsArr,
      colorsArr,
    } = useProductFilter();

    const { setColor } = useCharacteristicProduct();

    const currentPriceStart = ref<number>(0);
    const currentPriceEnd = ref<number>(0);
    let currentProps: { [key: string]: number[] } = reactive({});
    const currentCategory = ref<number>(0);
    const refElem = ref<HTMLInputElement[] | null>(null);
    const currentLimit = ref<number>(9);

    const setProp = (key: string, value: number): void => {
      const field = currentProps[key];
      if (field) {
        const indexElement = field.findIndex((element) => element === value);
        if (indexElement !== -1) field.splice(indexElement, 1);
        else field.push(value);
      } else {
        if (currentProps) currentProps[key] = [value];
      }
    };

    watch(currentLimit, () => {
      context.emit("update:limit", Number(currentLimit.value));
    });

    loadCategory();
    loadMaterial();
    loadSeason();
    loadColors();

    const submit = (): void => {
      context.emit("update:priceFrom", currentPriceStart.value);
      context.emit("update:priceTo", currentPriceEnd.value);
      context.emit("update:categoryId", currentCategory.value);
      context.emit(
        "update:properties",
        JSON.parse(JSON.stringify(currentProps))
      );
    };

    const toReset = (): void => {
      currentPriceStart.value = 0;
      currentPriceEnd.value = 0;
      currentCategory.value = 0;
      refElem.value?.forEach((input) => {
        input.checked = false;
      });
      currentProps = {};
      submit();
    };

    return {
      currentPriceStart,
      currentPriceEnd,
      currentCategory,
      currentProps,

      loadingMaterials,
      loadingCategories,
      loadingSeasons,
      loadingColors,

      setProp,
      submit,
      toReset,

      materialsArr,
      categoriesArr,
      seasonsArr,
      colorsArr,

      refElem,
      currentLimit,
      setColor,
    };
  },
});
</script>

<style>
.filter {
  height: 100%;
  position: relative;
}

.choose-pages {
  position: sticky;
  top: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.choose-pages__header {
  display: block;
  margin-bottom: 15px;
}

.choose-pages__button {
  width: 50px;
  padding: 15px 10px;
}

.choose-pages__list {
  width: 100%;
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  justify-content: space-around;
}
</style>
