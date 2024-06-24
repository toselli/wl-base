<template>
    <v-container class="content-container">
        <CommonSearch :compact="true" />
        <CarsFilters :filters="features" v-if="features && getLoggedUser" @apply="getFilteredResults"
            @clear="clearFilters">
        </CarsFilters>
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
                <CommonResultsTools v-if="results?.length > 0" :viewMode="viewMode" serviceType="cars"
                    :sorting="sorting" :loading="loading" @update:order="order" @update:viewMode="viewMode = $event" @update:prompt="filterByName" />
            </v-col>
        </v-row>
        <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-container v-if="getLoggedUser" fluid class="pa-0 pt-2">
            <!-- RESULTADOS -->
            <v-row dense justify="center" :key="renderKey" v-if="filteredResults.length > 0">
                <v-col :md="viewMode == 'list' ? 12 : 4" cols="12" :class="viewMode == 'list' ? 'pa-0' : ''"
                    class="mb-2" v-for="result in filteredResults">
                    <CarsListResultCard :item="result" :mode="viewMode" @goTo="goToCheckout"></CarsListResultCard>
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
                    <h3>No hemos podido encontrar autos disponibles con los parámetros de tu búsqueda</h3>
                    <v-img src="/base/img/services/no_results_cars.png" width="280" class="my-10 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text  mt-5">Pruebe realizando otra búsqueda</h4>
                    <cars-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup lang="ts">
import { CarsSearch, CarsSearchPayload } from '~/interfaces/services/cars/search-payload';
import { CarFeature, CarService, CarsSearchResponse } from '~/interfaces/services/cars/search-response';

//MOBILEs
const isMobile = useMobile()

const viewMode = ref("list");
const priceOrder = ref("asc");
const renderKey = ref(0)
const carName = ref('')

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

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);

const results: Ref<CarService[]> = ref([])
const features: Ref<CarFeature[]> = ref([])
const limitResults = ref(25)

watch(limitResults, (newValue, oldValue) => {
    if (newValue > oldValue) {
        getResults();
    }
})

const filteredResults = computed(() => {
    let filtered = []
    if (results.value) {
        filtered = results.value
        filtered = results.value.filter((carService) =>
            carService.Car.VehicleDetail.VehicleName.toLowerCase().includes(carName.value.toLowerCase()))
    }
    return filtered;
});

watch(filteredResults, () => {
    renderKey.value++;
})

const loading: Ref<boolean> = ref(false);
const loadingMore: Ref<boolean> = ref(false);
const totalServices = ref(null)

//SEARCH
const route = useRoute();

let search: CarsSearch = null;

const composeSearch = () => {
    try {
        let newSearch: CarsSearch = {

            IsOnAirport: route.query.isOnAirport === 'true',
            PickUpDate: `${route.query.pickUpDate} ${route.query.pickUpTime}`,
            ReturnDate: `${route.query.returnDate} ${route.query.returnTime}`,
            Nationality: (route.query.nationality as string) || "AR",
            Residence: (route.query.residence as string) || "AR",
            Currency: (route.query.currency as string) || "USD",
            Language: (route.query.language as string) || "es",
            PickUpOffice: {
                Id: route.query.pickUpOfficeId as string,
                Name: route.query.pickUpOfficeId as string,
                SmartSearchEnum: 7,
                Count: 0,
                Latitude: 0,
                Longitude: 0
            }
        }

        if (newSearch && store.basketId) {
            newSearch.Token = store.basketId
        }

        if (route.query.returnOfficeId) {
            const returnOffice = {
                Id: route.query.returnOfficeId as string,
                Name: route.query.returnOfficeId as string,
                SmartSearchEnum: 7,
                Count: 0,
                Latitude: 0,
                Longitude: 0
            }
            newSearch.ReturnOffice = returnOffice;
        }

        search = newSearch;;
    }
    catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    const loggedUser = getLoggedUser.value;
    if (loggedUser != null) {
        composeSearch()
        getResults();
    } else {
        // Esperar a que el usuario se loguee
        const unwatch = watch(getLoggedUser, (newValue, oldValue) => {
            if (newValue != null) {
                composeSearch();
                getResults();
                unwatch();
            }
        });
    }
});

onBeforeRouteUpdate((to, from) => {
    if ((to.query !== from.query) && getLoggedUser.value != null) {
        store.results = []
        composeSearch()
        getResults();

    }
});

const pageNumber = computed(() => {
    return limitResults.value / 25
})

const store = useCarsStore();

const getResults = async () => {
    const paging = { Page: pageNumber.value, PageSize: 25 }
    const sorting = { PropertyName: "Total", Direction: "asc" }
    if (search && store.basketId) {
        search.Token = store.basketId;
    }
    const payload: CarsSearchPayload = {
        Search: search,
        Paging: paging,
        Sorting: sorting,
        Features: filters.value,

    }
    loading.value = true
    try {
        await useNuxtApp().$toast.promise(store.search(payload), {
            pending: 'Buscando autos',
            success: 'Datos obtenidos exitosamente',
            error: 'Error al obtener los datos'
        })
        results.value = store.results
        features.value = store.features
        totalServices.value = store.totalServices

    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
        loadingMore.value = false
    }

}


//#region FILTERS

const filterByName = (name: string) => {
    carName.value = name;
}

const filters = ref([])
function getFilteredResults(payload) {
    filters.value = payload
}

watch(filters, (newValue, oldValue) => {
    if (newValue != oldValue) {
        getResults()
    }
})

function clearFilters() {
    if (filters.value) {
        filters.value = []
    }
}

//#endregion

const runtimeConfig = useRuntimeConfig()

async function goToCheckout(payload) {
    try {
        let services = {
            basketId: store.basketId,
            websiteId: runtimeConfig.public.websiteId,
            availUrl: window.location.href,
            selectedService: payload.service,
        }
        await useNuxtApp().$toast.promise(store.addService(services), {
            pending: 'Preparando todo para su reserva',
            error: 'Error al crear la reserva'
        })
        let routeQuery = {
            serviceType: 'cars',
            id: store.basketId,
            serviceId: payload.service,
            isOnAirport: 'true',
            pickUpDate: route.query.pickUpDate,
            pickUpTime: route.query.pickUpTime,
            returnTime: route.query.returnTime,
            returnDate: route.query.returnDate,
            nationality: route.query.nationality,
            residence: route.query.residence,
            currency: route.query.currency,
            pickUpOfficeId: route.query.pickUpOfficeId,
            pickUpCityId: route.query.pickUpCityId,
            pickUpCityName: route.query.pickUpCityName,
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




</script>