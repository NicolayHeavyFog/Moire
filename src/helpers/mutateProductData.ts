import { Product } from "@/types";
import { z } from "zod";

export default function mutateProductDate(
  productData: z.infer<typeof Product>
) {
  const imageSet: { img: string; colorId: number }[] = [];
  productData.colors.forEach((currentColor) => {
    if (currentColor.gallery) {
      const img: string = currentColor.gallery[0].file.url;
      const colorId: number = currentColor.color.id;
      imageSet.push({ img, colorId });
    }
  });
  return {
    ...productData,
    imageSet: imageSet,
  };
}
