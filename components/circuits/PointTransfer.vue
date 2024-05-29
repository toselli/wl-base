<template>
    <v-form v-model="valid">
        <v-sheet class="bg-transparent" rounded="md">
            <v-row dense>
                <v-col cols="12">
                    <span class="body-1" v-if="!compact">Salida</span></v-col>
                <v-col cols="6">
                    <VueDatePicker class="search-datepicker-input" ref="dp" v-model="model.date" :teleport="true"
                        auto-apply :enable-time-picker="false" locale="es" :min-date="new Date()"
                        :rules="requiredRules">
                        <template #dp-input="{ }">
                            <v-btn class="btn-search-date" variant="outlined" prepend-icon="mdi-calendar">
                                <div>
                                    <span v-if="model.date"> {{ $dayjs(model.date).format("DD/MM/YY") }}</span>
                                    <span v-else> dd/mm/aa -- : --</span>
                                </div>

                            </v-btn>

                        </template>
                    </VueDatePicker>
                </v-col>
                <v-col cols="6">
                    <v-text-field variant="outlined" v-model="model.address" :rules="requiredRules"
                        placeholder="Dirección origen" density=compact>

                    </v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="6">
                    <v-text-field variant="outlined" v-model="model.city" :rules="requiredRules" placeholder="Ciudad origen" density=compact>

                    </v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field variant="outlined" v-model="model.country" :rules="requiredRules"
                        placeholder="País origen" density=compact>

                    </v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field variant="outlined" v-model="model.notes" placeholder="Observaciones" density=compact>

                    </v-text-field>
                </v-col>
            </v-row>
        </v-sheet>
    </v-form>
</template>

<script setup>
const { requiredRules } = useFormRules()
const model = defineModel();
const valid = defineModel('valid')

onMounted(() => {
    valid.value = false;
})
</script>