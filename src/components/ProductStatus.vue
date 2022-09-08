<template>
  <div class="item-status">
    <div class="scene" :class="$attrs.class">
      <span class="circle">
        <svg class="circle-axic">
          <circle class="circle-inner"></circle>
          <circle class="circle-outer"></circle>
        </svg>
      </span>
      <span class="center">
        <span class="stick1"></span>
        <span class="stick2"></span>
      </span>
    </div>
    <span class="item-status__mention">{{
      status ? "Товар добавлен успешно" : "Товар не добавлен"
    }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    status: {
      required: true,
    },
  },
  inheritAttrs: false,
});
</script>

<style lang="scss">
.item-status {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  transition: opacity 0.2s ease-in-out;

  &__mention {
    display: block;
    position: absolute;
    font-weight: 600;
    font-size: 16px;
    bottom: 30%;

    .success & {
      color: #e02d71;
    }

    .failed & {
      color: black;
    }
  }
}

.fade.item-status {
  opacity: 0 !important;
}

.scene {
  position: relative;
  background-color: transparent;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.circle {
  width: 100px;
  height: 100px;
  position: relative;
  display: inline-block;

  &-axic {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  &-inner {
    stroke: transparent;
  }

  &-outer {
    stroke-dashoffset: 485px;
  }

  .success &-outer {
    stroke: #e02d71;
  }

  .failed &-outer {
    stroke: black;
  }

  &-inner,
  &-outer {
    stroke-dasharray: 485px;
    cx: 50px;
    cy: 50px;
    r: 45px;
    stroke-width: 5;
    fill: none;
    transition: stroke-dashoffset 1s ease-in-out;
  }

  .active &-inner,
  .active &-outer {
    transition: stroke-dashoffset 1.7s ease-in-out;
  }

  .active &-inner,
  .active &-outer {
    transition: stroke-dashoffset 1.7s ease-in-out;
  }

  .active.success &-outer,
  .active.failed &-outer {
    stroke-dashoffset: 200px;
  }
}

.center {
  width: 2px;
  height: 2px;
  background-color: transparent;
  position: absolute;
  z-index: 100;

  .success & {
    top: calc(50% - 1px);
    left: calc(47% - 1px);
  }

  .failed & {
    top: calc(50% - 1px);
    left: calc(50% - 1px);
    transform: rotate(45deg);
  }
}

.stick2,
.stick1 {
  background-color: transparent;
  position: absolute;
  border-radius: 5px;
  transition: background-color 1.5s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0px;
    border-radius: 5px;
    background-color: #e02d71;
    opacity: 1;
    display: block;
    transition: box-shadow 0.8s ease-in-out, width 0.85s ease-in-out;
    box-shadow: 0 0 0 0 #e02d71;
  }
}

.success .stick1 {
  width: 40px;
  height: 6px;
  top: 0;
  left: -8px;
  transform: rotate(-43deg);
}

.success .stick2 {
  width: 21px;
  height: 6px;
  top: 6px;
  left: -16px;
  transform: rotate(50deg);
}

.active.success .stick1,
.active.success .stick2 {
  &::before {
    box-shadow: 0 0 50px 4px #e02d71;
  }
}

.active.success .stick1 {
  &::before {
    width: 100%;
    transition: width 0.7s ease-out;
    transition-delay: 0.8s;
  }
}

.active.success .stick2 {
  &::before {
    width: 100%;
    transition: width 0.8s ease-in;
  }
}

.failed .stick1,
.failed .stick2 {
  width: 40px;
  height: 4px;
  position: absolute;
  top: -1px;
  left: -19px;

  &::before {
    background-color: black;
    box-shadow: 0 0 0 0 black;
  }
}

.failed .stick1 {
  transform: rotate(90deg);
}

.active.failed .stick1,
.active.failed .stick2 {
  &::before {
    box-shadow: 0 0 50px 4px black;
  }
}

.active.failed .stick1 {
  &::before {
    width: 100%;
  }
}

.active.failed .stick2 {
  &::before {
    transition-delay: 0.7s;
    width: 100%;
  }
}
</style>
