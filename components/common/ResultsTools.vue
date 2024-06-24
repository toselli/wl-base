<template>
    <v-row dense :justify="!isMobile ? 'end' : ''" align="center" class="mt-lg-2" no-gutters>

        <v-text-field variant="outlined" hide-details density="compact" :label="prompt" v-model="searchPromptModel"
            class="small-text-field pt-0 mr-2" ref="prompRef"
            :placeholder="`Escriba ${prompt.toLowerCase()} para filtrar`" v-if="!showMap && !hidePrompt"></v-text-field>
        <v-btn variant="flat" color="secondary" rounded="md" size="small"
            @click="showMap = true; $emit('showMapResults'); showMap = true" v-show="!showMap"
            v-if="serviceType == 'stays'" class="mr-2">
            <v-icon start icon="mdi-map"></v-icon>
            Mostrar mapa</v-btn>
        <v-btn variant="flat" color="secondary" rounded="md" size="small"
            @click="showMap = false; $emit('hideMapResults'); showMap = false" v-show="showMap" class="mr-2">
            <v-icon start icon="mdi-map"></v-icon>
            Ocultar
            mapa</v-btn>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn variant="flat" density="comfortable" class="mr-2 text-secondary_darken" v-bind="props"
                    rounded="md">
                    <v-icon :icon="selectedOrderBy?.icon ? selectedOrderBy?.icon : 'mdi-sort'" class="mr-1"></v-icon>
                    <span v-if="!isMobile && !selectedOrderBy" class="body-1"> 
                        Orden
                    </span>
                    <span class="body-3 ml-1">
                        {{ selectedOrderBy?.name  }}
                    </span>
                </v-btn>
            </template>
            <v-list flat color="foreground">
                <v-list-item v-for="item in sorting" class="body-1" @click="() => selectOrderBy(item)">
                    <v-icon size="16">{{ item?.icon }}</v-icon> 
                    <span>{{ item?.name }} </span>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-btn-toggle v-model="viewModeModel" density="compact" mandatory color="secondary" class="bg-foreground pa-1"
            variant="flat" selected-class="bg-secondary_darken text-white" rounded="md"
            v-if="!isMobile && serviceType != 'flights'">
            <v-btn size="x-small" rounded="sm" class="mr-1" density="compact" @click="viewMode = 'grid'">
                <v-icon size="16" icon="mdi-view-grid"></v-icon>
            </v-btn>
            <v-btn size="x-small" rounded="sm" density="compact" @click="viewMode = 'list'">
                <v-icon size="16" icon="mdi-view-list"></v-icon>
            </v-btn>
        </v-btn-toggle>
    </v-row>
</template>

<script setup lang="ts">
const isMobile = useMobile()
const props = defineProps(["viewMode", "serviceType", "showMap", "loading", "sorting", "orderType","hidePrompt"]);
const emit = defineEmits(['update:prompt', 'update:viewMode', 'update:order', 'hideMapResults', 'showMapResults'])

let prompt = ''
switch (props.serviceType) {
    case 'stays': prompt = 'Nombre del hotel'; break;
    case 'transfers': prompt = 'Nombre del vehículo'; break;
    case 'flights': prompt = 'Número de vuelo'; break;
    case 'cars': prompt = 'Nombre del vehículo'; break;
}

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


const emitPrompt = (value: string) => {
    emit('update:prompt', value);
};

const emitViewMode = (value: string) => {
    emit('update:viewMode', value);
};

const selectedOrderBy = ref(null)

const selectOrderBy = (item) => {
    selectedOrderBy.value = item;
    emit('update:order', {
        name: item.name,
        field: item.field,
        direction: item.direction,
        icon: item.icon
    });
};


watchEffect(() => {
    selectedOrderBy.value = props.orderType
});




</script>