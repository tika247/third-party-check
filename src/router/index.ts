import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";
import EntryView from "@/views/EntryView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "entryView",
    component: EntryView,
    props: true,
  },
  {
    path: "/confirmView",
    name: "confirmView",
    component: () => import("@/views/ConfirmView.vue"),
  },
  {
    path: "/completeView",
    name: "completeView",
    component: () => import("@/views/CompleteView.vue"),
  },
  {
    path: "/editView",
    name: "editView",
    component: () => import("@/views/EditView.vue"),
  },
];

/**
 * @description In production, router only works with createWebHashHistory()
 * @example if development, createWebHistory()
 * @example if production, createWebHashHistory()
 */
const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes,
});

export default router;
