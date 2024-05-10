<template>
  <v-card rounded="lg" class="pa-5 bg-foreground card-content-elevation mb-5">
    <h4 class="text-h6 semi my-2">Datos de los pasajeros</h4>
    <div v-for="(service, index) in booking.Services" v-if="serviceType == 'stays'">
      <h5 class="text-h5 mb-2 ml-2" v-if="booking.Services.length > 1">Habitación {{ index + 1 }} <span class="body-2">-
          {{
            service.Room.Description }}</span></h5>
      <v-divider class="my-3" v-if="booking.Services.length > 1"></v-divider>
      <checkout-passengers-form :passengers="service.Passengers" :indexService="index + 1"
        :showPhone="false" @valid="validPax" />
    </div>
    <div v-else>
      <checkout-passengers-form :passengers="booking.Services[0].Passengers" indexService="1"
        :showPhone="serviceType == 'transfers'" @valid="validPax" :serviceType="serviceType" />
    </div>
  </v-card>
</template>

<script setup>

const props = defineProps(["booking", "serviceType"]);

const emit = defineEmits(['validPax'])

const validPax = (value) => {
  emit('validPax', value);
};
</script>
