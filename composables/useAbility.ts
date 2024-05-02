import { useNuxtApp } from '#app';

export function useAbility() {
  const nuxtApp = useNuxtApp();

  const ability = nuxtApp.$ability;

  const can = (action, subject) => ability.can(action, subject);
  const cannot = (action, subject) => ability.cannot(action, subject);

  return { can, cannot };
}