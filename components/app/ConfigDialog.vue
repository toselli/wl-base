<template>
  <v-dialog v-model="show" width="700px">
    <v-card flat class="bg-background rounded-md">
      <v-toolbar color="bg-midground">
        <h3 class="pl-4">{{ $capitalize($t("user_config")) }} </h3>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-window-close" variant="icon" @click="show = false">
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-tabs v-model="tab" color="secondary" selected-class="bg-secondary_lighten" direction="vertical"
              class="bg-foreground rounded-md pa-2">
              <v-tab prepend-icon="mdi-account-cog" text="General" value="1" class-active="bg-secondary"></v-tab>
            </v-tabs>
          </v-col>          
          <v-col>
            <v-tabs-window v-model="tab" class="bg-foreground rounded-md pa-4">
              <v-tabs-window-item value="1">
                <v-sheet border class="bg-midground border-primary_text px-3 pb-3 pt-1 mb-3 rounded-md">
                  <h5 class="pt-3"><v-icon icon="md:sort" class="mr-2"></v-icon>Orden automático por precio</h5>
                  <p class="text-secondary_text body-2 pa-2">Active o desactive el orden automático por precio para la
                    búsqueda de alojamientos.</p>
                  <v-switch label="Activar" inset density="compact" class="body-1" hide-details color="secondary"
                    v-model="autoOrderbyPrice" @change="(val) => changeAutoOrderbyPrice(val)"></v-switch>
                </v-sheet>
                <v-sheet border class="bg-midground border-primary_text px-3 pb-3 pt-1 mb-3 rounded-md">
                  <h5 class="pt-3"><span v-if="activeTheme.name == 'ThemeLight'"><v-icon icon="md:light_mode"
                        size="small" class="mr-2"></v-icon>Modo Claro</span><span v-else><v-icon icon="md:dark_mode"
                        size="small" class="mr-2"></v-icon>Modo Oscuro</span></h5>
                  <p class="text-secondary_text body-2 pa-2">Seleccione su modo de preferencia</p>
                  <v-btn class="mr-2 rounded-md" color="primary_text" :disabled="activeTheme.name == 'ThemeLight'"
                    @click="handleChangeTheme('ThemeLight')" flat v-bind="props"> <v-icon icon="md:light_mode"
                      class="mr-2"></v-icon>{{ $capitalize($t("change_theme_to_light")) }}
                  </v-btn>
                  <v-btn class="mr-2 rounded-md" color="primary_text" flat @click="handleChangeTheme('ThemeDark')"
                    :disabled="activeTheme.name == 'ThemeDark'" v-bind="props"> <v-icon icon="md:dark_mode"
                      class="mr-2"></v-icon>{{ $capitalize($t("change_theme_to_dark")) }}
                  </v-btn>
                </v-sheet>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>
        </v-row>
      </v-container>

    </v-card>
  </v-dialog>
</template>


<script setup>
// Define tus datos reactivos
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  activeTheme: {
    type: Object,
    required: true
  },
  currentConfig: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['update:modelValue', 'changeTheme']);
const tab = ref(1)
const show = ref(false);

watchEffect(() => {
  show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close');
  }
});

const { updateUserConfig } = useUserConfig()

const autoOrderbyPrice = computed({
  get() {
    return props.currentConfig.autoOrderbyPrice;
  },
  set(newValue) {
    changeAutoOrderbyPrice(newValue);
  }
})

const changeAutoOrderbyPrice = async (newValue) => {
  try {
    await updateUserConfig(props.user.IdString, { autoOrderbyPrice: newValue });
  } catch (error) {
    console.error('Error updating user config:', error);
  }
};

const handleChangeTheme = (newTheme) => {
  emit('changeTheme', newTheme);
};

</script>