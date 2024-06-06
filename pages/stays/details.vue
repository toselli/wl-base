<template>
  <v-container class="content-container">
    <v-row dense>
      <v-col>
        <v-btn prepend-icon="mdi-chevron-left" rounded="sm" variant="outlined" density="comfortable"
          @click="backToResults"> Volver a los resultados</v-btn>
      </v-col>
    </v-row>
    <v-row dense class="mt-md-1">
      <v-col>
        <stays-search-card :compact="true" :noplaces="true" themed="tonal" />
      </v-col>
    </v-row>
    <v-skeleton-loader v-if="loading" class="list-result-loader mt-4" type="card">
    </v-skeleton-loader>
    <v-row dense v-if="getLoggedUser && property && !loading" justify="space-between"
      :class="isMobile ? 'flex-column-reverse' : ''" class="mb-2">
      <v-col cols="12" md="9">
        <h2 class="semi">{{ property.Name }}
          <v-rating v-model="property.Category" density="compact" size="small" color="orange" v-if="property.Category"
            readonly half-increments></v-rating>
        </h2>
        <p class="body-2 my-2"><v-icon icon="mdi-map-marker"></v-icon>{{ property.Address }}, <span
            v-if="property.City">{{ property.City.Value }}</span>,
          <span v-if="property.Country"> {{ property.Country.Value }}</span> <v-btn size="x-small" flat rounded="xl"
            append-icon="mdi-chevron-right" class="body-2 ml-2"
            :href="'https://www.google.com/maps/search/?api=1&query=' + property.Address" target="_blank">Ver
            mapa</v-btn>
        </p>
        <v-row justify="space-between" v-if="property.Details">
          <v-sheet rounded="lg" color="secondary_lighten"
            class="d-flex align-center justify-center text-center mt-3 ml-3" width="65"
            v-if="property.Details.GuestRatingOverall">
            <h2 class="semi text-secondary">{{ property.Details.GuestRatingOverall }}</h2>
          </v-sheet>
          <v-col class="mt-2">
            <h3 class="semi">{{ $capitalize($t(property.Details.GuestRatingQualification)) }}</h3>
            <p class="body-1">Calificación de los huéspedes</p>
            <p class="body-2 semi mt-1 mb-0">{{ property.Details.GuestRatingCount }} opiniones</p>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3">
        <v-hover v-slot="{ isHovering, props }">
          <v-card flat rounded="lg" @click="imageGallery = true">
            <v-img :src="property.Thumb" v-bind="props" height="180px" cover>
              <v-expand-transition>
                <div v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out justify-center align-center v-card--reveal"
                  style="height: 100%;">
                  <v-btn color="white" variant="flat" rounded="xl" size="small" @click="imageGallery = true"
                    prepend-icon="mdi-camera">
                    Ver {{ property.Images.length }} fotos
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
        </v-hover>
        <v-dialog width="650" v-model="imageGallery">
          <v-card>
            <v-carousel show-arrows="hover" hide-delimiters height="100%">
              <v-carousel-item v-for="(item, index) in property.Images" :key="index">
                <v-img :src="item.Url" :loading="true" @error="handleImageError(index)">
                  <v-btn icon="mdi-close" class="float-right ma-3" density="compact" fab
                    @click="imageGallery = false"></v-btn>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row dense class="mb-2">
      <v-col class="text-right">
        <v-btn color="primary" rounded="xl" variant="flat" v-if="goToCheckoutBtn" @click="goToCheckoutMultiple">
          Ir a confirmar reserva
        </v-btn>
        <v-bottom-sheet v-model="goToCheckoutSheet" inset>
          <v-card class="pt-4 px-8 pb-16 mb-n8" rounded="xl">
            <v-card-text class="text-center">
              <h4 class="pb-6">¿Confirmar selección y continuar al checkout?</h4>
              <v-btn color="primary" variant="tonal" rounded="xl" class="px-12 mx-2" @click="goToCheckoutSheet = false">
                No, quiero cambiar mis habitaciones
              </v-btn>
              <v-btn color="primary" rounded="xl" variant="flat" class="px-12" @click="goToCheckoutMultiple">
                Si, confirmar y continuar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-bottom-sheet>
      </v-col>
    </v-row>
    <v-sheet rounded="lg" class="pa-1 bg-midground" v-if="getLoggedUser" :class="isMobile ? '' : 'd-inline-block'">
      <v-tabs v-model="detailsTabs" class="text-secondary_text" active-class="text-secondary" color="secondary"
        density="compact" align-tabs="start" hide-slider :show-arrows="isMobile">
        <v-tab :value="1">Disponibilidad</v-tab>
        <v-tab :value="2">Detalles del hotel</v-tab>
        <v-tab :value="3">Habitaciones</v-tab>
        <v-tab :value="4">Opiniones</v-tab>
        <v-tab :value="5">Hoteles cercanos</v-tab>
      </v-tabs>
    </v-sheet>
    <v-window v-model="detailsTabs" class="bg-midground rounded-lg mt-1">
      <v-window-item :value="1">
        <v-row dense justify="center">
          <v-col v-if="property && rooms.length == 0" class="mt-12 d-flex justify-center flex-column">
            <v-progress-circular indeterminate color="primary" size="50" class="mx-auto"></v-progress-circular>
            <h3 class="text-center">
              Buscando las mejores habitaciones en
            </h3>
            <h2 class="semi text-center pb-12">
              {{ property.Name }}
            </h2>
          </v-col>
        </v-row>
        <!-- FORZAR LOGIN -->
        <auth-force-login-card v-if="!getLoggedUser" />
        <v-container v-if="getLoggedUser != null" class="pa-3">
          <v-sheet rounded="lg" class="pt-2 d-inline-block bg-midground" v-if="rooms.length > 1">
            <v-tabs v-model="roomsTabs" class="text-secondary_text" color="secondary_darken" align-tabs="start"
              hide-slider>
              <v-tab :value="index" v-for="room, index in rooms" class="body-2 mr-2">
                Habitación {{ index + 1 }} <span class="mx-3">|</span> <v-icon>mdi-account</v-icon> {{ room.Adults
                }}
                <span v-if="room.Children > 0"> <span class="mx-1">+</span>
                  <v-icon>mdi-baby-face-outline</v-icon> {{
            room.Children }} </span>
              </v-tab>
            </v-tabs>
          </v-sheet>
          <v-window v-model="roomsTabs">
            <v-window-item :value="index" v-for="room, index in rooms">
              <v-container v-if="avail">
                <v-row dense class="mb-2">
                  <v-col cols="12" md="4">
                    <v-btn-toggle v-model="availMode" density="compact" mandatory color="midground"
                      class="btn-toggle-large bg-secondary_lighten" variant="flat" rounded="md"
                      selected-class="btn-toggle-large-selected" v-if="activeHotelCollect">
                      <v-btn class="my-1 mx-1 body-2 text-primary_text bg-background" rounded="md">
                        Pago por agencia ({{ filteredAvail(room.Id).length }})
                      </v-btn>
                      <v-btn class="my-1 mx-1 body-2 text-primary_text bg-background" rounded="md"
                        :disabled="filteredAvailHotelCollect(room.Id).length == 0">
                        Pago directo al hotel ({{ filteredAvailHotelCollect(room.Id).length }})
                      </v-btn>
                    </v-btn-toggle>
                    <h5 class="mt-3" v-else>
                      Encontramos <span class="text-primary">{{ currentAvail(room.Id).length }}</span> resultados
                    </h5>
                  </v-col>
                  <v-col cols="12" md="8" :class="!isMobile ? 'text-right' : ''">
                    <stays-details-tools :viewMode="viewMode" :loading="loading" @orderDes="orderDes()"
                      @orderAsc="orderAsc()" @update:prompt="searchPrompt = $event; roomNumber = room.Id"
                      @update:showNonRef="showNonRef = $event" @update:showDirectChain="showDirectChain = $event"
                      @update:viewMode="viewMode = $event" :orderType="priceOrder" />
                  </v-col>
                </v-row>
                <!-- FILTROS -->
                <!-- RESULTS -->
                <v-row dense v-if="currentAvail(room.Id).length > 0">
                  <v-col :md="viewMode == 'list' ? 12 : 4" cols="12"
                    :class="viewMode == 'list' ? 'pa-0 d-flex flex-column' : ''"
                    v-for="result in currentAvail(room.Id).slice(0, limitAvail)">
                    <stays-list-avail-card :item="result" :mode="viewMode" @book="goToCheckoutSingle(result, property)"
                      :multiple="rooms.length > 1 ? true : false" @select="selectRoom(room.Id, result.Id)"
                      @unselect="unselectRoom(result.Id)" :selected.sync="isSelected(result.Id)"
                      :class="hasId(result.Id) ? 'list-avail-card-selected mb-2' : 'mb-2'">
                    </stays-list-avail-card>
                  </v-col>
                  <v-col cols="12" v-if="currentAvail(room.Id).length > limitAvail">
                    <v-skeleton-loader type="list-item-avatar-three-line" class="rounded-lg list-result-card">
                    </v-skeleton-loader>
                  </v-col>
                  <v-col cols="12" dense justify="center">
                    <div v-if="avail.length > limitAvail" v-intersect="onIntersect">
                    </div>
                  </v-col>
                </v-row>
                <v-row class="mt-3" justify="center"
                  v-if="currentAvail(room.Id).length == 0 && !isReceiving">
                  <v-col cols="12">
                    <h3 class="text-center">En este momento no hay habitaciones disponibles</h3>
                    <v-img src="/base/img/services/no_avail.png" width="280" class="my-6 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text text-center  mt-5">
                      Pruebe modificando las fechas o buscando en hoteles cercanos
                    </h4>
                    <stays-search-card :compact="true" :noplaces="true" :noresults="true" class="mx-auto mt-2" />
                    <StaysNearPropertiesGrid :items="nearProperties" :principal="property" v-if="property" />
                  </v-col>
                </v-row>
                <v-row class="mt-3" justify="center"
                  v-if="currentAvail(room.Id).length == 0 && searchPrompt">
                  <v-col cols="12">
                    <h3 class="text-center">No hay habitaciones con su filtro de búsqueda</h3>
                    <v-img src="/base/img/services/no_avail.png" width="280" class="my-6 mx-auto"></v-img>
                    <h4 class="body-1 semi text-secondary_text text-center  mt-5">
                      Pruebe modificando sus filtros
                    </h4>
                  </v-col>
                </v-row>
                <StaysFinishSearchBottomSheet v-model="finishSearch" v-if="!isReceiving && avail.length > 0 && !configStore.getConfig.autoOrderbyPrice"
                  :results="avail.length" :rooms="rooms.length" @close="finishSearch = false"
                  @orderResults="orderAsc(); finishSearch = false" />
              </v-container>
            </v-window-item>
          </v-window>
        </v-container>
      </v-window-item>
      <v-window-item :value="2">
        <v-container v-if="property">
          <v-row>
            <v-col cols="12" md="6">
              <v-card flat class="mb-3 bg-midground" rounded="lg">
                <v-card-text class="pa-4">
                  <h4 class="text-h6 mb-2">Ubicación</h4>
                  <p class="body-2 semi my-2"><v-icon icon="mdi-map-marker"></v-icon>{{ property.Address }}, {{
            property.City.Value }}
                    {{ property.Country.Value }} </p>
                  <div class="body-2 mb-2" v-html="property.Details.LocationDescription"></div>
                  <v-btn size="small" variant="outlined" rounded="xl" append-icon="mdi-chevron-right" class="body-2"
                    :href="'https://www.google.com/maps/search/?api=1&query=' + property.Address" target="_blank">Ver
                    mapa</v-btn>
                </v-card-text>
              </v-card>
              <v-card flat class="mb-3 bg-midground" rounded="lg">
                <v-card-text class="pa-6">
                  <h4 class="text-h6 mb-2">Puntos de interés cercanos</h4>
                  <div class="body-2" v-html="property.Details.AreaAttraction"></div>
                </v-card-text>
              </v-card>
              <v-card flat class="mb-3 bg-midground" rounded="lg">
                <v-card-text class="pa-6">
                  <h4 class="text-h6 mb-2">Instrucciones para Checkin</h4>
                  <div v-html="property.Details.CheckInInstructions" class="pa-3 body-2"></div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat class="mb-3 pa-3 bg-midground" rounded="lg">
                <h5 class="pa-1">
                  <v-icon icon="mdi-login" class="mr-2"></v-icon>Check-in: {{ property.Details.CheckInTime }}
                </h5>
                <h5 class="pa-1">
                  <v-icon icon="mdi-logout" class="mr-2"></v-icon> Check-out: {{ property.Details.CheckOutTime }}
                </h5>
                <h5 class="pa-1">
                  <v-icon icon="mdi-phone" class="mr-2"></v-icon> {{ property.Phone }}
                </h5>
              </v-card>
              <v-card flat class="mb-3 bg-midground" rounded="lg">
                <v-card-text class="pa-6">
                  <h4 class="text-h6 mb-2">Acerca del hotel</h4>
                  <div v-html="property.Details.RoomDetailDescription" class="body-2"></div>
                </v-card-text>
              </v-card>
              <v-card flat class="mb-3 bg-midground" rounded="lg">
                <v-card-text class="pa-6">
                  <h4 class="text-h6 mb-2">Amenities</h4>
                  <div class="body-2">{{ property.Details.AmenitiesDescription }}</div>
                  <h4 class="mt-3">Business Amenities</h4>
                  <p class="body-2 mb-2">{{ property.Details.BusinessAmenitiesDescription }}</p>
                </v-card-text>
              </v-card>
              <v-card flat class="mb-3 bg-midground" rounded="lg">
                <v-card-text class="pa-6">
                  <h4 class="text-h6 mb-2">Cargos adicionales</h4>
                  <div v-html="property.Details.MandatoryFeesDescription" class="pa-3 body-2"></div>
                  <h4 class="text-h6 mb-2">Infórmate antes de ir</h4>
                  <div v-html="property.Details.KnowBeforeYouGoDescription" class="pa-3 body-2"></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item :value="3">
        <v-container>
          <v-card flat class="mb-3 bg-midground" rounded="lg" v-for="roomsDetails in property.RoomTypes">
            <v-card-text class="pa-4">
              <h4 class="text-h4 mb-1"> {{ roomsDetails.Description }}</h4>
              <div v-html="roomsDetails.DescriptionLong" class="body-2"></div>
              <h5 class="my-1">Amenities</h5>
              <span v-for=" item in roomsDetails.Amenities" class="body-3">{{ item }} | </span>
            </v-card-text>
          </v-card>
        </v-container>
      </v-window-item>
      <v-window-item :value="4">
        <v-skeleton-loader v-if="loadingReviews" class="list-result-loader ma-4" type="list-item-avatar-three-line">
        </v-skeleton-loader>
        <v-card flat class="mt-4 bg-midground" rounded="xl" v-else>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" v-if="property && property.Details.GuestRatingOverall">
                <StaysGuestRatingCard :property="property" />
              </v-col>
              <v-col v-if="guestReviews.length > 0">
                <StaysGuestReviewsList :guestReviews="guestReviews" />
              </v-col>
              <v-col v-else>
                <p class="pa-5 text-center"> No hay opiniones para este establecimiento.</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-window-item>
      <v-window-item :value="5">
        <v-skeleton-loader v-if="loadingNear" class="list-result-loader ma-4 py-6" type="list-item-avatar-three-line">
        </v-skeleton-loader>
        <v-container v-else-if="nearProperties && nearProperties.length > 0">
          <v-row>
            <v-col cols="12" md="6">
              <StaysNearPropertiesMap :items="nearProperties" :principal="property" v-if="property"
                @goTo="goToDetails" />
            </v-col>
            <v-col cols="12" md="6">
              <StaysNearPropertiesList :items="nearProperties" :principal="property" v-if="property"
                @goToTab="goToDetails" />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>
    <!-- DIALOG TIMEOUT -->
    <v-dialog v-model="timeoutDialog" width="450px" radius="xl" persistent>
      <v-card rounded="lg" class="bg-midground">
        <v-card-text class="pa-6">
          <v-alert size="large" class="text-center" color="error" variant="tonal" border="start">
            <h4 class="text-h5 text-primary_text">Se agotó el tiempo de espera para realizar estas reservas</h4>
            <p class="body-1 semi text-primary_text mt-4">Vamos a comprobar la
              disponibilidad nuevamente.</p>
          </v-alert>
          <v-row dense class="mt-5">
            <v-col><v-btn flat color="primary" block rounded="xl" @click="reloadAvail()">Comprobar nueva
                disponibilidad</v-btn></v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()

//PERMISOS
const { can } = usePermissions();
//COUNTDOWN

const countdownTime = ref(900);
const minutes = ref(0);
const seconds = ref(0);
let countdownInterval = null;


function startCountdown() {
  minutes.value = Math.floor(countdownTime.value / 60);
  seconds.value = countdownTime.value % 60;

  countdownInterval = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--;
    } else {
      if (minutes.value > 0) {
        minutes.value--;
        seconds.value = 59;
      } else {
        clearInterval(countdownInterval);
        timeoutDialog.value = true
      }
    }
  }, 1000);
}

const timeoutDialog = ref(false)

function reloadAvail() {
  timeoutDialog.value = false
  startCountdown()
  getAvail()
}

//LOGGED USER

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);
const loadingLoggedUser = ref(false)

//LOGIN

onMounted(() => {
  loadingLoggedUser.value = true
  const loggedUser = getLoggedUser.value;
  occupancies.value = useOccupancies.parse(route.query.occupancies)
  if (loggedUser != null) {
    getDetails();
    getAvail();
    startCountdown();
    loadingLoggedUser.value = false
  } else {
    loadingLoggedUser.value = false
    // Esperar a que el usuario se loguee
    const unwatch = watch(getLoggedUser, (newValue, oldValue) => {
      if (newValue != null) {
        getAvail();
        getDetails();
        startCountdown();
        unwatch(); // Deja de observar una vez que el usuario se ha logueado
      }
    });
  }

  roomsSelected.value = [];
  toTop();
});

//GET DATA
const occupancies = ref([])
const property = ref({})
const detailsTabs = ref(1)
const route = useRoute();
const checkin = ref(route.query.checkIn);
const checkout = ref(route.query.checkOut);
const propertyId = ref(route.query.id)

const loading = ref(false);

const store = useStaysStore();

async function getDetails() {
  property.value = {}
  try {
    loading.value = true
    await useNuxtApp().$toast.promise(store.fetchDetails(propertyId.value), {
      error: 'Error al obtener los datos'
    })
    preloadImages()
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

watchEffect(() => {
  property.value = store.getDetails;
});

//IMAGES

const imageGallery = ref(false);

function preloadImages() {
  property.value.Images.forEach(function (item, index) {
    var img = new Image();
    img.src = item.Url
    img.onload = function () {
    }
    img.onerror = function () {
      property.value.Images.splice(index, 1);
      property.value.Images = [...property.value.Images];
    }
  })
};

function handleImageError(index) {
  // Marcamos la imagen como no disponible
  property.value.Images.splice(index, 1);
  // Aseguramos que Vue.js detecte el cambio en el array
  property.value.Images = [...property.value.Images];

};


//AVAIL
const avail = ref([])
const availHotelCollect = ref([])
const rooms = ref([])
const runtimeConfig = useRuntimeConfig()

async function getAvail() {
  roomsSelected.value = []
  let searchAvail = {
    CheckIn: checkin.value,
    CheckOut: checkout.value,
    Currency: "USD",
    House: false,
    Language: "es",
    Occupancies: occupancies.value,
    Nationality: "AR",
    Residence: "AR",
    PropertyId: propertyId.value,
  }
  if (!activeHotelCollect) {
    searchAvail.IsOnlyHotelCollect = null
  } else if (activeHotelCollect) {
    searchAvail.IsOnlyHotelCollect = false
  }
  try {
    await store.suscribeAvail();
    await store.fetchAvail(searchAvail);
    useNuxtApp().$toast.info('Buscando los mejores precios', { autoClose: runtimeConfig.public.searchTime, icon: "🚀", hideProgressBar: false, toastId: 'searchingToast', closeButton: false });
    avail.value = store.getAvail
    availHotelCollect.value = store.getAvailHotelCollect
    rooms.value = store.getRooms
    while (avail.value.length === 0 && property.value) {
      // Esperar 1 segundo antes de volver a comprobar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (avail.value.length == 0 && property.value) {
      fetchNearProperties();
    }
  } catch (error) {
    console.log(error);
  } finally {
  }
}

const finishSearch = ref(false)

const isReceiving = computed(() => store.getReceiving);

watch(isReceiving, (newValue, oldValue) => {
  if (newValue == oldValue)
    return;
  if (newValue === false) {
    useNuxtApp().$toast.remove("searchingToast");
    finishSearch.value = true
  }
});


//RESULTS
const searchPrompt = ref(null)
const roomNumber = ref(null)
const viewMode = ref('list')
const showNonRef = ref(true)
const showDirectChain = ref(false)
const priceOrder = ref("asc");
const roomsTabs = ref(0)
const dayjs = useDayjs()

function orderAsc() {
  avail.value = avail.value.sort((a, b) => a.Price.PVP.Total - b.Price.PVP.Total);
  priceOrder.value = 'asc'
}

function orderDes() {
  avail.value = avail.value.sort((a, b) => b.Price.PVP.Total - a.Price.PVP.Total);
  priceOrder.value = 'des'
}

const configStore = useConfigStore();

watch(() => configStore.getConfig, (newConfig) => {
    if (newConfig && newConfig.autoOrderbyPrice) {
      orderAsc()
    }
}, { immediate: true });

watch(avail, () => {
    if (priceOrder.value == 'asc') {
      orderAsc();
    }
}, { deep: true });

const filteredAvail = computed(() => roomId => {
  let results = avail.value.filter(result => result.RoomId === roomId);

  if (searchPrompt.value) {
    const lowerCaseRoomName = searchPrompt.value.toLowerCase();
    results = results.filter(result =>
      result.Room.Description.toLowerCase().includes(lowerCaseRoomName) ||
      result.Price.PVP.IncludedSupplements.some(supplement =>
        supplement.Description.toLowerCase().includes(lowerCaseRoomName)
      ) ||
      result.Price.PVP.Boards.some(board =>
        board.Description.toLowerCase().includes(lowerCaseRoomName)
      ) ||
      result.ProviderRef.Key.toLowerCase().includes(lowerCaseRoomName)
    );
  }

  if (!showNonRef.value) {
    results = results.filter(result => {
      const isNonRefundable = result.NonRefundable;
      const isBeforeThreshold = !dayjs(result.LastDayToCharge).isAfter(dayjs(), 'day');
      return !(isNonRefundable || isBeforeThreshold);
    });
  }

  if (showDirectChain.value) {
    results = results.filter(result => result.DirectChain);
  }

  return results;
});

const filteredAvailHotelCollect = computed(() => roomId => {
  let results = availHotelCollect.value.filter(result => result.RoomId === roomId);

  if (searchPrompt.value) {
    const lowerCaseRoomName = searchPrompt.value.toLowerCase();
    results = results.filter(result =>
      result.Room.Description.toLowerCase().includes(lowerCaseRoomName) ||
      result.Price.PVP.IncludedSupplements.some(supplement =>
        supplement.Description.toLowerCase().includes(lowerCaseRoomName)
      ) ||
      result.Price.PVP.Boards.some(board =>
        board.Description.toLowerCase().includes(lowerCaseRoomName)
      ) ||
      result.ProviderRef.Key.toLowerCase().includes(lowerCaseRoomName)
    );
  }

  if (!showNonRef.value) {
    results = results.filter(result => {
      const isNonRefundable = result.NonRefundable;
      const isBeforeThreshold = !dayjs(result.LastDayToCharge).isAfter(dayjs(), 'day');
      return !(isNonRefundable || isBeforeThreshold);
    });
  }

  if (showDirectChain.value) {
    results = results.filter(result => result.DirectChain);
  }

  return results;
});

//HOTEL COLLECT

const activeHotelCollect = runtimeConfig.public.activeHotelCollect === 'true'

const availMode = ref(0);

// Computed property para seleccionar el array correcto
const currentAvail = computed(() => roomId => availMode.value == 1 ? filteredAvailHotelCollect.value(roomId) : filteredAvail.value(roomId));

const limitAvail = ref(25)

const intersecting = ref(false)

function onIntersect(isIntersecting, entries, observer) {
  intersecting.value = entries[0].intersectionRatio >= 0.5
  if (intersecting.value) {
    viewMoreAvail()
  }
}

function viewMoreAvail() {
  limitAvail.value = limitAvail.value + 50
}

onBeforeUnmount(() => {
  store.handleUnsubscribeAvail()
});

watch(isMobile, (newValue) => {
  viewMode.value = newValue ? 'grid' : 'list';
});

const { toTop } = useScroll();


onBeforeRouteUpdate(async (to, from) => {
  if (to.query !== from.query) {
    checkin.value = to.query.checkIn
    checkout.value = to.query.checkOut
    occupancies.value = useOccupancies.parse(to.query.occupancies)
    propertyId.value = to.query.id
    roomsSelected.value = []
    nearProperties.value = []
    guestReviews.value = []
    getDetails()
    getAvail()
    startCountdown()
    toTop()
  }
});

//SELECCION MULTIPLE

const roomsSelected = ref([])
const goToCheckoutSheet = ref(false)
const goToCheckoutBtn = ref(false)

function selectRoom(room, item) {
  const existingIndex = roomsSelected.value.findIndex((element) => element.room === room);

  if (existingIndex !== -1) {
    // Si existe un elemento coincidente, reemplazarlo con el nuevo valor
    roomsSelected.value[existingIndex] = {
      room: room,
      id: item
    };
  } else {
    // Si no hay coincidencia, agregar un nuevo elemento al array
    roomsSelected.value.push({
      room: room,
      id: item
    });
  }
  if (roomsTabs.value + 1 != rooms.value.length) {
    roomsTabs.value = roomsTabs.value + 1
  }
  if (roomsSelected.value.length == rooms.value.length) {
    goToCheckoutSheet.value = true
    goToCheckoutBtn.value = true
  }
}

function unselectRoom(item) {
  const index = roomsSelected.value.indexOf(item);
  roomsSelected.value.splice(index, 1)
  goToCheckoutSheet.value = false
  goToCheckoutBtn.value = false
}

function hasId(itemId) {
  return roomsSelected.value.some(item => item.id === itemId);
}

function isSelected(itemId) {
  return roomsSelected.value.some(item => item.id === itemId);
}

// NEAR PROPERTIES

const nearProperties = ref([])
const loadingNear = ref(false)

async function fetchNearProperties() {
  let payload = {
    lat: property.value.Location.Latitude.toString(),
    lon: property.value.Location.Longitude.toString(),
    category: property.value.Category.toString(),
    limit: 6
  }
  try {
    loadingNear.value = true
    await useNuxtApp().$toast.promise(store.fetchNearProperties(payload), {
      pending: 'Buscando hoteles cercanos',
      success: 'Encontramos hoteles cercanos',
      error: 'No se encontraron hoteles cercanos'
    })
  } catch (error) {
    console.log(error);
  } finally {
    loadingNear.value = false;
  }
}

watchEffect(() => {
  nearProperties.value = store.getNearProperties;
})

const router = useRouter();

async function goToDetails(item) {
  await store.handleUnsubscribeAvail()
  detailsTabs.value = 1
  navigateTo({
    path: "/stays/details",
    query: {
      id: item.Id,
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      currency: 'USD',
      occupancies: route.query.occupancies,
      placeid: route.query.placeid,
      place: route.query.place
    },
    open: {
      target: '_blank'
    },
    wait: false
  });
}

// GUEST REVIEWS

watch(detailsTabs, (newValue, oldValue) => {
  if (newValue === 4 && guestReviews.value.length == 0) {
    fetchGuestReviews()
  }
  if (newValue === 5 && nearProperties.value.length == 0) {
    fetchNearProperties()
  }
});

const guestReviews = ref([])
const loadingReviews = ref(false)
async function fetchGuestReviews() {
  let payload = {
    id: property.value.Id,
    language: 'es',
  }
  try {
    loadingReviews.value = true
    await useNuxtApp().$toast.promise(store.fetchGuestReviewsById(payload), {
      pending: 'Buscando opiniones de huéspedes',
      success: 'Encontramos opiniones',
      error: 'No se encontraron opiniones'
    })
  } catch (error) {
    console.log(error);
  } finally {
    loadingReviews.value = false;
  }
}

watchEffect(() => {
  guestReviews.value = store.getGuestReviews;
})


// BACK TO RESULTS
function backToResults() {
  router.push({
    path: "/stays/results",
    query: {
      id: route.query.placeid,
      place: route.query.place,
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      occupancies: route.query.occupancies,
    },
    wait: false,
  });
}

// GO TO CHECKOUT

async function goToCheckoutSingle(item) {
  console.log(item)
  store.handleUnsubscribeAvail()
  try {
    let payload = {
      basketId: item.BasketId,
      websiteId: runtimeConfig.public.websiteId,
      availUrl: window.location.href,
      selectedPropertyServices: item.Id,
      selectedBoards: null
    }
    let isHotelCollect = item.IsHotelCollect
    await useNuxtApp().$toast.promise(store.addService(payload), {
      pending: 'Preparando todo para su reserva',
      error: 'Error al crear la reserva'
    })
    navigateTo({
      path: "/checkout/",
      query: {
        serviceType: 'stays',
        id: payload.basketId,
        property: route.query.id,
        checkIn: route.query.checkIn,
        checkOut: route.query.checkOut,
        occupancies: route.query.occupancies,
        placeid: route.query.placeid,
        place: route.query.place,
        isHotelCollect: isHotelCollect
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}

async function goToCheckoutMultiple() {
  store.handleUnsubscribeAvail()
  try {
    let payload = {
      basketId: store.basketId,
      websiteId: runtimeConfig.public.websiteId,
      availUrl: route.fullPath,
      selectedBoards: null,
      selectedPropertyServices: roomsSelected.value.map(item => item.id)
    }
    await useNuxtApp().$toast.promise(store.addService(payload), {
      pending: 'Preparando todo para su reserva',
      error: 'Error al crear la reserva'
    })
    navigateTo({
      path: "/checkout/",
      query: {
        serviceType: 'stays',
        id: store.basketId,
        property: route.query.id,
        checkIn: route.query.checkIn,
        checkOut: route.query.checkOut,
        occupancies: route.query.occupancies,
        placeid: route.query.placeid,
        place: route.query.place

      },
    });
  } catch (error) {
    console.log(error);
  } finally {
  }
}

</script>
