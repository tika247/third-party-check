<template>
  <ul class="list">
    <li v-for="item in returnConfirmViewText()" :key="item">{{ item }}</li>
  </ul>
  <div class="btn-wrap">
    <btn-a :type="'done'" @click="startProcess"></btn-a>
  </div>
</template>

<script setup lang="ts">
import { inject, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { ipcMessage, confirmViewText } from "@/constants";
import BtnA from "@/components/BtnA.vue";

// router
const router = useRouter();

// inject
const $GLOBAL_PROPS: any = inject("$GLOBAL_PROPS");
let $API_DATA: any = inject("$API_DATA");

// defineComponent
defineComponent({
  btnA: BtnA,
});
/**
 * start process
 */
const startProcess = async () => {
  $GLOBAL_PROPS.loadingState = true;
  try {
    const processResult = (await window.electron.PROCESS_B()) as unknown as string;
    if (processResult === ipcMessage[$API_DATA.language].gitControllerB) {
      $GLOBAL_PROPS.loadingState = false;
      router.push({ path: "/completeView" });
    } else {
      throw new Error(processResult);
    }
  } catch (err) {
    alert(err);
  }
  // window.electron.on("to get something from ipcMain");

  $GLOBAL_PROPS.loadingState = false;
};

/**
 * return confirmViewText
 * @returns {Object}
 */
const returnConfirmViewText = () => {
  return confirmViewText[$API_DATA.language];
};
</script>

<style lang="scss" scoped>
.list {
  width: min(440px, 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px 0;
  margin: 40px auto;
  padding-left: $gutter;

  > li {
    color: $color-01;
    list-style: circle;
    text-align: left;
  }
}
.btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: calc($shadow-size * 2);
}
</style>
