<template>
    <v-row dense :justify="!isMobile ? 'end' : 'start'" align="center" no-gutters>
        <v-checkbox label="Mostrar tarifas con gastos" hide-details density="compact" v-model="showNonRef"
            class="body-2 v-col-lg-3"></v-checkbox>
        <v-checkbox label="Mostrar solo cadena directa" hide-details density="compact" v-model="showDirectChain"
            class="body-2 v-col-lg-3"></v-checkbox>
        <v-text-field variant="outlined" hide-details density="compact" label="Buscar" v-model="searchPromptModel"
            class="small-text-field pt-0 mx-2" ref="prompRef"
            placeholder="Escriba un término para filtrar"></v-text-field>
        <v-btn variant="tonal" density="comfortable" color="secondary" class="mr-2"
            @click="$emit('orderDes'); priceOrder = 'desc'" rounded="md" v-if="priceOrder == 'asc'"> <v-icon
                icon="mdi-arrow-down"></v-icon> Precio
        </v-btn>
        <v-btn variant="tonal" density="comfortable" color="secondary" class="mr-2"
            @click="$emit('orderAsc'); priceOrder = 'asc'" rounded="md" v-else>
            <v-icon icon="mdi-arrow-up"></v-icon>Precio
        </v-btn>
        <v-btn-toggle v-model="viewModeModel" mandatory color="secondary" class="border-secondary" style="height: 28px;"
            density="comfortable" variant="tonal" rounded="md" v-if="!isMobile">
            <v-btn size="small" :class="viewMode == 'grid' ? 'bg-secondary text-white' : 'text-secondary'" class="px-4"
                icon="mdi-view-grid" @click="viewMode = 'grid'">
            </v-btn>
            <v-btn size="small" :class="viewMode == 'list' ? 'bg-secondary text-white' : 'text-secondary'" class="px-4"
                icon="mdi-view-list" @click="viewMode = 'list'">
            </v-btn>
        </v-btn-toggle>
    </v-row>
</template>

<script setup lang="ts">
const isMobile = useMobile()
const props = defineProps(["viewMode", "showMap", "loading", "orderType"]);

const priceOrder = ref("asc");

const viewModeModel = ref(1)

const searchPromptModel = ref('')

watch(searchPromptModel, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        emitPrompt(newValue);
    }
});

watch(viewModeModel, () => {
    emitViewMode(props.viewMode);
});


const emit = defineEmits(['update:prompt', 'update:viewMode', 'update:showNonRef', 'update:showDirectChain'])

const emitPrompt = (value: string) => {
    emit('update:prompt', value);
};

const emitViewMode = (value) => {
    emit('update:viewMode', value);
};

watch(props, (newValue, oldValue) => {
    priceOrder.value = props.orderType
},
    { deep: true });

const showNonRef = ref(true)

watch(showNonRef, (value) => {
    emit('update:showNonRef', value);
});

const showDirectChain = ref(false)

watch(showDirectChain, (value) => {
    emit('update:showDirectChain', value);
});

</script>
