export default defineNuxtRouteMiddleware((to, from) => {
    const usersStore = useUsersStore();
    if (!usersStore.getLoggedUser) {
      usersStore.fetchLoggedUser()
        .then(res => {
        })
        .catch(async (err) => {
        });
    } else {
    }
  });