<template>
    <v-container fluid class="content-container">
        <CommonSearch :compact="true" />
        <stays-filters :filters="features" v-if="features && getLoggedUser && !loadingResults"
            @apply="getFilteredResults" />
        <v-container fluid class="py-0 px-0">
            <v-row class="pb-2" v-if="getLoggedUser">
                <v-col cols="12" md="4">
                    <h5 class="mt-3" v-if="filteredResults.length > 0">
                        Encontramos <span class="text-primary">{{ filteredResults.length }}</span> resultados
                    </h5>
                    <h5 class="mt-3" v-if="!loadingResults && !isReceiving && results.length == 0">
                        No hay resultados
                    </h5>
                </v-col>
                <v-col cols="12" md="8" :class="!isMobile ? 'text-right' : ''">
                    <CommonResultsTools v-if="results.length > 0" :viewMode="viewMode" serviceType="stays"
                        :sorting="sorting" :loading="isReceiving" :showMap="showMap" :orderType="activeOrderInfo"
                        @showMapResults="showMapResults" @hideMapResults="hideMapResults" @update:order="orderResults"
                        @update:prompt="hotelName = $event" @update:viewMode="viewMode = $event" />
                </v-col>
            </v-row>
        </v-container>
        <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-container fluid class="px-0" v-if="getLoggedUser">
            <!-- RESULTADOS -->
            <v-row dense>
                <v-col :cols="showMap ? '7' : '12'" v-show="!expandedMap">
                    <v-row dense justify="center">
                        <v-col :lg="viewMode == 'list' ? 12 : (showMap ? 6 : 4)" cols="12"
                            :class="viewMode == 'list mb-1' ? 'pa-0' : ''" class="mb-2"
                            v-for="result in filteredResults.slice(0, limitResults)">
                            <stays-list-result-card :item="result" :mode="viewMode" @goTo="goToDetails(result)"
                                @goTotab="goToDetailsNewTab(result)"></stays-list-result-card>
                        </v-col>
                    </v-row>
                    <v-row dense justify="center">
                        <v-col v-if="isReceiving && results.length == 0"
                            class="mt-12 d-flex justify-center flex-column">
                            <v-progress-circular indeterminate color="primary" size="50"
                                class="mx-auto"></v-progress-circular>
                            <h3 class="text-center">
                                Buscando los mejores alojamientos en

                            </h3>
                            <h2 class="semi text-center pb-12">
                                {{ placeName }}
                            </h2>
                        </v-col>
                    </v-row>
                    <v-row v-if="limitResults < filteredResults.length">
                        <v-col>
                            <v-skeleton-loader type="list-item-avatar-three-line" class="rounded-lg list-result-card">
                            </v-skeleton-loader>
                        </v-col>
                    </v-row>
                    <v-row dense justify="center">
                        <div v-if="!loadingResults && filteredResults.length > limitResults" v-intersect="onIntersect">
                        </div>

                    </v-row>
                </v-col>
                <v-col v-if="showMap" :cols="expandedMap ? '12' : '5'">
                    <div class="sticky-container">
                        <stays-results-map-cluster class="sticky-card" :place="place" :results="filteredResults"
                            :filters="features" @goTo="goToDetailsNewTab" @goTotab="goToDetailsNewTab"
                            @expand="toggleExpandedMap" @update:prompt="hotelName = $event"
                            @update:filters="getFilteredResults" @hideMap="hideMapResults" />
                    </div>
                </v-col>
            </v-row>
            <StaysFinishSearchBottomSheet v-model="finishSearch" v-if="!loadingResults && !isReceiving" :results="filteredResults.length" @close="finishSearch = false" @orderResults="orderResults({
            field: 'Total',
            name: 'Precio',
            icon: 'md:arrow_upward',
            direction: 'asc'
        }); finishSearch = false"/>
            <v-row class="mt-3" justify="center"
                v-if="filteredResults && filteredResults.length == 0 && !isReceiving && !loadingResults">
                <v-col cols="12" class="text-center">
                    <h3 class="text-primary_text mb-4">No hemos podido encontrar hoteles que coincidan con tu búsqueda
                    </h3>
                    <v-img src="/base/img/services/no_results_stays.png" width="280" class="my-10 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text  my-8">Pruebe modificando los parámetros para obtener
                        resultados</h4>
                    <stays-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()
//LOGGED USER

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);

//LOGIN

onMounted(() => {
    const loggedUser = getLoggedUser.value;
    if (loggedUser != null) {
        getResults();
    } else {
        // Esperar a que el usuario se loguee
        const unwatch = watch(getLoggedUser, (newValue, oldValue) => {
            if (newValue != null) {
                getResults();
                unwatch(); // Deja de observar una vez que el usuario se ha logueado
            }
        });
    }
});


//RESULTS
const results = ref([]);
const viewMode = ref("list");
const hotelName = ref('')
const limitResults = ref(25)

const filteredResults = computed(() => {
    const activeFilters = filters.value
        .flat()
        .map(filter => {
            return {
                GroupName: filter.GroupName,
                SelectedFeatures: filter.Filters.map(f => f.Key),
            };
        });

    return results.value.filter(hotel => {
        const plainNameMatch = hotel.PlainName.toLowerCase().includes(hotelName.value.toLowerCase());

        if (activeFilters.length > 0) {
            const featuresMatch = activeFilters.every(activeFilter => {
                if (activeFilter.GroupName === 'feature.propertyCategory') {
                    const hotelCategory = hotel.Category.toFixed(2);
                    return hotelCategory && activeFilter.SelectedFeatures.includes(hotelCategory);
                } else {
                    return hotel.Features && Array.isArray(hotel.Features) && activeFilter.SelectedFeatures.every(feature => {
                        return hotel.Features.includes(feature);
                    });
                }
            });

            return plainNameMatch && featuresMatch;
        }
        return plainNameMatch;
    });
});

const intersecting = ref(false)

function onIntersect(isIntersecting, entries, observer) {
    intersecting.value = entries[0].intersectionRatio >= 0.5
    if (intersecting.value) {
        viewMoreResults()
    }
}

async function viewMoreResults() {
    if (loadingResults.value) return;
    limitResults.value = limitResults.value + 50
}

const finishSearch = ref(false)

//SEARCH
const route = useRoute();
const checkIn = ref(route.query.checkIn)
const checkOut = ref(route.query.checkOut)
const place = ref(route.query.id)
const placeName = computed(() => route.query.place)
const occupancies = ref([])

const loadingResults = ref(true);

const store = useStaysStore();

const isReceiving = computed(() => store.getReceiving);

watch(isReceiving, (newValue) => {
    if (newValue == false) {
        useNuxtApp().$toast.remove("searchingToast");
        finishSearch.value = true
    }
});

const nuxtConfig = useRuntimeConfig()

async function getResults() {
    occupancies.value = useOccupancies.parse(route.query.occupancies)
    finishSearch.value = false
    showMap.value = false
    expandedMap.value = false
    loadingResults.value = true;
    let paging = {
        Page: 1,
        PageSize: 120,
    }
    let sortingBy = {
        Direction: "asc",
        PropertyName: "Total",
    }
    let search = {
        CheckIn: checkIn.value,
        CheckOut: checkOut.value,
        Currency: "USD",
        House: false,
        Language: "es",
        Occupancies: occupancies.value,
        Nationality: "AR",
        Residence: "AR",
        Id: place.value,
    }
    let payload = {
        Paging: paging,
        Search: search,
        Sorting: sortingBy,
        Features: null
    }
    try {
        await store.suscribeSearch();
        await store.fetchResults(payload);
        useNuxtApp().$toast.info('Buscando los mejores precios', { autoClose: false, icon: "🚀", hideProgressBar: false, toastId: 'searchingToast', closeButton: false });
        results.value = store.getResults
        features.value = store.getFeatures
    } catch (error) {
        console.log(error);
    } finally {
        loadingResults.value = false
    }
}


//FILTERS
const features = ref([]);
const filters = ref([])

function getFilteredResults(payload) {
    filters.value = payload
}

//SORTING

const sorting = [
    {
        name: 'Precio: menor a mayor',
        icon: 'md:arrow_upward',
        field: 'Total',
        direction: 'asc'
    },
    {
        name: 'Precio: mayor a menor',
        icon: 'md:arrow_downward',
        field: 'Total',
        direction: 'desc'
    },
    {
        name: 'Popularidad',
        field: 'GuestRatingCount',
        direction: 'desc'
    },
    {
        name: 'Mejor calificado',
        field: 'GuestRatingAverage',
        direction: 'desc'
    }
]
const activeOrderInfo = ref({})

const orderResults = (orderInfo) => {
    activeOrderInfo.value = orderInfo
    const { field, direction } = orderInfo;
    results.value = results.value.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (direction === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
};

//MAP

const showMap = ref(false);
const expandedMap = ref(false);
function toggleExpandedMap() {
    expandedMap.value = !expandedMap.value
}

function showMapResults() {
    showMap.value = true
    expandedMap.value = true
}

function hideMapResults() {
    showMap.value = false
    expandedMap.value = false
}

//UPDATE

onBeforeRouteUpdate((to, from) => {
    if (to.query !== from.query) {
        checkIn.value = to.query.checkIn
        checkOut.value = to.query.checkOut
        place.value = to.query.id
        getResults();

    }
});

//DETAILS

const router = useRouter();

async function goToDetails(item) {
    await store.handleUnsubscribeResults()
    router.push({
        path: "/stays/details",
        query: {
            id: item.Id,
            checkIn: route.query.checkIn,
            checkOut: route.query.checkOut,
            currency: 'USD',
            occupancies: route.query.occupancies,
            placeid: place.value,
            place: route.query.place,
        },
        wait: false,
    });
}

async function goToDetailsNewTab(item) {
    const routeData = await new Promise((resolve) => {
        resolve(router.resolve({
            path: "/stays/details",
            query: {
                id: item.Id,
                checkIn: route.query.checkIn,
                checkOut: route.query.checkOut,
                currency: 'USD',
                occupancies: route.query.occupancies,
                placeid: place.value,
                place: route.query.place,
            },
            wait: false,
        }));
    });
    window.open(routeData.href, '_blank');
}
</script>

<style>
.sticky-container {
    position: sticky;
    top: 0;
    height: 100vh;
    /* Asegura que la columna pegajosa ocupe todo el alto de la vista */
    display: flex;
    justify-content: flex-end;
    /* Alinea la card a la derecha */
    align-items: flex-start;
    /* Alinea la card arriba */
}

.sticky-card {
    width: 100%;
    /* Asegura que la card tenga el ancho completo de la columna */
}

</style>