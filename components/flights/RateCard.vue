<template>
    <v-card class="bg-background fill-height" elevation="0" flat width="467px">
        <v-card-text>

            <v-card variant="outlined" class="rate-card bg-foreground pa-2 fill-height" rounded="md">
                <flights-one-way-header :rate="rate" v-if="type == 1" />
                <flights-roundtrip-header :rate="rate" v-if="type == 2" />
                <flights-multiple-destinations-header :rate="rate" :index="index" v-if="type == 3" />

                <v-sheet class="pa-2">
                    <div v-for="(group, i) in  rate.AirItinerary.GroupDetails ">
                        <div class="mx-1 mt-2" v-if="type != 3">
                            <v-icon color="secondary" size="16">{{
                    group.GroupNumber ? 'mdi-airplane-landing' : 'mdi-airplane-takeoff' }}
                            </v-icon>
                            <span class="body-1 text-secondary ml-1 semi">{{ group.GroupNumber ? 'Vuelta' : 'Ida' }}
                            </span>
                        </div>
                        <div v-else class="mx-1 mt-2">
                            <v-icon color="secondary" size="16"> mdi-airplane-takeoff
                            </v-icon>
                            <span class="body-1 text-secondary ml-1 semi">Tramo {{ i + 1 }}
                            </span>
                        </div>
                        <div v-for="segment in  group.Segments " class="mt-1 segment-box">
                            <div>
                                <span class="body-2 semi text-secondary">{{ segment.OriginAirport.Code }} - {{
                    segment.DestinationAirport.Code }}</span>
                                <span class="body-2 text-secondary ml-2">{{ segment.CabinClass.Description }}</span>
                            </div>

                            <div v-if="segment.BaggageNewList.length > 0" id="baggage">

                                <span class="body-2 semi text-primary_text">
                                    Equipaje
                                </span>
                                <p class="body-2 semi" v-for="bag in segment.BaggageNewList"> 
                                    <v-icon size="12" >{{ bag.Name.toUpperCase().trim() == 'CARRY ON' ? 'md:luggage' : 'md:work' }}</v-icon> <span v-if="bag.Quantity">{{ bag.Quantity
                                        }}</span> {{ bag.Name.replace('-', '') }}
                                    <span v-if="bag.Information">{{ bag.Information }}</span>
                                </p>
                            </div>
                            <div v-if="segment.PenaltyRules.length">
                                <span class="body-2 semi text-primary_text">
                                    Políticas
                                </span>
                                <p class="d-flex body-3 mb-1 semi align-center text-primary_text"
                                    v-for="pr in segment.PenaltyRules">
                                    <v-icon class="mr-1" :color="prColor(pr.Value)" size="16"
                                        :icon="prIcon(pr.Value)"></v-icon>
                                    <span> {{ $t(`flights.${pr.Key}`) }}</span>
                                    <span class="ml-auto body-2" :class="`text-${prColor(pr.Value)}`">{{ $t(`flights.${pr.Value}`)
                                        }}</span>
                                </p>
                            </div>
                            <div v-if="rate.ServicesIncluded && rate.ServicesIncluded.length">
                                <span class="body-2 semi text-primary_text">
                                    Servicios incluidos
                                </span>
                                <p class="d-flex   mb-1 align-center justify-space-between text-primary_text"
                                    v-for="si in rate.ServicesIncluded.map(x => parseIncluded(x))">
                                    <span class="body-3 text-primary_text">
                                        <v-icon class="mr-1" :color="siColor(si.tag)" size="16"
                                            :icon="siIcon(si.tag)"></v-icon>
                                        {{ si.description }}
                                    </span>
                                    <span class="ml-auto body-2 si-tag" :class="`text-${siColor(si.tag)}`">
                                        {{ si.tag }}
                                    </span>
                                </p>
                            </div>
                            <div v-if="rate.SeatAllowance && rate.SeatAllowance.length">
                                <span class="body-2 semi text-primary_text">
                                    Selección de asientos
                                </span>
                                <p class="d-flex   mb-1 align-center justify-space-between text-primary_text"
                                    v-for="sa in rate.SeatAllowance">
                                    <span class="body-3 text-primary_text">
                                        <v-icon class="mr-1" :color="saColor(sa.Value)" size="16"
                                            :icon="saIcon(sa.Value)"></v-icon>
                                        {{ sa.Key }}
                                    </span>
                                    <span class="ml-auto body-2 si-tag" :class="`text-${saColor(sa.Value)}`">
                                        {{ sa.Value }}
                                    </span>
                                </p>
                            </div>

                        </div>
                    </div>

                </v-sheet>
                <v-sheet v-if="false">
                    <span class="body-1 semi text-primary_text">
                        Selección de asientos
                    </span>
                    <div v-for=" group  in  rate.AirItinerary.GroupDetails ">
                        <v-icon color="secondary" size="16">{{
                    group.GroupNumber ? 'mdi-airplane-landing' : 'mdi-airplane-takeoff' }}
                        </v-icon>
                        <span class="body-2 text-secondary ml-1 semi">{{ group.GroupNumber ? 'Vuelta' : 'Ida' }}
                        </span>
                        <div>

                        </div>
                        <v-divider></v-divider>
                    </div>
                </v-sheet>
                <v-sheet v-for=" group  in  rate.AirItinerary.GroupDetails">
                </v-sheet>
                <v-card-actions>
                    <v-btn rounded="md"  variant="flat" color="primary" style="width:100%" @click="select">
                        <span class="body-1 semi">Seleccionar</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-card-text>
    </v-card>
</template>

<script setup>
const props = defineProps(['rate', 'type', 'index', 'included'])

const emit = defineEmits(['close', 'selected'])
const prIcon = (value) => {
    switch (value) {
        case "NotAllowed": return 'md:cancel';
        case "WithoutCharge": return 'md:check_circle';
        case "WithCharge": return 'md:paid';
    }
}

const prColor = (value) => {
    switch (value) {
        case "NotAllowed": return 'error';
        case "WithoutCharge": return 'success';
        case "WithCharge": return 'accent';
    }
}

const siColor = (tag) => {
    if (!tag) tag = ''
    switch (tag.toUpperCase()) {
        case "CON COSTO": return 'accent';
        case '': return 'success';
        default: return 'info';
    }
}

const saColor = (tag) => {
    if (!tag) tag = ''
    switch (tag.toUpperCase()) {
        case "WITHCHARGE": return 'accent';
        case '': return 'success';
        default: return 'info';
    }
}

const saIcon = (tag) => {
    if (!tag) tag = ''
    switch (tag.toUpperCase()) {
        case "WITHCHARGE": return 'md:paid';
        case '': return 'md:check';
        default: return 'md:check';
    }
}

const siIcon = (tag) => {
    if (!tag) tag = ''
    switch (tag.toUpperCase()) {
        case "CON COSTO": return 'md:paid';
        case '': return 'md:check';
        default: return 'md:check';
    }
}

const parseIncluded = (inc) => {
    const regex = new RegExp(/^(?<desc>.*?)(\((?<tag>.*)\))?$/)
    if (regex.test(inc)) {
        const res = regex.exec(inc)
        return {
            description: res.groups['desc'],
            tag: res.groups['tag'] ? res.groups['tag'] : null
        }
    }
}

const select = () => {
    emit('selected')
}
</script>

<style>
.rate-card:hover {
    border: 1px solid rgb(var(--v-theme-primary)) !important;
}

.segment-box {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-theme-secondary_lighten_hover))
}

.si-tag {
    text-wrap: nowrap;
}
</style>