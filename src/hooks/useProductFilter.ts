import { ref, Ref } from "vue";
import { RequestFields, Properties, FailureRequest } from "@/types";
import { useStore } from "vuex";
import { seasons } from "@/store/modules/loadSeasonData";
import { materials } from "@/store/modules/loadMaterialData";
import { categories } from "@/store/modules/loadCategoryData";
import { colors } from "@/store/modules/loadColorData";
import { z } from "zod";

interface returnValues {
  fillUpFields(fields: Partial<Properties>): RequestFields;

  needUpdate: Ref<boolean>;

  loadMaterial: () => void;
  loadCategory: () => void;
  loadSeason: () => void;
  loadColors: () => void;

  loadingCategories: Ref<boolean>;
  loadingMaterials: Ref<boolean>;
  loadingSeasons: Ref<boolean>;
  loadingColors: Ref<boolean>;

  seasonsArr: Ref<z.infer<typeof seasons> | null>;
  materialsArr: Ref<z.infer<typeof materials> | null>;
  categoriesArr: Ref<z.infer<typeof categories> | null>;
  colorsArr: Ref<z.infer<typeof colors> | null>;
}

export default function useProductFilter(): returnValues {
  const $store = useStore();
  const needUpdate = ref<boolean>(false);

  const categoriesArr = ref<z.infer<typeof categories> | null>(null);
  const materialsArr = ref<z.infer<typeof materials> | null>(null);
  const seasonsArr = ref<z.infer<typeof seasons> | null>(null);
  const colorsArr = ref<z.infer<typeof colors> | null>(null);

  const loadingCategories = ref<boolean>(false);
  const loadingMaterials = ref<boolean>(false);
  const loadingSeasons = ref<boolean>(false);
  const loadingColors = ref<boolean>(false);

  function fillUpFields(fields: Partial<Properties>): RequestFields {
    const limit = fields.l ? fields.l : 9;
    const page = fields.p ? fields.p : 1;
    let requestFields: RequestFields = { page, limit };

    if (fields.priceFrom) {
      requestFields.minPrice = fields.priceFrom;
    }
    if (fields.priceTo) {
      requestFields.maxPrice = fields.priceTo;
    }
    if (fields.categoryId) {
      requestFields.categoryId = fields.categoryId;
    }
    if (fields.props) {
      requestFields = Object.assign(requestFields, fields.props);
    }
    return requestFields;
  }

  function loadCategory(): void {
    loadingCategories.value = true;
    $store
      .dispatch("loadCategory")
      .then(
        (
          response:
            | { success: boolean; data: z.infer<typeof categories> }
            | FailureRequest
        ): void => {
          if (response.success) {
            categoriesArr.value = response.data;
          } else {
            console.log("Ошибка в загрузке категорий");
          }
          loadingCategories.value = false;
        }
      );
  }

  function loadMaterial(): void {
    loadingMaterials.value = true;
    $store
      .dispatch("loadMaterial")
      .then(
        (
          response:
            | { success: boolean; data: z.infer<typeof materials> }
            | FailureRequest
        ): void => {
          if (response.success) {
            materialsArr.value = response.data;
          } else {
            console.log("Ошибка в загрузке материалов");
          }
          loadingMaterials.value = false;
        }
      );
  }

  function loadSeason(): void {
    loadingSeasons.value = true;
    $store
      .dispatch("loadSeason")
      .then(
        (
          response:
            | { success: boolean; data: z.infer<typeof seasons> }
            | FailureRequest
        ): void => {
          if (response.success) {
            seasonsArr.value = response.data;
          } else {
            console.log("Ошибка в загрузке сезонов");
          }
          loadingSeasons.value = false;
        }
      );
  }

  function loadColors(): void {
    loadingColors.value = true;
    $store
      .dispatch("loadColors")
      .then(
        (
          response:
            | { success: true; data: z.infer<typeof colors> }
            | FailureRequest
        ): void => {
          if (response.success) {
            colorsArr.value = response.data;
          } else {
            console.log("Ошибка в получении цветов");
          }
        }
      );
    loadingColors.value = false;
  }

  return {
    fillUpFields,

    needUpdate,

    loadMaterial,
    loadCategory,
    loadSeason,
    loadColors,

    loadingCategories,
    loadingMaterials,
    loadingSeasons,
    loadingColors,

    categoriesArr,
    materialsArr,
    seasonsArr,
    colorsArr,
  };
}
