<template>
  <router-view />
  <loading-layer></loading-layer>
</template>

<script setup lang="ts">
import LoadingLayer from "@/components/LoadingLayer.vue";
import { defineComponent } from "vue";

defineComponent({
  loadingLayer: LoadingLayer,
});
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
</style>
