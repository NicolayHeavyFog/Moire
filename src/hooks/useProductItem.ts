import { ref, Ref, reactive, computed, ComputedRef, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ResponseData } from "@/store/modules/loadProductData";
import { z } from "zod";
import { ColorsItem, Gallery, Product, ItemCart } from "@/types";

const Colors = z.array(ColorsItem);
const ReassembledColors = z.array(
  z.object({
    title: z.string(),
    id: z.number(),
    code: z.string(),
  })
);

const fieldsError = z.object({
  sizeId: z.string().optional(),
  colorId: z.string().optional(),
});

function isImg(value: unknown): value is HTMLImageElement {
  return value instanceof HTMLImageElement;
}

interface returnValue {
  img: Ref<HTMLImageElement | undefined>;
  picIsLoad: Ref<boolean>;
  productFullData: Ref<z.infer<typeof Product> | null>;
  productFullDataLoad: Ref<boolean>;

  checkLoad: () => void;
  loadFullDataProduct: (id: number) => void;
  reassemblyColors: (
    colors: z.infer<typeof Colors>
  ) => z.infer<typeof ReassembledColors>;

  findSuitableImage: (
    colorId: number,
    productColors: z.infer<typeof Colors>
  ) => z.infer<typeof Gallery> | undefined;

  addProductToCart: (value: {
    productId: number;
    colorId: number;
    sizeId: string;
    quantity: number;
  }) => void;

  statusProduct: {
    productIsAdditing: boolean | null;
    productIsAdded: boolean | null;
    additingIsFailed: boolean | null;
    failedText: string | null;
  };

  colorId: Ref<number | null>;
  sizeId: Ref<number | null>;
  getCurrentProductFromCart: (
    productId: number,
    colorId: number,
    sizeId: number
  ) => z.infer<typeof ItemCart>;

  chosenGalleryItem: Ref<z.infer<typeof Gallery> | undefined>;
  loaderCircle: Ref<any | null>;
  chooseImage: (productColors: z.infer<typeof Colors>) => void;
}

export default function useProductItem(): returnValue {
  const $store = useStore();
  const productFullData = ref<z.infer<typeof Product> | null>(null);
  const img = ref<HTMLImageElement | undefined>();
  const picIsLoad = ref<boolean>(false);
  const productFullDataLoad = ref<boolean>(false);
  const newImg = new Image();
  const colorId = ref<number | null>(0);
  const sizeId = ref<number | null>(0);
  const chosenGalleryItem = ref<z.infer<typeof Gallery> | undefined>();
  const loaderCircle = ref<any | null>(null);
  const statusProduct: {
    productIsAdditing: boolean | null;
    productIsAdded: boolean | null;
    additingIsFailed: boolean | null;
    failedText: string | null;
  } = reactive({
    productIsAdditing: null,
    productIsAdded: null,
    additingIsFailed: null,
    failedText: null,
  });

  function checkLoad(): void {
    if (isImg(img.value)) {
      newImg.onload = () => {
        picIsLoad.value = true;
        if (img.value) img.value.src = newImg.src;
      };
      newImg.src = img.value.src;
    }
  }

  function loadFullDataProduct(id: number): void {
    productFullDataLoad.value = false;
    $store
      .dispatch("loadProductData", id)
      .then((response: ResponseData) => {
        if (response.success) {
          productFullData.value = response.data;
        } else {
          console.log("Ошибка при получении всех параметров продукта");
        }
      })
      .then(() => (productFullDataLoad.value = true));
  }

  function reassemblyColors(colors: z.infer<typeof Colors>) {
    return colors.map((color) => {
      return {
        title: color.color.title,
        id: color.color.id,
        code: color.color.code,
      };
    });
  }

  function findSuitableImage(
    colorId: number,
    productColors: z.infer<typeof Colors>
  ) {
    return productColors.find((color) => {
      return color.color.id === colorId;
    })?.gallery;
  }

  function chooseImage(productColors: z.infer<typeof Colors>) {
    if (colorId.value) {
      chosenGalleryItem.value = findSuitableImage(colorId.value, productColors);
      if (chosenGalleryItem.value && img.value) {
        picIsLoad.value = false;
        img.value.src = chosenGalleryItem.value[0].file.url;
        checkLoad();
      } else if (img.value && !chosenGalleryItem.value) {
        picIsLoad.value = false;
        img.value.src =
          "https://hb.bizmrg.com/ex-press/images/content/original/image-not-found-e6ed8dc1475cac69ba6604c3783544aa86064b6e.png";
        checkLoad();
      }
    }
  }

  function addProductToCart(value: {
    productId: number;
    colorId: number;
    sizeId: string;
    quantity: number;
  }): void {
    statusProduct.productIsAdditing = true;
    $store
      .dispatch("cart/addProductToCart", value)
      .then(
        (response: boolean | Partial<{ sizeId: string; colorId: string }>) => {
          if (typeof response === "boolean") {
            statusProduct.productIsAdded = response;
            statusProduct.productIsAdditing = false;
          } else if (fieldsError.safeParse(response).success) {
            statusProduct.productIsAdded = false;
            statusProduct.additingIsFailed = true;
            if (response?.colorId) {
              statusProduct.failedText = response.colorId;
            } else if (response?.sizeId) {
              statusProduct.failedText = response.sizeId;
            }
            statusProduct.productIsAdditing = false;
          }
        }
      );
  }

  function getCurrentProductFromCart(
    productId: number,
    colorId: number,
    sizeId: number
  ) {
    return $store.getters["cart/getCartProduct"].find(
      (item: z.infer<typeof ItemCart>) => {
        return (
          item.product.id === productId &&
          item.color.color.id === colorId &&
          item.size.id === sizeId
        );
      }
    );
  }

  return {
    img,
    picIsLoad,
    checkLoad,
    loadFullDataProduct,
    reassemblyColors,
    findSuitableImage,
    productFullData,
    productFullDataLoad,
    addProductToCart,
    statusProduct,

    colorId,
    sizeId,
    getCurrentProductFromCart,

    chosenGalleryItem,
    loaderCircle,
    chooseImage,
  };
}
