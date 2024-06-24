<template>
  <v-card class="mt-2" flat v-for="(service, index) in booking.Services">
    <h5 class="mb-2 ml-2" v-if="booking.Services.length > 1">Habitación {{ index + 1 }} <span class="body-3">- {{
      service.Room.Description }}</span></h5>
    <v-alert border="start" variant="tonal" color="error" rounded="lg" class="my-2  body-1"
      v-if="!service.NonRefundable && $dayjs(service.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day')">
      Cancelación con cargo
    </v-alert>
    <v-alert border="start" variant="tonal" color="error" rounded="lg" class="my-2 body-1" v-else-if="service.NonRefundable">
      <v-icon color="error" class="mr-3 mb-1">alert</v-icon>
      Esta reserva no tiene reembolso
    </v-alert>
    <v-alert border="start" variant="tonal" color="success" rounded="lg" density="compact" class="my-2 body-1" v-else>
      Cancelación sin cargo hasta
      {{ $dayjs(service.LastDayToCharge).format('MMMM DD') }}
    </v-alert>
  </v-card>
  <p class="body-2 mt-4 mx-2">
    Tipo de cama no está garantizado. Pueden aplicarse cargos extras, como Resort Fee o tax locales.
    Precios válidos para pasajeros con pasaportes de América Latina.
  </p>
</template>

<script setup>
const props = defineProps(["details", "booking"]);
</script>
