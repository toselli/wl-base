import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = async (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }

    const findEl = async (hash, x = 0) => {
      if (!hash) return document.querySelector("#app");
      return (
        document.querySelector(hash) ||
        new Promise((resolve) => {
          if (x > 50) { 
            return resolve(document.querySelector("#app"));
          }
          setTimeout(() => {
            resolve(findEl(hash, x + 1));
          }, 100);
        })
      );
    };

    if (to.hash) {
      const el = await findEl(to.hash);

      if ("scrollBehavior" in document.documentElement.style) {
        return window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
      } else {
        return window.scrollTo(0, el.offsetTop);
      }
    }
    return { left: 0, top: 0, behaviour: "smooth" };
  };
})