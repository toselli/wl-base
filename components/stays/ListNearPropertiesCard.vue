<template>
  <v-card rounded="lg" variant="outlined" class="full-height bg-foreground" @click="$emit('goTo')"
    @click.middle.prevent="$emit('goTotab')">
    <v-row dense no-gutters>
      <v-col :cols="mode == 'grid' ? '12' : '3'" class="pa-0">
        <v-img :src="item.Thumb" height="115px" cover></v-img>
      </v-col>
      <v-col class="pa-2">
        <v-rating :model-value="item.Category.toString()" density="compact" size="x-small" color="orange"
          half-increments readonly></v-rating>
        <h4 :class="!item.Category ? 'mt-2' : ''">
          {{ item.Name }}
        </h4>
        <p class="body-3 mt-2">
          <v-icon icon="mdi-map-marker" size="small"></v-icon>
          <span>{{ item.Address }}, {{ item.City.Value }}, <span v-if="item.Destination">{{ item.Destination.Value
              }}
            </span>, {{ item.Country.Key }}</span>
        </p>
        <p class="body-2 semi mt-2">
          <v-icon icon="mdi-car" class="mr-1" size="small"></v-icon>
          Distancia del hotel: {{ distance.toFixed(2) }} km.
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps(["item", "mode", "location"]);

const toRadians = (grados) => {
  return grados * (Math.PI / 180);
};

const distance = computed(() => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRadians(props.location.Latitude - props.item.Location.Latitude);
  const dLon = toRadians(props.location.Longitude - props.item.Location.Longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(props.location.Latitude)) * Math.cos(toRadians(props.item.Location.Latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
});

</script>
