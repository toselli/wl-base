import { ability } from "../utils/ability";
import { abilitiesPlugin } from "@casl/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ability, abilitiesPlugin);

  nuxtApp.provide('ability', ability);
});