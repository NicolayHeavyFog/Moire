import axios from "axios";
import { API_BASE_URL } from "@/config";
import { ActionContext } from "vuex";
import { RootState } from "@/store/index";
import { FailureRequest, Product } from "@/types";
import { z } from "zod";

// export const fullProductData = z.union([
//   z.union([z.array(Size), Product]),
//   z.object({ content: z.string() }),
// ]);

// export const fullProductData = Product.and(z.array(Size));

export interface SuccessRequets {
  success: true;
  data: z.infer<typeof Product>;
}
export type ResponseData = SuccessRequets | FailureRequest;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

export default {
  state: {},
  getters: {},
  mutation: {},
  actions: {
    loadProductData(
      context: ActionContext<State, RootState>,
      id: string
    ): Promise<ResponseData> {
      return axios.get(`${API_BASE_URL}/products/${id}`).then((response) => {
        // console.log(fullProductData.safeParse(obj));
        return Product.safeParse(response.data);
      });
    },
  },
};

const obj = {
  id: 1,
  title: "Носки",
  slug: "noski",
  price: 199,
  colors: [
    {
      id: 44,
      color: {
        id: 20,
        title: "Red",
        code: "#dd0808",
      },
      gallery: [
        {
          file: {
            url: "https://vue-moire.skillbox.cc/uploads/file/3/2/4/324e1f4fb34931a1d367602a730a75b5.jpg",
            name: "324e1f4fb34931a1d367602a730a75b5.jpg",
            originalName: "Rectangle 121.jpg",
            extension: "jpg",
            size: "4.3 Кб",
          },
        },
      ],
    },
  ],
  seasons: [
    {
      id: 2,
      title: "Осень",
      code: "autumn",
      productsCount: 10,
    },
    {
      id: 4,
      title: "Весна",
      code: "spring",
      productsCount: 10,
    },
  ],
  materials: [{ id: 2, title: "Шерсть", code: "wool", productsCount: 4 }],
  sizes: [
    {
      id: 2,
      title: "33-35",
    },
    {
      id: 3,
      title: "36-38",
    },
  ],
  category: {
    id: 3,
    title: "Носки",
    slug: "socks",
  },
  content: "",
};
