// Contain all the types that we want to use in this app

import { z, ZodError } from "zod";

export const Gallery = z
  .array(
    z.object({
      file: z.object({
        extension: z.string(),
        name: z.string(),
        originalName: z.string(),
        size: z.string(),
        url: z.string().url(),
      }),
    })
  )
  .nullable();

export const ColorsItem = z.object({
  id: z.number(),
  color: z.object({
    code: z.string(),
    id: z.number(),
    title: z.string(),
  }),
  gallery: Gallery,
});

export const Props = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  productsCount: z.number().positive().optional(),
});

export const Size = z.object({
  id: z.number(),
  title: z.string(),
});

export const Product = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  price: z.number().positive(),
  seasons: z.array(Props),
  materials: z.array(Props),
  colors: z.array(ColorsItem),
  imageSet: z.array(z.string()).nullable().optional(),
  sizes: z.array(Size).optional(),
  content: z.string().optional(),
});

export const CartProduct = z.object({
  color: ColorsItem,
  id: z.number(),
  price: z.number(),
  product: Product,
  quantity: z.number(),
  size: Size,
});

export const Pagination = z.object({
  page: z.number(),
  pages: z.number(),
  total: z.number(),
});

export const Category = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
});

export const CartData = z.object({
  id: z.number(),
  items: z.array(CartProduct),
  user: z.object({
    accessKey: z.string(),
    id: z.number(),
  }),
});

export const ProductsData = z.object({
  items: z.array(Product),
  pagination: Pagination,
});

export interface FailureRequest {
  success: false;
  error: ZodError;
}

export const ItemCart = z.object({
  id: z.number(),
  price: z.number(),
  quantity: z.number(),
  color: ColorsItem,
  size: Size,
  product: Product,
});

export const CartProductsData = z.object({
  id: z.number(),
  items: z.array(ItemCart),
  user: z.object({
    id: z.number(),
    accessKey: z.string(),
  }),
});

export interface FormFields {
  name: string;
  address: string;
  phone: string;
  email: string;
  comment: string;
}

export const Delivery = z.object({
  id: z.number(),
  title: z.string(),
  price: z.string(),
});

export const Payment = z.object({
  id: z.number(),
  title: z.string(),
});

export const Order = z.object({
  address: z.string(),
  basket: CartProductsData,
  comment: z.string().optional().nullable(),
  deliveryType: Delivery,
  email: z.string(),
  id: z.number(),
  name: z.string(),
  paymentType: z.string(),
  phone: z.string(),
  status: z.object({
    code: z.string(),
    id: z.number(),
    title: z.string(),
  }),
  totalPrice: z.number(),
});

export const ErrorOrder = z.object({
  data: z.object({
    error: z.object({
      code: z.number(),
      message: z.string(),
      request: z.object({
        address: z.string().optional(),
        email: z.string().optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
      }),
    }),
  }),
});

export const ErrorAddProductToCart = z.object({
  data: z.object({
    error: z.object({
      code: z.number(),
      message: z.string(),
      request: z.object({
        sizeId: z.string().optional(),
        colorId: z.string().optional(),
      }),
    }),
  }),
});

export const ErrorOrderNotFound = z.object({
  data: z.object({
    error: z.object({
      code: z.number(),
      message: z.string(),
    }),
  }),
});

// const orderFieldsRequest = z.object({
//   name: z.string(),
//   address: z.string(),
//   phone: z.string(),
//   email: z.string(),
//   deliveryTypeId: z.number(),
//   paymentTypeId: z.number(),
//   comment: z.string(),
// });

// {
//   "name": "string",
//   "address": "string",
//   "phone": "string",
//   "email": "string",
//   "deliveryTypeId": 0,
//   "paymentTypeId": 0,
//   "comment": "string"
// }

export interface File {
  url: string;
  name: string;
  originalName: string;
  extension: string;
  size: string;
}

export interface RequestFields {
  categoryId?: number;
  materialIds?: number[];
  seasonIds?: number[];
  colorIds?: number[];
  page: number;
  limit: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface Properties {
  priceFrom: number | undefined;
  priceTo: number | undefined;
  categoryId: number | undefined;
  props: { [key: string]: number[] } | null;
  l: number | undefined;
  p: number | undefined;
}
