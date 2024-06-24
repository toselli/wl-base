<template>
  <v-container class="content-container">
    <v-row dense>
      <v-col>
        <checkout-back-results-btn />
      </v-col>
    </v-row>
    <v-card rounded="lg" width="750" class="bg-midground mx-auto my-8" v-if="notAvailableCard">
      <v-card-text class="pa-6">
        <v-alert size="large" class="text-center" color="error" variant="tonal" border="start">
          <h4 class="text-h5 text-primary_text">Esta opción ya no se encuentra disponible. Por favor seleccione otra
            opcion.</h4>
        </v-alert>
        <v-row dense class="mt-5">
          <v-col><v-btn variant="flat" color="primary" block rounded="xl" @click="backToAvail">Seleccionar otra
              opción</v-btn></v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row class="mt-2" v-else>
      <v-col cols="12" md="7" v-if="prebooking?.Services">
        <v-alert border="start" variant="tonal" color="warning" rounded="lg" density="compact" class="mb-2 body-1"
          v-if="prebooking?.Services[0]?.PriceHasChanged">
          El precio ha cambiado de la última vez que vió esta reserva
        </v-alert>
        <v-card rounded="lg" class="card-checkout-forms-content pa-4 mb-4" v-if="isMobile">
          <checkout-details-card :booking="prebooking" :serviceType="serviceType" />

        </v-card>
        <v-card rounded="lg" class="card-checkout-forms">

          <v-row class="mb-4">
            <v-col cols="12" md="4">
              <h3 class="text-h4 semi mt-2">Completar detalles</h3>
            </v-col>
            <v-col>
              <v-alert border="start" variant="tonal" color="warning" rounded="lg" density="compact">
                <v-row dense>
                  <v-col cols="4" md="3">
                    <h4 class="text-h6">
                      <v-icon>mdi-clock-outline</v-icon>{{ minutes }}:{{ formatSeconds(seconds) }}
                    </h4>
                  </v-col>
                  <v-col class="text-primary_text">
                    <h6 class="body-2 semi">¡Finaliza el checkout lo antes posible!</h6>
                    <p class="body-3">Los precios y la disponibilidad pueden cambiar.</p>
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
          </v-row>
          <!-- GRUPO -->
          <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
          <v-card rounded="lg" class="card-checkout-forms-content pa-4 mb-4" v-else>
            <h4 class="text-h6 semi mb-4">Grupo de compra</h4>
            <v-radio-group v-model="purchaseGroup" inline density="compact" color="secondary" hide-details>
              <v-radio label="Nuevo grupo" :value="0" class="body-1"></v-radio>
              <v-radio label="Grupo existente" :value="1" class="body-1"></v-radio>
            </v-radio-group>
            <v-text-field density="compact" type="number" width="300" class="body-2" variant="outlined"
              v-if="purchaseGroup == 1" label="Escriba el código del grupo existente" hide-details
              v-model="purchaseGroupId"></v-text-field>
          </v-card>
          <!-- SELECCIONAR AGENTE -->
          <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
          <checkout-select-agent-card class="mb-4" :client-selected="clientSelected" :sellerSelected="sellerSelected"
            :clientSellerSelected="clientSellerSelected" :services="prebooking.Services"
            @update:sellerSelected="sellerSelected = $event"
            @update:clientSellerSelected="clientSellerSelected = $event" @update:clientSelected="seedClientSelected"
            v-else />
          <!-- INFO EXTRA -->
          <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
          <checkout-service-extra-info-card class="mb-4" :booking="prebooking" :serviceType="serviceType"
            @update:transferInDetailsFrom="prebooking.TransferInDetailsFrom = $event"
            @update:transferInDetailsTo="prebooking.TransferInDetailsTo = $event"
            @update:transferOutDetailsFrom="prebooking.TransferOutDetailsFrom = $event"
            @update:transferOutDetailsTo="prebooking.TransferOutDetailsTo = $event" @valid="validExtraInfo" v-else>
          </checkout-service-extra-info-card>
          <!-- PASAJEROS -->
          <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
          <checkout-passengers :booking="prebooking" :serviceType="serviceType" @validPax="validPax" class="mb-4"
            v-else />
          <!-- CREDIT CARD -->
          <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
          <v-card rounded="lg" v-else class="card-checkout-forms-content pa-4 mb-4" v-if="isHotelCollect">
            <div v-if="!selectedPayment">
              <h4 class="text-h6 semi mb-2">Método de pago</h4>
              <p class="body-2 text-secondary_text mb-2">Seleccione el método de pago con el que desea pagar la reserva
              </p>
              <div class="d-flex ">
                <img src="/base/img/visa_c.svg" width="60" class="" />
                <img src="/base/img/mastercard.svg" width="60" />
                <img src="/base/img/amex.svg" width="60" />
                <v-btn rounded="md" class="mt-2" flat color="background" @click="creditCardDialog = true">
                  Agregar tarjeta <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
            <div v-else>
              <h4 class="text-h6 semi mb-2">Método de pago seleccionado</h4>
              <v-btn rounded="md" class="float-right" flat color="background" @click="creditCardDialog = true">
                Modificar método de pago <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <h4 class="body-1 d-flex align-center mt-3">
                <img :src="'/base/img/' + selectedPayment.cardType + '.svg'" width="60" class="border" />
                <span class="ml-2">terminada en {{ selectedPayment.cardNumber.slice(-4) }}</span>
              </h4>

            </div>
          </v-card>
          <checkout-credit-card-dialog v-model="creditCardDialog" @close="creditCardDialog = false"
            @update:selectedPayment="selectPayment" />
          <!-- PETICIONES ESPECIALES -->
          <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
          <checkout-comments v-else :comments="comments" @update:comments="comments = $event" />
        </v-card>
      </v-col>
      <v-col cols="12" md="5" v-if="prebooking?.Services">
        <!-- DETALLES -->
        <v-card rounded="lg" class="card-checkout-details">
          <checkout-details-card :booking="prebooking" :serviceType="serviceType" v-if="!isMobile" />
          <!-- POLITICAS  -->
          <v-divider class="my-3" v-if="!isMobile"></v-divider>
          <h4 class="text-h5 mb-2">Políticas de cancelación</h4>
          <checkout-policies-card :booking="prebooking" :serviceType="serviceType"></checkout-policies-card>
          <v-divider class="my-3"></v-divider>
          <!-- PRECIOS  -->
          <h4 class="text-h5 mb-2">Detalles del costo</h4>
          <v-skeleton-loader v-if="priceLoading" type="card">
          </v-skeleton-loader>
          <checkout-price-card v-else :services="prebooking?.Services" :price="prebooking?.Price"
            :serviceType="serviceType" :retail="false"></checkout-price-card>
          <!-- TERMINOS  -->
          <v-checkbox class="body-1 mt-3" v-model="terms" color="secondary">
            <template v-slot:label>
              <div> Estoy de acuerdo con los
                <a class="text-secondary_darken semi" @click.prevent="openTerms()">términos y condiciones y política de
                  privacidad</a>
              </div>
            </template>
          </v-checkbox>
          <checkout-terms-dialog v-model="termsDialog" @close="termsDialog = false">
          </checkout-terms-dialog>
          <!-- BOTON CONFIRMAR -->
          <v-btn variant="flat" size="large" block color="primary" rounded="xl" :disabled="!validBooking || loading"
            :loading="loading"
            v-if="prebooking?.Services[0]?.NonRefundable || $dayjs(prebooking?.Services[0]?.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day')"
            @click="finishBookingOnCancellation">Confirmar reserva con gastos
          </v-btn>
          <v-btn variant="flat" size="large" block color="primary" rounded="xl" :disabled="!validBooking || loading"
            @click="finishBooking" :loading="loading" v-else>Confirmar reserva
          </v-btn>
          <h4 class="body-2 text-error my-3 mx-3"> {{ tooltipValidBooking }}</h4>
          <v-divider class="my-5"></v-divider>
          <p class="text-secondary_text body-1"><v-icon icon="mdi-account-lock" color="success"></v-icon> Nuestro
            proceso de transmisión es seguro</p>
          <p class="text-secondary_text body-1 mt-2"><v-icon icon="mdi-check-circle" color="success"></v-icon>
            Protegemos tu información personal</p>
        </v-card>
        <v-dialog width="450" v-model="confirmBookingOnCancellationPoliciesDialog" persistent
          v-if="prebooking?.Services">
          <v-card class="pa-7" rounded="xl">
            <v-icon size="50" color="warning" class="mx-auto mb-4">mdi-information-outline</v-icon>
            <div v-if="prebooking?.Services[0]?.NonRefundable">
              <p class="mb-3">
                Esta reserva tiene vencimiento en el día de hoy, el voucher se emitirá automáticamente para evitar su
                cancelación.</p>
              <p class="mb-3">Esta tarifa especial con descuento es <strong>no reembolsable</strong>. Por lo tanto, si
                elige cambiar o cancelar esta reserva, el pago no será reembolsado.</p>
              <p> ¿Confirma esta reserva de <strong>{{ prebooking?.Services[0]?.PriceRetail.Currency }} {{
      prebooking?.Services[0]?.PriceRetail.PVP.Total.toFixed(2) }}</strong> sin reembolso?</p>
            </div>
            <div v-else>
              <p class="mb-3">
                Esta reserva tiene gastos de cancelación, el voucher se emitirá automáticamente para evitar ser
                cancelada.
              </p>
              <p class="mb-3">Esta es una tarifa especial con descuento, por lo tanto, si elige cambiar o cancelar esta
                reserva, el pago no será reembolsado en su totalidad.</p>
              <p> ¿Confirma esta reserva de <strong>{{ prebooking?.Services[0]?.PriceRetail.Currency }} {{
      prebooking?.Services[0]?.PriceRetail.PVP.Total.toFixed(2) }}</strong>?</p>
            </div>
            <v-btn variant="flat" size="large" block color="primary" rounded="xl" :disabled="!validBooking" class="mt-6"
              @click="finishBooking">Confirmar reserva
            </v-btn>
            <v-btn color="primary_text" rounded="xl" class="mt-2" variant="outlined"
              @click="confirmBookingOnCancellationPoliciesDialog = false">Cancelar
            </v-btn>
          </v-card>
        </v-dialog>
      </v-col>
      <!-- DIALOG EXITO -->
      <checkout-booking-success-dialog v-model="successBookingDialog" :booking="prebooking" :serviceType="serviceType"
        :waitingProvider="waitingProvider" :bookingConfirmed="bookingConfirmed" @back="backToAvail" />
      <!-- DIALOG NO DISPONIBLE -->
      <v-dialog v-model="notAvailableCard" width="450px" radius="xl" persistent>
        <v-card rounded="lg" class="bg-midground">
          <v-card-text class="pa-6">
            <v-alert size="large" class="text-center" color="error" variant="tonal" border="start">
              <h4 class="text-h5 text-primary_text">Esta opción ya no está disponible.</h4>
            </v-alert>
            <v-row dense class="mt-5">
              <v-col><v-btn variant="flat" color="primary" block rounded="xl" @click="backToAvail">Seleccionar otra
                  opción</v-btn></v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- DIALOG ERROR -->
      <v-dialog v-model="errorBookingDialog" width="450px" radius="xl">
        <v-card rounded="lg" class="bg-midground">
          <v-card-text class="pa-6">
            <v-alert size="large" class="text-center" color="error" variant="tonal" border="start">
              <h4 class="text-h5 text-primary_text">Ocurrió un error al realizar su reserva</h4>
              <p class="body-1 semi text-primary_text mt-4">Revise la información solicitada e intente nuevamente.</p>
            </v-alert>
            <stays-checkout-details-card v-if="details" :compact="true" :details="details"
              class="mt-5"></stays-checkout-details-card>
            <v-row dense class="mt-5">
              <v-col>
                <v-btn variant="flat" color="primary" block rounded="xl" @click="finishBooking">Intentar
                  nuevamente</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- DIALOG TIMEOUT -->
      <v-dialog v-model="timeoutDialog" width="450px" radius="xl" persistent>
        <v-card rounded="lg" class="bg-midground">
          <v-card-text class="pa-6">
            <v-alert size="large" class="text-center" color="error" variant="tonal" border="start">
              <h4 class="text-h5 text-primary_text">Finalizó el tiempo de espera para confirmar su reserva</h4>
              <p class="body-1 semi text-primary_text mt-4">Vamos a volver a la página anterior para comprobar la
                disponibilidad.</p>
            </v-alert>
            <v-row dense class="mt-5">
              <v-col><v-btn variant="flat" color="primary" block rounded="xl" @click="backToAvail">Comprobar nueva
                  disponibilidad</v-btn></v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script setup>
const isMobile = useMobile()
//SERVICE TYPE
const route = useRoute();
const serviceType = route.query.serviceType
const store = useServiceStore(serviceType);

//HOTEL COLLECT - B2C

const anonymousUser = useCookie('anonymousUser')
const runtimeConfig = useRuntimeConfig()
const isHotelCollect = route.query.isHotelCollect
const b2c = runtimeConfig.public.b2c === 'true'
const creditCardDialog = ref(false)

const selectedPayment = ref(null)

function selectPayment(data) {
  selectedPayment.value = data
}

//LOGGED USER

const usersStore = useUsersStore();
const { getLoggedUser } = storeToRefs(usersStore);


//CHECKOUT DATA

const purchaseGroup = ref(0)
const purchaseGroupId = ref(null)

watch(() => purchaseGroup.value, (newValue, oldValue) => {
  if (purchaseGroup.value == 0) {
    purchaseGroupId.value = null
  }
}, { deep: true });

const details = ref({})

const loading = ref(false);
const prebooking = ref({})

const { getPrebooking } = storeToRefs(store)
const clientSelected = ref('')

async function getBasket() {
  loading.value = true
  try {
    let payload = {
      basketId: route.query.id,
      currency: 'USD'
    }
    await useNuxtApp().$toast.promise(store.getBasket(payload), {
      pending: "Solicitando datos",
      success: "Datos correctos",
      error: "La reserva ya no esta disponible o contiene errores...",
    })
    prebooking.value = getPrebooking.value

    sellerSelected.value = prebooking.value.Services[0].Seller
    seedClientSelected(prebooking.value.Services[0].Agency)
  } catch (error) {
    notAvailableCard.value = true
  } finally {
    loading.value = false
  }
}

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
        openTimeoutDialog()
      }
    }
  }, 1000);
}

function formatSeconds(value) {
  return value < 10 ? `0${value}` : value;
}

const timeoutDialog = ref(false)

function openTimeoutDialog() {
  if (successBookingDialog.value == false) {
    timeoutDialog.value = false
  }
}

//BACK

function backToAvail() {
  timeoutDialog.value = false
  useBackButton();
}

//AGENTS

const clientSellerSelected = ref(null)
const sellerSelected = ref(null)

//TERMS

const termsDialog = ref(false)

function openTerms() {
  termsDialog.value = true
}

//VALIDATION
const terms = ref(false)

const validPassengers = ref(false)
function validPax(value) {
  validPassengers.value = value
}

const validExtraInfoVar = ref(false)

function validExtraInfo(value) {
  validExtraInfoVar.value = value
}

const validBooking = computed(() => {
  if (serviceType === 'transfers') {
    if (!validExtraInfoVar.value) {
      return false;
    }
  } else {
    validExtraInfoVar.value = true
  }
  switch (true) {
    case !terms.value:
      return false;
    case !validPassengers.value:
      return false;
    case sellerSelected.value === null:
      return false;
    case clientSelected.value === null:
      return false;
    default:
      return true;
  }
});

const tooltipValidBooking = computed(() => {
  let tooltipMessage = '';
  if (!terms.value && validPassengers.value && sellerSelected.value != null) {
    tooltipMessage = "Para continuar, acepte los términos y condiciones.";
  } else if (terms.value && !validPassengers.value && sellerSelected.value != null) {
    tooltipMessage = "Para continuar, complete los datos de los pasajeros.";
  } else if (terms.value && validPassengers.value && sellerSelected.value == null) {
    tooltipMessage = "Para continuar, no olvide seleccionar un agente.";
  } else if (!terms.value && validPassengers.value && sellerSelected.value == null) {
    tooltipMessage = "Para continuar, acepte los términos y condiciones y no olvide seleccionar un agente.";
  } else if (!terms.value && !validPassengers.value && sellerSelected.value != null) {
    tooltipMessage = "Para continuar, acepte los términos y condiciones y complete los datos de los pasajeros.";
  } else if (terms.value && !validPassengers.value && sellerSelected.value == null) {
    tooltipMessage = "Para continuar, complete los datos de los pasajeros  y no olvide seleccionar un agente.";
  } else if (!terms.value && !validPassengers.value && sellerSelected.value == null) {
    tooltipMessage = "Para continuar, acepte los términos y condiciones, complete los datos de los pasajeros y seleccione un agente.";
  }
  if (!validExtraInfoVar.value) {
    tooltipMessage += " Agregue la información extra requerida.";
  }
  return tooltipMessage;
});

// NO DISPONIBLE

const notAvailableCard = ref(false)

// CONFIRMAR RESERVA

const comments = ref('')
const successBookingDialog = ref(false)
const errorBookingDialog = ref(false)
const paymentProcessor = ref('RSTAFF')

const { can } = usePermissions();
const confirmBookingOnCancellationPoliciesDialog = ref(false)

async function finishBookingOnCancellation() {
  confirmBookingOnCancellationPoliciesDialog.value = true
}
const dayjs = useDayjs()


async function finishBooking() {
  // if (prebooking.value.Services[0].NonRefundable == true || dayjs(prebooking.value.Services[0].LastDayToCharge).isBefore(dayjs().add(1, 'day'), 'day')) {
  //   paymentProcessor.value = 'RSTAFF'
  // }
  // else if (can('Sellers', 'Division')) {
  //   paymentProcessor.value = 'RSTAFF'
  // } else {
  //   paymentProcessor.value = 'RAGE'

  // }
  loading.value = true
  errorBookingDialog.value = false
  const payload = createPayload()
  try {
    let bookingsToPay = []
    await useNuxtApp().$toast.promise(store.updateServices(payload), {
      pending: "Preparando datos de la reserva",
    }).then((res) => {
      bookingsToPay = res
    })
    let payloadPayment = {
      BasketId: prebooking.value.Services[0].BasketId,
      PaymentProcessorId: paymentProcessor.value,
      BookingsToPay: bookingsToPay,
      UrlCancel: 'https://adm2.ebooking.com.ar/',
      WebSiteId: prebooking.value.Services[0].WebSiteId,
      OwnerId: prebooking.value.Services[0].OwnerId,
      PaymentPromo: null,
      PaymentPromoItemId: null,
      CreditCardId: null,
      Customer: { DocumentType: 'DNI', CustomerType: 'FISICA', FiscalResponsability: 'Consumidor Final', Nationality: 'AR', Address: {} },
      AmountType: 0,
      Platform: 'web',
      OurRecordLocator: prebooking.value.Services[0].RecordLocator
    }
    processPayment(payloadPayment)
  } catch (error) {
    console.log(error)
    errorBookingDialog.value = true
    loading.value = false
  }
}

const createPayload = () => {
  const passengersReduce = prebooking.value.Services.reduce((acc, pax) => {
    return acc.concat(pax.Passengers);
  }, []);

  let payload = {
    BasketId: route.query.id,
    Comments: [],
    Customer: {
      DocumentType: "DNI",
      CustomerType: "FISICA",
      FiscalResponsability: "Consumidor Final",
      Nationality: "AR",
      Address: {}
    },
    Passengers: passengersReduce,
    PaymentProcessorId: paymentProcessor.value,
    PurchaseGroupId: purchaseGroupId.value,
    Reference: '',
    SellerRef: sellerSelected.value,
  }

  if (serviceType == 'stays') {
    payload.BedTypes = []
    payload.House = false
  } else if (serviceType == 'transfers') {
    payload.TransferInDetailsFrom = prebooking.value.TransferInDetailsFrom
    payload.TransferInDetailsTo = prebooking.value.TransferInDetailsTo
    payload.TransferOutDetailsFrom = prebooking.value.TransferOutDetailsFrom
    payload.TransferOutDetailsTo = prebooking.value.TransferOutDetailsTo
  }

  if (getLoggedUser.value && can('Sellers', 'Division')) {
    payload.SellerRef = {
      Key: getLoggedUser.value.LegacyId,
      Value: getLoggedUser.value.FullName,
    }
  }

  if (comments.value != '') {
    payload.Comments.push(comments.value)
  }

  return payload
}


watch(sellerSelected, (newValue, oldValue) => {
  if (newValue?.Key !== oldValue?.Key)
    updatePrice()
})

const priceLoading = ref(false)
const updatePrice = async () => {
  priceLoading.value = true;
  try {
    let payload = {
      basketId: route.query.id,
      currency: 'USD'
    }
    await useNuxtApp().$toast.promise(store.getBasket(payload), {
      pending: "Actualizando comisión",
      success: "Datos correctos",
      error: "La reserva ya no esta disponible o contiene errores...",
    })
    prebooking.value.Price = getPrebooking.value.Price
    prebooking.value.PriceRetail = getPrebooking.value.PriceRetail
  }
  catch (e) {

  }
  finally {
    priceLoading.value = false;
  }
}

const commonStore = useCommonServicesStore();

async function processPayment(payload) {
  await useNuxtApp().$toast.promise(commonStore.processPayment(payload)
    .then((res) => {
      callProvider(res)
        .then(() => {

          successBookingDialog.value = true
          loading.value = false
        });
      console.log(res)
    }), {
    pending: "Enviando datos al proveedor",
  })

}

async function callProvider(payload) {
  try {
    const response = await fetch(payload.FormData.FormAction, {
      method: 'GET',
      redirect: 'manual'
    });

    if (response.type === 'opaqueredirect') {
      getBookingByTransaction(payload.TransactionId);
    } else {
      console.log("Código de estado de la respuesta:", response.status);
    }
  } catch (error) {
    console.error('Error en la llamada:', error);
  }
}


const bookingConfirmed = ref(null)
const waitingProvider = ref(false)

async function getBookingByTransaction(transaction) {
  let payload = {
    transactionId: transaction,
    currency: 'USD'
  }
  waitingProvider.value = true
  await useNuxtApp().$toast.promise(commonStore.getBookingByTransaction(payload), {
    pending: "Consultando estado de reserva en proveedor",
    success: "Datos obtenidos"
  }).then((res) => {
    bookingConfirmed.value = res
    waitingProvider.value = false
  })
};

const seedClientSelected = ($clientSelected) => {

  clientSelected.value = $clientSelected ? { Id: $clientSelected.Key, FantasyName: $clientSelected.Value } : null
}


//MOUNTED
const { toTop } = useScroll();

onMounted(() => {
  getBasket()
  startCountdown()
  toTop()
});

</script>
