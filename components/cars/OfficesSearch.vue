<template>
 <v-menu :close-on-content-click="isMobile ? true : false" origin="overlap" v-model="menuSearch"
    :location="isMobile ? 'top' : 'bottom'" 
    :max-height="isMobile ? '' : '450'" :min-height="isMobile ? '750' : ''"
    :max-width="isMobile ? '360' : '380'" :min-width="isMobile ? '360' : '380'"> 
    <template v-slot:activator="{ props }">
      <v-btn class="btn-search-places" :class="!compact ? 'mt-2' : ''" variant="tonal" v-bind="props"
        :disabled="!selectedPlace">
        <span class="text-primary_text" v-if="searchedOffice">
          {{ formatOfficeHeader(searchedOffice.Name) }}
        </span>
        <span class="text-primary_text" v-else-if="selectedOffice">
          {{ formatOfficeHeader(selectedOffice.Name) }}
        </span>
        <span class="text-secondary_text" v-else>{{ label }}</span>
      </v-btn>
    </template>
    <v-card rounded="md" class="card-search-places py-2">
      <v-card-title>
        <v-text-field autofocus variant="outlined" ref="searchField" :density="isMobile ? 'default' : 'compact'"
          v-model="search" clearable
          :placeholder="selectedOffice ? selectedOffice.Name : $capitalize($t('where_are_you_going'))" hide-details
          class="body-2"></v-text-field>
      </v-card-title>
      <v-skeleton-loader :loading="store.isLoadingOffices" type="list-item-two-line, list-item-two-line">
        <v-card-text class="pa-0">
          <v-list>
            <v-list-item class="search-list-item" v-for="office in filteredOffices" :key="office.id"
              @click="selectOffice(office)">
              <h4 class="body-1 semi text-primary_text">
                <v-icon class="mr-1" :icon="usePlaceIcon(office?.SmartSearchEnum)" size="sm">
                </v-icon>
                {{ formatOfficeHeader(office?.Name) }}
              </h4>
              <h6 class="body-3 ml-5 text-secondary_text">
                {{ formatOfficeSubheader(office?.Name) }}
              </h6>
            </v-list-item>
          </v-list>
          <div v-if="filteredOffices.length === 0">
            <p class="px-6 py-2 body-3">{{ $t("no_results") }}</p>
          </div>
        </v-card-text>
      </v-skeleton-loader>
    </v-card>
  </v-menu>
</template>
|
<script setup>
const isMobile = useMobile()
const props = defineProps(['compact', 'type', 'searchedOffice', 'selectedPlace', 'label']);
const emit = defineEmits(['update:selectedOffice']);

const menuSearch = ref(false);
const search = ref('');
const selectedOffice = ref(null);
const store = useCarsStore();

const pickupOffices = ref([])
const returnOffices = ref([])

watch(() => props.selectedPlace, (newValue, oldValue) => {
  if (newValue) {
    fetchOffices(props.type);
  }
}, { deep: true });

async function fetchOffices(type) {
  const cityId = props.selectedPlace?.Id;
  try {
    await useNuxtApp().$toast.promise(
      store.fetchOffices({ cityCode: cityId, forReturn: type == 'return' }), {
      error: 'Error al obtener los datos'
    });

    if (type == 'pickup') {
      pickupOffices.value = store.getPickupOffices;
    } else {
      returnOffices.value = store.getReturnOffices;
    }

    if (type == 'pickup' && pickupOffices.value.length > 0) {
      selectOffice(pickupOffices.value[0])
    } else if (type == 'return' && returnOffices.value.length > 0) {
      selectOffice(returnOffices.value[0])
    }

  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  if (props.type) {
    fetchOffices(props.type);
  }
});

const formatOfficeHeader = (name) => {
  const parts = name.split('-')
  if (!parts) return;
  const description = parts[0]?.trim();
  return description;
}

const formatOfficeSubheader = (name) => {
  const parts = name.split('-')
  if (!parts) return;
  const address = parts[1]?.trim();
  return address;
}

const searchField = ref(null);

const filteredOffices = computed(() => {
  const offices = [...pickupOffices.value, ...returnOffices.value];
  return offices.filter(office => office.Name.toLowerCase().includes(search.value.toLowerCase()));
});

function selectOffice(office) {
  selectedOffice.value = office;
  emit('update:selectedOffice', office);
  menuSearch.value = false;
  search.value = '';
}
</script>