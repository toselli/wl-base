<template>
    <v-bottom-sheet v-model="show" inset :scrim="false"
                theme="ThemeDark" location="right" scroll-strategy="none"
                class="finish-search-sheet rounded-xl mb-6">
                <v-card class="py-8 px-8" rounded="xl">
                    <v-row dense align="center">
                        <v-col cols="1">
                            <v-icon>
                                mdi-check-circle
                            </v-icon>
                        </v-col>
                        <v-col class="pl-2">
                            <p class="body-1"> Finalizamos la búsqueda y encontramos <span class="text-primary semi">{{
            results }}</span> resultados <span v-if="rooms && rooms > 1"> en total en las {{
            rooms }} habitaciones.</span><span v-else> en total.</span></p>
                            <h4 class="semi">
                                ¿Desea ordenarlos por precio?</h4>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="secondary" rounded="md" flat class="px-12" @click="$emit('orderResults')">
                                Si, reordenar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-bottom-sheet>
</template>

<script setup>
const props = defineProps(["results",'modelValue','rooms']);
const emit = defineEmits(['close']);

const isMobile = useMobile()

const show = ref(false);

watchEffect(() => {
  show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close');
  }
});

</script>