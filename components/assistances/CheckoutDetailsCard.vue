<template>
    <v-card flat rounded="lg" class=" fill-height pa-3 bg-background" :id="service.Id">
        <v-row dense no-gutters>
            <v-col cols="4">
                <v-sheet class="pa-4 rounded" rounded="lg">

                    <v-img :src="src" height="110px" class="mx-auto">
                    </v-img>
                </v-sheet>


            </v-col>
            <v-col class="px-4 pa-1">
                <v-row dense no-gutters>
                    <v-col>
                        <h4 class="semi mb-1">{{ service.Assistance.Product.Id }}</h4>
                        <v-sheet rounded class="border">
                            <v-row class="pa-2">
                                <v-col>
                                    <h3 class="body-2 bold">Origen</h3>
                                    <h3 class="body-2   text-secondary_text">{{ service.Assistance.Origin }}</h3>
                                </v-col>
                                <v-col cols=3 class="text-center">
                                    <v-icon icon="md:arrow_circle_right"></v-icon>
                                </v-col>
                                <v-col class="text-left">
                                    <h3 class="body-2 bold">Destino</h3>
                                    <h3 class="body-2  text-secondary_text">{{ service.Assistance.Destination.Value }}</h3>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="12" class="body-2">
                        <div>
                            <v-icon color="secondary_text" icon="md:person"></v-icon>
                            {{ service.Occupancy.Adults }} adultos ({{ service.Occupancy.AdultsAges.join(',') }} años)
                        </div>
                        <div>
                            <v-icon color="secondary_text" icon="md:mode_of_travel"></v-icon>
                            Tipo: {{ service.Assistance.TravelType }}
                        </div>
                    </v-col>
                </v-row>
            </v-col>

        </v-row>
    </v-card>
</template>

<script setup>
const props = defineProps(['services'])
const service = props.services[0]
const mode = 'list'
const runtimeConfig = useRuntimeConfig();
const src = runtimeConfig.public.ebookingCdn + 'providers/' + service.ProviderRef.Key + '.png'

function parseAirport(input) {
    const matches = /(.+?)\s?\((\w{3})-(.+)\)/.exec(input)
    const city = matches[1]
    const cityCode = matches[2]
    const airportName = matches[3]
    return { city, cityCode, airportName }
}

</script>