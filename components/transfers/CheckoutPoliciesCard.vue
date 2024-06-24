<template>
  <v-card class="mt-2" flat v-for="(service, index) in booking.Services">
    <h5 class="mb-2 ml-2" v-if="booking.Services.length > 1">Traslado 
      <span v-if="index == 0"> ida</span>
      <span v-else> vuelta</span>
    </h5>
    <v-alert border="start" variant="tonal" color="error" rounded="lg" class="my-2 body-1"
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
    <h5>Cargos por cancelación:</h5>
    <v-alert border="start" variant="tonal" color="default" rounded="lg" density="compact" class="my-2 body-1" v-for="item in service.CancellationPolicies">
      Desde {{ $dayjs(item.From).subtract('2','days').format('DD-MM-YYYY') }}
      <span class="float-right"> {{ service.CancellationPrice.Currency }} {{ item.Amount.toFixed(2) }}</span>
    </v-alert>
  </v-card>
</template>

<script setup>
const props = defineProps(["details", "booking"]);
</script>
