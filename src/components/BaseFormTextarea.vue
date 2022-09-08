<template>
  <BaseFormField :title="title" :error="error">
    <textarea
      class="form__input form__input--area"
      name="comments"
      v-model="dataValue"
      :placeholder="placeholder"
    ></textarea>
  </BaseFormField>
</template>

<script lang="ts">
import { defineComponent, computed, SetupContext } from "vue";
import BaseFormField from "@/components/BaseFormField.vue";

export default defineComponent({
  components: { BaseFormField },
  props: {
    title: {
      required: true,
      type: String,
    },
    error: {
      type: String,
    },
    placeholder: {
      required: true,
      type: String,
    },
    modelValue: {
      type: String,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context: SetupContext) {
    const dataValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        context.emit("update:modelValue", value);
      },
    });

    return { dataValue };
  },
});
</script>
