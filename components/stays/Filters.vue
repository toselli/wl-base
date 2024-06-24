<template>
  <v-container class="py-0">
    <v-row dense class="mb-1" v-if="filters.length > 1">
      <v-col cols="12">
        <v-icon icon="mdi-tune" size="small" v-if="!compact"></v-icon> <span class="body-1 mr-2"
          v-if="!compact">Filtros</span>
        <v-menu center bottom offset-y transition="scale-transition" :close-on-content-click="false" rounded
          :attach="true" v-for="item in filters">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-1 px-3 my-1"
              v-if="item.GroupName != 'feature.propertyName' && item.GroupName !== 'feature.price'"
              :density="compact ? 'compact' : 'comfortable'" :elevation="compact ? 2 : 0"
              :variant="checkFeatureChecked(item) ? 'tonal' : (compact ? 'default' : 'outlined')" rounded="sm"
              v-bind="props"
              :class="checkFeatureChecked(item) ? 'text-secondary bg-secondary_lighten' : (compact ? 'bg-foreground border-secondary_lighten text-secondary_text' : 'bg-foreground  border-secondary_lighten text-secondary_text')">
              <v-icon size="16" class="mr-1" :icon="getIcon(item.GroupName)"></v-icon>
              {{ $t(item.GroupName) }}
              <v-icon size="16" class="ml-1" icon="mdi-chevron-down">
              </v-icon>
            </v-btn>
          </template>
          <v-list flat rounded="lg" v-if="item.FeatureInput == 0" class=" pa-2">
            <div class="bg-background pa-2 rounded-lg border-secondary_lighten">
              <v-list-item v-for="feature in item.Features" class="bg-background">
                <v-checkbox v-model="feature.Checked" density="compact" hide-details
                  @change="updateSelectedFilters(item.GroupName, feature)">
                  <template v-slot:label>
                    <div v-if="item.GroupName == 'feature.propertyCategory'">
                      <v-rating size="small" density="compact" v-model="feature.Value" readonly
                        half-increments></v-rating>
                      <!-- <span class="body-3 text-secondary_text text-left">({{ feature.Count }} opciones)</span> -->
                    </div>
                    <div v-else>
                      <span class="body-2 text-left">{{ feature.Value }}</span>
                      <!-- <span class="body-3 text-secondary_text text-left">({{ feature.Count }} opciones)</span> -->
                    </div>
                  </template>
                </v-checkbox>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
        <v-btn v-if="hasCheckedFilters" @click="clearFilters" color="secondary_text" dark size="small" rounded="sm"
          variant="text">
          <v-icon icon="mdi-close"></v-icon> Limpiar filtros
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps(['filters', 'compact']);
const emit = defineEmits(['apply'])

const updateSelectedFilters = (groupName, selectedFeature) => {
  props.filters.forEach(item => {
    if (groupName === 'feature.propertyCategory' && item.Features) {
      item.Features.forEach(feature => {
        if (feature !== selectedFeature) {
          feature.Checked = false;
        }
      });
    }
  });
  const activeFilters = props.filters
    .map(item => {
      if (item.Features) {
        return {
          GroupName: item.GroupName, // Mantener el GroupName original
          Filters: item.Features.filter(f => f.Checked),
        };
      } else {
        return null;
      }
    })
    .filter(filter => filter !== null && filter.Filters.length > 0);

  emit('apply', activeFilters);
};


const checkFeatureChecked = (item) => {
  return item.Features && item.Features.some(feature => feature.Checked);
};

const hasCheckedFilters = computed(() => {
  return props.filters.some(item => checkFeatureChecked(item));
});

const clearFilters = () => {
  props.filters.forEach(item => {
    if (item.Features) {
      item.Features.forEach(feature => {
        feature.Checked = false;
      });
    }
  });

  updateSelectedFilters();
};

const getIcon = (groupName) => {
  switch (groupName) {
    case 'feature.price':
      return 'mdi-currency-usd';
    case 'feature.propertyCategory':
      return 'mdi-star';
    case 'feature.propertyFacilities':
      return 'mdi-room-service';
    case 'feature.propertyMeals':
      return 'mdi-silverware-fork-knife';
    case 'feature.propertyTypes':
      return 'mdi-hoop-house';
  }
};

onMounted(async () => {
  setTimeout(() => {
    updateSelectedFilters();
  }, 3000);
});
</script>
