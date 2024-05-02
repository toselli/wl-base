<template>
  <v-card class="pa-1 pa-md-4 bg-midground" flat rounded="lg">
    <v-form v-model="valid">
      <div v-for="(passenger, index) in passengers">
        <h4 class="body-1 semi mb-3">Pasajero {{ index + 1 }} <span class="body-3">Adulto</span></h4>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="passenger.FirstName" label="Nombre" variant="outlined" :rules="nameRules"
              density="compact" class="mb-3" :tabindex="indexService + '1' + index + 1 + '1'"> </v-text-field>
            <v-select v-model="passenger.DocumentType" label="Tipo Doc" variant="outlined" density="compact" class="mb-3"
              :items="documentTypes" :tabindex="indexService + '1' + index + 1 + '3'"> </v-select>
            <v-autocomplete v-model="passenger.Nationality" label="Nacionalidad" variant="outlined" density="compact"
              item-title="name" item-value="Id" eager :items="countries"
              :tabindex="indexService + '1' + index + 1 + '5'">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="passenger.LastName" label="Apellido" variant="outlined" class="mb-3" density="compact"
              :rules="nameRules" :tabindex="indexService + '1' + index + 1 + '2'"> </v-text-field>
            <v-text-field v-model="passenger.DocumentNumber" label="N° Documento" variant="outlined" class="mb-3"
              density="compact" :rules="documentRules" :tabindex="indexService + '1' + index + 1 + '4'"
              @input="onChangeDocumentNumber(passenger)"> </v-text-field>
            <v-text-field v-model="passenger.CUIT" label="CUIT" variant="outlined" class="mb-3"
              v-if="serviceType == 'flights'" density="compact" :rules="cuitRules"
              :tabindex="indexService + '1' + index + 1 + '4'"> </v-text-field>
            <v-autocomplete v-model="passenger.Residence" label="Residencia" variant="outlined" density="compact"
              item-title="name" item-value="Id" eager :items="countries"
              :tabindex="indexService + '1' + index + 1 + '6'">
            </v-autocomplete>
          </v-col>
          <v-col cols="8" offset="2">
            <v-phone-input v-model="passenger.PhoneNumber" label="Teléfono pasajero líder" countryLabel="País"
              :includeCountries="['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'PE', 'PY', 'UY', 'US', 'VE']"
              country-icon-mode="svg" :countryProps="{ variant: 'outlined', density: 'compact' }"
              invalidMessage="Ingrese un número de teléfono válido." :rules="phoneRules"
              :phoneProps="{ variant: 'outlined', density: 'compact' }"
              v-if="indexService == 1 && index == 0 && showPhone" />
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-card>
</template>

<script setup>
import 'flag-icons/css/flag-icons.min.css';
import 'v-phone-input/dist/v-phone-input.css';
import {
  VPhoneInput
} from 'v-phone-input';

const props = defineProps(["passengers", "indexService", "showPhone", "serviceType"]);
const countries = ref([])

const store = usePlacesStore();
const documentTypes = ref(['DNI', 'Pasaporte']);

//VALIDATION

const valid = ref(false);

const { nameRules, documentRules, phoneRules, cuitRules, requiredRules } = useFormRules();

const emit = defineEmits(['valid'])

watch(valid, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    emit('valid', true);
  } else {
    emit('valid', false);
  }
});

//COUNTRIES

async function getCountries() {
  try {
    await useNuxtApp().$toast.promise(store.fetchCountries(), {})
    countries.value = store.countries
  } catch (error) {
    console.log(error);
  } finally {

  }
}

//PASSENGERDATA

const passengersStore = usePassengersStore();

function onChangeDocumentNumber(passenger) {
  if (passenger.DocumentNumber && passenger.DocumentNumber.length >= 8) {
    getPassengerData(passenger);
  }
}

async function getPassengerData(passenger) {
  let payload = {
    documentType: passenger.DocumentType,
    documentNumber: passenger.DocumentNumber
  }
  try {
    const res = await useNuxtApp().$toast.promise(
      passengersStore.fetchPassengerData(payload),
      {
        pending: "Recuperando datos de pasajero",
        error: "Error al recuperar datos de pasajero",
      }
    );
    res.FirstName && (passenger.FirstName = res.FirstName);
    res.LastName && (passenger.LastName = res.LastName);
    res.Residence && (passenger.Residence = res.Residence);
    res.Nationality && (passenger.Nationality = res.Nationality);
  } catch (error) {
    console.log(error);
  } finally {

  }
}

onMounted(() => {
  getCountries();
  props.passengers.forEach(passenger => {
    passenger.Residence = 'AR';
    passenger.Nationality = 'AR';
  });
});


</script>

<style>
.v-phone-input .v-select .v-field__outline__end {
  border-radius: 0 !important;
}

.v-phone-input .v-text-field:not(.v-select) .v-field__outline__start {
  border-radius: 0 !important;
}
</style>