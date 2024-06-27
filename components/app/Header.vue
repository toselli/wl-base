<template>
  <div>
    <v-app-bar class="menu-bar">
      <v-container class="pa-0">
        <v-row dense align="center">
          <v-col>
            <div class="d-flex align-center">
              <a @click="$router.push('/')" @click.middle.prevent="handleMiddleClick($event)" style="cursor: pointer"
                v-if="isMobile" class="body-3">
                <CommonLogoMobileDark height="70" class="ml-2" v-if="theme?.name == 'ThemeDark'" />
                <CommonLogoMobileLight height="70" class="ml-2" v-else />
              </a>
              <a @click="$router.push('/')" @click.middle.prevent="handleMiddleClick($event)" style="cursor: pointer"
                v-else class="body-3">
                <CommonLogoDark height="30" class="ml-2" v-if="theme?.name == 'ThemeDark'" />
                <CommonLogoLight height="30" class="ml-2" v-else />
              </a>
              <CommonServiceTypesMenu class="ml-lg-6"
                v-if="$route.path !== '/' && !$route.path.startsWith('/checkout')" />
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
            <v-tooltip text="Reportar error o sugerencia" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-comment-outline" color="secondary_text" @click="newIssueDialog = true" v-bind="props">
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip :text="$capitalize($t('change_theme'))" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn icon="md:light_mode" v-if="theme?.name == 'ThemeDark'" class="mr-2" color="secondary_text"
                  @click="changeTheme('ThemeLight')" v-bind="props">
                </v-btn>
                <v-btn icon="md:dark_mode" v-else class="mr-2" color="secondary_text" @click="changeTheme('ThemeDark')"
                  v-bind="props">
                </v-btn>
              </template>
            </v-tooltip>
            <AppUserMenu :user="getLoggedUser" v-if="getLoggedUser" @openConfigDialog="openConfigDialog" @openChangePasswordDialog="openChangePasswordDialog" @logout="logout" />

          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <AppConfigDialog v-model="configDialog" :user="getLoggedUser" :activeTheme="theme" :currentConfig="configStore.getConfig" @close="configDialog = false" v-if="getLoggedUser" @changeTheme="changeTheme" />
    <AppNewIssueDialog v-model="newIssueDialog" :user="getLoggedUser" @close="newIssueDialog = false" v-if="getLoggedUser" />
    <AuthLoginDialog v-model="loginDialog" @close="closeLoginDialog" @openRegister="openRegisterDialog" />
    <AuthChangePasswordDialog v-model="changePasswordDialog" @close="closeChangePasswordDialog" />
  </div>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()

const usersStore = useUsersStore();
const { getLoggedUser, getAnonymousUser } = storeToRefs(usersStore);
const loginStore = useLoginStore();
const newIssueDialog = ref(false)

function logout() {
  usersStore.loggedUser.value = null;
  loginStore.logout();
}

function handleMiddleClick(event) {
  if (event.button === 1) {
    const url = 'https://beta.ebooking.com.ar/';
    window.open(url, '_blank');
  }
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
//CONFIG

const configDialog = ref(false)

function openConfigDialog() {
  configDialog.value = true
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

const { theme, activeTheme, applyThemeConfig } = useThemeManager()
const { updateUserConfig } = useUserConfig()

function changeTheme(newTheme) {
  applyThemeConfig(newTheme)
  updateUserConfig(getLoggedUser.value.IdString, { theme: newTheme })
}

const configStore = useConfigStore()

watch(() => configStore.getConfig, (newConfig) => {
    if (newConfig) {
        applyThemeConfig(newConfig.theme)
    }
}, { once: true });
</script>
