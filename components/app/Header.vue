<template>
  <div>
    <v-app-bar class="menu-bar" id="top" flat v-if="!isMobile">
      <v-container class="pa-0">
        <v-row dense>
          <v-col cols="2">
            <a href="/">
              <CommonLogoDark :height="isMobile ? '45' : '45'" :class="isMobile ? 'ml-2' : ''" />
            </a>
          </v-col>
          <v-col cols="9"  class="text-right pt-2" >
            <v-btn href="https://360regional.com/360/" variant="text">Inicio</v-btn>
            <v-btn href="https://360regional.com/360/reserva-de-paquetes-online/" variant="text">Reservas paquetes</v-btn>            
            <v-btn href="https://360regional.com/360/destinos-internacionales/" variant="text">Destinos</v-btn>
            <v-btn href="https://360regional.com/360/una-empresa-solida/" variant="text">Nosotros</v-btn>
            <v-btn href="https://360regional.com/360/pago-y-financiacion/" variant="text">Administración</v-btn>
            <v-btn href="https://360regional.com/360/contacto/" variant="text">Contacto</v-btn>
          </v-col>
          <v-col cols="1" class="text-right pt-2" v-if="getLoggedUser == null" :class="isMobile ? 'pr-2' : ''">
            <!-- <v-btn rounded variant="outlined" color="primary" class="mr-2" @click="openRegisterDialog()">
              {{ $capitalize($t("sign_up")) }}
            </v-btn> -->
            <v-btn rounded variant="flat" color="primary" @click="openLoginDialog()">
              {{ $capitalize($t("log_in")) }}
            </v-btn>
          </v-col>
          <v-col class="text-right pt-2" v-else>
            <!-- <v-tooltip text="Cambiar modo" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn rounded icon="mdi-theme-light-dark" class="mr-2" color="primary" @click="toggleTheme()"
                  v-bind="props">
                </v-btn>
              </template>
            </v-tooltip> -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn variant="text" size="xl"  class="py-1 px-2" v-bind="props">

                  <v-icon size="sm" icon="mdi-menu">
                  </v-icon>
                  <v-avatar class="bg-secondary ml-2" size="32">
                    {{
                      getLoggedUser.FirstName[0] + getLoggedUser.LastName[0]
                    }}
                  </v-avatar>
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
                <v-list density="compact">

                  <v-list-item @click="openChangePasswordDialog"  prepend-icon="mdi-lock-outline">
                     {{ $capitalize($t("change_password")) }}
                  </v-list-item>
                  <v-list-item @click="logout" prepend-icon="mdi-logout">
                    {{ $capitalize($t("log_out")) }}
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-app-bar class="menu-bar" id="top" flat v-else>
   
      <v-container class="pa-0">
        <v-row dense>
          <v-col cols="7" class="d-flex">
            <v-app-bar-nav-icon variant="text" @click.stop="menuMobile = !menuMobile"></v-app-bar-nav-icon>

            <a href="/">
              <CommonLogoDark :height="isMobile ? '40' : '45'" :class="isMobile ? '' : ''" />
            </a>
          </v-col>
          <v-col cols="5" class="text-right pt-2 pr-4" v-if="getLoggedUser == null" :class="isMobile ? 'pr-2' : ''">
            <!-- <v-btn rounded variant="outlined" color="primary" class="mr-2" @click="openRegisterDialog()">
              {{ $capitalize($t("sign_up")) }}
            </v-btn> -->
            <v-btn rounded variant="flat" color="primary" @click="openLoginDialog()">
              {{ $capitalize($t("log_in")) }}
            </v-btn>
          </v-col>
          <v-col cols="5" class="text-right pt-2 pr-4" v-else>
            <!-- <v-tooltip text="Cambiar modo" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn rounded icon="mdi-theme-light-dark" class="mr-2" color="primary" @click="toggleTheme()"
                  v-bind="props">
                </v-btn>
              </template>
            </v-tooltip> -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn variant="text" size="xl"  class="py-1 px-2" v-bind="props">

                  <v-icon size="sm" icon="mdi-account">
                  </v-icon>
                  <v-avatar class="bg-secondary" size="32">
                    {{
                      getLoggedUser.FirstName[0] + getLoggedUser.LastName[0]
                    }}
                  </v-avatar>
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
                <v-list density="compact">

                  <v-list-item @click="openChangePasswordDialog"  prepend-icon="mdi-lock-outline">
                     {{ $capitalize($t("change_password")) }}
                  </v-list-item>
                  <v-list-item @click="logout" prepend-icon="mdi-logout">
                    {{ $capitalize($t("log_out")) }}
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer v-model="menuMobile" dark color="secondary" clipped app disable-resize-watcher v-if="isMobile">
            <v-list color="transparent" class="pa-3">
            
            <v-list-item href="https://360regional.com/360/" block variant="text">Inicio</v-list-item>
            <v-list-item href="https://360regional.com/360/reserva-de-paquetes-online/" block variant="text">Reservas paquetes</v-list-item>            
            <v-list-item href="https://360regional.com/360/destinos-internacionales/" block variant="text">Destinos</v-list-item>
            <v-list-item href="https://360regional.com/360/una-empresa-solida/" block variant="text">Nosotros</v-list-item>
            <v-list-item href="https://360regional.com/360/pago-y-financiacion/" block variant="text">Administración</v-list-item>
            <v-list-item href="https://360regional.com/360/contacto/" block variant="text">Contacto</v-list-item>
            </v-list>
        </v-navigation-drawer>
    <AuthLoginDialog v-model="loginDialog" @close="closeLoginDialog" @openRegister="openRegisterDialog" />
    <AuthRegisterDialog v-model="registerDialog" @close="closeRegisterDialog" />
    <AuthChangePasswordDialog v-model="changePasswordDialog" @close="closeChangePasswordDialog" />

  </div>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()
const menuMobile = ref(false)
//#region imports

import { useAbility } from "@casl/vue";

//#endregion


const { can, cannot } = useAbility();

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);

function logout() {
  usersStore.loggedUser.value = null;
  const loginStore = useLoginStore();
  loginStore.logout();
}

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
const route = useRoute();

const isHomePage = computed(() => {
  return route.path === '/';
});

import { useTheme } from 'vuetify'

const theme = ref(useTheme())

function toggleTheme() {
  theme.value.global.name = theme.value.global.current.dark ? 'ThemeLight' : 'ThemeDark'
}
</script>
