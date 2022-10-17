<template>
  <fieldset class="form__block" v-if="style === 'colors'">
    <legend class="form__legend">Цвет</legend>
    <ul class="colors colors--black">
      <li
        :class="`colors__item`"
        v-for="characteristic of characteristics"
        :key="characteristic.id"
      >
        <label :class="`colors__label`">
          <input
            :class="`colors__radio sr-only`"
            type="radio"
            :name="characteristic.title"
            :value="characteristic.id"
            :checked="currentParam === characteristic.id"
            v-model="currentParam"
          />
          <span
            v-if="style === 'colors'"
            class="colors__value"
            :style="`background-color: ${setColor(characteristic.code)}`"
          >
          </span>
        </label>
      </li>
    </ul>
  </fieldset>
  <fieldset class="form__block" v-else-if="style === 'sizes'">
    <legend class="form__legend">Размер</legend>
    <label class="form__label form__label--small form__label--select">
      <select class="form__select" name="category" v-model="currentParam">
        <option
          :value="characteristic.id"
          v-for="characteristic of characteristics"
          :key="characteristic.id"
        >
          {{ characteristic.title }}
        </option>
      </select>
    </label>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from "vue";
import useCharacteristicProduct from "@/hooks/useCharacteristicProduct";
import { z } from "zod";

import { Size } from "@/types";

const Sizes = z.array(Size);

const ReassembledColors = z.array(
  z.object({
    title: z.string(),
    id: z.number(),
    code: z.string(),
  })
);

export default defineComponent({
  props: {
    characteristics: {
      required: true,
      type: Object as PropType<
        z.infer<typeof Sizes> | z.infer<typeof ReassembledColors>
      >,
    },
    param: {
      required: true,
      type: [Number],
    },
  },
  emits: ["update:param"],
  setup(props, context) {
    const { isColors, isSizes, setColor } = useCharacteristicProduct();
    const style: string | null = isColors(props.characteristics)
      ? "colors"
      : isSizes(props.characteristics)
      ? "sizes"
      : null;

    const currentParam = ref<number | null>(props.param);
    const initialParam = computed(() => {
      if (props.characteristics.length === 1 || style === "sizes") {
        context.emit("update:param", props.characteristics[0].id);
        return props.characteristics[0].id;
      }
      return 0;
    });
    currentParam.value = initialParam.value;
    watch(
      () => props.param,
      () => {
        currentParam.value = props.param;
      }
    );

    watch(currentParam, () => {
      context.emit("update:param", currentParam.value);
    });

    return {
      style,
      currentParam,
      setColor,
    };
  },
});
</script>

<style scoped>
.form__label--small select {
  height: 30px;
  padding: 6px 25px 6px 2px;
}

.form__block:nth-child(2) {
  width: 80px;
}
</style>
