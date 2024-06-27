<template>
     <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn variant="flat" color="secondary_lighten" size="xl" rounded="xl" class="py-1 pl-3 pr-0" v-bind="props">
                  <v-icon size="sm" class="mr-2" icon="mdi-menu">
                  </v-icon>
                  <v-avatar class="bg-secondary mr-2" size="32">
                    {{
                  user.FirstName[0] + user.LastName[0]
                }}
                  </v-avatar>
                </v-btn>
              </template>
              <v-card flat>
                <v-card-text class="d-flex align-center">
                  <v-avatar class="bg-secondary mr-2" size="28">
                    {{
                    user.FirstName[0] + user.LastName[0]
                  }}
                  </v-avatar>
                  <p>{{
                    user.FirstName + ' ' + user.LastName
                  }}</p>
                </v-card-text>
                <v-list>
                  <v-list-item @click="$emit('openConfigDialog')">
                    <v-icon icon="mdi-cog-outline" size="md"></v-icon> {{ $capitalize($t("config")) }}
                  </v-list-item>
                  <v-list-item @click="$emit('openChangePasswordDialog')">
                    <v-icon icon="mdi-lock-outline" size="md"></v-icon> {{ $capitalize($t("change_password")) }}
                  </v-list-item>
                  <v-list-item @click="$emit('logout')">
                    <v-icon icon="mdi-logout" size="md"></v-icon> {{ $capitalize($t("log_out")) }}
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
</template>

<script setup>

const props = defineProps(['user'])


const emit = defineEmits(['openConfigDialog']);
</script>