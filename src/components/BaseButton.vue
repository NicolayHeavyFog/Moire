<template>
  <button class="ti-btn" ref="btn" @click="animateRipple($event)">
    {{ text }}
    <transition-group v-for="(val, i) in ripples" :key="'ripple' + i">
      <span
        class="ripple"
        :style="{ top: val.y + 'px', left: val.x + 'px' }"
        v-if="val.show === true"
        @animationend="rippleEnd(i)"
      >
      </span>
    </transition-group>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

function isButton(btn: unknown): btn is HTMLButtonElement {
  return btn instanceof HTMLButtonElement;
}

interface Ripple {
  x: number;
  y: number;
  show: boolean;
}

export default defineComponent({
  props: {
    text: {
      type: String,
      required: false,
      default: "Купить",
    },
  },
  inheritAttrs: true,
  setup() {
    const ripples = ref<Ripple[]>([]);
    const btn = ref<HTMLButtonElement | null>(null);
    const animateRipple = (e: MouseEvent) => {
      if (isButton(btn.value)) {
        const pos = btn.value.getBoundingClientRect();

        ripples.value.push({
          x: e.clientX - pos.left,
          y: e.clientY - pos.top,
          show: true,
        });
      }
    };
    const rippleEnd = (i: number) => {
      ripples.value[i].show = false;
    };
    return {
      ripples,
      btn,
      animateRipple,
      rippleEnd,
    };
  },
});
</script>

<style lang="scss">
.ti-btn {
  width: 100%;
  color: #fff;
  border: none;
  padding: 15px 30px;
  outline: 0;
  overflow: hidden;
  display: inline-block;
  position: relative;
  user-select: none;
  font-weight: 600;
  font-size: 13px;
  font-family: "Circe", "Arial", sans-serif;
  box-shadow: 0 0 0 0 rgba(#fff, 0.5);
  transition: box-shadow 150ms ease-out;
}

.ti-btn:focus {
  box-shadow: 0 0 0 8px rgba(#fff, 0.5);
}

.button--loading.ti-btn {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    left: 39%;
    border: 2px solid white;
    top: calc(50% - 12px);
    border-width: 3px;
    border-color: white transparent white transparent;
    animation-name: rotation;
    animation-duration: 1s;
  }
}

.ripple {
  background-color: #ff1ead;
  width: 2px;
  height: 2px;
  position: absolute;
  border-radius: 50%;
  transform: translateX(-100%) translateY(-100%);
  mix-blend-mode: screen;
  animation: ripple 1250ms ease-out forwards, fade 1500ms ease-out forwards;
}

@keyframes ripple {
  0% {
    transform: translate(-100%, -100%);
  }
  80% {
    transform: translate(-100%, -100%) scale(90);
  }
  100% {
    transform: translate(-100%, -100%) scale(90);
    opacity: 0;
  }
}

@keyframes fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
