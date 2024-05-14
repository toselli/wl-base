export const usePermissionsStore = defineStore('permissions', () => {
  const myPermissions = ref([]);
  const fetchingPermissions = ref(false);

  const getMyPermissions = computed(() => myPermissions.value || []);

  const fetchMyPermissions = async () => {
    try {
      fetchingPermissions.value = true;
      const res = await useIdentity.get('v1/users/me/permissions');
      if (res) {
        myPermissions.value = res;
        fetchingPermissions.value = false;
        return res; 
      }
    } catch (err) {
      console.error(err);
      throw err; 
    }
  };

  return { myPermissions, getMyPermissions, fetchMyPermissions, fetchingPermissions };
});