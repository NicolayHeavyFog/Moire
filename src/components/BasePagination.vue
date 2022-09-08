<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <button
        class="pagination__link pagination__link--arrow"
        aria-label="Предыдущая страница"
        :disabled="currentPage <= 1"
        @click.prevent="currentPage--"
        :class="[currentPage <= 1 ? 'pagination__link--disabled' : '']"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </button>
    </li>
    <li class="pagination__item" v-for="page in pages" :key="page">
      <a
        class="pagination__link pagination__link--current"
        @click.prevent="currentPage = page"
        href="#"
        >{{ page }}
      </a>
    </li>
    <li class="pagination__item">
      <button
        class="pagination__link pagination__link--arrow"
        aria-label="Следующая страница"
        :disabled="currentPage >= pages"
        @click.prevent="currentPage++"
        :class="[currentPage >= pages ? 'pagination__link--disabled' : '']"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, SetupContext, ref, watch } from "vue";

interface Props {
  page: number;
  pages: number;
}

export default defineComponent({
  props: {
    page: {
      type: Number,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:page"],
  setup(props: Props, context: SetupContext) {
    const currentPage = ref<null | number>(props.page);
    watch(currentPage, (): void => {
      context.emit("update:page", currentPage.value);
    });
    return { currentPage };
  },
});
</script>
