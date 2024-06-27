<template>
    <v-container class="content-container">
        <CommonSearch :compact="true" />
        <!-- <circuits-filters :filters="store.features" @apply="getFilteredResults" @clear="clearFilters"
            v-if="getLoggedUser && filteredResults.length > 0"></circuits-filters>  -->
        <v-row dense v-if="getLoggedUser">
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
                    @update:order="order" @update:prompt="$event => serviceName = $event" :loading="loading"
                    @update:viewMode="viewMode = $event" :orderType="activeOrderInfo" />
            </v-col>
        </v-row>
        <!-- FORZAR LOGIN --> <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-container v-if="getLoggedUser"  fluid class="pa-0 pt-2">
            <v-row v-if="filteredResults.length > 0" :key="renderKey">

                <v-col :cols="viewMode == 'list' ? 12 : 4" v-for="service in filteredResults">
                    <SightseeingListResultCard :service="service" :mode="viewMode" @selected="goToAvail">
                    </SightseeingListResultCard>
                </v-col>
                <v-col cols="12" class="text-center" v-if="!loading && filteredResults.length < totalServices">
                    <v-btn variant="outlined" rounded="xl" @click="limitResults += 24" :loading="loadingMore">
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
                    <h3>No hemos podido encontrar atracciones disponibles con los parámetros de tu búsqueda</h3>
                    <v-img src="/base/img/services/no_results_sightseeing.png" width="280" class="my-10 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text  mt-5">Pruebe realizando otra búsqueda</h4>
                    <sightseeing-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup lang="ts">

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

const store = useSightseeingStore();
const { getResults } = storeToRefs(store)
const { search, clearSearch } = store;
const totalServices = ref(null)
const serviceName = ref('')

const activeOrderInfo = ref({
    field: 'Total',  // Campo inicial para la ordenación
    direction: 'asc' // Dirección inicial
});

const filteredResults = computed(() => {
    const results = [...getResults.value]; // Hacemos una copia para no modificar el original
    const { field, direction } = activeOrderInfo.value;
    const filtered = results.filter(item => item.Title.toLowerCase().includes(serviceName.value.toLowerCase()));
    return filtered.sort((a, b) => {
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
    store.clearSearch()
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

const limitResults = ref(24)
watch(limitResults, (newValue, oldValue) => {
    if (newValue > oldValue) {
        searchResults();
    }
})
const pageNumber = computed(() => {
    return limitResults.value / 24
})

const searchResults = async (route?) => {
    // if (!route) route = useRoute()
    // loading.value = true
    // let payload = {
    //     cityId:  route.query.destinationId || '',
    //     Paging: { Page: pageNumber.value, PageSize: 24 },
    //     Sorting: {
    //         PropertyName: "Total",
    //         Direction: "asc"
    //     },
    //     Features: filters.value
    // }
    // try {
    //     await useNuxtApp().$toast.promise(search(payload), {
    //         pending: 'Buscando circuitos',
    //         success: 'Datos obtenidos exitosamente',
    //         error: 'Error al obtener los datos'
    //     })
    //     totalServices.value = store.totalServices

    // } catch (error) {
    //     console.log(error);
    // } finally {
    //     loading.value = false
    //     loadingMore.value = false
    // }
}

onBeforeRouteUpdate((to, from) => {
    if (from !== to) {
        store.results = []
        searchResults(to)
    }
})

const router = useRouter();
const goToAvail = (productCode) => {
    let route = useRoute()
    router.push({
        path: "/sightseeing/details",
        query: {
            productCode: productCode,
            destinationId: route.query.destinationId,
            destinationName: route.query.destinationName
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