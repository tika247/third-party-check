<template>
  <button class="btnA" :class="returnSizeClass()">
    <img :src="require(`@/assets/img/icon-${type}.svg`)" alt="" />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  type: String,
  size: String,
});

/**
 * @description return size class
 */
const returnSizeClass = () => {
  return props.size ? `is-${props.size}` : false;
};
</script>

<style lang="scss" scoped>
.btnA {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid $text-color;
  border-radius: 50%;
  background-color: #fff;
  filter: drop-shadow(0 0 0 $shadow-color);
  transition: filter 0.3s ease-in-out, transform 0.3s ease-in-out;

  &.is-small {
    width: 32px;
    height: 32px;
  }

  &:hover,
  &:focus,
  &:active {
    filter: drop-shadow(0 0 $shadow-size $shadow-color);
    transform: scale(1.1);
  }
}
</style>
