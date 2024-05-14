<template>
  <v-app>
    <transition name="fade" v-if="showHideSpinner">
      <AppLoadSpinner />
    </transition>
    <transition name="fade" v-else>
      <div class="d-flex flex-column fill-height justify-space-start">
        <AppHeader />
        <VitePwaManifest />
        <slot />
      </div>
    </transition>
    <AppFooter />
    <AuthLoginDialog v-model="loginDialog" />
  </v-app>
</template>

<script setup>
const loginDialog = ref(false)

const showHideSpinner = ref(true)

onMounted(() => {
  showHideSpinner.value = false;
})

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
