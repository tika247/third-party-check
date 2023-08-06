<!-- TODO: $API_DATA.languageで日本語と英語を切り分ける -->
<template>
  <ul class="list">
    <li>
      <h2>{{ returnProjectText }}</h2>
      <ul class="list-projectName">
        <li v-for="item in returnApiProjects" :key="item.name">
          <button @click="switchSelectedProject(item.name)" :class="returnProjectBtnCurrent(item.name)">{{ item.name }}</button>
        </li>
        <btn-a :type="'add'" :size="'small'" @click="switchAddBtnState()" v-if="returnListInfoIsHide('add')"></btn-a>
      </ul>

      <div class="list-projectInfo v-projectInfo" v-for="(item, index) in returnApiProjects" :key="item.name" :class="returnListInfoIsHide(item.name)">
        <ul class="list-projectInfo__list">
          <li>
            <h3>{{ returnNameText }}</h3>
            <textarea :name="`${item.name}-name`" :id="`${item.name}-name`" rows="1" v-html="item.name"></textarea>
          </li>
          <li>
            <h3>{{ returnRemoteText }}</h3>
            <textarea :name="`${item.name}-remote`" :id="`${item.name}-remote`" rows="1" v-html="item.remote"></textarea>
          </li>
          <li>
            <h3>{{ returnLocalText }}</h3>
            <textarea :name="`${item.name}-local`" :id="`${item.name}-local`" rows="1" v-html="item.local"></textarea>
          </li>
        </ul>
        <div class="list-projectInfo__btn-wrap">
          <btn-a :type="'remove'" :size="'small'" @click="removeProjectProcess(index)"></btn-a>
          <btn-a :type="'close-small'" :size="'small'" @click="closeProjectInfoProcess"></btn-a>
          <btn-a :type="'ok'" :size="'small'" @click="editProjectProcess($event, index)"></btn-a>
        </div>
      </div>

      <div class="list-projectInfo" :class="returnListInfoIsHide('add')" ref="addArea">
        <ul class="list-projectInfo__list">
          <li>
            <h3>{{ returnNameText }}</h3>
            <textarea name="add-name" id="add-name" rows="1" class="_full"></textarea>
          </li>
          <li>
            <h3>{{ returnRemoteText }}</h3>
            <textarea name="add-remote" id="add-remote" rows="1"></textarea>
          </li>
          <li>
            <h3>{{ returnLocalText }}</h3>
            <textarea name="add-local" id="add-local" rows="1"></textarea>
          </li>
        </ul>
        <div class="list-projectInfo__btn-wrap">
          <btn-a :type="'close-small'" :size="'small'" @click="closeProjectInfoProcess"></btn-a>
          <btn-a :type="'ok'" :size="'small'" @click="addProjectProcess"></btn-a>
        </div>
      </div>
    </li>
    <li>
      <h2>{{ returnWinmergeText }}</h2>
      <textarea name="winMerge" id="winMerge" rows="1" v-html="returnApiWinMerge()" @change="changeWinMerge($event)"></textarea>
    </li>
    <li>
      <h2>{{ returnLanguageText }}</h2>
      <div class="list-language" ref="languageArea">
        <input type="radio" id="language-en" name="language" value="en" @change="changeLanguage($event)" />
        <label for="language-en">En</label>
        <input type="radio" id="language-ja" name="language" value="ja" @change="changeLanguage($event)" />
        <label for="language-ja">Ja</label>
      </div>
    </li>
  </ul>
  <div class="btn-wrap">
    <btn-a :type="'close'" @click="goBackProcess"></btn-a>
    <btn-a :type="'done'" @click="updateAPIProcess"></btn-a>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, inject, computed, ref, Ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { editViewText } from "@/constants";
import BtnA from "@/components/BtnA.vue";

// router
const router = useRouter();

// inject
let $API_DATA: any = inject("$API_DATA");

//ref
const selectedProject: Ref<string | null> = ref(null);
const addArea: Ref<HTMLDivElement | null> = ref(null);
const languageArea: Ref<HTMLDivElement | null> = ref(null);
let currentLanguage: Ref<string> = ref($API_DATA.language);

// defineComponent
defineComponent({
  btnA: BtnA,
});

// TODO: JSON.parse & JSON.stringify are costly. Alternative solution?
// CHECK: check if possible with structuredClone()
const originalProjects = JSON.parse(JSON.stringify($API_DATA.projects));
const originalWinmerge = JSON.parse(JSON.stringify($API_DATA.winmerge));
const originalLanguage = JSON.parse(JSON.stringify($API_DATA.language));

/**
 * @description return API projects
 * @returns {object} projects
 */
const returnApiProjects = computed(() => {
  return $API_DATA.projects;
});
/**
 * @description return API winmerge
 * @returns {string} winmerge
 */
const returnApiWinMerge = () => {
  return $API_DATA.winmerge;
};
/**
 * @description change winmerge
 * @param {Event} e
 */
const changeWinMerge = (e: Event) => {
  if (e.currentTarget instanceof HTMLTextAreaElement) {
    $API_DATA.winmerge = e.currentTarget.value;
  }
};
/**
 * @description change winmerge
 * @param {Event} e
 */
const changeLanguage = (e: Event) => {
  if (e.currentTarget instanceof HTMLInputElement) {
    $API_DATA.language = e.currentTarget.value;
    currentLanguage.value = e.currentTarget.value;
  }
};

/**
 * @description close and back to top
 */
const goBackProcess = async () => {
  await (() => {
    $API_DATA.projects = originalProjects;
    $API_DATA.winmerge = originalWinmerge;
    $API_DATA.language = originalLanguage;
    return Promise.resolve();
  })();
  router.push({ path: "/" });
};

/**
 * @description done and back to top
 */
const updateAPIProcess = async () => {
  await window.electron.PROCESS_UPDATE_API($API_DATA);
  router.push({ path: "/" });
};

/**
 * @description return project btn current
 * @param {string} name
 */
const returnProjectBtnCurrent = (name: string) => {
  return selectedProject.value === name ? "is-current" : false;
};

/**
 * @description return list info is-hide
 * @param {string} name
 * @returns {string | null}
 */
const returnListInfoIsHide = (name: string) => {
  return selectedProject.value === null || selectedProject.value !== name ? "is-hide" : false;
};

/**
 * @description switch add btn state
 */
const switchAddBtnState = () => {
  if (selectedProject.value !== "add") selectedProject.value = "add";
};

/**
 * @description open modal event
 * @param {string} name
 */
const switchSelectedProject = (name: string) => {
  selectedProject.value = name;
};

/**
 * @description remove process
 */
const removeProjectProcess = (index: number) => {
  $API_DATA.projects.splice(index, 1);
  selectedProject.value = null;
};

/**
 * @description close info area
 */
const closeProjectInfoProcess = () => {
  if (!addArea.value) return;
  const textarea = addArea.value?.getElementsByTagName("textarea");
  if (!textarea) return;

  textarea[0].value = "";
  textarea[1].value = "";
  textarea[2].value = "";

  selectedProject.value = null;
};

/**
 * @description edit project
 */
const editProjectProcess = (e: MouseEvent, index: number) => {
  if (!(e.currentTarget instanceof HTMLElement) || !e.currentTarget) return;
  const projectInfo = e.currentTarget.closest(".v-projectInfo");
  if (!projectInfo) return;
  const textarea = projectInfo.getElementsByTagName("textarea");
  if (!textarea) return;
  const name = textarea[0].value;
  const remote = textarea[1].value;
  const local = textarea[2].value;

  const editInfo = {
    name: name,
    remote: remote,
    local: local,
  };

  $API_DATA.projects.splice(index, 1, editInfo);

  textarea[0].value = "";
  textarea[1].value = "";
  textarea[2].value = "";

  selectedProject.value = null;
};

/**
 * @description add new project
 */
const addProjectProcess = () => {
  if (!addArea.value) return;
  const textarea = addArea.value?.getElementsByTagName("textarea");
  if (!textarea) return;
  const name = textarea[0].value;
  const remote = textarea[1].value;
  const local = textarea[2].value;

  const newProject = {
    name: name,
    remote: remote,
    local: local,
  };

  $API_DATA.projects.push(newProject);

  textarea[0].value = "";
  textarea[1].value = "";
  textarea[2].value = "";

  selectedProject.value = null;
};

onMounted(() => {
  if (!languageArea.value) return;
  const inputs = languageArea.value.getElementsByTagName("input");
  for (const input of inputs) {
    if (input.value === $API_DATA.language) {
      input.checked = true;
    }
  }
});

/**
 * return project text
 * @returns {Object}
 */
const returnProjectText = computed(() => {
  return editViewText[currentLanguage.value].project;
});
/**
 * return name text
 * @returns {Object}
 */
const returnNameText = computed(() => {
  return editViewText[currentLanguage.value].name;
});
/**
 * return remote text
 * @returns {Object}
 */
const returnRemoteText = computed(() => {
  return editViewText[currentLanguage.value].remote;
});
/**
 * return local text
 * @returns {Object}
 */
const returnLocalText = computed(() => {
  return editViewText[currentLanguage.value].local;
});
/**
 * return winmerge text
 * @returns {Object}
 */
const returnWinmergeText = computed(() => {
  return editViewText[currentLanguage.value].winmerge;
});
/**
 * return language text
 * @returns {Object}
 */
const returnLanguageText = computed(() => {
  return editViewText[currentLanguage.value].language;
});
</script>

<style lang="scss" scoped>
%btn-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 16px;
}
.list {
  width: 100%;
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
    }

    textarea {
      width: 100%;
      border-radius: 8px;
      padding: 8px;
      font-size: 1.4rem;
      color: $text-color-02;
    }
  }
}
.list-projectName {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px 12px;
  > li {
    > button {
      min-width: 56px;
      border-radius: 8px;
      padding: 8px;
      font-size: 1.4rem;
      overflow-y: hidden;
      border: 1px solid $color-01;
      text-align: left;
      color: $text-color-02;
      text-align: center;
      transition: background-color 0.3s ease-in-out;

      &:hover,
      &:focus {
        background-color: $color-02;
      }

      &.is-current {
        background-color: $color-02;
      }
    }
  }
}

.list-projectInfo {
  padding: 14px 16px 18px;
  margin-top: 8px;
  border-radius: 8px;
  background-color: $color-02;
  &.is-hide {
    display: none;
  }

  &__list {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;

    > li {
      width: 100%;

      > *:last-child {
        margin-bottom: 0;
      }

      > h3 {
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 8px;
      }

      textarea {
        width: 100%;
        border-radius: 8px;
        padding: 8px;
        font-size: 1.4rem;
        overflow-y: hidden;
        color: $text-color-02;
      }
    }

    textarea {
      &._full {
        width: 100%;
      }
    }
  }

  &__btn-wrap {
    @extend %btn-wrap;
    margin-top: 12px;
  }
}
.btn-wrap {
  @extend %btn-wrap;
}

.list-language {
  display: flex;
  margin-bottom: 36px;
  overflow: hidden;

  input {
    position: absolute !important;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    border: 0;
    overflow: hidden;

    &:checked + label {
      background-color: $color-02;
      font-size: 1.5rem;
    }
  }

  label {
    color: $text-color;
    font-size: 1.3rem;
    text-align: center;
    padding: 18px 14px;
    line-height: 0;
    margin-right: -1px;
    border: 1px solid $color-01;
    cursor: pointer;
    vertical-align: middle;

    &:first-of-type {
      border-radius: 4px 0 0 4px;
    }

    &:last-of-type {
      border-radius: 0 4px 4px 0;
    }
  }
}
</style>
