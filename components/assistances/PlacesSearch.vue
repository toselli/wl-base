<template>
    <v-menu :close-on-content-click="isMobile ? true : false" origin="overlap" v-model="menuSearch"
        :location="isMobile ? 'top' : 'bottom'" :max-height="isMobile ? '' : '450'" :min-height="isMobile ? '750' : ''"
        :max-width="isMobile ? '360' : '380'" :min-width="isMobile ? '360' : '380'">
        <template v-slot:activator="{ props }">
            <v-btn class="btn-search-places" :class="!compact ? 'mt-2' : ''" variant="tonal" v-bind="props">
                <span class="text-primary_text" v-if="origin && selectedPlace">
                    <country-flag :country='selectedPlace?.code.toLowerCase()' size='small' />
                    <span class="mt-n1"> {{ selectedPlace.es }}</span>
                </span>
                <span class="text-primary_text" v-else-if="!origin && selectedPlace">
                    <v-icon size="small" icon="mdi-map-marker"></v-icon>
                    {{ selectedPlace.Name }}
                </span>
                <span class="text-secondary_text" v-else>{{ label }}</span>
            </v-btn>
        </template>
        <v-card rounded="md" class="card-search-places py-2">
            <v-card-title v-if="origin">
                <v-text-field autofocus variant="outlined" ref="searchField" :density="isMobile ? 'default' : 'compact'"
                    v-model="searchOrigin" clearable
                    :placeholder="selectedPlace ? selectedPlace.Name : $capitalize($t('search_country_origin'))"
                    hide-details class="body-2"></v-text-field>
            </v-card-title>
            <v-card-title v-else>
                <v-text-field autofocus variant="outlined" ref="searchField" :density="isMobile ? 'default' : 'compact'"
                    v-model="searchDestination" clearable
                    :placeholder="selectedPlace ? selectedPlace.Name : $capitalize($t('destination_place'))"
                    hide-details class="body-2"></v-text-field>
            </v-card-title>
            <v-skeleton-loader :loading="store.isLoadingPlaces" type="list-item-two-line, list-item-two-line" v-if="origin">
            <v-card-text class="pa-0" v-if="origin">
                <v-list>
                    <v-list-item class="search-list-item" v-for="place in filteredOrigins" :key="place.id"
                        @click="selectPlace(place)">
                        <h4 class="body-2 semi text-primary_text">
                            <country-flag :country='place.code.toLowerCase()' size='small' />
                           <span>{{ place.es }}</span> 
                        </h4>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-skeleton-loader>
            <v-skeleton-loader :loading="store.isLoadingPlaces" type="list-item-two-line, list-item-two-line" v-else>
                <v-card-text class="pa-0">
                    <v-list>
                        <v-list-item class="search-list-item" v-for="place in filteredDestinations" :key="place.Id"
                            @click="selectPlace(place)">
                            <h4 class="body-2 semi text-primary_text">
                                <v-icon size="x-small" icon="mdi-map-marker"></v-icon>
                                {{ place.Name }}
                            </h4>
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-skeleton-loader>
        </v-card>
    </v-menu>
</template>

<script setup>
const isMobile = useMobile()
const props = defineProps(['compact', 'origin', 'selectedPlace', 'label']);
const emit = defineEmits(['update:selectedPlace']);
const searchField = ref(null);
const menuSearch = ref(false);
const searchOrigin = ref('');
const searchDestination = ref('');
const store = useAssStore();


watchEffect(() => {
    if (menuSearch.value) {
        nextTick().then(() => {
            setTimeout(() => {
                searchField.value.focus();
            }, 100);
        });
    }
});

const filteredOrigins = computed(() => {
    if (searchOrigin.value) {
        return store.getOrigins.filter(place =>
            place.es.toLowerCase().includes(searchOrigin.value.toLowerCase())
        );
    }
    return store.getOrigins;
});

const filteredDestinations = computed(() => {
    if (searchDestination.value) {
        return store.getDestinations.filter(place =>
            place.Name.toLowerCase().includes(searchDestination.value.toLowerCase())
        );
    }
    return store.getDestinations;
});


onMounted(() => {
    const route = useRoute();
    if (!props.origin) {
        store.fetchDestinations()
            .then(() => {
                if (route.query.destination) {
                    let place = {
                        Name: route.query.destination
                    }
                    selectPlace(place)
                }

            });
    } else {
        if (route.query.origin) {
            let place = {
                code: route.query.origin,
                es: route.query.originName
            }
            selectPlace(place)
        }
    }

})

function selectPlace(place) {
    emit('update:selectedPlace', place);
    menuSearch.value = false;
}
</script>