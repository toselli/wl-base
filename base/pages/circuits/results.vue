<template>
    <v-container class="content-container">
        <CommonSearch :compact="true" />
        <circuits-filters :filters="store.features" @apply="getFilteredResults" @clear="clearFilters"
            v-if="getLoggedUser && filteredResults.length > 0"></circuits-filters>
        <v-row class="py-2" v-if="getLoggedUser">
            <v-col cols="12" md="5">
                <div>
                    <h5>Resultados de la búsqueda</h5>
                    <p class="body-2 text-secondary_text" v-if="loading">
                        Buscando...
                    </p>
                    <p class="body-1 text-primary_text semi" v-if="!loading && filteredResults.length > 0">
                        Mostrando <span class="text-primary">{{ filteredResults?.length }}</span> de {{ totalServices }}
                        resultados encontrados
                    </p>
                    <p class="body-2 text-secondary_text" v-if="!loading && !filteredResults.length">
                        No hay resultados
                    </p>
                </div>
            </v-col>
            <v-col cols="12" md="7" :class="!isMobile ? 'text-right' : ''">
                <common-results-tools v-if="getResults.length > 0" service-type="circuits" :sorting="sorting"
                    @update:order="order" @update:prompt="$event => catalogNameSearch = $event" :loading="loading"
                    @update:viewMode="viewMode = $event" :orderType="activeOrderInfo" />
            </v-col>
        </v-row>
        <!-- FORZAR LOGIN --> <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-container v-if="getLoggedUser"  fluid class="pa-0 pt-2">
            <v-row v-if="filteredResults.length > 0" :key="renderKey">

                <v-col :cols="viewMode == 'list' ? 12 : 4" v-for="service in filteredResults">
                    <CircuitsListResultCard :service="service" :mode="viewMode" @selected="goToAvail">
                    </CircuitsListResultCard>
                </v-col>
                <v-col cols="12" class="text-center" v-if="!loading && filteredResults.length < totalServices">
                    <v-btn variant="outlined" rounded="xl" @click="limitResults += 25" :loading="loadingMore">
                        Mostrar más resultados
                    </v-btn>
                </v-col>
            </v-row>
            <!-- LOADER -->
            <v-skeleton-loader v-if="loading" class="list-result-loader mt-4" type="list-item-avatar-three-line">
            </v-skeleton-loader>
            <!-- SIN RESULTADOS -->
            <v-row class="mt-3" justify="center" v-if="filteredResults.length == 0 && !loading">
                <v-col cols="12" class="text-center">
                    <h3>No hemos podido encontrar circuitos disponibles con los parámetros de tu búsqueda</h3>
                    <v-img src="/base/img/services/no_results_circuits.png" width="280" class="my-10 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text  mt-5">Pruebe realizando otra búsqueda</h4>
                    <circuits-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup lang="ts">
import { CatalogsSearchRequest } from '~/interfaces/services/circuits/CatalogsSearch';

//#region SITE
const viewMode = ref("grid");
const isMobile = useMobile()
const loading = ref(true)
const loadingMore = ref(false)
const sorting = [{
    name: 'Precio',
    field: 'Total',
    icon: 'md:arrow_upward',
    direction: 'asc'
},
{
    name: 'Precio',
    field: 'Total',
    icon: 'md:arrow_downward',
    direction: 'desc'
}]
//#endregion

//LOGGED USER
const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);

//RESULTS

const store = useCircuitsStore();
const { getResults } = storeToRefs(store)
const { search } = store;
const totalServices = ref(null)
const catalogNameSearch = ref('')

const activeOrderInfo = ref({
    field: 'Total',  // Campo inicial para la ordenación
    direction: 'asc' // Dirección inicial
});

// Ajustamos filteredResults para que considere el ordenamiento
const filteredResults = computed(() => {
    const results = [...getResults.value]; // Hacemos una copia para no modificar el original
    const { field, direction } = activeOrderInfo.value;
    return results.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
});

const order = (orderInfo) => {
    activeOrderInfo.value = { ...orderInfo };  // Asegurarse de que se actualiza
};

const filters = ref([])
function getFilteredResults(payload) {
    filters.value = payload
}

function clearFilters() {
    if (filters.value) {
        filters.value = []
    }
}

watch(filters, (newValue, oldValue) => {
    if (newValue != oldValue) {
        searchResults()
    }
})

const renderKey = ref(0)
watch(filteredResults, () => {
    renderKey.value++;
})

const limitResults = ref(25)
watch(limitResults, (newValue, oldValue) => {
    if (newValue > oldValue) {
        searchResults();
    }
})
const pageNumber = computed(() => {
    return limitResults.value / 25
})

const searchResults = async (route?) => {
    if (!route) route = useRoute()
    loading.value = true
    let payload: CatalogsSearchRequest = {
        Search: {
            Search: route.query.code || '',
            DurationFrom: '1',
            DurationTo: '99',
            Currency: "USD",
            PriceFrom: "0",
            PriceTo: "99999",
            Nationality: "AR",
            Residence: "AR",
            Language: "es"
        },
        Paging: { Page: pageNumber.value, PageSize: 25 },
        Sorting: {
            PropertyName: "Total",
            Direction: "asc"
        }
    }

    payload.Search.cities = route.query.cities ? route.query.cities.split(',') : []
    payload.Search.countries = route.query.countries ? route.query.countries.split(',') : []

    try {
        await useNuxtApp().$toast.promise(search(payload), {
            pending: 'Buscando circuitos',
            success: 'Datos obtenidos exitosamente',
            error: 'Error al obtener los datos'
        })
        totalServices.value = store.totalServices

    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

onBeforeRouteUpdate((to, from) => {
    if (from !== to) {
        store.results = []
        searchResults(to)
    }
})

const router = useRouter();
const goToAvail = (catalogId) => {
    router.push({
        path: "/circuits/details",
        query: {
            catalogId: catalogId,
            basketId: store.basketId,
            currency: 'USD'
        }
    });
}

onMounted(() => {
    const loggedUser = getLoggedUser.value;

    if (loggedUser != null) {
        searchResults();
    } else {
        // Esperar a que el usuario se loguee
        const unwatch = watch(getLoggedUser, (newValue, oldValue) => {
            if (newValue != null) {
                searchResults();
                unwatch(); // Deja de observar una vez que el usuario se ha logueado
            }
        });
    }
});


</script>