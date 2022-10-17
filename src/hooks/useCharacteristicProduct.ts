import { z, ZodError } from "zod";
import { Size } from "@/types";

const ReassembledColors = z.array(
  z.object({
    title: z.string(),
    id: z.number(),
    code: z.string(),
  })
);
const Sizes = z.array(Size);

interface returnValue {
  isColors: (value: unknown) => boolean;
  isSizes: (value: unknown) => boolean;
  setColor: (code: string) => string;
}

export default function useCharacteristicProduct(): returnValue {
  function isColors(
    value: unknown
  ): value is z.infer<typeof ReassembledColors> {
    try {
      ReassembledColors.parse(value);
    } catch (e) {
      if (e instanceof ZodError) {
        return false;
      }
    }
    return true;
  }

  function isSizes(value: unknown): value is z.infer<typeof Sizes> {
    try {
      Sizes.parse(value);
    } catch (e) {
      if (e instanceof ZodError) {
        return false;
      }
    }
    return true;
  }

  function setColor(code: string) {
    if (code === "#ffffff") return "#dddddd";
    return code;
  }

  return {
    isColors,
    isSizes,
    setColor,
  };
}
