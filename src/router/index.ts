import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import CartPage from "@/views/CartPage.vue";
import ProductPage from "@/views/ProductPage.vue";
import CartOrder from "@/views/CartOrder.vue";
import CartOrderInfo from "@/views/CartOrderInfo.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: MainPage,
  },
  {
    path: "/cart-page",
    name: "cart",
    component: CartPage,
  },
  {
    path: "/product/:id",
    name: "product",
    component: ProductPage,
  },
  {
    path: "/order",
    name: "order",
    component: CartOrder,
  },
  {
    path: "/order/:id",
    name: "order-info",
    component: CartOrderInfo,
  },
  { name: "not-found", component: NotFoundPage, path: "/:pathMatch(.*)*" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
