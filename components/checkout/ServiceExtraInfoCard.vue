<template>
    <v-card rounded="lg" class="card-checkout-forms-content pa-4 mb-4" v-if="serviceType == 'transfers'">
    <v-form v-model="valid">
        <h3 class="text-h6 semi mb-6 pa-3 pa-md-0">Información para traslados</h3>
        <v-row dense>
            <v-col cols="6">
                <v-text-field label="Dirección recogida*" variant="outlined" class="mb-3" density="compact" :rules="requiredRules" readonly
                    v-model="booking.Address">
                </v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field label="Dirección destino*" variant="outlined" class="mb-3" density="compact" :rules="requiredRules" readonly
                    v-model="booking.AddressDestination">
                </v-text-field>
            </v-col>
        </v-row>
        <div v-for="service in booking.Services">
            <div v-if="service.Transfer.ArrivalPoint.TypeEnum == 3 && service.Transfer.TransferType == 0">
                <h5 class="mb-4">Vuelo de llegada (información requerida)</h5>
                <v-row dense>
                    <v-col cols="6">
                        <v-autocomplete label="Aerolínea*" variant="outlined" density="compact" :items="airlines" :rules="requiredRules"
                            v-model="transferInDetailsFrom.Airline" v-model:search="search" item-title="Value" return-object
                            no-data-text="No hay resultados para su búsqueda">
                            <template v-slot:append-inner>
                                <v-progress-circular indeterminate color="primary" size="25"
                                    v-if="loadingAirlines"></v-progress-circular>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="N° Vuelo*" variant="outlined" class="mb-3" density="compact" :rules="requiredRules"
                            v-model="transferInDetailsFrom.FlightInfo">
                        </v-text-field></v-col>
                </v-row>
            </div>
            <div v-if="service.Transfer.DestinationPoint.TypeEnum == 3 && service.Transfer.TransferType == 0">
                <h5 class="mb-4">Vuelo de salida (información requerida)</h5>
                <v-row dense>
                    <v-col cols="6">
                        <v-autocomplete label="Aerolínea*" variant="outlined" density="compact" :items="airlines" :rules="requiredRules"
                            v-model="transferInDetailsTo.Airline" v-model:search="search" item-title="Value" return-object
                            no-data-text="No hay resultados para su búsqueda">
                            <template v-slot:append-inner>
                                <v-progress-circular indeterminate color="primary" size="25"
                                    v-if="loadingAirlines"></v-progress-circular>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="N° Vuelo*" variant="outlined" class="mb-3" density="compact" :rules="requiredRules"
                            v-model="transferInDetailsTo.FlightInfo">
                        </v-text-field></v-col>
                </v-row>
            </div>
            <div v-if="service.Transfer.ArrivalPoint.TypeEnum == 3 && service.Transfer.TransferType == 2">
                <h5 class="mb-4">Vuelo de regreso (información requerida)</h5>
                <v-row dense>
                    <v-col cols="6">
                        <v-autocomplete label="Aerolínea*" variant="outlined" density="compact" :items="airlines" :rules="requiredRules"
                            v-model="transferOutDetailsFrom.Airline" v-model:search="search" item-title="Value"
                            return-object no-data-text="No hay resultados para su búsqueda">
                            <template v-slot:append-inner>
                                <v-progress-circular indeterminate color="primary" size="25"
                                    v-if="loadingAirlines"></v-progress-circular>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="N° Vuelo*" variant="outlined" class="mb-3" density="compact" :rules="requiredRules"
                            v-model="transferOutDetailsFrom.FlightInfo">
                        </v-text-field></v-col>
                </v-row>
            </div>
            <div v-if="service.Transfer.DestinationPoint.TypeEnum == 3 && service.Transfer.TransferType == 2">
                <h5 class="mb-4">Vuelo de regreso (información requerida)</h5>
                <v-row dense>
                    <v-col cols="6">
                        <v-autocomplete label="Aerolínea*" variant="outlined" density="compact" :items="airlines" :rules="requiredRules"
                            v-model="transferOutDetailsTo.Airline" v-model:search="search" item-title="Value" return-object
                            no-data-text="No hay resultados para su búsqueda">
                            <template v-slot:append-inner>
                                <v-progress-circular indeterminate color="primary" size="25"
                                    v-if="loadingAirlines"></v-progress-circular>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="N° Vuelo*" variant="outlined" class="mb-3" density="compact" :rules="requiredRules"
                            v-model="transferOutDetailsTo.FlightInfo">
                        </v-text-field></v-col>
                </v-row>
            </div>
        </div>
    </v-form>
    </v-card>
</template>

<script setup>
const props = defineProps(["booking", "serviceType"]);
const loadingAirlines = ref(false)
const airlines = ref([])
const transferInDetailsFrom = ref({
    Airline: null,
    FlightInfo: null
})
const transferInDetailsTo = ref({
    Airline: null,
    FlightInfo: null
})
const transferOutDetailsFrom = ref({
    Airline: null,
    FlightInfo: null
})
const transferOutDetailsTo = ref({
    Airline: null,
    FlightInfo: null
})
const search = ref(null);

let searchTimer = null;

watch(search, (newSearch) => {
    clearTimeout(searchTimer);
    if (newSearch.length >= 3) {
        searchTimer = setTimeout(() => {
            getAirlines(newSearch);
        }, 400);
    } else {
        airlines.value = [];
        clearTimeout(searchTimer);
    }
});

const store = useTransfersStore();

async function getAirlines(query) {
    if (!loadingAirlines.value) {
        loadingAirlines.value = true;
        try {
            await useNuxtApp().$toast.promise(store.getAirlines(query), {
                error: 'Error al obtener los datos'
            });
            airlines.value = store.airlines.slice(0, 10);
        } catch (error) {
            console.log(error);
        } finally {
            loadingAirlines.value = false;
        }
    }
}

watch(transferInDetailsFrom, (newValue, oldValue) => {
    transferInDetailsFrom.value.AirlineCode = newValue.Airline.Key
    transferInDetailsFrom.value.AirlineName = newValue.Airline.Value
    emitTransferInDetailsFrom(transferInDetailsFrom.value);
}, { deep: true });

watch(transferInDetailsTo, (newValue, oldValue) => {
    transferInDetailsTo.value.AirlineCode = newValue.Airline.Key
    transferInDetailsTo.value.AirlineName = newValue.Airline.Value
    emitTransferInDetailsTo(transferInDetailsTo.value);
}, { deep: true });

watch(transferOutDetailsFrom, (newValue, oldValue) => {
    transferOutDetailsFrom.value.AirlineCode = newValue.Airline.Key
    transferOutDetailsFrom.value.AirlineName = newValue.Airline.Value
    emitTransferOutDetailsFrom(transferOutDetailsFrom.value);
}, { deep: true });

watch(transferOutDetailsTo, (newValue, oldValue) => {
    transferOutDetailsTo.value.AirlineCode = newValue.Airline.Key
    transferOutDetailsTo.value.AirlineName = newValue.Airline.Value
    emitTransferOutDetailsTo(transferOutDetailsTo.value);
}, { deep: true });


const emit = defineEmits(['update:transferInDetailsFrom', 'update:transferInDetailsTo', 'update:transferOutDetailsFrom', 'update:transferOutDetailsTo','valid'])

const emitTransferInDetailsFrom = (value) => {
    emit('update:transferInDetailsFrom', value);
};
const emitTransferInDetailsTo = (value) => {
    emit('update:transferInDetailsTo', value);
};
const emitTransferOutDetailsFrom = (value) => {
    emit('update:transferOutDetailsFrom', value);
};
const emitTransferOutDetailsTo = (value) => {
    emit('update:transferOutDetailsTo', value);
};

//VALIDATION

const valid = ref(false);

const { requiredRules } = useFormRules();

watch(valid, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    emit('valid', true);
  } else {
    emit('valid', false);
  }
});

</script>
