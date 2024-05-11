import { ability } from "../plugins/ability";
import { abilitiesPlugin } from "@casl/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(abilitiesPlugin, ability);

  nuxtApp.provide('ability', ability);
});