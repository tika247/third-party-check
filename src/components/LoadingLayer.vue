<template>
  <transition name="fade">
    <dialog class="loading" v-if="returnLoadingState()" open>
      <div><span>now loading</span></div>
    </dialog>
  </transition>
</template>

<script setup lang="ts">
import { inject } from "vue";
const $GLOBAL_PROPS: any = inject("$GLOBAL_PROPS");

/**
 * @description return loading state
 */
const returnLoadingState = () => {
  return $GLOBAL_PROPS.loadingState;
};
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  > div {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: $color-01;
    animation: pulseanim 1.2s ease-in-out infinite;

    > span {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 2px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 2px;
    }
  }
}

@keyframes pulseanim {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }

  100% {
    transform: scale(1);
    opacity: 0;
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
