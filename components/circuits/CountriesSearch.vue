<template>
    <v-menu :close-on-content-click="isMobile ? true : false" origin="overlap" v-model="menuSearch"
    :location="isMobile ? 'top' : 'bottom'" 
    :max-height="isMobile ? '' : '450'" :min-height="isMobile ? '750' : ''"
    :max-width="isMobile ? '360' : '380'" :min-width="isMobile ? '360' : '380'"> 
        <template v-slot:activator="{ props }">
            <v-btn class="btn-search-places btn-search-countries" :class="!compact ? 'mt-2' : ''" variant="tonal" v-bind="props">
                <template v-if="selectedCountries.length > 0">
                    <v-chip v-for="item in selectedCountries" size="small" closable class="mr-1"
                        @click:close="removeCountry(item)" :key="updateKey">
                        {{ item.Name }}
                    </v-chip>
                </template>
                <span class="text-secondary_text" v-else>{{ label }}</span>
            </v-btn>
        </template>
        <v-card rounded="md" class="card-search-places py-2">
            <v-card-title>
                <v-text-field autofocus variant="outlined" ref="searchField" :density="isMobile ? 'default' : 'compact'"
                    v-model="search" clearable
                    :placeholder="selectedCountries ? selectedCountries.Name : $capitalize($t('search_countries'))"
                    hide-details class="body-2"></v-text-field>
            </v-card-title>
            <v-skeleton-loader :loading="store.isLoadingPlaces" type="list-item-two-line, list-item-two-line">
                <v-card-text class="pa-0">
                    <v-list>
                        <v-list-item class="search-list-item" v-for="place in store.getCountries" :key="place.Id"
                            @click="selectCountry(place)">
                            <h4 class="body-1 semi text|-primary_text">
                                {{ place?.Name }}
                            </h4>
                        </v-list-item>
                    </v-list>
                    <div v-if="store.getCountries.length === 0">
                        <p class="px-6 py-2 body-3">{{ $t("no_result_type_3_chars") }}</p>
                        <v-list v-if="searchedCountries.length > 0">
                            <h4 class="mb-4 px-3">Última búsqueda</h4>
                            <v-list-item @click="selectCountries(searchedCountries)">
                                <v-chip v-for="item in searchedCountries" size="small" closable class="mr-1">
                                    {{ item.Name }}
                                </v-chip>
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
const props = defineProps(['compact', 'searchedCountries', 'label', 'length']);
const emit = defineEmits(['update:selectedCountries']);

const menuSearch = ref(false);
const search = ref('');
const selectedCountries = ref([]);
const store = useCircuitsStore();

const debouncedFetchCountries = debounce((newSearch) => {
    if (newSearch && newSearch.length >= 3) {
        store.countriesAutocomplete(newSearch)
            .then(() => {
                nextTick(() => {

                })
            })
    } if (newSearch == null) {
        store.clearCountries()
    }
}, 400);

watch(search, (newSearch) => {
    debouncedFetchCountries(newSearch);
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

watch(props.searchedCountries, (newSearch) => {
    if (props.searchedCountries.length > 0) {
        selectedCountries.value = props.searchedCountries
    }
});

function selectCountry(country) {
    selectedCountries.value.push(country)
    emit('update:selectedCountries', selectedCountries.value)
    menuSearch.value = false
    search.value = ''
}

function selectCountries(countries) {
    selectedCountries.value = countries
}
const updateKey = ref(0)
const removeCountry = (country) => {
    const index = selectedCountries.value.indexOf(country)

    if (index > -1) {
        selectedCountries.value.splice(index, 1)
    }
    nextTick().then(() => {
            updateKey.value ++
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