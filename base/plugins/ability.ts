import { PureAbility, AbilityBuilder } from '@casl/ability';

export const ability = new PureAbility();

export default defineNuxtPlugin(nuxtApp => {
  const usersStore = useUsersStore();
  const permissionsStore = usePermissionsStore();

  permissionsStore.fetchMyPermissions().catch(err => console.error(err));

  let myPermissions = permissionsStore.getMyPermissions.value || [];
  myPermissions = myPermissions.map(x => ({
      action: x.Action,
      subject: x.Subject
  }));

  if (myPermissions.length > 0) {
      ability.update(myPermissions);
  }

  nuxtApp.hook('app:data', async () => {
      const loggedUser = usersStore.loggedUser;
      if (!loggedUser) return;

      await permissionsStore.fetchMyPermissions().catch(err => console.error(err));

      myPermissions = permissionsStore.getMyPermissions.value || [];
      myPermissions = myPermissions.map(x => ({
          action: x.Action,
          subject: x.Subject
      }));

      if (myPermissions.length > 0) {
          ability.update(myPermissions);
      }
  });
});
