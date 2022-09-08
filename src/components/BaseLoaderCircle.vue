<template>
  <div class="lds-dual-ring" v-bind="$attrs"></div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
  data() {
    return {};
  },
};
</script>

<style scoped>
.catalog__item .lds-dual-ring {
  justify-self: center;
  margin: auto;
  align-self: center;
}
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

.lds-dual-ring:after {
  border-color: #272727 transparent #272727 transparent;
  margin: auto;
}

.active.lds-dual-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
}

.lds-dual-ring {
  display: flex;
  width: 100%;

  justify-content: center;
}

.lds-dual-ring {
  align-content: center;
  height: 100%;
}

.lds-dual-ring:after {
  width: 100px;
  height: 100px;
  border-width: 9px;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
