<template>
    <v-container class="content-container">
        <CommonSearch :compact="true" />
        <flights-filters :filters="flightsStore.features" @apply="getFilteredResults" v-if="flightsStore.features"
            @clear="clearFilters"></flights-filters>
        <v-row class="pb-0" v-if="getLoggedUser">
            <v-col cols="12" md="5">
                <h5 class="mt-2">Resultados de la búsqueda</h5>
                <p class="body-2 text-secondary_text" v-if="loading">
                    Buscando...
                </p>
                <p class="body-1 text-primary_text semi" v-if="Object.keys(filteredResults).length > 0">
                    Encontramos <span class="text-primary">{{ Object.keys(filteredResults).length }}</span> resultados

                </p>
                <p class="body-2 text-secondary_text" v-if="!loading && !Object.keys(filteredResults).length">
                    No hay resultados
                </p>
            </v-col>
            <v-col cols="12" md="7" :class="!isMobile ? 'text-right' : ''">
                <common-results-tools service-type="flights" :sorting="sorting" @update:order="order"
                    @update:prompt="$event => flightNumberSearch = $event"></common-results-tools>

            </v-col>
            <v-col>
                <v-btn-toggle v-if="flexMode && flightsStore.getMatrix && flightsStore.getMatrix.length"
                    v-model="selectedSystem" mandatory color="secondary" class="bg-foreground pa-1 mb-2 text-secondary"
                    density="compact" variant="flat" rounded="md" style="height:30px"
                    selected-class="btn-toggle-selected">
                    <v-btn size="small" rounded="sm" class="text-secondary" :value="_class"
                        v-for="_class in ['Sabre', 'NDC']">
                        {{ _class }}
                    </v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>
        <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-row class="py-2" v-if="getLoggedUser">
            <v-col cols="12">
                <v-skeleton-loader v-if="loading && useRoute().query.flex == 'true'" type="table-tbody"
                    class="list-result-loader mb-3">
                </v-skeleton-loader>
                <FlightsGrid class="mt-4" v-else-if="flightsStore.getMatrix && selectedSystem == 'NDC'"
                    v-model="flightsStore.getMatrix" v-model:selected="gridSelected" />
                <FlightsSabreGrid class="mt-4" v-else-if="flightsStore.getMatrix && selectedSystem == 'Sabre'"
                    v-model="flightsStore.getMatrix" v-model:selected="gridSelected">
                </FlightsSabreGrid>
                <v-skeleton-loader v-if="loading" v-for="n in 25" class="list-result-loader mt-4"
                    type="list-item-avatar-three-line">
                </v-skeleton-loader>
                <v-row :key="renderKey" v-else>
                    <v-col cols="12" v-for="(item, index) in filteredResults">
                        <flights-list-result-card :flightRoute="item" :mode="'list'" :index="index" :ref="item[0].Id"
                            :id="item[0].Id" @add-to-cart="goToCheckout"
                            @openRates="{ serviceSelected = item; rateDialog = true }"></flights-list-result-card>

                    </v-col>
                    <v-col cols="12" class="text-center" v-if="Object.keys(filteredResults).length > 0">
                        <v-btn variant="outlined" rounded="xl" @click="limitResults += 25" :loading="loadingMore">Ver
                            más
                            resultados</v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-navigation-drawer temporary class="rates-nav-drawer" v-model="rateDialog" location="right">
            <v-card flat class="bg-background">
                <v-card-title>
                    <h3 class="text-primary_text semi d-flex" style="font-size:20px">Selecciona la tarifa
                        para continuar
                        <v-icon icon="md:close" color="secondary_text" size="18" class="ml-auto ma-2"
                            @click="rateDialog = false"></v-icon>
                    </h3>
                </v-card-title>
                <v-card-subtitle class="body-1 d-flex mb-3" v-if="serviceSelected">
                    <span v-if="serviceSelected.length > 1">Tarifas disponibles</span>
                    <span v-else>Tarifa única</span>

                    <span v-if="serviceSelected.length > 1" class="ml-auto">{{ slideNumber + 1 }} de {{
            serviceSelected.length }}</span>
                </v-card-subtitle>
                <v-slide-group mandatory show-arrows class="d-flex justify-center fill-height slide-group">
                    <v-slide-group-item class="fill-height slide-item" v-for="(item, index) in serviceSelected"
                        :value="index">
                        <flights-rate-card class="mb-5" :rate="item" :index="index" @selected="goToCheckout(item.Id)"
                            :type="useRoute().query.flightType"></flights-rate-card>
                    </v-slide-group-item>

                    <template v-slot:next>
                        <v-btn icon :disabled="slideNumber == serviceSelected.length - 1" class="bg-transparent"
                            variant="flat" elevation="0" @click="slideNumber++">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </template>
                    <template v-slot:prev>
                        <v-btn icon :disabled="slideNumber == 0" class="bg-transparent" variant="flat" elevation="0"
                            @click="slideNumber--">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                    </template>
                </v-slide-group>
            </v-card>
        </v-navigation-drawer>
    </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouteLocationNormalized } from 'vue-router';
//MOBILEs

const route = useRoute()
const router = useRouter()
const isMobile = useMobile()
const rateDialog = ref(false)
const usersStore = useUsersStore();
const flightsStore = useFlightsStore();
const { getLoggedUser } = storeToRefs(usersStore);
const loading: Ref<boolean> = ref(true);
const renderKey = ref(0)
const gridSelected = ref('')
const serviceSelected = ref(null)
const selectedSystem = ref("NDC");
const slideNumber = ref(0)
const flexMode = ref(false)

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
}

const results = ref([])
const limitResults = ref(25)

const pageNumber = computed(() => {
    return limitResults.value / 25
})
const loadingMore: Ref<boolean> = ref(false);
watch(limitResults, (newValue, oldValue) => {
    if (newValue > oldValue) {
        loadingMore.value = true
        search();
    }
})

const search = async (newRoute?: RouteLocationNormalized) => {
    let route = useRoute()
    if (newRoute) route = newRoute;
    loading.value = true
    const occupancy = useOccupancies.parse(route.query.occupancies as string)
    const segments = useSegments();
    const search = {
        FlightType: route.query.flightType,
        ClassPref: route.query.classPref,
        Flex: flexMode.value,
        Occupancy: occupancy[0],
        Segments: segments,
        Residence: route.query.residence,
        Nationality: route.query.nationality,
        Currency: route.query.currency
    }
    const payload = {
        Language: "es",
        Search: search,
        Paging: { Page: pageNumber.value, PageSize: limitResults.value },
        Sorting: { PropertyName: "Total", Direction: "asc" },
        Features: filters.value,
    }

    try {
        await useNuxtApp().$toast.promise(flightsStore.search(payload, flexMode.value), {
            pending: 'Buscando vuelos',
            success: 'Datos obtenidos exitosamente',
            error: 'Error al obtener los datos'
        })
        results.value = flightsStore.getGrouped
        loading.value = false
    } catch (error) {
        loading.value = false
    } finally {
        loadingMore.value = false
        loading.value = false
    }

}

const flightNumberSearch = ref('')
const filteredResults = computed(() => {
    let filtered = []
    if (results.value) {

        filtered = results.value
        //todo: filtro de nº vuelos

    }

    return filtered;
})

const runtimeConfig = useRuntimeConfig()


const goToCheckout = async (serviceId: string) => {
    try {
        let services = {
            basketId: flightsStore.basketId,
            websiteId: runtimeConfig.public.websiteId,
            availUrl: window.location.href,
            selectedService: serviceId,
        }
        await useNuxtApp().$toast.promise(flightsStore.addService(services), {
            pending: 'Preparando todo para su reserva',
            error: 'Error al crear la reserva'
        })
        let routeQuery = {
            serviceType: 'flights',
            id: flightsStore.basketId,
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

watch(gridSelected, (newValue, oldValue) => {
    let element = document.getElementById(gridSelected.value);
    element.classList.remove('grid-selected')
    element.classList.add('grid-selected')
    element.scrollIntoView({ behavior: 'smooth' });
})


onBeforeRouteUpdate((to, from) => {
    if (from !== to) {
        flexMode.value = route.query.flex == 'true' ? true : false
        search(to)
    }
})

onMounted(() => {
    flexMode.value = route.query.flex == 'true' ? true : false
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

<style>
.rates-nav-drawer {
    height: 100% !important;
    top: 0 !important;
    z-index: 9999 !important;
    width: 580px !important;
}

.grid-selected {
    animation: glow 1s;

}

.card-scroll {
    overflow: hidden;
}

@keyframes glow {
    0% {
        border: 2px solid rgba(var(--v-theme-primary), .8);
    }

    25% {
        border: 2px solid rgba(var(--v-theme-primary), .6);
    }

    50% {
        border: 2px solid rgba(var(--v-theme-primary), .4);
    }

    75% {
        border: 2px solid rgba(var(--v-theme-primary), .2);
    }

    100% {
        border: 2px solid rgba(var(--v-theme-primary), .1);
    }
}


.slide-group {
    width: 570px !important;
    overflow: visible;
}

.v-slide-group__content {
    justify-content: center !important;
}

.slide-item {
    z-index: 0 !important;
}
</style>