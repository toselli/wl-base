<template>
    <v-card rounded="lg" class="card-checkout-forms-content pa-4">
        <h4 class="text-h6 semi mb-4">Seleccionar agente</h4>
        <v-row>
            <v-col cols="12" md="6" v-if="!can('Sellers', 'Division')">
                <v-autocomplete label="Agente Mayorista" variant="outlined" density="compact" :items="sellers"
                    v-model="sellerSelectedModel" :rules="sellerRules" item-title="Value" return-object
                    no-data-text="No hay resultados para su búsqueda">
                    <template v-slot:append-inner>
                        <v-progress-circular indeterminate color="primary" size="25"
                            v-if="loadingSellers"></v-progress-circular>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col cols="12" md="7" v-if="can('Sellers', 'Division')">
                <v-autocomplete label="Agencia" variant="outlined" density="compact" :items="clientsStore.getClients"
                    v-model="clientSelected" v-model:search="clientsSearch" item-title="FantasyName" return-object
                    @change="fetchSellersByClient()" clearable no-data-text="No hay resultados para su búsqueda">
                    <template v-slot:append-inner>
                        <v-progress-circular indeterminate color="primary" size="25"
                            v-if="loadingClients"></v-progress-circular>
                    </template>
                </v-autocomplete>
                <v-autocomplete label="Agente" variant="outlined" density="compact" :items="sellers"
                    v-model="clientSellerSelected" item-title="Value" return-object :disabled="!clientSelected"
                    no-data-text="No hay resultados para su búsqueda">
                    <template v-slot:append-inner>
                        <v-progress-circular indeterminate color="primary" size="25"
                            v-if="loadingSellers"></v-progress-circular>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col v-if="can('Sellers', 'Division')">
                <v-card variant="outlined" class="pa-2 bg-error_lighten error" rounded="lg"
                    v-if="!clientSellerSelected">
                    <h4 class="text-error text-h6 semi"><v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>Atención
                    </h4>
                    <p class="body-3 pa-2">Debe seleccionar una agencia cliente. De lo contrario, la actividad será
                        auditada
                        y reportada como mala práctica. Si continúa con este procedimiento será punible de penalidades.
                    </p>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>

const usersStore = useUsersStore();

const props = defineProps(["clientSelected", "sellerSelected", "clientSellerSelected", 'services']);

const { can } = usePermissions();

const runtimeConfig = useRuntimeConfig()

const sellers = ref([])
const agencyId = ref(runtimeConfig.public.agencyId)
const clientSellerSelected = ref(props.clientSellerSelected)
const loadingSellers = ref(false)

async function fetchSellers() {
    try {
        loadingSellers.value = true
        let payload = {
            agencyId: agencyId.value
        }
        const result = await useNuxtApp().$toast.promise(usersStore.fetchSellers(payload), {
            pending: "Buscando vendedores",
            error: "Error al buscar vendedores",
        });

        sellers.value = result;
        loadingSellers.value = false
    } catch (error) {
        console.log(error);
    }
}


function fetchSellersByClient() {
    if (clientSelected.value) {
        agencyId.value = clientSelected.value.LegacyId
        fetchSellers()
            .then(() => {
                changeClientSeller()
            })
    }
}

const { sellerRules } = useFormRules();

//CLIENTS

const clients = ref([])
const clientSelected = ref(props.clientSelected)
const sellerSelectedModel = ref('')
const clientsSearch = ref('')
const clientsStore = useClientsStore();
const loadingClients = ref(false)

watch(clientsSearch, () => {
    if (clientsSearch.value && clientsSearch.value.length > 2) {
        fetchClients(clientsSearch.value)
    }
})
async function fetchClients(name) {
    if (name && !loadingClients.value) {
        loadingClients.value = true
        let payload = {
            ClientTypeId: 0,
            FantasyName: name
        }
        try {
            const result = await useNuxtApp().$toast.promise(clientsStore.fetchClients(payload), {
                pending: "Buscando clientes",
                error: "Error al buscar clientes",
            });
            loadingClients.value = false
        } catch (error) {
            console.log(error);
        }
    }
}

onMounted(() => {
    fetchSellers();
});

watchEffect(() => {
    clients.value = clientsStore.getClients;
});

watch(clientSelected, (newValue, oldValue) => {
    if (!clientSelected.value) {
        clientSellerSelected.value = ''
        sellerSelectedModel.value = ''
    }
    emitClientSelected(newValue)
    if (newValue !== oldValue) {
        clientSellerSelected.value = ''
        sellers.value = []
        fetchSellersByClient();
    }
});

watch(clientSellerSelected, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        sellerSelectedModel.value = newValue
        changeClientSeller();
    }
});

watch(sellerSelectedModel, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        emitSellerSelected(newValue);
    }
});

const emit = defineEmits(['update:clientSelected', 'update:sellerSelected', 'update:clientSellerSelected'])

const emitSellerSelected = (value) => {
    emit('update:sellerSelected', value);
};

const emitClientSellerSelected = (value) => {
    emit('update:clientSellerSelected', value);
};

const emitClientSelected = (value) => {
    emit('update:clientSelected', value);
};


//UPDATE BASKET

async function changeClientSeller() {
    if (!clientSellerSelected.value) {
        clientSellerSelected.value = sellers.value ? sellers.value[0] : {};
    }
    let payload = {
        agencyId: clientSelected.value?.LegacyId ?? clientSelected.value?.Id,
        userId: clientSellerSelected.value.Key,
        basketId: props.services[0].BasketId
    }
    console.log(payload)
    try {
        const result = await useNuxtApp().$toast.promise(clientsStore.changeClientSeller(payload), {
            error: "Error al setear el vendedor",
        });
        sellerSelectedModel.value = result;
    } catch (error) {
        console.log(error);
    }
}
</script>