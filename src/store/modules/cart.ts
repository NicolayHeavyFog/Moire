import axios from "axios";
import { API_BASE_URL } from "@/config";
import { ActionContext } from "vuex";
import { RootState } from "@/store/index";
import {
  FailureRequest,
  CartProductsData,
  CartData,
  ErrorAddProductToCart,
} from "@/types";
import { z } from "zod";
import { ItemCart } from "@/types";

interface SuccessRequetsCartData {
  success: true;
  data: z.infer<typeof CartData>;
}
type ResponseData = SuccessRequetsCartData | FailureRequest;

interface State {
  cartProducts: [] | z.infer<typeof ItemCart>[];
  cartIsLoading: boolean;
  cartIsLoaded: boolean;
}

interface FailedRequestAddProductToCart {
  success: true;
  data: z.infer<typeof ErrorAddProductToCart>;
}

export default {
  namespaced: true,
  state() {
    return {
      cartProducts: [],
      cartIsLoading: false,
      cartIsLoaded: false,
    };
  },
  getters: {
    getStatusCart(state: State) {
      return { loaded: state.cartIsLoaded, loading: state.cartIsLoading };
    },
    getCartProduct(state: State) {
      return state.cartProducts;
    },
    getTotalAmount(state: State) {
      return (state.cartProducts as z.infer<typeof ItemCart>[]).reduce(
        (acc: number, currentItem: z.infer<typeof ItemCart>) =>
          acc + currentItem.quantity,
        0
      );
    },
    getTotalPrice(state: State) {
      return (state.cartProducts as z.infer<typeof ItemCart>[]).reduce(
        (acc: number, currentItem: z.infer<typeof ItemCart>) =>
          acc + currentItem.quantity * currentItem.price,
        0
      );
    },
  },
  mutations: {
    updateCartProductData(
      state: State,
      items: z.infer<typeof ItemCart>[]
    ): void {
      state.cartProducts = items;
    },
    resetCart(state: State): void {
      state.cartProducts = [];
    },
  },
  actions: {
    addProductToCart(
      context: ActionContext<State, RootState>,
      value: {
        productId: number;
        colorId: number;
        sizeId: string;
        quantity: number;
      }
    ): Promise<boolean | Partial<{ sizeId: string; colorId: string }>> {
      return axios
        .post(
          `${API_BASE_URL}/baskets/products`,
          {
            productId: value.productId,
            colorId: value.colorId,
            sizeId: value.sizeId,
            quantity: value.quantity,
          },
          {
            params: {
              userAccessKey: context.rootState.userAccessKey,
            },
          }
        )
        .then((response) => {
          const r = CartProductsData.safeParse(response.data);
          if (r.success) {
            console.log("Товар успешно добавлен");
            context.commit("updateCartProductData", r.data.items);
            return true;
          } else {
            console.log("Ошибка с добавленем товара в корзину");
            return false;
          }
        })
        .catch((e) => {
          const r = ErrorAddProductToCart.safeParse(
            e.response
          ) as FailedRequestAddProductToCart;

          return r.data.data.error.request;
        });
    },
    loadCart(context: ActionContext<State, RootState>): Promise<ResponseData> {
      context.state.cartIsLoading = true;
      context.state.cartIsLoaded = false;
      // const currentAccessKey = context.getters.userAccessKey;
      return axios
        .get(`${API_BASE_URL}/baskets`, {
          params: {
            userAccessKey: context.rootState.userAccessKey,
          },
        })
        .then((response) => {
          // console.log("useAccessKey: ", currentAccessKey);
          const r = CartData.safeParse(response.data);
          if (r.success) {
            console.log("Коризина успешно загружена");
          } else {
            console.log("Коризина не загружена, что-то пошло не так");
          }
          context.state.cartIsLoading = false;
          context.state.cartIsLoaded = true;
          return r;
        });
    },
    updateQuantityProduct(
      context: ActionContext<State, RootState>,
      value: { basketItemId: number; quantity: number }
    ): Promise<boolean> {
      if (!value.quantity) {
        console.log("Количество товара нельзя уменьшить");
        return new Promise((resolve) => resolve(false));
      }
      return axios
        .put(
          `${API_BASE_URL}/baskets/products`,
          {
            basketItemId: value.basketItemId,
            quantity: value.quantity,
          },
          {
            params: {
              userAccessKey: context.rootState.userAccessKey,
            },
          }
        )
        .then((response) => {
          const r = CartProductsData.safeParse(response.data);
          if (r.success) {
            console.log("Обновление количества товара произошло успешно!");
            context.commit("updateCartProductData", r.data.items);
            return true;
          } else {
            console.log("Ошибка в обновлении количества товара товара");
            return false;
          }
        });
    },
    deleteProductFromCart(
      context: ActionContext<State, RootState>,
      basketItemId: number
    ): Promise<boolean> {
      return axios
        .delete(`${API_BASE_URL}/baskets/products`, {
          data: {
            basketItemId,
          },
          params: {
            userAccessKey: context.rootState.userAccessKey,
          },
        })
        .then((response) => {
          const r = CartProductsData.safeParse(response.data);
          if (r.success) {
            console.log("Товар удален успешно!");
            context.commit("updateCartProductData", r.data.items);
            return true;
          } else {
            console.log("Ошибка с удалением товара");
            return false;
          }
        });
    },
  },
};

// // const obj = {
// //   id: 1,
// //   title: "Носки",
// //   slug: "noski",
// //   price: 199,
// //   colors: [
// //     {
// //       id: 44,
// //       color: {
// //         id: 20,
// //         title: "Red",
// //         code: "#dd0808",
// //       },
// //       gallery: [
// //         {
// //           file: {
// //             url: "https://vue-moire.skillbox.cc/uploads/file/3/2/4/324e1f4fb34931a1d367602a730a75b5.jpg",
// //             name: "324e1f4fb34931a1d367602a730a75b5.jpg",
// //             originalName: "Rectangle 121.jpg",
// //             extension: "jpg",
// //             size: "4.3 Кб",
// //           },
// //         },
// //       ],
// //     },
// //   ],
// //   seasons: [
// //     {
// //       id: 2,
// //       title: "Осень",
// //       code: "autumn",
// //       productsCount: 10,
// //     },
// //     {
// //       id: 4,
// //       title: "Весна",
// //       code: "spring",
// //       productsCount: 10,
// //     },
// //   ],
// //   materials: [{ id: 2, title: "Шерсть", code: "wool", productsCount: 4 }],
// //   sizes: [
// //     {
// //       id: 2,
// //       title: "33-35",
// //     },
// //     {
// //       id: 3,
// //       title: "36-38",
// //     },
// //   ],
// //   category: {
// //     id: 3,
// //     title: "Носки",
// //     slug: "socks",
// //   },
// //   content: "",
// // };
