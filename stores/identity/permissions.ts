export const usePermissionsStore = defineStore('permissions', () => {
    const myPermissions = ref([]);
  
    const getMyPermissions = computed(() => myPermissions.value || []);
  
    const fetchMyPermissions = async () => {
      try {
        const res = await useIdentity.get('v1/users/me/permissions');
        if (res) {
          myPermissions.value = res;
          return res; 
        }
      } catch (err) {
        console.error(err);
        throw err; 
      }
    };
  
    return { myPermissions, getMyPermissions, fetchMyPermissions };
  });