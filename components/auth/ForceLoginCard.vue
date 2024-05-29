<template>
  <v-card class="ma-6" flat rounded="xl">
    <v-card-text class="text-center pa-6 pa-md-16">
      <h4 class="text-h4 semi pa-6">
        Inicia sesión para continuar
      </h4>
      <v-img src="/base/img/no_login.png" width="280" class="mx-auto"></v-img>
      <v-btn variant="flat" color="primary" rounded="md" @click="openLoginDialog">
        Iniciar sesión
      </v-btn>
    </v-card-text>
    <AuthLoginDialog v-model="loginDialog" @close="closeLoginDialog" :compact="true" />
  </v-card>
</template>
<script setup>
//LOGIN

const loginDialog = ref(false);

function openLoginDialog() {
  loginDialog.value = true;
}
function closeLoginDialog() {
  loginDialog.value = false;
}
</script>