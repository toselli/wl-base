<template>
  <v-dialog v-model="show" width="600px" radius="xl" persistent>
    <v-card rounded="lg" class="bg-midground">
      <v-card-text class="pa-6">
        <h4 class="text-h5 text-primary_text text-center" v-if="!bookingConfirmed">Hemos recibido su solicitud.
          <br>Estamos contactando
          con el proveedor para confirmar su reserva. Aguarde un instante.
        </h4>
        <div v-if="!bookingConfirmed" class="text-center">
          <v-progress-circular indeterminate class="my-8 mx-auto"></v-progress-circular>
        </div>
        <v-alert size="large" class="text-center mb-5" color="success" variant="tonal" border="start"
          v-if="!waitingProvider && bookingConfirmed">
          <div v-if="bookingConfirmed[0].Status?.Key == 'CF'">
            <h4 class="text-h4 text-primary_text" >¡La reserva ha sido confirmada!
            </h4>
            <p class="body-2 text-primary_text mt-3">Ponte en contacto con nuestro equipo para finalizar los detalles de la
              operación.</p>
            <p class="text-h5 mt-3 text-primary_text">¡Muchas gracias por confiar en nosotros!</p>
          </div>
          <div v-else>
            <h4 class="text-h4 text-error" >Se produjo un error al confirmar la reserva. Estado: {{ bookingConfirmed[0].Status?.Value }}
            </h4>
            <p class="body-2 text-primary_text mt-3">Si es oportuno ponte en contacto con nuestro equipo para revisar los detalles de la
              operación.</p>
          </div> 
        </v-alert>
        <checkout-details-card :booking="booking" :serviceType="serviceType" class="mt-5"></checkout-details-card>
        <h4 class="mb-1"> Grupo de reserva: # {{ bookingConfirmed[0].PurchaseGroupId }} </h4>
        <h4 class="mb-3"> Localizador: # {{ bookingConfirmed[0].OurRecordLocator }}</h4>
        <v-card flat v-for="(service, index) in booking.Services" v-if="!waitingProvider && bookingConfirmed">

          <h5 class="mb-2 ml-2" v-if="booking.Services.length > 1">Habitación {{ index + 1 }} <span class="body-3">- {{
    service.Room.Description }}</span></h5>
          <v-alert border="start" variant="tonal" color="error" rounded="lg" class="mt-2"
            v-if="!service.NonRefundable && service.IsOnCancellationPolicies">
            Cancelación con cargo
          </v-alert>
          <v-alert border="start" variant="tonal" color="error" class="mt-4" v-if="service.NonRefundable">
            <v-icon color="error" class="mr-3">alert</v-icon>
            Esta reserva no tiene reembolso
          </v-alert>
          <v-alert border="start" variant="tonal" color="success" density="compact" class="mb-4"
            v-if="!service.IsOnCancellationPolicies">
            Cancelación sin cargo hasta
            {{ $dayjs(service.LastDayToCharge).format('MMMM DD') }}
          </v-alert>
          <p class="body-2 mt-4" v-if="serviceType == 'stays' && !waitingProvider && bookingConfirmed">
            Tipo de cama no está garantizado. Pueden aplicarse cargos extras, como Resort Fee o tax locales.
            Precios válidos para pasajeros con pasaportes de América Latina.
          </p>
        </v-card>
        <v-row dense class="mt-5" v-if="!waitingProvider && bookingConfirmed">
          <v-col><v-btn flat block color="primary" rounded="xl" @click="$emit('back')">Volver a los resultados</v-btn></v-col>
          <v-col><v-btn flat block rounded="xl" @click="$router.push('/')">Volver al
              inicio</v-btn></v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps(["booking", "serviceType", "waitingProvider", 'bookingConfirmed', 'modelValue']);

const show = ref(false);

watchEffect(() => {
  show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close');
  }
});
</script>