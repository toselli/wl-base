<template>
    <v-sheet class="bg-transparent" rounded="md">
        <v-form v-model="valid" :ref="refKey">
            <!-- <v-row dense>
                <v-col cols="6">
                    <v-autocomplete label="Aerolínea" variant="outlined" density="compact" :items="airlines"
                        :rules="requiredRules" v-model="model.airline" v-model:search="airlineSearch" item-title="Value"
                        return-object no-data-text="No hay resultados para su búsqueda" clearable>
                        <template v-slot:append-inner>
                            <v-progress-circular indeterminate color="primary" size="25"
                                v-if="loadingAirlines"></v-progress-circular>
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="6">
                    <v-text-field variant="outlined" :rules="requiredRules" v-model="model.country" placeholder="Número de vuelo" density=compact>

                    </v-text-field>
                </v-col>
            </v-row> -->
            <!-- <v-row dense>
                <v-col cols="9">
                    <VueDatePicker class="search-datepicker-input" ref="dp" v-model="model.date" :teleport="true"
                        auto-apply :enable-time-picker="false" locale="es" >
                        <template #dp-input="{ }" :rules="requiredRules">
                            <v-btn class="btn-search-date" variant="outlined" prepend-icon="mdi-calendar">
                                <div>
                                    <span v-if="model.date"> {{ $dayjs(model.date).format("DD/MM/YY") }}</span>
                                    <span v-else> dd/mm/aa -- : --</span>
                                </div>

                            </v-btn>

                        </template>
                    </VueDatePicker>
                </v-col>
                <v-col cols="3">
                    <v-btn  variant="flat" color="secondary" rounded="sm" :disabled="!valid">
                        Buscar vuelo
                    </v-btn>
                </v-col>
            </v-row> -->
            <v-row dense>
                <v-col>
                    <v-card class="bg-foreground" rounded="md" variant="outlined">
                        <!-- <v-card-title class="body-2 text-secondary semi">
                            Si al tocar "Buscar vuelo" no se autocompletan los campos, deberá hacerlo manualmente.
                        </v-card-title> -->
                        <v-card-text>
                            <v-row dense justify="center" align="center">
                                <v-col cols="5" :class="compact ? 'pr-2' : ''">
                                    <v-no-ssr>
                                        <span class="body-1 semi">{{ $capitalize($t("origin")) }}</span>
                                        <v-autocomplete id="origin-autocomplete" v-model="model.originAirport"
                                            :items="getAirports" hide-details clear-icon="mdi-close"
                                            class="autocomplete-search-places" :filter-mode="'union'" no-filter
                                            variant="tonal" item-props density="compact" rounded :rules="requiredRules"
                                            :placeholder="$capitalize($t('destination_place'))" clearable
                                            v-model:search="originSearch" open-on-clear item-title="Name" return-object
                                            eager>
                                        </v-autocomplete>
                                    </v-no-ssr>
                                </v-col>
                                <v-col cols="1" align="center">
                                    <v-icon icon="md:swap_horiz" class="mt-5"></v-icon>
                                </v-col>
                                <v-col :class="compact ? 'pr-2' : ''">
                                    <v-no-ssr>

                                        <span class="body-1 semi">{{ $capitalize($t("going_to")) }}</span>
                                        <v-autocomplete id="destination-autocomplete" v-model="model.destinationAirport"
                                            :items="getAirports" hide-details clear-icon="mdi-close"
                                            class="autocomplete-search-places" :filter-mode="'union'" no-filter
                                            :rules="requiredRules" variant="tonal" item-props density="compact" rounded
                                            :placeholder="$capitalize($t('destination_place'))" clearable
                                            v-model:search="destinationSearch" open-on-clear item-title="Name" return-object
                                            eager>
                                        </v-autocomplete>
                                    </v-no-ssr>
                                </v-col>
                                <v-col cols="5">

                                    <span class="body-1 semi">Salida
                                    </span>
                                    <v-no-ssr>
                                        <VueDatePicker v-model="model.departureDate" class="search-datepicker-input"
                                            :clearable="false" :dark="theme.name == 'ThemeDark'" :teleport="true"
                                            auto-apply locale="es" :min-date="new Date()" :rules="requiredRules">

                                            <template #action-preview="{ value }">
                                            </template>
                                            <template #dp-input="{ }">
                                                <v-btn class="btn-search-date" variant="tonal">
                                                    <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                                                    <span v-if="model.departureDate">{{
                                                        $dayjs(model.departureDate).format("DD/MM/YYYY HH:mm")
                                                    }}</span>
                                                    <span v-else> dd/mm/aa --:-- </span>
                                                </v-btn>
                                            </template>
                                        </VueDatePicker>
                                    </v-no-ssr>
                                </v-col>
                                <v-col cols="1" align="center">

                                </v-col>
                                <v-col>

                                    <span class="body-1 semi">Llegada
                                    </span>
                                    <v-no-ssr>
                                        <VueDatePicker v-model="model.arrivalDate" class="search-datepicker-input" 
                                            :clearable="false" :dark="theme.name == 'ThemeDark'" :teleport="true"
                                            auto-apply locale="es" :min-date="new Date()" :rules="requiredRules">

                                            <template #action-preview="{ value }">
                                            </template>
                                            <template #dp-input="{ }">
                                                <v-btn class="btn-search-date" variant="tonal">
                                                    <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                                                    <span v-if="model.arrivalDate">{{
                                                        $dayjs(model.arrivalDate).format("DD/MM/YYYY HH:mm")
                                                    }}</span>
                                                    <span v-else> dd/mm/aa --:-- </span>
                                                </v-btn>
                                            </template>
                                        </VueDatePicker>
                                    </v-no-ssr>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>

        </v-form>

    </v-sheet>
</template>

<script setup>
import { useTheme } from 'vuetify'
const { requiredRules } = useFormRules();
const model = defineModel()
const valid = defineModel('valid')
const theme = ref(useTheme())
const originSearch = ref('')
const destinationSearch = ref('')
const store = useFlightsStore();
const { getAirports } = storeToRefs(store)
const refKey = ref(0)
let searchTimer = null;
watch(originSearch, (newSearch) => {
    clearTimeout(searchTimer);
    if (newSearch.length >= 3) {
        searchTimer = setTimeout(() => {
            store.fetchAirports(newSearch)
        }, 400);
    } else {
        clearTimeout(searchTimer);
    }
});

watch(destinationSearch, (newSearch) => {
    clearTimeout(searchTimer);
    if (newSearch.length >= 3) {
        searchTimer = setTimeout(() => {
            store.fetchAirports(newSearch)
        }, 400);
    } else {
        clearTimeout(searchTimer);
    }
});

const airlines = ref([])
const loadingAirlines = ref(false)
const airlineSearch = ref('')
watch(airlineSearch, (newSearch) => {
    clearTimeout(searchTimer);
    if (newSearch.length >= 2) {
        searchTimer = setTimeout(() => {
            getAirlines(newSearch);
        }, 400);
    } else {
        airlines.value = [];
        clearTimeout(searchTimer);
    }
});

const transfersStore = useTransfersStore()
async function getAirlines(query) {
    if (!loadingAirlines.value) {
        loadingAirlines.value = true;
        try {
            await useNuxtApp().$toast.promise(transfersStore.getAirlines(query), {
                error: 'Error al obtener los datos'
            });
            airlines.value = transfersStore.airlines.slice(0, 10);
        } catch (error) {

        } finally {
            loadingAirlines.value = false;
        }
    }
}

onMounted(() => {
    valid.value = true;
    refKey.value++
})

</script>
