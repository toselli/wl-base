<template>
    <v-card :ripple="false" v-if="model && model.length > 0" flat class="bg-midground pa-5 mb-4 grid-card" rounded="lg">
        <v-row dense>
            <v-col align="center">
                <v-icon color=secondary size="24" icon="md:flight_takeoff"> </v-icon>
                <span class="text-secondary body-3 semi ml-2">Salida</span>
            </v-col>
        </v-row>
        <v-row dense v-for="(row, rIndex) in model">
            <v-col v-for="(col, cIndex) in row" align="center" >
                <v-card v-if="rIndex == 0 && cIndex == 0" class="bg-transparent fill-height" elevation="0">
                    <v-icon color=secondary size="24" icon="md:flight_land"> </v-icon>
                    <span class="text-secondary bg-foreground body-3 semi ml-2">Regreso</span>
                </v-card>
                <v-card v-else class="body-3 semi text-secondary_text pa-3 fill-height" rounded="sm" border @click="goTo(col.ServiceId)" elevation="0"
                    :class="col && col.ServiceId ? 'bg-secondary_lighten border-secondary' : '', col && col.ServiceId ? priceRelation(col.Amount)._class : ''">
                    <div v-if="!col.ServiceId" class="d-flex fill-height justify-center align-center">
                        <div> {{
                            $sentence(dayjs(col.DepartureDate).format('ddd DD MMM')) }}
                        </div>

                    </div>
                    <div v-else class="d-flex fill-height">
                        <v-icon v-if="priceRelation(col.Amount)._icon" size="16"
                            class="align-self-start position-absolute mt-n2 ml-6" :color="priceRelation(col.Amount)._color">
                            {{ priceRelation(col.Amount)._icon
                            }}</v-icon>

                        <v-img   position="left" class="align-self-center mt-auto" :src=col.AirlineLogo>
                        </v-img>


                        <div class="d-flex flex-column text-center justify-center">
                            <span class="body-3 semi text-secondary_text">{{ col.Currency }}</span>
                            <span class="body-2 semi text-secondary grid-price"
                                :class="'text-' + priceRelation(col.Amount)._color">{{ col.Amount.toFixed(2) }}</span>
                        </div>
                    </div>
                </v-card>
                </v-col>
            </v-row>
        </v-card>
</template>

<script setup>
const dayjs = useDayjs()
const model = defineModel();
const selected = defineModel('selected')
const average = ref(0)
const threshhold = ref(0)
const cheapest = ref(0)
const costliest = ref(0)

watch(model, () => {
    calculateAverageAndThreshold()
}, { deep: true })

const goTo = (serviceId) => {
    selected.value = serviceId;
}

const calculateAverageAndThreshold = () => {
    try {
        let _cheapest = Number.MAX_VALUE
        let _costliest = 0 //https://context.reverso.net/traduccion/ingles-espanol/costliest TRUE ENGLISH!
        let acc = 0
        let count = 0
        for (let row of model) {
            for (let col of row.value || []) {
                for (let cell of col) {
                    if (cell && cell.Amount) {
                        if (cell.Amount < _cheapest) {
                            _cheapest = cell.Amount
                        }

                        if (cell.Amount > _costliest) {
                            _costliest = cell.Amount;
                        }
                        acc += cell.Amount;
                        count++
                    }
                }
            }
        }
        average.value = acc / count;
        threshhold.value = (_costliest / _cheapest) / 20
        costliest.value = _costliest;
        cheapest.value = _cheapest;
    }
    catch (e) {
        console.log(e)
    }


}

onMounted(() => {
    calculateAverageAndThreshold()
})

const priceRelation = (amount) => { 
    let _class = ''
    let _icon = ''
    let _color = ''
    if (amount > average.value) {
        const diff = amount - average.value;
        const numTh = average.value * threshhold.value
        if (diff > numTh) {
            _class = 'bg-error_lighten border-error'
            _icon = 'md:trending_up',
                _color = 'error'
        }
    }

    if (amount < average.value) {
        const diff = average.value - amount;
        const numTh = average.value * threshhold.value
        if (diff > numTh) {
            _class = 'bg-success_lighten border-success'
            _icon = 'md:trending_down',
                _color = 'success'
        }
    }
    return { _class, _icon, _color };
}
</script>

<style scoped>
.grid-price {
    font-family: Manrope;
    font-size: 12px;
    font-weight: 600;
    line-height: 15px;
    letter-spacing: 1.25px !important;
    text-align: center;

}

.grid-card:hover {
    background-color: rgb(var(--v-theme-midground)) !important;
}

.border-error {
    border: 1px solid rgb(var(--v-theme-error))
}

.border-success {
    border: 1px solid rgb(var(--v-theme-success))
}


</style>