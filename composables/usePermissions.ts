export const usePermissions = () => {
  const permissionsStore = usePermissionsStore();
  const permissions = ref([]);

  const fetchPermissions = async () => {
    if (!permissionsStore.fetchingPermissions && permissions.value.length == 0) {
      try {
        await permissionsStore.fetchMyPermissions();
        permissions.value = permissionsStore.getMyPermissions;
      } catch (err) {
        console.error(err);
      }
    } else {
      permissions.value = permissionsStore.getMyPermissions;
    }
  };

  const can = (action, subject) => {
    return permissions.value.some(permission => permission.Action === action && permission.Subject === subject);
  };

  // Fetch permissions on component mount or when needed
  fetchPermissions();

  return { can };
};