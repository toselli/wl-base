import { ability } from "../plugins/ability";
//import { abilitiesPlugin } from "@casl/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ability);

  nuxtApp.provide('ability', ability);
});