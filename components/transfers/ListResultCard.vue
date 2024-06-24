<template>
  <v-card rounded="lg" class="list-result-card fill-height" flat :id="item.Id">
    <!-- <v-btn @click="share" size="xs" variant="flat" color="primary" icon class="btn-share"><v-icon icon="mdi-share"
        size="xs"></v-icon></v-btn> -->
    <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
      <v-col cols="12" :md="mode == 'list' ? '3' : '12'" class="pa-0">
        <v-img :src="item.Transfer.VehicleInfo.UrlImage" height="164px" lazy-src="/base/img/services/no_results_cars.png" contain></v-img>
      </v-col>
      <v-col cols="12" :md="mode == 'list' ? '4' : '12'" :class="mode == 'list' ? 'pa-4' : 'px-4'">
        <h3 class="text-h5 semi" :class="mode == 'list' ? '' : 'mt-2'">
          {{ descriptionWithoutParenthesis(item.Transfer.VehicleInfo.Description) }}
          <v-chip v-if="hasParenthesis(item.Transfer.VehicleInfo.Description)" size="small" class="ml-1"
            :prepend-icon="getIconForDescription(item.Transfer.VehicleInfo.Description)"
            :color="getChipColorClass(item.Transfer.VehicleInfo.Description)">
            {{ descriptionCategory(item.Transfer.VehicleInfo.Description) }}
          </v-chip>
        </h3>
        <span class="text-success body-3" v-if="item.ProviderRef">
          ({{ item.ProviderRef?.Value }})
        </span>
        <p class="body-2 mt-1 text-secondary_text ">
          <!-- <span class="body-2"><v-icon icon="bus"></v-icon>{{ item.NumberOfVehicles }} - </span> -->
          <span v-if="item.Transfer.VehicleInfo.IsShuttle">Traslado regular</span>
          <span v-else>Traslado privado</span>
        </p>
        <p class="body-2 text-secondary_text mt-1">
          <v-icon icon="mdi-map-marker"></v-icon> Desde: {{ item.Transfer.ArrivalPoint.Name }}
        </p>
        <p class="body-2 text-secondary_text mt-1">
          <v-icon icon="mdi-map-marker"></v-icon> Hasta:
          {{ item.Transfer.DestinationPoint.Name }}
        </p>
        <p class="body-2 text-secondary_text mt-1">
          <v-icon icon="mdi-calendar"></v-icon> Fecha recogida: 
          {{ $dayjs($route.query.arrivalDate).format('DD-MM-YYYY') }} 
          <!-- - {{ $route.query.arrivalTime }} hs -->
        </p>
        <p class="body-2 text-secondary_text mt-2">
          <span title="Capacidad Pasajeros" class="mr-5">
            <v-icon icon="mdi-account-multiple"></v-icon>
            {{ item.Transfer.VehicleInfo.MinCapacity }}-{{ item.Transfer.VehicleInfo.MaxCapacity }}
          </span>
          <span title="Equipaje por persona" class="mr-5">
            <v-icon icon="mdi-bag-suitcase"></v-icon>
            {{ item.Transfer.VehicleInfo.MaxBigBagsNumber }}
          </span>
          <span title="Tiempo aproximado de viaje" class="mr-5">
            <v-icon icon="mdi-clock"></v-icon>
            {{ item.Transfer.JourneyTime }} min
          </span>
          <!-- <span title="Distancia" class="mr-5">
            <v-icon icon="map-marker-distance"></v-icon>
            <span v-if="item.JourneyDistanceKm == 0">No informada</span>
            <span v-if="item.JourneyDistanceKm > 0">
              {{ item.JourneyDistanceKm }} km
            </span>
          </span> -->

        </p>
        <p class="mt-1" v-if="item.Price.PVP.IncludedSupplements.length > 0">
          <strong class="body-2 semi text-secondary_text">Incluye: </strong>
          <span class="body-3 mr-2 text-secondary_text" style="vertical-align: middle;"
            v-for="supplement in item.Price.PVP.IncludedSupplements">
            <v-icon icon="mdi-check-circle mr-1" color="secondary"></v-icon>{{ supplement.Description }}
          </span>
        </p>
        <div v-if="item.Price.PVP.MandatoryAtDestinationSupplements.length > 0">
          <strong class="body-2 semi text-secondary_text">Pago en destino:</strong>
          <div v-for="supplement in item.Price.PVP.MandatoryAtDestinationSupplements" class="d-flex ">
            <v-chip size="x-small" v-if="supplement.Amount > 0" class="mt-3">{{ supplement.Description }} {{
    item.Price.Currency }} {{
    supplement.Amount.toFixed(2) }}</v-chip>
          </div>
        </div>
        <v-sheet v-if="item.Price.PVP.OptionalSupplements.length > 0" color="background py-1 px-4 mt-2" rounded="lg"
          class="d-flex">
          <strong class="body-2 semi text-secondary_text mt-3 mr-2">Suplementos:</strong>
          <div v-for="supplement in item.Price.PVP.OptionalSupplements" class="mr-2">
            <v-checkbox class="body-2" color="secondary" density="compact" hide-details v-model="supplement.select"
              @change="addOptionalSupplement(supplement)">
              <template v-slot:label>
                <div>
                  <p class="text-secondary_darken"> {{ supplement.Description }}</p>
                  <p class="semi text-success" v-if="supplement.Amount == 0">Sin cargo</p>
                  <p class="semi text-secondary_darken" v-if="supplement.Amount > 0">{{ item.Price.Currency }} {{
    supplement.Amount.toFixed(2) }}</p>
                </div>
              </template>
            </v-checkbox>
          </div>
        </v-sheet>
        <div v-if="item.Price.PVP.Boards.length > 0">
          <strong class="body-2 semi text-secondary_text">Régimen de comida:</strong>
          <div v-for="board in item.Price.PVP.Boards" class="d-flex ">
            <v-checkbox :label="board.Description" class="body-2" color="secondary" density="compact" hide-details
              v-model="board.id">
            </v-checkbox>
            <v-chip size="x-small" color="success" class="mt-3" v-if="board.Amount == 0">Sin cargo</v-chip>
            <v-chip size="x-small" v-if="board.Amount > 0" class="mt-3">{{ item.Price.Currency }} {{
    board.Amount.toFixed(2) }}</v-chip>
          </div>
        </div>
      </v-col>
      <v-col :class="mode == 'list' ? '' : ''" class="d-flex justify-center flex-column align-start">
        <!-- <v-chip size="small" variant="outlined" color="error" class="my-1"
          v-if="!item.NonRefundable && $dayjs(item.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day')">
          Cancelación con cargo
        </v-chip>
        <v-chip size="small" variant="outlined" color="success" class="my-1" v-else-if="!item.NonRefundable">
          Cancelación sin cargo
        </v-chip> -->
        <v-chip size="small" v-if="item.NonRefundable" class="bg-error my-1">
          No reembolsable
        </v-chip>
      </v-col>
      <v-col cols="12" :md="mode == 'list' ? '3' : '12'"
        class="pa-4 d-flex justify-space-between " :class="mode == 'list' ? 'flex-column text-right' : ''">
        <h3 class="text-h4 semi pr-4 pt-4">
          <span class="body-2 text-secondary_text">{{ item.Price.Currency }}</span>{{
    item.Price.PVP.Amount.toFixed(2) }}
        </h3>
        <div>
          <div v-if="transferMode == 1">
            <v-btn color="primary" rounded="xl" variant="flat" density="comfortable"
              :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="unselectService()" v-if="selected"
              prepend-icon="mdi-minus-circle">
              Descartar</v-btn>
            <v-btn color="primary" variant="outlined" rounded="xl" density="comfortable"
              :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="selectService()"
              :disabled="item.NonRefundable || (!item.HaveCancellationPolicies ? $dayjs(cancellationPolicies.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day') : $dayjs(item.LastDayToCharge).isBefore($dayjs(), 'day'))"
              v-else prepend-icon="mdi-check-circle">Seleccionar</v-btn>
          </div>
          <v-btn color="primary" class="px-4" rounded="md" variant="flat" @click="addService" v-else>{{
    $capitalize($t('get_book'))
            }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps(['item', 'mode', 'selected', 'transferMode']);

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
    switch (word) {
      case 'Standard':
        return 'secondary';
      case 'Economy':
        return 'success';
      case 'Business':
        return 'primary';
      case 'First Class':
        return 'primary';
      case 'ELX':
        return 'primary';
      default:
        return 'default-chip-color';
    }
  }
  return 'default-chip-color';
};

const supplements = ref([])
const addOptionalSupplement = (supplement) => {
  if (supplement.select == true) {
    supplements.value.push(supplement)
  } else {
    supplements.value = supplements.value.filter(item => item.Id !== supplement.Id);
  }
}

const emit = defineEmits(['goTo', 'select', 'unselect'])

const selected = ref(props.selected)

function selectService() {
  props.item.supplements = supplements.value.map(item => item.Id) // Mapeamos el array de objetos para obtener un array de sus Ids
  emit('select')
}
function unselectService() {
  emit('unselect')
}

const addService = () => {
  let payload = {
    service: [props.item.Id],
    supplements: supplements.value
  };
  emit('goTo', payload)
}

const route = useRoute();

</script>