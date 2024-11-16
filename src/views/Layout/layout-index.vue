<script setup>
import LayoutNav from "./components/LayoutNav.vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import LayoutFooter from "./components/LayoutFooter.vue";
import LayoutFixed from "./components/LayoutFixed.vue";

// 触发获取导航列表的action

import { useCategoryStore } from "@/stores/categoryStore";
import { onMounted } from "vue";

const categoryStore = useCategoryStore();

onMounted(() => categoryStore.getCategory());
</script>

<template>
  <div class="container">
    <LayoutFixed />

    <div class="layout">
      <LayoutNav />
      <LayoutHeader />
    </div>
    <div class="router-view-container">
      <router-view></router-view>
    </div>
    <LayoutFooter />
  </div>
</template>

<style>
.container {
  position: relative;
  overflow-y: auto; /* 垂直方向溢出显示滚动条 */
}

.router-view-container {
  position: relative;
  z-index: 1; /* 设置 RouterView 的 z-index 值 */
}
.layout {
  z-index: 10;
}
</style>
