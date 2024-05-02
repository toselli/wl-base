<template>
  <v-card color="transparent" flat v-if="details">
    <v-row dense>
      <v-col>
        <v-card flat rounded="lg">
        <v-img :src="details.Thumb">
        </v-img>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-rating v-model="details.PropertyCategory" density="compact" size="small" color="orange" v-if="details.PropertyCategory" readonly
          half-increments></v-rating>
        <h4 :class="compact ? 'text-h5' : 'text-h3'" class="mb-2">
          {{ details.Name }}
        </h4>
        <v-row dense>
          <v-col cols="6">
            <v-card variant="tonal" class="bg-midground pa-1">
              <p :class="compact ? 'body-3' : 'body-2'" class="mb-1 text-secondary_text">Checkin</p>
              <div class="d-flex">
                <v-icon icon="calendar-today" size="x-small"></v-icon>
                <span class="body-2 text-primary_text semi">{{ $dayjs($route.query.checkIn).format('D MMM YYYY') }}</span>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card variant="tonal" class="pa-1">
              <p :class="compact ? 'body-3' : 'body-2'" class="mb-1 text-secondary_text">Checkout</p>
              <div class="d-flex">
                <v-icon icon="calendar" size="x-small"></v-icon>
                <span class="body-2 text-primary_text semi">{{ $dayjs($route.query.checkOut).format('D MMM YYYY') }}</span>

              </div>
            </v-card>
          </v-col>
        </v-row>
        <p  v-if="details.Addresses" :class="compact ? 'body-3' : 'body-2'" class="my-2  text-secondary_text"><v-icon icon="map-marker"></v-icon>{{ details.Addresses[0].Street }}, {{ details.Addresses[0].CityName }},  {{ details.Addresses[0].StateProv }},  {{ details.Addresses[0].Country }}
            {{ details.Country.Value }}</p>
           <p class="body-3 my-2  text-secondary_text" v-if="services" v-for="(room, index) in services">
            <span v-if="services.length > 1">Hab. {{ index +1 }}: </span> 
            <v-icon icon="bed-queen-outline"></v-icon> {{ room.Room.Description }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps(["details","compact","services"]);
</script>
