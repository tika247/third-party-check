<!-- TODO: $API_DATA.languageで日本語と英語を切り分ける -->
<template>
  <icon-setting></icon-setting>
  <ul class="list">
    <li>
      <h2>{{ returnProjectText() }}</h2>
      <p class="project-notice" v-if="!returnAPIProject()" v-html="returnNoteText()"></p>
      <select name="project" id="project" ref="project" v-else>
        <option :value="item.name" v-for="item in returnAPIProject()" :key="item.name">{{ item.name }}</option>
      </select>
    </li>
    <li>
      <h2>{{ returnBranchText() }}</h2>
      <textarea name="branch" id="branch" rows="1" ref="branch"></textarea>
    </li>
    <li>
      <h2>
        {{ returnCommitText() }}<small>{{ returnFlowText() }}</small>
      </h2>
      <div class="list__commit">
        <!-- new SHA -->
        <textarea name="commitNew" id="commitNew" rows="1" ref="commitNew"></textarea>
        <!-- old SHA -->
        <textarea name="commitOld" id="commitOld" rows="1" ref="commitOld"></textarea>
      </div>
    </li>
    <li>
      <h2>{{ returnStorageText() }}</h2>
      <textarea name="storage" id="storage" ref="storage"></textarea>
    </li>
  </ul>
  <div class="btn-wrap">
    <btn-a :type="'start'" @click="startCheckingProcess"></btn-a>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, defineComponent, inject } from "vue";
import { useRouter } from "vue-router";
import { ipcMessage, entryViewText } from "@/constants";
import BtnA from "@/components/BtnA.vue";
import IconSetting from "@/components/IconSetting.vue";

// router
const router = useRouter();

// inject
const $GLOBAL_PROPS: any = inject("$GLOBAL_PROPS");
const $API_DATA: any = inject("$API_DATA");

// ref
const project: Ref<HTMLSelectElement | null> = ref(null);
const branch: Ref<HTMLTextAreaElement | null> = ref(null);
const commitNew: Ref<HTMLTextAreaElement | null> = ref(null);
const commitOld: Ref<HTMLTextAreaElement | null> = ref(null);
const storage: Ref<HTMLTextAreaElement | null> = ref(null);

// defineComponent
defineComponent({
  btnA: BtnA,
  iconSetting: IconSetting,
});

const electronDevelopment = true;

/**
 * return API first Project
 */
const returnAPIProject = () => {
  return $API_DATA.projects.length > 0 ? $API_DATA.projects : false;
};

/**
 * @description start all process
 */
let startCheckingProcess = () => {
  alert("electronDevelopment is now false");
};

/**
 * @description check if under development with electron
 */
if (electronDevelopment) {
  startCheckingProcess = async () => {
    let infoUserEntered = null;

    /**
     * @description info entered by user
     */
    const EnteredInfoCheck = async () => {
      const filterStr = (str: string | undefined) => {
        return str ? str.trim() : "";
      };

      /**
       * @description info entered by user
       */
      infoUserEntered = {
        project: filterStr(project.value?.selectedOptions[0].value),
        branch: filterStr(branch.value?.value),
        commit: [commitNew.value?.value, commitOld.value?.value], // OK even if commitOld is vacant
        storage: filterStr(storage.value?.value),
      };

      return Promise.resolve();
    };

    await EnteredInfoCheck();

    // Access to electron
    $GLOBAL_PROPS.loadingState = true;
    const processResult = (await window.electron.PROCESS_A(infoUserEntered)) as unknown as string;
    $GLOBAL_PROPS.loadingState = false;
    if (processResult === ipcMessage[$API_DATA.language].gitControllerA) {
      router.push({ path: "/confirmView" });
    } else {
      await window.electron.PROCESS_ERROR_DIALOG(processResult);
    }
    // window.electron.on("to get something from ipcMain");
  };
}

/**
 * return project text
 * @returns {Object}
 */
const returnProjectText = () => {
  return entryViewText[$API_DATA.language].project;
};

/**
 * return note text
 * @returns {Object}
 */
const returnNoteText = () => {
  return entryViewText[$API_DATA.language].note;
};

/**
 * return branch text
 * @returns {Object}
 */
const returnBranchText = () => {
  return entryViewText[$API_DATA.language].branch;
};

/**
 * return commit text
 * @returns {Object}
 */
const returnCommitText = () => {
  return entryViewText[$API_DATA.language].commit;
};

/**
 * return flow text
 * @returns {Object}
 */
const returnFlowText = () => {
  return entryViewText[$API_DATA.language].flow;
};

/**
 * return storage text
 * @returns {Object}
 */
const returnStorageText = () => {
  return entryViewText[$API_DATA.language].storage;
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px 0;
  margin-bottom: 32px;

  > li {
    > *:last-child {
      margin-bottom: 0;
    }

    > h2 {
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 8px;

      > small {
        display: block;
        letter-spacing: 0.08em;
      }
    }

    .project-notice {
      color: #ff0000;
    }

    textarea,
    select {
      width: 100%;
      border-radius: 8px;
      padding: 8px;
      font-size: 1.4rem;
      color: $text-color-02;
      border: 1px solid $text-color-02;
    }

    select {
      padding: 6px 8px;
    }
  }

  &__commit {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0 56px;

    &::before {
      width: 26px;
      height: 19px;
      background-image: url("@/assets/img/icon-arrow.svg");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      position: absolute;
      content: "";
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: calc($shadow-size * 2);
}
</style>
