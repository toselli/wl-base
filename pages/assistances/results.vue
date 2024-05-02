<template>
    <v-container class="content-container">        
        <CommonSearch :compact="true" />
        <assistances-filters :filters="store.features"  v-if="store.features && getLoggedUser" @apply="getFilteredResults"
                    @clear="clearFilters"></assistances-filters>
        <v-divider v-if="!isMobile"></v-divider>
        <v-row class="py-2" v-if="getLoggedUser">
            <v-col cols="12" md="5">
                <h5 class="mt-2">Resultados de la búsqueda</h5>
                <p class="body-2 text-secondary_text" v-if="loading">
                    Buscando...
                </p>
                <p class="body-1 text-primary_text semi" v-if="!loading && filteredResults.length > 0">
                    Mostrando <span class="text-primary">{{ filteredResults?.length }}</span> de {{ totalServices }} resultados encontrados
                </p>
                <p class="body-2 text-secondary_text" v-if="!loading && filteredResults?.length == 0">
                    No hay resultados
                </p>
            </v-col>
            <v-col cols="12" md="7" :class="!isMobile ? 'text-right' : ''">
                <common-results-tools service-type="assistances" :sorting="sorting" @update:order="order"
                    @update:prompt="filterSearch = $event"></common-results-tools>
            </v-col>
        </v-row>
         <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-container v-if="getLoggedUser" fluid class="pa-0 pt-2">
         <!-- RESULTADOS -->
                <v-row :key="renderKey" class="mt-3">
                    <v-col cols="12" v-for="(item, index) in filteredResults">
                        <assistances-list-result-card :service="item" :mode="'list'" :index="index"
                            @add-to-cart="goToCheckout"></assistances-list-result-card>
                    </v-col>
                    <v-col cols="12" class="text-center" v-if="!loading && totalServices > filteredResults.length">
                        <v-btn variant="outlined" rounded="xl" @click="limitResults += 25" :loading="loadingMore">Mostrar
                            más
                            resultados</v-btn>
                    </v-col>
                </v-row>
                 <!-- LOADER -->
            <v-skeleton-loader v-if="loading" class="list-result-loader mt-4" type="list-item-avatar-three-line">
            </v-skeleton-loader>
             <!-- SIN RESULTADOS -->
            <v-row class="mt-3" justify="center" v-if="filteredResults.length == 0 && !loading">
                <v-col cols="12" class="text-center">
                    <h3>No hemos podido encontrar asistencia disponibles con los parámetros de tu búsqueda</h3>
                    <v-img src="/img/no_results.png" width="280" class="my-10 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text  mt-5">Pruebe realizando otra búsqueda</h4>
                    <assistances-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                </v-col>
            </v-row>
        </v-container>
            

    </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import dayjs from "dayjs";

//MOBILEs
const isMobile = useMobile()
const usersStore = useUsersStore();
const store = useAssStore();
const { getLoggedUser } = storeToRefs(usersStore);
const loading: Ref<boolean> = ref(true);
const renderKey = ref(0)
const filterSearch = ref('')
const sorting = [
    {
        name: 'Precio',
icon: 'md:arrow_upward',
        field: 'Total',
        direction: 'asc'
    },
    {
        name: 'Precio',
icon: 'md:arrow_downward',
        field: 'Total',
        direction: 'desc'
    }]

const priceOrder = ref("asc");
function order($event) {
    switch ($event.direction) {
        case 'desc':
            {
                results.value = results.value.sort((a, b) => b.Total - a.Total);;
                priceOrder.value = 'desc'

            } break;

        case 'asc':
        default: {
            results.value = results.value.sort((a, b) => a.Total - b.Total);
            priceOrder.value = 'asc'
        }
            break;
    }
    renderKey.value++;
}

const results = ref([])
const limitResults = ref(25)
const loadingMore: Ref<boolean> = ref(false);
const totalServices = ref(null)

watch(limitResults, (newValue, oldValue) => {
    if (newValue > oldValue) {
        search();
    }
})
const pageNumber = computed(() => {
    return limitResults.value / 25
})


const search = async () => {
    loading.value = true
    const route = useRoute()
    const query = {
        DepartureDate: dayjs(route.query.departureDate as string).toISOString(),
        ArrivalDate: dayjs(route.query.arrivalDate as string).toISOString(),
        Origin: route.query.origin,
        Destination: route.query.destination,
        TravelType: decodeURI(route.query.travelType as string),
        Occupancy: useOccupancies.parse(route.query.occupancies as string)[0],
        Currency: "USD",
        Nationality: "AR",
        Residence: "AR",
        Language: "es"
    }
    const payload = {
        Search: query,
        Paging: { Page: pageNumber.value, PageSize: 25 },
        Sorting: { PropertyName: "Total", Direction: "asc" },
    }
    try {
        await useNuxtApp().$toast.promise(store.search(payload), {
            pending: 'Buscando asistencias',
            success: 'Datos obtenidos exitosamente',
            error: 'Error al obtener los datos'
        })
        results.value = store.results
        loading.value = false
        loadingMore.value = false
        totalServices.value = store.totalServices
    } catch (error) {
        loading.value = false
        loadingMore.value = false
    } finally {
        loading.value = false
        loadingMore.value = false
    }

}

const filteredResults = computed(() => {
    let filtered = []
    if (results.value) {
        if (!filterSearch || !filterSearch.value) {
            filtered = results.value
        }
        filtered = results.value.filter((service) =>
            service.ProductSingleName.toLowerCase().includes(filterSearch.value.toLowerCase()))
    }

    return filtered;
});

watch(filteredResults, () => {
    renderKey.value++;
})

const runtimeConfig = useRuntimeConfig()

const goToCheckout = async (serviceId: string) => {
    const route = useRoute()
    const router = useRouter()
    try {
        let services = {
            basketId: store.basketId,
            websiteId: runtimeConfig.public.websiteId,
            availUrl: window.location.href,
            selectedService: serviceId,
        }
        await useNuxtApp().$toast.promise(store.addService(services), {
            pending: 'Preparando todo para su reserva',
            error: 'Error al crear la reserva'
        })
        let routeQuery = {
            serviceType: 'assistances',
            id: store.basketId,
            serviceId: serviceId,
            currency: route.query.currency
        }

        navigateTo({
            path: "/checkout/",
            query: routeQuery
        });
    } catch (error) {
        console.log(error);
    } finally {
    }

}

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
        search()
    }
})

watch(results, () => {
    renderKey.value++;
})


onBeforeRouteUpdate((to, from) => {
    if (from !== to) {
        store.results = []
        search()
    }
})

onMounted(() => {
    const loggedUser = getLoggedUser.value;
    if (loggedUser != null) {
        search()
    } else {
        // Esperar a que el usuario se loguee
        const unwatch = watch(getLoggedUser, (newValue, oldValue) => {
            if (newValue != null) {
                search()
                unwatch();
            }
        });
    }
})

</script>