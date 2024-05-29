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
        <v-rating v-model="details.PropertyCategory" density="compact" size="small" color="orange"
          v-if="details.PropertyCategory" readonly half-increments></v-rating>
        <h4 :class="compact ? 'text-h5' : 'text-h3'" class="mb-2">
          {{ details.Name }}
        </h4>
        <v-row dense>
          <v-col cols="6">
            <v-card variant="tonal" class="bg-midground pa-1">
              <p :class="compact ? 'body-3' : 'body-2'" class="mb-1 text-secondary_text">Checkin</p>
              <div class="d-flex">
                <v-icon icon="calendar-today" size="x-small"></v-icon>
                <span class="body-2 text-primary_text semi">{{ $dayjs($route.query.checkIn).format('D MMM YYYY')
                  }}</span>
              </div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card variant="tonal" class="pa-1">
              <p :class="compact ? 'body-3' : 'body-2'" class="mb-1 text-secondary_text">Checkout</p>
              <div class="d-flex">
                <v-icon icon="calendar" size="x-small"></v-icon>
                <span class="body-2 text-primary_text semi">{{ $dayjs($route.query.checkOut).format('D MMM YYYY')
                  }}</span>

              </div>
            </v-card>
          </v-col>
        </v-row>
        <p v-if="details.Addresses" :class="compact ? 'body-3' : 'body-2'" class="my-2  text-secondary_text"><v-icon
            icon="mdi-map-marker"></v-icon>{{ details.Addresses[0].Street }}, {{ details.Addresses[0].CityName }}, {{
    details.Addresses[0].StateProv }}, {{ details.Addresses[0].Country }}
          {{ details.Country?.Value }}</p>
        <p class="body-2 semi">
          <v-icon icon="mdi-silverware-fork-knife" class="mr-1"></v-icon>Régimen:{{
    services[0].Price.PVP.IncludedSupplements[0]?.Description }}
        </p>
        <p class="body-3 my-2  text-secondary_text" v-if="services" v-for="(room, index) in services">
          <span v-if="services.length > 1">Hab. {{ index + 1 }}: </span>
          <v-icon icon="mdi-bed-queen-outline"></v-icon> Tipo de hab: {{ room.Room.Description }}
        </p>

      </v-col>
    </v-row>
    <v-expansion-panels multiple v-model="openPanels">
      <v-expansion-panel rounded="lg" class="mb-3 bg-background border-secondary_lighten" elevation="0"
        v-if="services[0].VoucherRemarks">
        <v-expansion-panel-title>
          Detalles y tasas extras del hotel
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="body-2" v-html="services[0].VoucherRemarks">
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel rounded="lg" class="mb-3 bg-background border-secondary_lighten" elevation="0"
        v-if="services[0].ProviderMessage">
        <v-expansion-panel-title>
          Comentarios del hotel
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p class="body-2" v-html="services[0].ProviderMessage">
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

  </v-card>
</template>

<script setup>
const props = defineProps(["details", "compact", "services"]);
const openPanels = ref([1, 2])
</script>
