<template>
  <div class="btn-wrap">
    <btn-a :type="'replay'" @click="replayProcess"></btn-a>
    <btn-a :type="'checkStorage'" @click="checkStorageProcess"></btn-a>
    <btn-a :type="'exit'" @click="exitProcess"></btn-a>
  </div>
</template>

<script setup lang="ts">
import { inject, defineComponent } from "vue";
import { useRouter } from "vue-router";
import BtnA from "@/components/BtnA.vue";

// router
const router = useRouter();

// inject
const $GLOBAL_PROPS: any = inject("$GLOBAL_PROPS");

// defineComponent
defineComponent({
  btnA: BtnA,
});
const replayProcess = async () => {
  router.push({ path: "/" });
};
const checkStorageProcess = async () => {
  $GLOBAL_PROPS.loadingState = true;
  const processResult = (await window.electron.PROCESS_C()) as unknown as string;
  await window.electron.PROCESS_ERROR_DIALOG(processResult);
  $GLOBAL_PROPS.loadingState = false;
};
const exitProcess = async () => {
  await window.electron.PROCESS_D();
};
</script>

<style lang="scss" scoped>
.btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 16px;
  margin-top: 32px;
  padding: calc($shadow-size * 2) 0 8px;
}
</style>
