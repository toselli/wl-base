<template>
    <v-card rounded="lg" flat elevation="0" class="bg-foreground">
        <v-card-title class="px-3 pt-2 pb-0 semi">
            Cotizaciones
        </v-card-title>
        <v-card-text class="d-flex flex-row justify-space-between">
            <div class="d-flex flex-column text-center justify-center align-center" v-for="exch in getExchanges">
                <country-flag :country='flag(exch.Key)' />
                <div v-if="exch.Key == 'BSP'" class="bsp-flag flag">
                    <span class="body-3 text-white">BSP</span>
                </div>
                <span class="body-2 mt-1 semi text-secondary_text"> {{ exch.Value }}</span>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
const webstore = useWebStore()
const { fetchExchanges } = webstore;
const { getExchanges } = storeToRefs(webstore)

const flag = (key) => {
    switch (key) {
        case 'USD': return 'US';
        case 'EUR': return 'EU';
        case 'BRL': return 'BR';
        case 'GBP': return 'GB';
        default: return '';
    }

}

onMounted(() => {
    fetchExchanges()
})

</script>

<style>
.flag {
    border-radius: 6px !important;
}

.bsp-flag {
    background-color: #1E77E8 !important;
    text-align: center !important;
    text-justify: center !important;
    width: 29px !important;
    height: 23px !important;
    display: inline-block;
    color: white;
    margin-top: 9px
}
</style>