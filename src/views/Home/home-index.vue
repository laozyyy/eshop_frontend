<script setup>
import HomeCategory from './components/HomeCategory.vue'
import HomeBanner from './components/HomeBanner.vue'
import HomeProduct from './components/HomeProduct.vue';
</script>

<template>

  <div class="container">
    <HomeCategory />
    <HomeBanner />
  </div>
  <HomeProduct />
</template>

<style>
.container{
  height: auto;
}
</style>


