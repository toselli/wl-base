<template>
    <v-menu :close-on-content-click="isMobile ? true : false" origin="overlap" v-model="menuSearch"
        :location="isMobile ? 'top' : 'bottom'" :max-height="isMobile ? '' : '450'" :min-height="isMobile ? '750' : ''"
        :max-width="isMobile ? '360' : '380'" :min-width="isMobile ? '360' : '380'">
        <template v-slot:activator="{ props }">
            <v-btn class="btn-search-places" :class="!compact ? 'mt-2' : ''" variant="tonal" v-bind="props">
                <span class="text-primary_text" v-if="searchedPlace">
                    <v-icon :icon="usePlaceIcon(searchedPlace?.SmartSearchEnum)" size="sm">
                    </v-icon> {{ substringPlaceName(searchedPlace.Name) }}
                </span>
                <span class="text-primary_text" v-else-if="selectedPlace">
                    <v-icon :icon="usePlaceIcon(selectedPlace?.SmartSearchEnum)" size="sm">
                    </v-icon> {{ substringPlaceName(selectedPlace.Name) }}
                </span>
                <span class="text-secondary_text" v-else>{{ label }}</span>
            </v-btn>
        </template>
        <v-card rounded="md" class="card-search-places py-2" :class="isMobile ? 'full-height' : ''">
            <v-card-title>
                <v-text-field autofocus variant="outlined" ref="searchField" :density="isMobile ? 'default' : 'compact'"
                    v-model="search" clearable
                    :placeholder="selectedPlace ? selectedPlace.Name : $capitalize($t('where_are_you_going'))"
                    hide-details class="body-2"></v-text-field>
            </v-card-title>
            <v-skeleton-loader :loading="store.isLoadingPlaces" type="list-item-two-line, list-item-two-line">
                <v-card-text class="pa-0">
                    <v-list>
                        <v-list-item class="search-list-item" v-for="place in store.getPlaces" :key="place.id"
                            @click="selectPlace(place)">
                            <h4 class="body-1 semi text-primary_text">
                                <v-icon class="mr-1" :icon="usePlaceIcon(place?.SmartSearchEnum)" size="sm">
                                </v-icon>
                                {{ place?.Name.split(', ')[0] }}
                            </h4>
                            <h6 class="body-3 ml-5 text-secondary_text">{{ place?.Name.split(', ').slice(1).join(', ')
                                }}
                            </h6>
                        </v-list-item>
                    </v-list>
                    <div v-if="store.getPlaces.length === 0">
                        <p class="px-6 py-2 body-3">{{ $t("no_result_type_3_chars") }}</p>
                        <v-list v-if="searchedPlace">
                            <h4 class="mb-4 px-3">Última búsqueda</h4>
                            <v-list-item @click="selectPlace(searchedPlace)">
                                <h4 class="body-1 semi text-primary_text">
                                    <v-icon class="mr-1" :icon="usePlaceIcon(searchedPlace?.SmartSearchEnum)" size="sm">
                                    </v-icon>
                                    {{ searchedPlace?.Name.split(', ')[0] }}
                                </h4>
                                <h6 class="body-3 ml-5 text-secondary_text">
                                    {{ searchedPlace?.Name.split(',').slice(1).join(',') }}
                                </h6>
                            </v-list-item>
                        </v-list>
                        <v-list v-if="userPlacesSearched.length > 0 && serviceType == '0' || serviceType == '2'">
                            <h4 class="mb-4 px-3">Búsquedas anteriores</h4>
                            <v-list-item v-for="places in userPlacesSearched" @click="selectPlace(places)">
                                <h4 class="body-1 semi text-primary_text">
                                    <v-icon class="mr-1" :icon="usePlaceIcon(places.SmartSearchEnum)" size="sm">
                                    </v-icon>
                                    {{ places.Name.split(', ')[0] }}
                                </h4>
                                <h6 class="body-3 ml-5 text-secondary_text">
                                    {{ places.Name.split(',').slice(1).join(',') }}
                                </h6>
                            </v-list-item>
                        </v-list>
                        <v-list v-if="serviceType == '0' || serviceType == '2'">
                            <h4 class="mb-4 px-3">Top destinos</h4>
                            <v-list-item v-for="top in store.topPlaces" @click="selectPlace(top)">
                                <h4 class="body-1 semi text-primary_text">
                                    <v-icon class="mr-1" :icon="usePlaceIcon(top.SmartSearchEnum)" size="sm">
                                    </v-icon>
                                    {{ top.Name.split(', ')[0] }}
                                </h4>
                                <h6 class="body-3 ml-5 text-secondary_text">
                                    {{ top.Name.split(',').slice(1).join(',') }}
                                </h6>
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
const props = defineProps(['compact', 'serviceType', 'searchedPlace', 'label', 'length']);
const emit = defineEmits(['update:selectedPlace']);

const menuSearch = ref(false);
const search = ref('');
const selectedPlace = ref(null);
const store = usePlacesStore();

const substringPlaceName = (name) => {
    if (isMobile.value) {
        return name.substring(0, 45) + '...';
    }
    let length = 120
    if (props.length) {
        length = props.length
    }
    if (name.length <= length) {
        return name;
    }

    return name.substring(0, length) + '...';
};

const debouncedFetchPlaces = debounce((newSearch) => {
    if (newSearch && newSearch.length >= 3) {
        store.fetchPlaces(newSearch, props.serviceType)
            .then(() => {
                nextTick(() => {

                })
            })
    } if (newSearch == null) {
        store.places = []
    }
}, 400);

watch(search, (newSearch) => {
    debouncedFetchPlaces(newSearch);
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

const { updateUserConfig } = useUserConfig()
const configStore = useConfigStore()
const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);
const userPlacesSearched = computed(() => configStore.getConfig?.lastPlacesSearched || []);

async function selectPlace(place) {
    selectedPlace.value = place;
    emit('update:selectedPlace', place);
    menuSearch.value = false;
    search.value = '';
    if (getLoggedUser.value) {
        const filteredPlaces = userPlacesSearched.value.filter(p => p.Id !== place.Id);
        
        const updatedPlaces = [place, ...filteredPlaces];
        
        const placesLimited = updatedPlaces.slice(0, 5);
        
        userPlacesSearched.value = placesLimited;
        
        await updateUserConfig(getLoggedUser.value.IdString, { lastPlacesSearched: placesLimited });
    }
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