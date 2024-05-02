<template>
  <v-card color="background" rounded="lg" class="pa-3 mb-2" flat v-for="(booking, index) in services">
    <v-row dense>
      <v-col cols="12" lg="4" class="pa-1 bg-white rounded-lg d-flex align-center">
        <v-img :src="booking.Transfer.VehicleInfo.UrlImage"></v-img>
      </v-col>
      <v-col cols="12" lg="8">
      <div v-if="services.length > 1" class="body-2 float-right">
        <span v-if="index == 0">IDA</span>
        <span v-else>VUELTA</span>
      </div>
        <h3 class="text-h6">
          {{ descriptionWithoutParenthesis(booking.Transfer.VehicleInfo.Description).length > 80 ?
            descriptionWithoutParenthesis(booking.Transfer.VehicleInfo.Description).substr(0, 80)
            + '...' : descriptionWithoutParenthesis(booking.Transfer.VehicleInfo.Description) }}
          <v-chip v-if="hasParenthesis(booking.Transfer.VehicleInfo.Description)" size="small" class="ml-1"
            :prepend-icon="getIconForDescription(booking.Transfer.VehicleInfo.Description)"
            :color="getChipColorClass(booking.Transfer.VehicleInfo.Description)">
            {{ descriptionCategory(booking.Transfer.VehicleInfo.Description) }}
          </v-chip>
        </h3>
        <!-- <p class="body-3 mt-1">
           <span class="body-2"><v-icon icon="mdi-bus"></v-icon>{{ booking.NumberOfVehicles }} - </span> 
          <span v-if="booking.Transfer.VehicleInfo.IsShuttle">Traslado regular</span>
          <span v-else>Traslado privado</span>
        </p> -->
        <v-sheet class="mt-1 bg-foreground pa-1" border rounded="lg" v-if="index == 0">
          <v-icon icon="mdi-calendar" class="float-left mt-2 mr-1"></v-icon> 
          <p :class="compact ? 'body-3' : 'body-2'" class="text-secondary_text">Fecha recogida</p>
          <span class="body-2 text-primary_text semi"> {{ $dayjs($route.query.arrivalDate).format('DD-MM-YYYY') }}</span>
        </v-sheet>
        <v-sheet class="mt-1 bg-foreground pa-1" border rounded="lg" v-else>
          <v-icon icon="mdi-calendar" class="float-left mt-2 mr-1"></v-icon> 
          <p :class="compact ? 'body-3' : 'body-2'" class="text-secondary_text">Fecha recogida</p>
          <span class="body-2 text-primary_text semi">{{ $dayjs($route.query.departureDate).format('DD-MM-YYYY') }}</span>
        </v-sheet>
        <v-sheet class="mt-1 bg-foreground pa-1" border rounded="lg" v-if="index == 0">
          <v-icon icon="mdi-clock-outline" class="float-left mt-2 mr-1"></v-icon> 
          <p :class="compact ? 'body-3' : 'body-2'" class="text-secondary_text">Hora recogida</p>
         <span class="body-2 text-primary_text semi"> {{ $route.query.arrivalTime  }} hs</span>
        </v-sheet>
        <v-sheet class="mt-1 bg-foreground pa-1" border rounded="lg" v-else>
          <v-icon icon="mdi-clock-outline" class="float-left mt-2 mr-1"></v-icon> 
          <p :class="compact ? 'body-3' : 'body-2'" class="text-secondary_text">Hora recogida</p>
          <span class="body-2 text-primary_text semi">{{ $route.query.departureTime  }} hs </span>
        </v-sheet>
      </v-col>
    </v-row>
    <p class="body-2 text-secondary_text mt-2">
      <v-icon :icon="usePlaceIcon( booking.Transfer.ArrivalPoint.TypeEnum)" class="mr-1"></v-icon>{{
        booking.Transfer.ArrivalPoint.Name }}
    </p>
    <p class="body-2 text-secondary_text mt-1">
      <v-icon :icon="usePlaceIcon( booking.Transfer.DestinationPoint.TypeEnum)" class="mr-1"></v-icon>{{
        booking.Transfer.DestinationPoint.Name }}
    </p>
  </v-card>
</template>

<script setup>
const props = defineProps(["compact", "services"]);

const route = useRoute();

const hasParenthesis = (description) => {
  return /\(([^)]+)\)/.test(description);
};

const descriptionWithoutParenthesis = (description) => {
  return description.replace(/\(([^)]+)\)/, '').trim();
};


const descriptionCategory = (description) => {
  const wordsInParenthesis = /\(([^)]+)\)/.exec(description);
  if (wordsInParenthesis && wordsInParenthesis[1]) {
    return wordsInParenthesis[1].trim();
  }
  return '';
}

const getIconForDescription = (description) => {
  const wordsInParenthesis = /\(([^)]+)\)/.exec(description);
  if (wordsInParenthesis && wordsInParenthesis[1]) {
    const word = wordsInParenthesis[1].trim();
    switch (word) {
      case 'Standard':
        return 'mdi-star-half-full';
      case 'Economy':
        return 'mdi-currency-usd'; 
      case 'Business':
        return 'mdi-briefcase-variant'; 
      case 'First Class':
        return 'mdi-diamond'; 
      case 'ELX':
        return 'mdi-star'; 
      default:
      return 'mdi-car-estate';
    }
  }
  return 'mdi-car-estate';
};

const getChipColorClass = (description) => {
  const wordsInParenthesis = /\(([^)]+)\)/.exec(description);
  if (wordsInParenthesis && wordsInParenthesis[1]) {
    const word = wordsInParenthesis[1].trim();
    // Asigna clases de colores según la categoría
    switch (word) {
      case 'Standard':
        return 'secondary'; // Reemplaza 'standard-chip-color' con la clase de color adecuada.
      case 'Economy':
        return 'success'; // Reemplaza 'economy-chip-color' con la clase de color adecuada.
      case 'Business':
        return 'primary'; // Reemplaza 'business-chip-color' con la clase de color adecuada.
      case 'First Class':
        return 'primary'; // Reemplaza 'first-class-chip-color' con la clase de color adecuada.
      case 'ELX':
        return 'primary'; // Reemplaza 'elx-chip-color' con la clase de color adecuada.
      default:
        return 'default-chip-color'; // Clase de color predeterminada si no coincide ninguna categoría.
    }
  }
  return 'default-chip-color'; // Clase de color predeterminada si no hay palabras entre paréntesis.
};

</script>
