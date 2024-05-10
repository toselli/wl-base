<template>
    <v-card class="bg-background" flat rounded="md">
        <v-card-text class="px-2 py-0">
            <v-sheet class="my-2 body-1 pa-2" rounded="md" v-for="group in rate.AirItinerary.GroupDetails ">
                <v-icon color="secondary" size="16">{{
                    group.GroupNumber ? 'mdi-airplane-landing' : 'mdi-airplane-takeoff' }}
                </v-icon>
                <span class="body-2 text-secondary ml-1 semi">{{ group.GroupNumber ? 'Vuelta' : 'Ida' }}
                </span> 
                <div v-if="group.AllSegmentsSameFare">
                    <p class="semi mt-1 text-primary_text" style="font-size:16px">
                        {{ group.Segments[0].CabinClass.Description }}
                    </p>
                </div>
                <div v-else>
                    <v-row no-gutters class="semi mt-1 text-primary_text" style="font-size:16px"
                        v-for="segment in group.Segments">
                        <v-col cols="8">
                            <span class="body-1 semi mr-2"> {{ segment.CabinClass.Description }}</span>
                            <span class="body-3 text-secondary_text ml-auto">{{
                                segment.OriginAirport.Code }}/{{ segment.DestinationAirport.Code }}</span>
                        </v-col>
                    </v-row>
                </div>
            </v-sheet>
            <v-row dense class="mb-2 px-1">
                <v-col cols="6" class="text-left body-2 semi text-secondary_text ">
                    <span>{{ rate.Occupancy.Adults }} adultos</span>

                    <span v-if="rate.Occupancy.Children">{{ rate.Occupancy.Children }}
                        niños</span>
                </v-col>
                <v-col cols="6" class="d-flex justify-end">
                    <div> <span class="body-2">{{
                        rate.Amount.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            style: 'currency',
                            currency: rate.Currency
                        })
                    }}</span></div>
                </v-col>
                <v-col cols="6" class="text-left body-2 semi text-secondary_text">
                    <span>Impuestos</span>

                </v-col>
                <v-col cols="6">
                    <div><span class="body-2 d-flex justify-end"> {{
                        rate.Taxes.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            style: 'currency',
                            currency: rate.Currency
                        })
                    }}</span></div>
                </v-col>

                <v-col cols="3">
                    <h4 class="body-1 semi">Total</h4>

                </v-col>
                <v-col cols="9">
                    <div class="d-flex justify-end align-center">
                        <span class="body-3 mr-1">{{ rate.Currency }}</span>
                        <h2 class="semi" style="font-size:24px">{{
                            rate.Total.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                style: 'currency',
                                currency: rate.Currency
                            })
                        }}</h2>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>

    </v-card>
</template>


<script setup>
const props = defineProps(['rate'])

const areAllClassesEqual = (segments) => {
    let equal = segments.length == 1;
    equal = equal || segments.every((val, i, arr) => val.CabinClass.Code === arr[0].CabinClass.Code)
    return equal;
}
</script>