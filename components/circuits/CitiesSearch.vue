<template>
    <v-menu :close-on-content-click="isMobile ? true : false" origin="overlap" v-model="menuSearch"
        :location="isMobile ? 'top' : 'bottom'" :max-height="isMobile ? '' : '450'" :min-height="isMobile ? '750' : ''"
        :max-width="isMobile ? '360' : '380'" :min-width="isMobile ? '360' : '380'">
        <template v-slot:activator="{ props }">
            <v-btn class="btn-search-places btn-search-cities" :class="!compact ? 'mt-2' : ''" variant="tonal"
                v-bind="props">
                <template v-if="selectedCities.length > 0">
                    <v-chip v-for="(item, i) in selectedCities" size="x-small" closable class="mr-1"
                        @click:close="removeCity(i)" :key="updateKey">
                        {{ item.Name }}</v-chip>
                </template>
                <span class="text-secondary_text" v-else>{{ label }}</span>
            </v-btn>
        </template>
        <v-card rounded="md" class="card-search-places py-2">
            <v-card-title>
                <v-text-field autofocus variant="outlined" ref="searchField" :density="isMobile ? 'default' : 'compact'"
                    v-model="search" clearable
                    :placeholder="selectedCities ? selectedCities.Name : $capitalize($t('search_cities'))" hide-details
                    class="body-2"></v-text-field>
            </v-card-title>
            <v-skeleton-loader :loading="store.isLoadingPlaces" type="list-item-two-line, list-item-two-line">
                <v-card-text class="pa-0">
                    <v-list>
                        <v-list-item class="search-list-item" v-for="city in store.getCities" :key="city.Id"
                            @click="selectCity(city)">
                            <h4 class="body-1 semi text-primary_text">
                                <v-icon class="mr-1" :icon="usePlaceIcon(city?.SmartSearchEnum)" size="sm">
                                </v-icon>
                                {{ city?.Name }}
                            </h4>
                        </v-list-item>
                    </v-list>
                    <div v-if="store.getCities.length === 0">
                        <p class="px-6 py-2 body-3">{{ $t("no_result_type_3_chars") }}</p>
                        <v-list v-if="searchedCities.length > 0">
                            <h4 class="mb-4 px-3">Última búsqueda</h4>
                            <v-list-item @click="selectCities(searchedCities)">
                                <h4 class="body-1 semi text-primary_text">
                                    <v-chip v-for="item in searchedCities">
                                        {{ item.Name }}</v-chip>
                                </h4>
                            </v-list-item>
                        </v-list>
                    </div>
                </v-card-text>
            </v-skeleton-loader>
        </v-card>
    </v-menu>
</template>
|


<script setup>
const isMobile = useMobile()
const props = defineProps(['compact', 'searchedCities', 'label', 'length']);
const emit = defineEmits(['update:selectedCities']);

const menuSearch = ref(false);
const search = ref('');
const selectedCities = ref([]);
const store = useCircuitsStore();

const debouncedFetchCities = debounce((newSearch) => {
    if (newSearch && newSearch.length >= 3) {
        store.citiesAutocomplete(newSearch)
            .then(() => {
                nextTick(() => {

                })
            })
    } if (newSearch == null) {
        store.places = []
    }
}, 400);

watch(search, (newSearch) => {
    debouncedFetchCities(newSearch);
});

watch(props.searchedCities, (newSearch) => {
    if (props.searchedCities.length > 0) {
        selectedCities.value = props.searchedCities
    }
});

const searchField = ref(null);

watchEffect(() => {
    if (menuSearch.value) {
        nextTick().then(() => {
            setTimeout(() => {
                searchField.value.focus();
            }, 100);
        });
    }
});

function selectCity(place) {
    selectedCities.value.push(place);
    emit('update:selectedCities', selectedCities.value);
    menuSearch.value = false
    search.value = ''
}

function selectCities(cities) {
    selectedCities.value = cities
}
const updateKey = ref(0)
const removeCity = (index) => {
    selectedCities.value.splice(index, 1)
    nextTick().then(() => {
        updateKey.value++
    });
}
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

</script>