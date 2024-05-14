<template>
  <div>
    <v-app-bar class="menu-bar">
      <v-container class="pa-0">
        <v-row dense align="center">
          <v-col>
            <div class="d-flex align-center">
                <a href="/" v-if="isMobile" class="body-3" >
                  <CommonLogoMobileDark height="70" class="ml-2"
                    v-if="theme.name == 'ThemeDark'" />
                  <CommonLogoMobileLight height="70" class="ml-2"  v-else />
                </a>
                <a href="/" v-else class="body-3">
                  <CommonLogoDark height="i30" class="ml-2"
                    v-if="theme.name == 'ThemeDark'" />
                  <CommonLogoLight height="30" class="ml-2" v-else />
                </a>
              <CommonServiceTypesMenu class="ml-lg-6"  v-if="$route.path != '/'" />
            </div>
          </v-col>
          <v-col class="text-right" v-if="getLoggedUser == null" :class="isMobile ? 'pr-2' : ''">
            <!-- <v-btn rounded variant="outlined" color="primary" class="mr-2" @click="openRegisterDialog()">
              {{ $capitalize($t("sign_up")) }}
            </v-btn> -->
            <v-btn rounded="md" color="secondary" variant="outlined" @click="openLoginDialog()">
              {{ $capitalize($t("log_in")) }}
            </v-btn>
          </v-col>
          <v-col class="text-right" v-else>
            <v-tooltip text="Cambiar modo" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn rounded icon="mdi-theme-light-dark" class="mr-2" color="primary" @click="toggleTheme()"
                  v-bind="props">
                </v-btn>
              </template>
            </v-tooltip>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn variant="text" size="xl" rounded="xl" class="pr-2" v-bind="props">
                  <v-avatar class="bg-secondary mr-2" size="42">
                    {{
                      getLoggedUser.FirstName[0] + getLoggedUser.LastName[0]
                    }}
                  </v-avatar>
                  <v-icon size="16" icon="mdi-chevron-down">
                  </v-icon>
                </v-btn>
              </template>
              <v-card flat>
                <v-card-text class="d-flex align-center">
                  <v-avatar class="bg-secondary mr-2" size="28">
                    {{
                      getLoggedUser.FirstName[0] + getLoggedUser.LastName[0]
                    }}
                  </v-avatar>
                  <p>{{
                    getLoggedUser.FirstName + ' ' + getLoggedUser.LastName
                  }}</p>
                </v-card-text>
                <v-list>
                  <v-list-item @click="openChangePasswordDialog">
                    <v-icon icon="mdi-lock-outline" size="md"></v-icon> {{ $capitalize($t("change_password")) }}
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-icon icon="mdi-logout" size="md"></v-icon> {{ $capitalize($t("log_out")) }}
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <AuthLoginDialog v-model="loginDialog" @close="closeLoginDialog" @openRegister="openRegisterDialog" />
    <AuthChangePasswordDialog v-model="changePasswordDialog" @close="closeChangePasswordDialog" />
  </div>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);
const loginStore = useLoginStore();

function logout() {
  usersStore.loggedUser.value = null;
  loginStore.logout();
}

//captura los 401 y abre el loginDialog

// watch(() => loginStore.isExpired, (newValue) => {
//   if (newValue) {
//     openLoginDialog();
//   }
// }, { immediate: true });

//LOGIN

const loginDialog = ref(false);
const registerDialog = ref(false);

function openLoginDialog() {
  loginDialog.value = true;
  registerDialog.value = false;
}

function closeLoginDialog() {
  loginDialog.value = false;
}

function openRegisterDialog() {
  registerDialog.value = true;
  loginDialog.value = false;
}

function closeRegisterDialog() {
  registerDialog.value = false;
}

//CHANGE PASSWORD

const changePasswordDialog = ref(false)

function openChangePasswordDialog() {
  changePasswordDialog.value = true
}

function closeChangePasswordDialog() {
  changePasswordDialog.value = false

}

//THEME

import { useTheme } from 'vuetify'

const theme = ref(useTheme())

function toggleTheme() {
  theme.value.global.name = theme.value.global.current.dark ? 'ThemeLight' : 'ThemeDark'
}
</script>
