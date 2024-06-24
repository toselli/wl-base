export default defineNuxtRouteMiddleware((to, from) => {
    const usersStore = useUsersStore();
    const runtimeConfig = useRuntimeConfig();
    if (!usersStore.getLoggedUser) {
      usersStore.fetchLoggedUser()
        .then(res => {
        })
        .catch(async (err) => {
          if(runtimeConfig.public.activeHotelCollect === 'true') {
            usersStore.fetchAnonymousUser()
          }
        });
    } else {
     
    }
  });