<template>
    <v-card class="bg-background" flat rounded="md">
        <v-card-text class="px-2 pb-0">
            <v-row dense class="mb-2 px-1">
                <v-col>
                    <h3 class="semi" style="font-size:18px">
                        Tarifa {{ index + 1 }}
                    </h3>
                </v-col>
            </v-row>
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
const props = defineProps(['rate', 'index'])
</script>