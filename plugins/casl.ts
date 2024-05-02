import { abilitiesPlugin } from "@casl/vue";
import { ability } from "../plugins/ability";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(abilitiesPlugin, ability);

  nuxtApp.provide('ability', ability);
});