<template>
  <Teleport to="#teleport-target">
    <Transition name="show" appear>
      <div class="cart-mention" v-if="condition">
        <div class="cart-mention__wrapper">
          <div class="cart-mention__header">
            <span class="cart-mention__title">{{ textHeader }}</span>
            <span
              class="cart-mention__subtitle"
              style="
                background-image: url('img/svg/Tick_Mark_Circle_icon-icons.com_69145.svg');
              "
              >{{ description }}</span
            >
          </div>
          <div class="cart-mention__content">
            <slot name="img" />
            <div class="cart-mention__info">
              <slot name="text" />
            </div>
          </div>
          <div class="cart-mention__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    condition: {
      required: true,
    },
    textHeader: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.cart-mention {
  position: absolute;
  width: 330px;
  top: 79px;
  right: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #a6a6a6;

  &::before {
    content: "";
    position: absolute;
    border: 20px solid transparent;
    border-top: 20px solid #a6a6a6;
    right: 8px;
    z-index: -1;
    top: -38px;
    transform: rotate(180deg);
  }

  &__wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f1f1f1;
  }

  &__header {
    width: 100%;
  }

  &__title {
    display: flex;
    height: 50px;
    align-items: center;
    padding: 10px;
    font-weight: 600;
  }

  &__subtitle {
    display: block;
    padding: 10px;
    background-color: rgb(212, 234, 225);
    background-position: 4px center;
    background-repeat: no-repeat;
    padding-left: 40px;
    background-size: 30px;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    padding: 10px;
  }

  &__description {
  }

  &__info {
  }

  &__footer {
    position: relative;
    padding: 15px 10px;
    &::before {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      content: "";
      width: 100%;
      height: 1px;
      background-color: #a6a6a6;
    }
  }
}

.show-enter-from {
  transform: translateY(-400px);
}

.show-leave-to {
  transform: translateY(-400px);
}

.show-leave-active,
.show-enter-active {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.show-enter-to,
.show-leave-from {
  transform: translate(0);
  opacity: 1;
}
</style>
