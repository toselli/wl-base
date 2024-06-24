<template>
    <v-card flat rounded="lg">
        <v-card-title class="mb-n4">
            <div class="d-flex  justify-space-between">
                <h5>Itinerario</h5>
                <v-icon icon="md:close" @click="close"></v-icon>
            </div>
        </v-card-title>
        <v-card-text class="pa-1">
            <v-container>
                <v-row v-for="(segment, index) in itinerary.Segments">
                    <v-col cols="12">
                        <v-sheet class="bg-background" rounded="md">
                            <v-row no-gutters dense class="text-center mb-n4">
                                <v-col cols="4" class="pl-3 ml-3">
                                    <v-img :src="segment.MarketingAirline.UriImage" height="70"></v-img>
                                </v-col>
                                <v-col class="pa-3">
                                    <p class="body-3 text-secondary_text">Operado por</p>
                                    <p class="body-3  semi">
                                        {{ segment.OperatingAirline.Name }}
                                    </p>

                                </v-col>
                                <v-col class="pa-3">
                                    <p class="body-3 ">
                                        <span class="body-3 text-secondary_text"> Número de vuelo </span>
                                        <span class="semi">{{ segment.FlightNumber }}</span>
                                    </p>
                                    <!-- <p class="body-3 ">
                                        <span class="body-3 text-secondary_text"> Avión: </span>
                                        <span class="semi">{{ segment.Airplane }}</span>
                                    </p> -->
                                </v-col>
                            </v-row>
                            <v-row class="text-center" no-gutters dense align="baseline">
                                <v-col>
                                    <v-sheet class="bg-transparent pa-3 d-flex flex-column align-items-center">
                                        <span class="text-secondary_text body-2">{{
                                            dayjs(segment.DepartureDateTime).format('DD/MM/YYYY')
                                        }}</span>
                                        <h3 class="semi text-secondary">{{
                                            dayjs(segment.DepartureDateTime).format('HH:mm a') }}</h3>
                                        <h4 class="semi">{{
                                            parseAirport(segment.OriginAirport.Name).cityCode }}</h4>
                                        <span class="semi body-2 text-secondary_text">{{
                                            parseAirport(segment.OriginAirport.Name).airportName }}</span>
                                        <span class=" body-2 text-secondary_text">{{
                                            parseAirport(segment.OriginAirport.Name).city }}</span>

                                    </v-sheet>
                                </v-col>
                                <v-col cols="2" class="body-3">
                                    <div class="d-flex flex-column align-center">
                                        <p class="bold mb-1">
                                            Duración
                                        </p>
                                        <p>
                                            {{ dayjs('0001-01-01T' + segment.ElapsedTime).format('H[hs], mm[min]') }}
                                        </p>
                                    </div>

                                </v-col>
                                <v-col>
                                    <v-sheet class="bg-transparent pa-3 d-flex flex-column align-items-center">
                                        <span class="text-secondary_text body-2">{{
                                            dayjs(segment.ArrivalDateTime).format('DD/MM/YYYY') }}</span>
                                        <h3 class="semi text-secondary">{{
                                            dayjs(segment.ArrivalDateTime).format('HH:mm a') }}</h3>
                                        <h4 class="semi">{{
                                            parseAirport(segment.DestinationAirport.Name).cityCode }}</h4>
                                        <span class="semi body-2 text-secondary_text">{{
                                            parseAirport(segment.DestinationAirport.Name).airportName
                                        }}</span>
                                        <span class="body-2">{{
                                            parseAirport(segment.DestinationAirport.Name).city }}</span>

                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                    <v-col class="text-center">

                        <v-sheet rounded="sm" class="border border-dashed body-3 pa-2" v-if="index < itinerary.Segments.length - 1">
                            <v-icon size="12" icon="md:schedule"></v-icon>
                            <span class="semi"> Tiempo en espera</span>
                            {{ getWaitingTime(new Date(segment.ArrivalDateTime), new Date(itinerary.Segments[index +
                                1].DepartureDateTime)) }}
                        </v-sheet>
                        <v-sheet v-else rounded="sm" class="bg-background  body-3 pa-2">
                            <v-icon size="12" icon="md:schedule"></v-icon>
                            <span class="bold"> Duración total</span>
                            {{ totalTime }}
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
const dayjs = useDayjs()
const props = defineProps(['itinerary','totalTime'])

function parseAirport(input: string) {
    const matches = /(.+?)\s?\((\w{3})-(.+)\)/.exec(input)
    const city = matches[1]
    const cityCode = matches[2]
    const airportName = matches[3]
    return { city, cityCode, airportName }
}
const close = () => {
    emit('close')
}

const getWaitingTime = (arrival, nextDeparture) => {
    const miliseconds = Math.abs(arrival - nextDeparture)
    const diff = dayjs(miliseconds)
    const offset = diff.toDate().getTimezoneOffset()
    return diff.add(offset, 'minutes').format('H[hs], mm[min]')

}




const emit = defineEmits(['close'])
</script>