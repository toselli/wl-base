import { ref } from 'vue';
import { usePermissionsStore } from './usePermissionsStore';

export const usePermissions = () => {
  const { getMyPermissions } = usePermissionsStore();
  const permissions = ref([]);

  const fetchPermissions = async () => {
    if (permissions.value.length === 0) {
      try {
        permissions.value = await getMyPermissions;
      } catch (err) {
        console.error(err);
      }
    }
  };

  const can = (action, subject) => {
    return permissions.value.some(permission => permission.Action === action && permission.Subject === subject);
  };

  // Fetch permissions on component mount or when needed
  fetchPermissions();

  return { can };
};
