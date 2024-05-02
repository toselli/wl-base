<template>
  <v-card rounded="lg" variant="outlined" @click="$emit('goTo')"  @click.middle.prevent="$emit('goTotab')">
    <v-row dense no-gutters >
      <v-col cols="3" class="pa-0">
        <v-img :src="item.Thumb" height="100px" cover></v-img>
      </v-col>
      <v-col class="pa-2">
        <v-rating :model-value="item.Category.toString()" density="compact" size="small" color="orange" half-increments readonly></v-rating>
        <h4 :class="!item.Category ? 'mt-2' : ''">
          {{ item.Name }}
        </h4>
        <p class="body-2">
          <v-icon icon="mdi-map-marker" size="small"></v-icon>
          <span>{{ item.Address }}, {{ item.City.Value }}, <span v-if="item.Destination">{{ item.Destination.Value }}</span>, {{ item.Country.Key }}</span>
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps(["item"]);
</script>
