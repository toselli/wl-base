<template>
  <v-row dense class="mb-1" v-if="filters.length > 0">
    <v-col cols="12">
      <v-menu center bottom offset-y transition="scale-transition" :close-on-content-click="false" rounded
        v-for="item in filters">
        <template v-slot:activator="{ props }">
          <v-btn class="mr-1 px-3 my-1 body-2 semi"
            v-if="item.GroupName != 'feature.propertyName' && item.GroupName !== 'feature.price'" density="comfortable"
            variant="outlined" rounded="sm" v-bind="props"
            :color="checkFeatureChecked(item) ? 'secondary' : 'secondary_darken'"
            :class="checkFeatureChecked(item) ? 'text-secondary bg-secondary_lighten' : (compact ? 'bg-foreground border-secondary_lighten text-secondary_text' : 'bg-foreground  border-secondary_lighten text-secondary_text')">
            <v-icon size="16" class="mr-1" :icon="getIcon(item.GroupName)"></v-icon>
            {{ $t(item.GroupName) }}
            <v-icon size="16" class="ml-1" icon="mdi-chevron-down"></v-icon>
          </v-btn>
        </template>
        <v-list flat color="foreground" v-if="item.FeatureInput == 0">
          <v-list-item v-for="feature in item.Features">
            <v-checkbox v-model="feature.Checked" density="compact" hide-details @change="updateSelectedFilters()">
              <template v-slot:label>
                <v-rating size="small" density="compact" v-model="feature.Value" readonly half-increments
                  v-if="item.GroupName == 'feature.propertyCategory'"></v-rating>
                <span v-else class="body-2 text-left">{{ feature.Value }}</span>
              </template>
            </v-checkbox>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn @click="applyFilters" density="comfortable" rounded="sm" class="mr-1 body-2 semi" variant="flat"
        color="secondary" :disabled="!hasCheckedFilters">Aplicar filtros</v-btn>

      <v-btn v-if="hasCheckedFilters" @click="clearFilters" color="secondary_text" dark size="small" rounded="sm"
        variant="text">
        <v-icon icon="mdi-close"></v-icon> Limpiar filtros
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps(["filters"]);
const updateSelectedFilters = () => {

};

const checkFeatureChecked = (item) => {
  return item.Features && item.Features.some(feature => feature.Checked);
};

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
    case 'feature.carRental':
      return 'mdi-currency-usd';
    case 'feature.category':
      return 'mdi-star';
    case 'feature.carRate':
      return 'mdi-currency-usd';
    case 'feature.carAC':
      return 'mdi-snowflake';
    case 'feature.carTrans':
      return 'mdi-hoop-house';
  }
};

const emit = defineEmits(['apply'])

const clearFilters = () => {
  props.filters.forEach(item => {
    if (item.Features) {
      item.Features.forEach(feature => {
        feature.Checked = false;
      });
    }
  });

  applyFilters();
};

function applyFilters() {
  const activeFilters = props.filters.map(item => ({
    ...item,
    Features: item.Features ? item.Features.filter(feature => feature.Checked) : []
  })).filter(item => item.Features.length > 0);

  emit('apply', activeFilters)
};
</script>
