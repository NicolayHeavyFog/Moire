import { createStore } from "vuex";
import loadProductsData from "./modules/loadProductsData"; // много продуктов
import loadProductData from "./modules/loadProductData"; // один продукт
import loadCategoryData from "./modules/loadCategoryData";
import loadMaterialData from "./modules/loadMaterialData";
import loadColorsData from "./modules/loadColorData";
import loadSeasonData from "./modules/loadSeasonData";
import cart from "./modules/cart";
import order from "./modules/order";

export interface RootState {
  userAccessKey: null | string;
}

export const store = createStore({
  state() {
    return {
      userAccessKey: null,
    };
  },
  getters: {
    userAccessKey(state: RootState) {
      return state.userAccessKey;
    },
  },
  mutations: {
    setUserAccessKey(state: RootState, userAccessKey): void {
      state.userAccessKey = userAccessKey;
    },
  },
  actions: {},
  modules: {
    loadProductsData,
    loadCategoryData,
    loadMaterialData,
    loadSeasonData,
    loadProductData,
    loadColorsData,
    cart: cart,
    order: order,
  },
});
