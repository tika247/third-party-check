import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import GLOBAL_PROPS from "@/store/grobalProps";

const vm = createApp(App);

(async () => {
  const API_DATA = (await window.electron.PROCESS_GET_API()) as unknown as any;
  // define plugins
  vm.use(router);
  // provide & mount
  router.isReady().then(() => {
    vm.provide("$API_DATA", API_DATA);
    vm.provide("$GLOBAL_PROPS", GLOBAL_PROPS);
    vm.mount("#app");
  });
})();
