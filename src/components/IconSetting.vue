<template>
  <transition name="fade">
    <button class="icon-setting" @click="startEditProcess" v-if="returnLoadingState">
      <img src="@/assets/img/icon-setting.svg" alt="" />
    </button>
  </transition>
</template>

<script setup lang="ts">
import { inject, computed } from "vue";

import { useRouter } from "vue-router";

// router
const router = useRouter();

// inject
const $GLOBAL_PROPS: any = inject("$GLOBAL_PROPS");

/**
 * @description return loading state
 */
const returnLoadingState = computed(() => {
  return !$GLOBAL_PROPS.loadingState;
});

/**
 * @description steart edit process
 */
const startEditProcess = () => {
  router.push({ path: "/editView" });
};
</script>

<style lang="scss" scoped>
.icon-setting {
  position: absolute;
  top: -46px;
  right: 0px;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover,
  &:active,
  &:focus {
    transform: scale(1.2) rotate(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
