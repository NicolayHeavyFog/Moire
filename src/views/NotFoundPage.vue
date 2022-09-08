<template>
  <h1 class="title">К сожалению страница не найдена :(</h1>
  <router-link class="link breadcrumbs__link" :to="{ name: 'home' }">
    Перейти на главную
  </router-link>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}

.link {
  display: block;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
</style>
