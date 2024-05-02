<template>
  <v-row dense>
    <v-col cols="12" :sm="compact ? '10' : '12'" id="col_search_card">
      <v-card rounded="md" class="search-card" flat
        :class="compact ? 'mb-1 bg-transparent' : ' pa-4 bg-foreground'" id="search_card">
        <v-row dense no-gutters :class="noresults ? 'justify-center' : ''">
          <v-col cols="12">
            <v-card :rounded="compact ? 'md' : ''" flat
              :class="compact ? 'pa-1 mb-2 border-secondary bg-foreground' : 'bg-foreground'">
              <v-row class="align-center" dense :no-gutters="compact">
                <!-- INPUT CIUDADES RETIRO -->
                <v-col cols="12" sm="5" :class="compact ? 'pr-2' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon :icon="'mdi-map-marker'" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">{{ $capitalize($t('pickup_city')) }}</span>
                  <CommonPlacesSearch :compact="compact" :label="$capitalize($t('arrival_place'))" serviceType="2"
                    :length="compact ? '85' : '85'" :searchedPlace="selectedPickupPlace"
                    @update:selectedPlace="handleSelectedPickupPlace" />
                </v-col>
                <!-- INPUT OFICINAS RETIRO -->
                <v-col cols="12" sm="3" :class="compact ? 'pr-2' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon :icon="'mdi-car-key'" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">{{ $capitalize($t('pickup_office')) }}</span>
                  <CarsOfficesSearch :compact="compact" :label="$capitalize($t('search_pickup_office'))" type="pickup"
                    :selectedPlace="selectedPickupPlace" :searchedOffice="selectedPickupOffice" 
                    @update:selectedOffice="handleSelectedPickupOffice" />
                </v-col>
                <!-- INPUT FECHA RECOGIDA-->
                <v-col cols="12" sm="2" :class="compact ? 'pr-2' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">Fecha de retiro
                  </span>
                  <v-no-ssr>
                    <VueDatePicker v-model="pickupDate" class="search-datepicker-input" :class="compact ? '' : ' mt-2'"
                      ref="dateP" :clearable="false" :dark="theme.name != 'ThemeLight'" :teleport="true"
                      :enable-time-picker="false" locale="es" :min-date="new Date()" auto-apply >
                      <template #action-buttons="{ value }">
                        <v-btn variant="flat" rounded="xl" color="primary" @click="selectPickupDate">
                          {{ $capitalize($t("confirm")) }}</v-btn>
                      </template>
                      <template #action-preview="{ value }">
                      </template>
                      <template #dp-input="{ }">
                        <v-btn class="btn-search-date" :variant="(compact && !isMobile) ? 'tonal' : themed">
                          <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                          {{ $dayjs(pickupDate).format("DD/MM/YYYY") }}
                        </v-btn>
                      </template>
                    </VueDatePicker>
                  </v-no-ssr>
                </v-col>
                <!-- INPUT HORA RECOGIDA-->
                <v-col cols="12" sm="2" :class="compact ? '' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon icon="mdi-car-clock" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">Hora de retiro
                  </span>
                  <v-no-ssr>
                    <VueDatePicker v-model="pickupTime" class="search-datepicker-input" :class="compact ? '' : ' mt-2'"
                      ref="timeP" :clearable="false" :dark="theme.name != 'ThemeLight'" :teleport="true"
                      time-picker locale="es" minutes-increment="15">
                      <template #action-buttons="{ value }">
                        <v-btn variant="flat" rounded="xl" color="primary" @click="selectPickupTime">
                          {{ $capitalize($t("confirm")) }}</v-btn>
                      </template>
                      <template #action-preview="{ value }">
                      </template>
                      <template #dp-input="{ }">
                        <v-btn class="btn-search-date" :variant="(compact && !isMobile) ? 'tonal' : themed">
                          <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
                          {{ pickupTime.hours }}:{{ pickupTime.minutes < 10 ? '0' + pickupTime.minutes :
      pickupTime.minutes }} hs </v-btn>
                      </template>
                    </VueDatePicker>
                  </v-no-ssr>
                </v-col>
              </v-row>
              <v-row class="align-start" dense :no-gutters="compact" :class="compact ? 'mt-2' : ''">
                <!-- INPUT CIUDADES DEVOLUCIÓN -->
                <v-col cols="12" :sm="differentReturnPoint ? '5' : '8'" :class="compact ? 'pr-2' : 'pr-2'">
                  <div v-if="differentReturnPoint">
                    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                      <v-icon :icon="'mdi-map-marker'" color="foreground" size="x-small"></v-icon> </v-avatar><span
                      class="body-1 semi" v-if="!compact">Ciudad de devolución</span>
                    <CommonPlacesSearch :compact="compact" :label="$capitalize($t('arrival_place'))" serviceType="2"
                    :length="compact ? '85' : '85'" :searchedPlace="selectedReturnPlace"
                      @update:selectedPlace="handleSelectedReturnPlace" />
                  </div>
                  <v-switch v-model="differentReturnPoint" color="secondary" density="compact" hide-details
                    :label="$capitalize($t('return_another_office'))" class="body-2"
                    :class="compact ? 'ml-2' : 'ml-2 mt-2'" @click="toggle">
                  </v-switch>
                </v-col>
                <!-- INPUT OFICINA DEVOLUCIÓN -->
                <v-col cols="12" sm="3" :class="compact ? 'pr-2' : 'pr-2'"
                  v-if="differentReturnPoint">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon :icon="'mdi-car-key'" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">Oficina de devolución</span>
                  <CarsOfficesSearch :compact="compact" :label="$capitalize($t('search_pickup_office'))" type="return"
                    :selectedPlace="selectedReturnPlace" :searchedOffice="selectedReturnOffice"
                    @update:selectedOffice="handleSelectedReturnOffice" />
                </v-col>
                <!-- INPUT FECHA DEVOLUCIÓN-->
                <v-col cols="12" sm="2" :class="compact ? 'pr-2' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon icon="mdi-calendar-today" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">Fecha de devolución
                  </span>
                  <v-no-ssr>
                    <VueDatePicker v-model="returnDate" class="search-datepicker-input" :class="compact ? '' : ' mt-2'"
                      ref="dateR" :clearable="false" :dark="theme.name != 'ThemeLight'" :teleport="true"
                      :enable-time-picker="false" locale="es" :min-date="pickupDate" auto-apply>
                      <template #action-buttons="{ value }">
                        <v-btn variant="flat" rounded="xl" color="primary" @click="selectReturnDate">
                          {{ $capitalize($t("confirm")) }}</v-btn>
                      </template>
                      <template #action-preview="{ value }">
                      </template>
                      <template #dp-input="{ }">
                        <v-btn class="btn-search-date" :variant="(compact && !isMobile) ? 'tonal' : themed">
                          <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                          {{ $dayjs(returnDate).format("DD/MM/YYYY") }}
                        </v-btn>
                      </template>
                    </VueDatePicker>
                  </v-no-ssr>
                </v-col>
                <!-- INPUT HORA DEVOLUCION-->
                <v-col cols="12" sm="2" :class="compact ? '' : 'pr-2'">
                  <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
                    <v-icon :icon="'mdi-car-clock'" color="foreground" size="x-small"></v-icon> </v-avatar><span
                    class="body-1 semi" v-if="!compact">Hora devolución
                  </span>
                  <v-no-ssr>
                    <VueDatePicker v-model="returnTime" class="search-datepicker-input" :class="compact ? '' : ' mt-2'"
                      ref="timeR" :clearable="false" :dark="theme.name != 'ThemeLight'" :teleport="true"
                      time-picker locale="es" minutes-increment="15">
                      <template #action-buttons="{ value }">
                        <v-btn variant="flat" rounded="xl" color="primary" @click="selectReturnTime">
                          {{ $capitalize($t("confirm")) }}</v-btn>
                      </template>
                      <template #action-preview="{ value }">
                      </template>
                      <template #dp-input="{ }">
                        <v-btn class="btn-search-date" :variant="(compact && !isMobile) ? 'tonal' : themed">
                          <v-icon icon="mdi-clock-outline" class="mr-2"></v-icon>
                          {{ returnTime.hours }}:{{ returnTime.minutes < 10 ? '0' + returnTime.minutes :
      returnTime.minutes }} hs </v-btn>
                      </template>
                    </VueDatePicker>
                  </v-no-ssr>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" :sm="compact ? '2' : '12'" class="text-center">
      <v-btn rounded="md" color="primary" :variant="compact ? 'tonal' : 'flat'"
        :class="compact ? 'semi mt-1' : 'semi mt-3'" :block="isMobile" :size="compact ? 'large' : 'x-large'"
        prepend-icon="mdi-magnify" @click="searchResults" :disabled="!validForm">
        {{ $capitalize($t("search")) }}
      </v-btn>
      <CommonSearchBy v-if="!compact && !nologo" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

//#region imports
import { useTheme } from 'vuetify/framework';
import dayjs from "dayjs";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

//#endregion

//#region boilerplate
const isMobile = useMobile()
const theme = ref(useTheme())
const props = defineProps(["noplaces", "compact", "noresults", "nologo", "themed", "divider"]);
const route = useRoute();
//#endregion

//#region DESIGN


//#endregion

//#region PLACES

const selectedPickupPlace: Ref<any> = ref(null);
const selectedReturnPlace: Ref<any> = ref(null)
const differentReturnPoint: Ref<boolean> = ref(false)

//#region OFFICES
const selectedPickupOffice: Ref<any> = ref(null)
const selectedReturnOffice: Ref<any> = ref(null)

const handleSelectedPickupPlace = (place: any) => {
  selectedPickupPlace.value = place;
}

const handleSelectedReturnPlace = (place: any) => {
  selectedReturnPlace.value = place;
}

const handleSelectedPickupOffice = (place: any) => {
  selectedPickupOffice.value = place;
}

const handleSelectedReturnOffice = (place: any) => {
  selectedReturnOffice.value = place;
}


//#endregion

//#region DATES
const d = new Date();

const pickupDate: Ref<Date> = ref(d);
d.setDate(d.getDate() + 1)
const returnDate: Ref<Date> = ref(d);
const dateP = ref();
const dateR = ref();

const selectPickupDate = () => {
  dateP.value.selectDate();
};

const selectReturnDate = () => {
  dateR.value.selectDate();
};

//#endregion

//#region TIME

interface Time {
  hours: number;
  minutes: number;
}


const timeP = ref();
const timeR = ref();
const pickupTime: Ref<Time> = ref(null);
const returnTime: Ref<Time> = ref(null);

const selectPickupTime = () => {
  timeP.value.selectDate();
};

const selectReturnTime = () => {
  timeR.value.selectDate();
};
//#endregion

watch(pickupDate, (newDate) => {
  if (returnDate.value <= pickupDate.value) {
    const newReturnDate = new Date(pickupDate.value.getTime() + 86400000);
    returnDate.value = newReturnDate;
  }
})

//#region lifecycles
onMounted(() => {
  const date = new Date();
  const dateT = new Date(date.getTime() + 86400000);
  pickupDate.value = date;
  pickupTime.value = { hours: 10, minutes: 0 };
  returnDate.value = dateT;
  returnTime.value = { hours: 10, minutes: 0 };

  if (route.query.pickUpTime && route.query.pickUpDate) {
    pickupDate.value = dayjs((route.query.pickUpDate as string)).toDate();
    const [hoursStr, minutesStr] = (route.query.pickUpTime as string).split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    pickupTime.value = {
      hours: hours,
      minutes: minutes
    }

    selectedPickupPlace.value = {
      Id: route.query.pickUpCityId,
      SmartSearchEnum: 7,
      Name: decodeURI(route.query.pickUpCityName as string)
    }

    selectedPickupOffice.value = {
      Id: route.query.pickUpOfficeId,
      Name: decodeURI(route.query.pickUpOfficeName as string)
    }

    if (route.query.returnCityId) {
      differentReturnPoint.value = true
      selectedReturnPlace.value = {
        Id: route.query.returnCityId,
        SmartSearchEnum: 7,
        Name: decodeURI(route.query.returnCityName as string)
      }
      selectedReturnOffice.value = {
      Id: route.query.returnOfficeId,
      Name: decodeURI(route.query.returnOfficeName as string)
    }
      
    }

    if (route.query.returnDate && route.query.returnTime) {
      returnDate.value = dayjs(route.query.returnDate as string).toDate();
      const [hoursStr, minutesStr] = (route.query.returnTime as string).split(':');
      const hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr);
      returnTime.value = {
        hours: hours,
        minutes: minutes
      }
    } else {


    }

  }


});


//#endregion

//#region search

async function searchResults() {
  const router = useRouter();
  const query = {
    isOnAirport: 'true',
    pickUpDate: dayjs(pickupDate.value).format('YYYY-MM-DD'),
    pickUpTime: pickupTime.value.hours + ':' + (pickupTime.value.minutes < 10 ? '0' + pickupTime.value.minutes : pickupTime.value.minutes),
    returnTime: returnTime.value.hours + ':' + (returnTime.value.minutes < 10 ? '0' + returnTime.value.minutes : returnTime.value.minutes),
    returnDate: dayjs(returnDate.value).format('YYYY-MM-DD'),
    nationality: "AR",
    residence: "AR",
    currency: "USD",
    pickUpOfficeId: selectedPickupOffice.value.OfficeCode,
    pickUpCityId: selectedPickupPlace.value.Id,
    pickUpCityName: encodeURI(selectedPickupPlace.value.Name),
    pickUpOfficeName: encodeURI(selectedPickupOffice.value.Name)
  }

  if (differentReturnPoint.value && selectedReturnOffice.value && selectedReturnPlace.value) {
    Object.assign(query, {
      returnOfficeId: selectedReturnOffice.value?.OfficeCode,
      returnCityId: selectedReturnPlace.value?.Id,
      returnCityName: encodeURI(selectedReturnPlace.value?.Name),
      returnOfficeName: encodeURI(selectedReturnOffice.value.Name)
    })
  }

  //NUEVA BUSQUEDA DESDE RESULTS
  if (route.path == "/cars/results") {
    router.replace({
      path: "/cars/results",
      query: query
    }).then(() => {

    })
  }
  else {
    //BUSQUEDA NORMAL
    navigateTo({
      path: "/cars/results",
      query: query
    })
  }
}
//#endregion

const validForm: Ref<boolean> = computed(() => {
  let valid: boolean =
    selectedPickupOffice.value != null
    && dayjs(pickupDate.value).isValid()
    && pickupTime.value != null;

  if (differentReturnPoint.value) {
    valid = selectedReturnOffice.value
      && dayjs(returnDate.value).isValid()
      && returnTime.value != null;
  }

  return valid;
})

const toggle = () => {
  differentReturnPoint.value = !differentReturnPoint.value
}

</script>
