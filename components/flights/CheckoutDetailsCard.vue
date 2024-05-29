<template>
    <v-card flat rounded="lg" class="list-result-card fill-height" elevation="0" :id="service.Id">
        <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
            <v-col cols="12">
                <v-row v-for="group in service.AirItinerary.GroupDetails">
                    <v-col>
                        <v-row>
                            <v-col cols="12">
                                <v-sheet class="bg-background rounded">
                                    <v-row>
                                        <v-col class="pl-3 ml-3 pb-3 mb-n4">
                                            <v-img :src="group.Segments[0].MarketingAirline.UriImage" height="70"></v-img>
                                        </v-col>
                                    </v-row>
                                    <v-row no-gutters dense class="text-center" align="baseline">
                                        <v-col>
                                            <v-sheet class="bg-transparent pa-3 d-flex flex-column align-items-center">
                                                <span class="text-secondary_text body-1">{{
                                                    dayjs(group.Segments[0].DepartureDateTime).format('DD/MM/YYYY')
                                                }}</span>
                                                <span class="bold text-secondary">{{
                                                    dayjs(group.Segments[0].DepartureDateTime).format('HH:mm a') }}</span>
                                                
                                                <span class="bold body-1">{{
                                                    parseAirport(group.Segments[0].OriginAirport.Name).city }}</span>

                                            </v-sheet>
                                        </v-col>
                                        <v-col cols="1" class="d-flex flex-column align-self-center">
                                            <v-icon style="transform: rotate(45deg);">mdi-airplane</v-icon>
                                        </v-col>
                                        <v-col>
                                            <v-sheet class="bg-transparent pa-3 d-flex flex-column align-items-center">
                                                <span class="text-secondary_text body-1">{{
                                                    dayjs(group.Segments[group.Segments.length -
                                                        1].ArrivalDateTime).format('DD/MM/YYYY') }}</span>
                                                <span class="bold text-secondary">{{
                                                    dayjs(group.Segments[group.Segments.length -
                                                        1].ArrivalDateTime).format('HH:mm a') }}</span>
                                                <span class="bold body-1">{{
                                                    parseAirport(group.Segments[group.Segments.length -
                                                        1].DestinationAirport.Name).city }}</span>

                                            </v-sheet>
                                        </v-col>
                                    </v-row>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
const dayjs = useDayjs()
const props = defineProps(['services'])
const service = props.services[0]
const mode = 'list'
function parseAirport(input) {
    const matches = /(.+?)\s?\((\w{3})-(.+)\)/.exec(input)
    const city = matches[1]
    const cityCode = matches[2]
    const airportName = matches[3]
    return { city, cityCode, airportName }
}

</script>