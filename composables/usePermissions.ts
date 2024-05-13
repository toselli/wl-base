export const usePermissions = () => {
  const { getMyPermissions } = usePermissionsStore();

  const can = (action, subject) => {
    const permissions = getMyPermissions();
    return permissions.some(permission => permission.Action === action && permission.Subject === subject);
  };

  return { can };
};