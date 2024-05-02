<template>
    <v-form v-model="valid">
        <v-card flat class="bg-background pa-5" elevation="0">
            <v-row dense no-gutters align=center justify=center>
                <v-col cols="9">
                    <v-expansion-panels flat>
                        <v-expansion-panel rounded="md" class="bg-midground">
                            <v-expansion-panel-title>
                                <span> Traslado de ida </span>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text class="bg-midground rounded-md">
                                <v-select :items="service.Catalog.TransferOptionsIn" bg-color="foreground"
                                    base-color="secondary_text" density="compact" v-model="transferInMode"
                                    variant="outlined" rounded="md" return-object>
                                    <template v-slot:item="{ item, props }">
                                        <div class="pa-3   text-secondary_text" v-bind="props">
                                            {{ item.raw.Value }}
                                        </div>
                                    </template>

                                    <template v-slot:selection="{ item }">
                                        <div class="  text-secondary_text">
                                            {{ item.raw.Value }}
                                        </div>
                                    </template>
                                </v-select>
                                <CircuitsAirportTransfer v-model="transferIn" v-model:valid="valid"
                                    v-if="transferInMode.Key == 2">
                                </CircuitsAirportTransfer>
                                <CircuitsPointTransfer v-model="transferIn" v-model:valid="valid"
                                    v-if="transferInMode.Key == 3">
                                </CircuitsPointTransfer>
                                <CircuitsListTransfer v-model="transferIn" v-model:valid="valid"
                                    v-if="transferInMode.Key == 4">
                                </CircuitsListTransfer>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-expansion-panels elevation=0 class=mt-3>
                        <v-expansion-panel rounded="md" class="bg-midground">
                            <v-expansion-panel-title>
                                Traslado de vuelta
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-select :items="service.Catalog.TransferOptionsOut.TransferType" bg-color="foreground"
                                    base-color="secondary_text" density="compact" v-model="transferOutMode"
                                    variant="outlined" rounded="md" return-object>
                                    <template v-slot:item="{ props, item }">
                                        <div class="pa-3   text-secondary_text" v-bind="props">
                                            {{ item.raw.Value }}
                                        </div>
                                    </template>
                                    <template v-slot:selection="{ item }">
                                        <span class="  text-secondary_text">{{ item.raw?.Value }}</span>
                                    </template>
                                </v-select>
                                <CircuitsAirportTransfer v-model="transferOut" v-model:valid="valid"
                                    v-if="transferOutMode.Key == 2">
                                </CircuitsAirportTransfer>
                                <CircuitsPointTransfer v-model="transferOut" v-model:valid="valid"
                                    v-if="transferOutMode.Key == 3">
                                </CircuitsPointTransfer>
                                <CircuitsListTransfer v-model="transferOut" v-model:valid="valid"
                                    v-if="transferOutMode.Key == 4">
                                </CircuitsListTransfer>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-col>
            </v-row>
        </v-card>
    </v-form>
</template>

<script setup>


const valid = defineModel('valid')
const transferInMode = defineModel('modeIn', {default: { "Key": "1", "Value": "No Contratado" }})
const transferOutMode = defineModel('modeOut', {default: { "Key": "1", "Value": "No Contratado" }})
const transferIn = defineModel('in')
const transferOut = defineModel('out')
const store = useCircuitsStore();
const { getPrebooking } = storeToRefs(store)
const service = computed(() => {
    if (getPrebooking.value && getPrebooking.value.Services) {
        return getPrebooking.value.Services[0]
    }
})

watch(transferInMode, (value) => {
    transferIn.value = {}

})

watch(transferOutMode, (value) => {
    transferOut.value = {}

})

onMounted(() => {
    
    valid.value = true;
})

</script>