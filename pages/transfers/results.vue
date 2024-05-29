<template>
    <v-container class="content-container">
        <CommonSearch :compact="true" />
        <!-- <transfers-filters :filters="features" v-if="features" @apply="getFilteredResults" /> -->
        <v-row class="pb-0" v-if="getLoggedUser">
            <v-col cols="12" md="5">
                <h5 class="mt-2">Resultados de la búsqueda</h5>
                <p class="body-2 text-secondary_text" v-if="loading">
                    Buscando...
                </p>
                <p class="body-1 text-primary_text semi" v-if="results?.transfersIn?.length > 0">
                    Encontramos <span class="text-primary"> {{ results?.transfersIn?.length }}</span> resultados <span
                        v-if="results?.transfersOut?.length > 0"> para la ida y <span class="text-primary">{{ results?.transfersOut?.length }}</span> para la
                        vuelta</span>
                </p>
                <p class="body-2 text-secondary_text" v-if="!loading && results?.transfersIn?.length == 0">
                    No hay resultados
                </p>
            </v-col>
            <v-col cols="12" md="7" :class="!isMobile ? 'text-right' : ''">
                <CommonResultsTools v-if="results?.transfersIn?.length > 0" :viewMode="viewMode" serviceType="transfers" :hidePrompt="true"
                    :sorting="sorting" :loading="loading" @update:order="orderResults"
                        @update:prompt="transferName = $event" @update:viewMode="viewMode = $event" />
            </v-col>
        </v-row>
         <!-- FORZAR LOGIN -->
         <auth-force-login-card v-if="!getLoggedUser" />        
        <v-container v-if="getLoggedUser" fluid class="pa-0 mt-2">
            <!-- LOADER -->
            <v-skeleton-loader v-if="loading" v-for="n in limitResultsIn" class="list-result-loader mt-4"
                type="list-item-avatar-three-line">
            </v-skeleton-loader>
            <!-- RESULTADOS -->
            <v-btn color="primary" rounded="xl" variant="flat" v-if="goToCheckoutBtn" class="float-right mt-2"
                @click="goToCheckoutInOut">
                Ir a confirmar reserva
            </v-btn>
            <v-tabs v-model="resultTabs" color="primary" align-tabs="start" v-if="results?.transfersOut?.length">
                <v-tab :value="1">IDA <span class="body-3">({{ filteredResults?.transfersIn?.length }})</span></v-tab>
                <v-tab :value="2" v-if="route.query.departureDate">VUELTA <span class="body-3">({{
                    filteredResults?.transfersOut?.length }})</span></v-tab>
            </v-tabs>
            <v-window v-model="resultTabs">
                <v-window-item :value="1">
                    <v-container class="content-container" fluid >
                        <v-row dense  v-if="results?.transfersIn?.length > 1">
                            <v-col cols="12">
                                <v-row dense justify="center">
                                    <v-col :md="viewMode == 'list' ? 12 : 4" cols="12"
                                        :class="viewMode == 'list mb-1' ? 'pa-0' : ''" class="mb-2"
                                        v-for="result in filteredResults?.transfersIn.slice(0, limitResultsIn)">
                                        <transfers-list-result-card :item="result" :mode="viewMode"
                                            :transferMode="transferMode" @select="selectService('in', result)"
                                            @unselect="unselectService(result)" :selected.sync="isSelected(result.Id)"
                                            :class="hasId(result.Id) ? 'list-result-card-selected' : ''"
                                            @goTo="goToCheckoutIn"></transfers-list-result-card>
                                    </v-col>
                                    <v-col cols="3" class="text-center body-2"
                                        v-if="filteredResults?.transfersIn.length > 1 && !loadingMore">
                                        <span v-if="limitResultsIn < filteredResults?.transfersIn.length">{{ limitResultsIn
                                        }}</span>
                                        <span v-else>{{
                                            filteredResults?.transfersIn.length
                                        }}</span> de {{ filteredResults?.transfersIn.length }}
                                        <v-progress-linear :model-value="getProgressPercentageIn()" color="black"
                                            class="my-2"></v-progress-linear>
                                    </v-col>
                                    <v-col cols="12" class="text-center" v-if="!loading">
                                        <v-btn variant="outlined" rounded="xl" @click="viewMoreResultsIn"
                                            v-if="limitResultsIn < filteredResults?.transfersIn.length" :loading="loadingMore"> Mostrar más
                                            resultados</v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="mt-3" justify="center" v-if="filteredResults?.transfersIn?.length == 0 && !loading">
                            <v-col cols="12" class="text-center">
                                <h3>No hemos podido encontrar traslados con los parámetros de tu búsqueda</h3>
                                <v-img src="/base/img/services/no_results_transfers.png" width="280" class="my-10 mx-auto"></v-img>
                                <h4 class="body-1 semi text-secondary_text  mt-5">Pruebe realizando otra búsqueda</h4>
                                <transfers-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-window-item>
                <v-window-item :value="2">
                    <v-container class="content-container" fluid>
                        <v-row dense  v-if="filteredResults?.transfersOut?.length > 1">
                            <v-col cols="12">
                                <v-row dense justify="center">
                                    <v-col :md="viewMode == 'list' ? 12 : 4" cols="12"
                                        :class="viewMode == 'list mb-1' ? 'pa-0' : ''" class="mb-2"
                                        v-for="result in filteredResults?.transfersOut.slice(0, limitResultsOut)">
                                        <transfers-list-result-card :item="result" :mode="viewMode"
                                            :transferMode="transferMode" @select="selectService('out', result)"
                                            @unselect="unselectService(result)" :selected.sync="isSelected(result.Id)"
                                            :class="hasId(result.Id) ? 'list-result-card-selected' : ''"></transfers-list-result-card>
                                    </v-col>
                                    <v-col cols="3" class="text-center body-2"
                                        v-if="filteredResults?.transfersOut.length > 1 && !loadingMore">
                                        <span v-if="limitResultsOut < filteredResults?.transfersOut.length">
                                            {{ limitResultsOut }}</span>
                                        <span v-else>{{ filteredResults?.transfersOut.length }}</span>
                                        de {{ filteredResults?.transfersOut.length }}
                                        <v-progress-linear :model-value="getProgressPercentageOut()" color="black"
                                            class="my-2"></v-progress-linear>
                                    </v-col>
                                    <v-col cols="12" class="text-center" v-if="!loading">
                                        <v-btn variant="outlined" rounded="xl" @click="viewMoreResultsOut"
                                            v-if="filteredResults?.transfersOut.length > limitResultsOut">Mostrar más
                                            resultados</v-btn>
                                        <div v-if="loadingMore" class="text-center">
                                            <v-progress-circular indeterminate></v-progress-circular>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="mt-3" justify="center" v-if="filteredResults?.transfersOut?.length == 0 && !loading">
                            <v-col cols="12" class="text-center">
                                <h3>No hemos podido encontrar traslados con los parámetros de tu búsqueda</h3>
                                <v-img src="/base/img/services/no_results_transfers.png" width="280" class="mx-auto"></v-img>
                                <h4 class="body-1 semi text-secondary_text  mt-5">Pruebe realizando otra búsqueda</h4>
                                <transfers-search-card :compact="true" :noresults="true" class="mx-auto mt-2" />
                            </v-col>
                        </v-row>
                        <v-bottom-sheet v-model="goToCheckoutSheet" inset>
                            <v-card class="pt-4 px-8 pb-16 mb-n8" rounded="xl">
                                <v-card-text class="text-center">
                                    <h4 class="pb-6">¿Confirmar selección y continuar al checkout?</h4>
                                    <v-btn color="primary" variant="tonal" rounded="xl" class="px-12 mx-2"
                                        @click="goToCheckoutSheet = false">
                                        No, quiero cambiar mi selección
                                    </v-btn>
                                    <v-btn color="primary" rounded="xl" variant="flat" class="px-12"
                                        @click="goToCheckoutInOut">
                                        Si, confirmar y continuar
                                    </v-btn>
                                </v-card-text>
                            </v-card>
                        </v-bottom-sheet>
                    </v-container>
                </v-window-item>
            </v-window>
        </v-container>
    </v-container>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()


//LOGGED USER

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);


//RESULTS

const resultTabs = ref(1)
const results = ref();
const viewMode = ref("list");
const transferName = ref('')
const limitResultsIn = ref(60)
const limitResultsOut = ref(60)

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

const activeOrderInfo = ref({})

function orderResults(orderInfo) {
    activeOrderInfo.value = orderInfo
    const { field, direction } = orderInfo;
    results.value.transfersIn = results.value.transfersIn.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (direction === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
    results.value.transfersOut = results.value.transfersOut.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (direction === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
}


const filteredResults = computed(() => {
    let filtered = []
    if (results.value) {
        if (!transferName || !transferName.value) {
            filtered = results.value
        }
        switch (transferMode) {
            case 'in':
                filtered = results.value.transfersIn.filter((transfer) =>
                    transfer.Transfer.VehicleInfo.Description.toLowerCase().includes(transferName.value.toLowerCase()))
                break;
            case 'out': filtered = results.value.transfersOut.filter((transfer) =>
                transfer.Transfer.VehicleInfo.Description.toLowerCase().includes(transferName.value.toLowerCase()))
                break;
            default: break;
        }
    }

    return filtered;
});


function getProgressPercentageIn() {
    return (limitResultsIn.value / results?.value.transfersIn.length) * 100;
}

function getProgressPercentageOut() {
    return (limitResultsOut.value / results?.value.transfersOut.length) * 100;
}

function viewMoreResultsIn() {
    limitResultsIn.value = limitResultsIn.value + 60
}

function viewMoreResultsOut() {
    limitResultsOut.value = limitResultsOut.value + 60
}

const loadingMore = ref(false)


//SEARCH
const route = useRoute();
const occupanciesString = ref(route.query.occupancies)
const arrivalDate = ref(route.query.arrivalDate + ' ' + route.query.arrivalTime)
const arrivalPointData = ref({
    Count: 0,
    Id: route.query.arrivalPointDataId,
    Latitude: 0,
    Longitude: 0,
    Name: formatPointName(route.query.arrivalPointName),
    SmartSearchEnum: route.query.arrivalPointType,
})
const desinationPointData = ref({
    Count: 0,
    Id: route.query.destinationPointDataId,
    Latitude: 0,
    Longitude: 0,
    Name: formatPointName(route.query.destinationPointName),
    SmartSearchEnum: route.query.destinationPointType,
})
function formatPointName(name) {
    const parts = name.split(/[\s\-,()]+/);
    const formattedName = parts.map((part, index) => {
        if (index === 3) {
            return part;
        } else {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
    }).join(' ');

    return formattedName;
}
const place = ref(route.query.id)
const departureDate = ref(null)
const transferMode = ref(0)
if (route.query.departureDate && route.query.departureTime) {
    departureDate.value = route.query.departureDate + ' ' + route.query.departureTime
    transferMode.value = 1
}
const occupancies = ref({
    Adults: parseInt(occupanciesString.value.split(";")[0]),
    AdultsAges: Array(parseInt(occupanciesString.value.split(";")[0])).fill(30),
    Children: parseInt(occupanciesString.value.split(";")[1].split("**")[0]),
    ChildrenAges: [],
    Infants: 0,
    SeniorAges: [],
    Visible: true
});


const loading = ref(true);

const store = useTransfersStore();

async function getResults() {
    let search = {
        ArrivalPointData: arrivalPointData.value,
        DestinationPointData: desinationPointData.value,
        ArrivalDate: arrivalDate.value,
        DepartureDate: departureDate.value,
        Occupancy: occupancies.value,
        Language: "es",
        Currency: "USD",
        Nationality: "AR",
        Residence: "AR",
    }
    let payload = search
    loading.value = true
    try {
        await useNuxtApp().$toast.promise(store.search(payload), {
            pending: 'Buscando traslados',
            success: 'Datos obtenidos exitosamente',
            error: 'Error al obtener los datos'
        })
        results.value = store.results
        features.value = store.features
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

const { toTop } = useScroll();


onMounted(() => {
    const loggedUser = getLoggedUser.value;
    if (loggedUser != null) {
        getResults();
    } else {
        // Esperar a que el usuario se loguee
        const unwatch = watch(getLoggedUser, (newValue, oldValue) => {
            if (newValue != null) {
                getResults();
                unwatch();
            }
        });
    }
    toTop()
});

//FILTERS
const features = ref([]);
const filters = ref([])

//UPDATE

onBeforeRouteUpdate((to, from) => {
    if (to.query !== from.query) {
        occupanciesString.value = to.query.occupancies
        arrivalPointData.value = {
            Count: 0,
            Id: to.query.arrivalPointDataId,
            Latitude: 0,
            Longitude: 0,
            Name: formatPointName(to.query.arrivalPointName),
            SmartSearchEnum: to.query.arrivalPointType,
        }
        desinationPointData.value = {
            Count: 0,
            Id: to.query.destinationPointDataId,
            Latitude: 0,
            Longitude: 0,
            Name: formatPointName(to.query.destinationPointName),
            SmartSearchEnum: to.query.destinationPointType,
        }
        place.value = to.query.id
        occupancies.value = {
            Adults: parseInt(occupanciesString.value.split(";")[0]),
            AdultsAges: Array(parseInt(occupanciesString.value.split(";")[0])).fill(30),
            Children: parseInt(occupanciesString.value.split(";")[1].split("**")[0]),
            ChildrenAges: [],
            Infants: 0,
            SeniorAges: [],
            Visible: true
        }
        store.results = []
        getResults();
    }
});

//CHECKOUT

const nuxtConfig = useRuntimeConfig()

async function goToCheckoutIn(payload) {
    try {
        let services = {
            basketId: store.basketId,
            websiteId: nuxtConfig.public.websiteId,
            availUrl: window.location.href,
            selectedServices: payload.service,
            selectedSupplements: payload.supplements
        }
        await useNuxtApp().$toast.promise(store.addService(services), {
            pending: 'Preparando todo para su reserva',
            error: 'Error al crear la reserva'
        })
        let routeQuery = {
            serviceType: 'transfers',
            id: store.basketId,
            arrivalDate: route.query.arrivalDate,
            arrivalTime: route.query.arrivalTime,
            arrivalPointDataId: route.query.arrivalPointDataId,
            arrivalPointType: route.query.arrivalPointType,
            arrivalPointName: route.query.arrivalPointName,
            destinationPointDataId: route.query.destinationPointDataId,
            destinationPointType: route.query.destinationPointType,
            destinationPointName: route.query.destinationPointName,
            occupancies: route.query.occupancies
        }
        if (route.query.departureDate && route.query.departureTime) {
            routeQuery.departureDate = route.query.departureDate
            routeQuery.departureTime = route.query.departureTime
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

//IDA Y VUELTA

const servicesSelected = ref([])
const goToCheckoutSheet = ref(false)
const goToCheckoutBtn = ref(false)

function selectService(mode, item) {
    if (mode == 'in' && servicesSelected.value.length > 0) {
        // Si existe un elemento coincidente, reemplazarlo con el nuevo valor
        servicesSelected.value[0] = {
            mode: mode,
            id: item.Id,
            supplements: item.supplements
        };
    } else if (mode == 'out' && servicesSelected.value.length > 1) {
        // Si existe un elemento coincidente, reemplazarlo con el nuevo valor
        servicesSelected.value[1] = {
            mode: mode,
            id: item.Id,
            supplements: item.supplements
        };
    } else {
        // Si no hay coincidencia, agregar un nuevo elemento al array
        servicesSelected.value.push({
            mode: mode,
            id: item.Id,
            supplements: item.supplements
        });
    }
    if (mode == 'in') {
        resultTabs.value = 2
    } else {
        if (servicesSelected.value.length == 2) {
            goToCheckoutSheet.value = true
            goToCheckoutBtn.value = true
        } else {
            resultTabs.value = 1
        }
    }

}

function unselectService(item) {
    const index = servicesSelected.value.indexOf(item);
    servicesSelected.value.splice(index, 1)
    goToCheckoutSheet.value = false
    goToCheckoutBtn.value = false
}

function hasId(itemId) {
    return servicesSelected.value.some(item => item.id === itemId);
}

function isSelected(itemId) {
    return computed(() => {
        return servicesSelected.value.some(serviceSelected => {
            return serviceSelected.id == itemId;
        });
    });
}

const runtimeConfig = useRuntimeConfig()

async function goToCheckoutInOut() {
    try {
        let selectedSupplements = servicesSelected.value.reduce((result, item) => {
            const supplements = item.supplements.map(supplementId => ({
                Key: item.id,
                Value: supplementId
            }));
            return result.concat(supplements);
        }, []);
        let services = {
            basketId: store.basketId,
            websiteId: runtimeConfig.public.websiteId,
            availUrl: window.location.href,
            selectedServices: servicesSelected.value.map(item => item.id),
            selectedSupplements: selectedSupplements
        }
        await useNuxtApp().$toast.promise(store.addService(services), {
            pending: 'Preparando todo para su reserva',
            error: 'Error al crear la reserva'
        })
        let routeQuery = {
            serviceType: 'transfers',
            id: store.basketId,
            arrivalDate: route.query.arrivalDate,
            arrivalTime: route.query.arrivalTime,
            arrivalPointDataId: route.query.arrivalPointDataId,
            arrivalPointType: route.query.arrivalPointType,
            arrivalPointName: route.query.arrivalPointName,
            destinationPointDataId: route.query.destinationPointDataId,
            destinationPointType: route.query.destinationPointType,
            destinationPointName: route.query.destinationPointName,
            occupancies: route.query.occupancies
        }
        if (route.query.departureDate && route.query.departureTime) {
            routeQuery.departureDate = route.query.departureDate
            routeQuery.departureTime = route.query.departureTime

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

<style scoped>
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