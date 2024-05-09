<template>
  <v-row dense class="mb-1" v-if="filters.length > 0">
    <v-col cols="12">
      <v-btn @click="applyFilters" density="comfortable" rounded="sm" class="mr-1 semi body-2" flat color="secondary"
        :disabled="!hasActiveFilters">Aplicar filtros</v-btn>
      <v-menu center bottom offset-y transition="scale-transition" :close-on-content-click="false" rounded
        v-for="item in filters">
        <template v-slot:activator="{ props }">
          <v-btn class="mr-1 px-3 my-1"
            v-if="item.GroupName != 'feature.propertyName' && item.GroupName !== 'feature.price'" density="comfortable"
            :variant="checkFeatureChecked(item) ? 'tonal' : 'outlined'" rounded="sm" v-bind="props"
            :color="checkFeatureChecked(item) ? 'secondary' : 'secondary_darken'"
            :class="checkFeatureChecked(item) ? 'bg-secondary_lighten' : 'secondary_text'">
            <v-icon size="16" class="mr-1" :icon="getIcon(item.GroupName)"></v-icon>
            {{ $t(item.GroupName) }}
            <v-icon v-if="!checkFeatureChecked(item)" size="16" class="ml-1" icon="mdi-chevron-down"></v-icon>
            <v-icon v-else icon="md:cancel" size="16" class="ml-1"></v-icon>
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

const hasActiveFilters = computed(() => {
  return props.filters.some(item => item.Features && item.Features.some(feature => feature.Checked));
});

const getIcon = (groupName) => {
  switch (groupName) {
    case 'feature.assistanceType':
      return 'mdi-star'
  }
};

const emit = defineEmits(['apply'])

function applyFilters() {
  const activeFilters = props.filters.map(item => ({
    ...item,
    Features: item.Features ? item.Features.filter(feature => feature.Checked) : []
  })).filter(item => item.Features.length > 0);

  emit('apply', activeFilters)
};
</script>
