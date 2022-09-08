import { ref, Ref, computed, reactive } from "vue";
import { Product, ProductsData, RequestFields, Pagination } from "@/types";
import { useStore } from "vuex";
import { ResponseData } from "@/store/modules/loadProductsData";
import { z } from "zod";

interface returnValue {
  products: Ref<z.infer<typeof Product>[]> | [];
  pagination: Ref<z.infer<typeof Pagination> | null>;
  statusLoading: { isLoading: boolean; error: boolean };
  loadProduct: (requestFields: RequestFields) => void;
}

export function useListProduct(): returnValue {
  const $store = useStore();
  const data = ref<null | z.infer<typeof ProductsData>>(null);
  const statusLoading = reactive({
    isLoading: false,
    error: false,
  });

  function loadProduct(requestFields: RequestFields): void {
    statusLoading.isLoading = true;
    $store
      .dispatch("loadProductsData", requestFields)
      .then((response: ResponseData): void => {
        if (response.success) {
          data.value = response.data;
        } else {
          console.log("сообщение об ошибке");
        }

        statusLoading.isLoading = false;
      });
  }

  const products = computed((): [] | z.infer<typeof Product>[] => {
    let result: [] | z.infer<typeof Product>[] = [];
    let items: [] | z.infer<typeof Product>[] = [];
    if (!data.value) return result;
    else {
      result = data.value.items;
      items = result.map(
        (product: z.infer<typeof Product>): z.infer<typeof Product> => {
          const imageSet: string[] = [];
          product.colors.forEach((currentColor) => {
            if (currentColor.gallery) {
              const img: string = currentColor.gallery[0].file.url;
              imageSet.push(img);
            }
          });
          return {
            ...product,
            imageSet: imageSet,
          };
        }
      );
    }
    return items;
  });

  const pagination = computed(() => {
    if (!data.value?.pagination) return null;
    else return data.value.pagination;
  });

  return { products, pagination, statusLoading, loadProduct };
}
