<template>
  <v-dialog v-model="show" width="500px">
    <v-card flat class="background pt-2 rounded-md px-4 py-5">
      <h3>{{ $capitalize($t("config")) }} 
      <v-btn icon="mdi-window-close" variant="flat" class="float-right" @click="show = false">
      </v-btn>
      </h3>
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense>
                <v-col>
            <h5 class="py-3">Tema activo: <span v-if="activeTheme.name == 'ThemeLight'">Claro</span><span v-else>Oscuro</span></h5>
            <v-btn   class="mr-2" color="secondary" :disabled="activeTheme.name == 'ThemeLight'"
                  @click="handleChangeTheme('ThemeLight')" v-bind="props"> <v-icon icon="md:light_mode" class="mr-2"></v-icon>{{ $capitalize($t("change_theme_to_light")) }}
                </v-btn>
                <v-btn class="mr-2" color="secondary" @click="handleChangeTheme('ThemeDark')" :disabled="activeTheme.name == 'ThemeDark'"
                  v-bind="props"> <v-icon icon="md:dark_mode" class="mr-2"></v-icon>{{ $capitalize($t("change_theme_to_dark")) }}
                </v-btn>
                <v-divider class="mt-4"></v-divider>
                <h5 class="py-3">Orden automático de resultados por precio</h5>
               <v-switch label="Activar" color="secondary" v-model="autoOrderbyPrice" @change="(val) => changeAutoOrderbyPrice(val)"></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
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
const emit = defineEmits(['update:modelValue','changeTheme']);

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