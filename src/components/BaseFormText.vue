<template>
  <BaseFormField :title="title" :error="error">
    <input
      class="form__input"
      type="text"
      v-model="dataValue"
      :placeholder="placeholder"
    />
  </BaseFormField>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed } from "vue";
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
