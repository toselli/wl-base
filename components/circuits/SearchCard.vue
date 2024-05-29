<template>
    <v-card :rounded="compact ? 'lg' : 'md'" class="search-card" flat
        :class="compact ? 'mb-1 bg-transparent' : ' pa-4 bg-foreground'">
        <v-row dense no-gutters class="">
            <v-col cols="12" sm="10">
                <v-card :rounded="compact ? 'lg' : ''"
                    :class="compact ? 'pa-2 pa-md-1 mb-2 border-secondary bg-foreground' : 'bg-foreground'" flat>
                    <v-row class="align-center justify-space-between" dense>
                        <v-col cols="12" sm="5" :class="isMobile ? 'mt-3' : 'pr-2'">
                            <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                                <v-icon icon="mdi-map-marker" color="foreground" size="x-small"></v-icon>
                            </v-avatar><span class="body-1 semi" v-if="!compact">Ciudades</span>
                            <CircuitsCitiesSearch :compact="compact" :label="$capitalize($t('select_cities'))"
                                serviceType="3" :searchedCities="selectedCities"
                                @update:selectedCities="handleSelectedCities" />
                        </v-col>
                        <v-col cols="12" sm="4" :class="isMobile ? 'mt-3' : 'pr-2'">
                            <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                                <v-icon icon="mdi-map-marker-radius" color="foreground" size="x-small"></v-icon>
                            </v-avatar><span class="body-1 semi" v-if="!compact">Países</span>
                            <CircuitsCountriesSearch :compact="compact" :label="$capitalize($t('select_countries'))"
                                serviceType="3" :searchedCountries="selectedCountries"
                                @update:selectedCountries="handleSelectedCountries" />
                        </v-col>
                        <v-col cols="12" sm="3" :class="isMobile ? 'mt-3' : ''">
                            <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                                <v-icon icon="mdi-text-search-variant" color="foreground" size="x-small"></v-icon>
                            </v-avatar><span class="body-1 semi" v-if="!compact">Nombre o código del circuito</span>
                            <v-text-field hide-details clear-icon="mdi-close" class="autocomplete-search-places body-2"
                                :class="compact ? '' : 'mt-2'" no-filter placeholder="Ingrese el nombre o código"
                                :variant="(compact && !isMobile) ? 'tonal' : themed" :flat="compact && !isMobile"
                                density="compact" rounded clearable v-model="code" open-on-clear eager>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols="12" sm="2" :class="isMobile ? 'mt-3' : 'text-center'">
                <v-btn rounded="md" color="primary" :class="compact ? 'semi' : 'semi mt-3'" :block="isMobile"
                    :variant="compact ? 'tonal' : 'flat'" :size="compact ? 'large' : 'x-large'"
                    prepend-icon="mdi-magnify" @click="searchResults">
                    {{ $capitalize($t("search")) }}
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps(["compact", "nologo", "themed"])
const isMobile = useMobile()
const selectedCities = ref([])
const selectedCountries = ref([])
const code = ref('')
const route = useRoute();
const router = useRouter();
const store = useCircuitsStore();

const handleSelectedCities = (cities: any) => {
    selectedCities.value = cities;
}

const handleSelectedCountries = (cities: any) => {
    selectedCountries.value = cities;
}

onMounted(() => {
    if (route && route.query.code) {
        code.value = route.query.code as string;
    }
    if (route && route.query.cities) {
        const citiesIds = route.query.cities ? (route.query.cities as string).split(',') : []
        for (let id of citiesIds) {
            store.fetchCityData(id)
                .then((res) => {
                    if (res) {
                        selectedCities.value.push(res)
                    }
                })
        }
    }
    if (route && route.query.countries) {
        const countriesIds = route.query.countries ? (route.query.countries as string).split(',') : []
        for (let id of countriesIds) {
            store.fetchCountryData(id)
                .then((res) => {
                    if (res) {
                        selectedCountries.value.push(res)
                    }
                })
        }
    }
})

const searchResults = () => {
    let query =  {
            cities: encodeURI(selectedCities.value.map(x => x.Id).join(',')),
            countries: encodeURI(selectedCountries.value.map(x => x.Id).join(',')),
            code: code.value
        }
    //NUEVA BUSQUEDA DESDE RESULTS
    if (route.path == "/circuits/results") {
        router.replace({
            path: "/circuits/results",
            query: query
        }).then(() => {

        })
    }
    else {
        //BUSQUEDA NORMAL
        navigateTo({
            path: "/circuits/results",
            query: query
        })
    }
}
</script>