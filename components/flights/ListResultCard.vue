<template>
    <v-card flat rounded="lg" class="list-result-card fill-height" :id="commonService.Id">
        <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
            <v-col cols="9" :class="mode == 'list' ? 'pa-4' : 'px-4'">
                <v-row v-for="(group, index) in commonService.AirItinerary.GroupDetails">
                    <v-col>
                        <v-row align="center">
                            <v-col cols="12" class="body-1 d-flex justify-start align-baseline">
                                <div class="">
                                    <h4 class="mb-3 semi">Opción {{ index + 1 }}</h4>
                                </div>
                                <v-sheet class="border body-1 pa-2 ml-3" rounded="sm">
                                    <span class="body-1 semi">{{ group.GroupNumber ? 'Vuelta' : 'Ida' }}
                                        <v-icon color="secondary">{{
                                            group.GroupNumber ? 'mdi-airplane-landing' : 'mdi-airplane-takeoff' }}
                                        </v-icon></span>
                                    <span class="body-2  semi ml-2 mr-1">Duración</span>
                                    <span class="body-2 text-secondary_text"> {{ dayjs(group.TotalTime).format("H[hs], mm[min]") }}</span>
                                    <!-- <b class="bold ml-2 mr-1">Clase</b> {{ group.Segments[0].CabinClass.Description }} --> 
                                    <v-chip rounded="md" size="small" class="ml-2 bg-warning" v-if="commonService.IsNdc"><span class="v-z">NDC</span></v-chip>
                                </v-sheet>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-sheet class="bg-background py-4" rounded="md">
                                    <v-row no-gutters dense>
                                        <v-col cols="3" class="pl-3 pb-3 text-left">
                                            <v-img position="left" :src="group.Segments[0].MarketingAirline.UriImage"
                                                height="70"></v-img>
                                            <p class="body-3 text-secondary_text">
                                                {{ group.Segments[0].MarketingAirline.Name }}
                                            </p>
                                            <p class="body-3 text-secondary_text">
                                                Vuelo Nro {{ group.Segments[0].FlightNumber }}
                                            </p>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-sheet class="bg-transparent pa-3 d-flex flex-column align-items-center">
                                                <span class="text-secondary_text body-2">{{
                                                    dayjs(group.Segments[0].DepartureDateTime).format('DD/MM/YYYY')
                                                }}</span>
                                                <h3 class="semi text-secondary">{{
                                                    dayjs(group.Segments[0].DepartureDateTime).format('HH:mm a') }}</h3>
                                                <span class="body-3 text-secondary_text">{{
                                                    parseAirport(group.Segments[0].OriginAirport.Name , 35).airportName }}</span>
                                                <h4 class="semi secondary_text">{{
                                                    parseAirport(group.Segments[0].OriginAirport.Name).city }}</h4>
                                            </v-sheet>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-sheet class="bg-transparent pa-3 text-center">
                                                <span class="body-2 text-secondary_text">{{ group.Segments.length > 1 ?
                                                    `${group.Segments.length - 1} escalas` : 'Directo' }}
                                                </span>
                                                <v-row no-gutters dense class="mb-4" justify="center">
                                                    <v-col cols="4" class="mb-n1 d-flex justify-space-around">
                                                        <div class="d-flex" v-for="n in group.Segments.length - 1">
                                                            <svg height="6" width="6">
                                                                <circle cx="3" cy="3" r="3" fill="grey" />
                                                            </svg>
                                                        </div>
                                                    </v-col>
                                                    <v-col cols="12" class="d-flex justify-center">
                                                        <v-divider length="40"
                                                            class="border-opacity-100 d-flex justify-center" thickness="1"
                                                            color="grey">
                                                        </v-divider>
                                                    </v-col>

                                                </v-row>

                                                <template>
                                                </template>
                                                <v-btn rounded="md" size="small" variant="outlined" color="secondary"
                                                    @click="showItinerary(group)">
                                                    <template v-slot:prepend>
                                                        <v-icon icon="md:date_range" size="16"></v-icon>
                                                    </template>
                                                    <span>Ver itinerario</span>
                                                </v-btn>
                                                <v-dialog v-model="itineraryDialog" width="500">
                                                    <flights-air-itinerary :itinerary="groupCopy"
                                                        @close="itineraryDialog = false" />
                                                </v-dialog>
                                            </v-sheet>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-sheet class="bg-transparent pa-3 d-flex flex-column align-items-center">
                                                <span class="text-secondary_text body-2">{{
                                                    dayjs(group.Segments[group.Segments.length -
                                                        1].ArrivalDateTime).format('DD/MM/YYYY') }}</span>
                                                <h3 class="semi text-secondary">{{
                                                    dayjs(group.Segments[group.Segments.length -
                                                        1].ArrivalDateTime).format('HH:mm a') }}</h3>
                                                <span class="body-3 text-secondary_text">{{
                                                    parseAirport(group.Segments[group.Segments.length -
                                                        1].DestinationAirport.Name, 35).airportName, 35 }}</span>
                                                <h4 class="semi secondary_text">{{
                                                    parseAirport(group.Segments[group.Segments.length -
                                                        1].DestinationAirport.Name).city }}</h4>

                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

            </v-col>
            <v-col cols="3" class="pb-6">
                <v-card flat rounded="md" class="bg-warning_lighten fill-height ma-3 d-flex align-center">
                    <v-card-text class="body-1">
                        <v-row dense>
                            <v-col cols="12" class="text-center">
                                <span>{{ commonService.Occupancy.Adults }} Adultos</span>
                                <span v-if="commonService.Occupancy.Children">{{ commonService.Occupancy.Children }}
                                    Niños</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-space-between">
                                <span>Tarifa</span>
                                <div><span class="body-2">{{ commonService.Currency }}</span> <span class="semi">{{
                                    commonService.Amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })
                                }}</span></div>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-space-between">
                                <span>Impuestos</span>
                                <div><span class="body-2">{{ commonService.Currency }}</span> <span class="semi">{{
                                    commonService.Taxes.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })
                                }}</span></div>
                            </v-col>

                            <v-col cols="12" class="d-flex justify-space-between mt-3">
                                <h4 class="semi">Total</h4>
                                <span class="body-2 mr-n7">{{ commonService.Currency }}</span>
                                <h2 class="semi" style="font-size:20px">{{
                                    commonService.Total.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })
                                }}</h2>
                            </v-col>
                            <v-col cols="12" class="d-flex flex-column align-center">
                                <v-btn rounded="md" variant="flat" color="primary" style="width:100%"
                                    @click="$emit('openRates')">
                                    <span class="body-1 semi">Seleccionar</span>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>


    </v-card>
</template>

<script setup lang="ts">
const props = defineProps(['flightRoute', 'mode', 'index'])
import dayjs from 'dayjs'

const rateDialog = ref(false)
const itineraryDialog = ref(false)
const commonService = computed(() => {
    return props.flightRoute[0]
})

function parseAirport(input: string, x: number = Infinity) {
    const matches = /\((\w{3})-(.+)\)/.exec(input)
    const city = matches[1]
    let airportName = matches[2]

    if (airportName.length > x) {
        airportName = airportName.substring(0, x) + '...'
    }

    return { city, airportName }
}



const groupCopy = ref(null)
const showItinerary = (group) => {
    const copy = useDeepCopy(group)
    groupCopy.value = copy;
    itineraryDialog.value = true
}

function addToCart() {
    emit('addToCart', props.flightRoute.Id)
}

const emit = defineEmits(['addToCart', 'openRates'])

</script>
