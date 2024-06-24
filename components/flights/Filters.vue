<template>
    <v-row dense class="mb-1" v-if="filters.length > 0">
        <v-col cols="12">
            <v-btn @click="applyFilters" density="comfortable" rounded="sm" class="mr-1 body-2 semi" flat
                color="secondary" :disabled="!hasCheckedFilters">Aplicar filtros</v-btn>
            <v-menu center bottom offset-y transition="scale-transition" :close-on-content-click="false" rounded
                v-for="item in filters">
                <template v-slot:activator="{ props }">
                    <v-btn class="mr-1 px-3 my-1 body-2 semi"
                        v-if="item.GroupName != 'feature.propertyName' && item.GroupName !== 'feature.price'"
                        density="comfortable" variant="outlined" rounded="sm" v-bind="props"
                        :color="checkFeatureChecked(item) ? 'secondary' : 'secondary_darken'"
                        :class="checkFeatureChecked(item) ? 'text-secondary bg-secondary_lighten' : (compact ? 'bg-foreground border-secondary_lighten text-secondary_text' : 'bg-foreground  border-secondary_lighten text-secondary_text')">
                        <v-icon size="16" class="mr-1" :icon="getIcon(item.GroupName)"></v-icon>
                        {{ $t(item.GroupName) }}
                        <v-icon size="16" class="ml-1" icon="mdi-chevron-down"></v-icon>
                        <!-- <v-icon v-else icon="md:cancel" size="16" class="ml-1" style="z-index: 999 !important;" @click="clearFeature(item)"></v-icon> -->
                    </v-btn>
                </template>
                <v-list flat color="foreground" v-if="item.FeatureInput == 0">
                    <v-list-item v-for="feature in item.Features">
                        <v-checkbox v-model="feature.Checked" density="compact" hide-details
                            >
                            <template v-slot:label>
                                <v-rating size="small" density="compact" v-model="feature.Value" readonly half-increments
                                    v-if="item.GroupName == 'feature.propertyCategory'"></v-rating>
                                <span v-else class="body-2 text-left">{{ feature.Value }}</span>
                            </template>
                        </v-checkbox>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn class="ml-1 px-3 my-1 semi body-2" color="secondary_text" density="comfortable" rounded="sm"
                variant="text" v-if="hasCheckedFilters" @click="clearFilters">
                <v-icon icon="mdi-close"></v-icon>
                Limpiar filtro
            </v-btn>
        </v-col>
    </v-row>
</template>
    
<script setup>
const props = defineProps(["filters"]);

watch(
  () => props.filters,
  (newFilters) => {
    if (newFilters.length > 0 && !newFilters.some(filter => filter.GroupName === 'feature.isNdc')) {
      newFilters.unshift({
        "GroupName": "feature.isNdc",
        "FeatureInput": 0,
        "Features": [
          {
            "Value": "Sólo NDC",
            "Checked": false
          },
          {
            "Value": "Sólo GDS",
            "Checked": false
          }
        ]
      });
    }
  },
  { immediate: true, deep: true }
);

const checkFeatureChecked = (item) => {
    return item.Features && item.Features.some(feature => feature.Checked);
};

const clearFeature = (item) => {
    for(let feature of item) {
        feature.Checked = false
    }
}

const hasCheckedFilters = computed(() => {
    return props.filters.some(item => item.Features && item.Features.some(feature => feature.Checked));
});

/*"carRental": "Rentadora",
    "category": "Categoría",
    "carRate": "Tarifa",
    "carAC": "Aire acondicionado",
    "carTrans": "Transmisión"*/

const getIcon = (groupName) => {
    switch (groupName) {
        case 'feature.flightLuggage':
            return 'md:luggage';
        case 'feature.flightClasses':
            return 'md:category';
        case 'feature.flightScales':
            return 'md:linear_scale';
        case 'feature.flightOperator':
            return 'md:airplane_ticket';
        case 'feature.flightDeparture':
            return 'mdi-airplane-takeoff';
        case 'feature.flightArrival':
            return 'mdi-airplane-landing';
        case 'feature.isNdc':
            return 'mdi-star-outline';
    }
    /* "flightLuggage": "Equipaje",
    "flightClasses": "Clase",
    "flightScales": "Escalas",
    "flightOperator": "Aerolínea",
    "flightDeparture": "Salida",
    "flightArrival": "Llegada" */
};

const emit = defineEmits(['apply'])

function clearFilters(item) {
    emit('clear')
}

function applyFilters() {
    const activeFilters = props.filters.map(item => ({
        ...item,
        Features: item.Features ? item.Features.filter(feature => feature.Checked) : []
    })).filter(item => item.Features.length > 0);

    const isNdcFilter = props.filters.find(item => item.GroupName === 'feature.isNdc');
  if (isNdcFilter) {
    const ndcFeature = isNdcFilter.Features.find(feature => feature.Value === 'Sólo NDC' && feature.Checked);
    if (ndcFeature) {
      activeFilters.push({ GroupName: 'isNdc', Features: [{ Value: true }] });
    }
  }
    emit('apply', activeFilters)
};
</script>
  
  