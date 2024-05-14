<template>
  <v-card rounded="lg" class="list-avail-card fill-height mb-2" variant="outlined" v-if="showItem">
    <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
      <v-col :md="mode == 'list' ? '3' : '11'" cols="11" class="pa-0 d-flex flex-column pl-4 justify-center">
        <h4 class="semi" :class="mode == 'grid' ? 'mt-4' : ''"> {{ item.Room.Description }}</h4>
        <h6 v-if="item.Room.BedTypes.length > 0" class="body-2 semi mt-1">
          <v-icon icon="mdi-bed"></v-icon>
          Tipos de cama:
        </h6>
        <div v-if="item.Room.BedTypes.length > 0">
          <p class="mt-1 body-2" v-for="bedType in item.Room.BedTypes" v-html="bedType.Value">
          </p>
        </div>
        <span class="text-success body-3 mt-1" v-if="item.ProviderRef">
          ({{ item.ProviderRef?.Value }})
        </span>
        <!-- <v-alert class="bg-info" v-if="item.DebugInfo"
                      v-html="item.DebugInfo">
                    </v-alert> -->
      </v-col>
      <v-divider vertical class="ma-3" v-if="mode == 'list'"></v-divider>
      <v-col cols="12" :md="mode == 'list' ? '3' : '6'" :class="mode == 'list' ? 'pa-4' : 'px-4'"
        class="d-flex justify-center flex-column align-start">
        <!-- <ul class="list-unstyled">
          <li v-for="promo in item.Promos">
            <div v-if="promo.Value">
              <span class="bg-info" v-html="promo.Value">
              </span>
            </div>
          </li>
          <li v-for="promo of item.PromosWithToolTip">
            <div v-if="promo.Value">
              <span class="body-1" v-html="promo.Value">
              </span>
            </div>
          </li>
        </ul> -->
        <div v-if="item.Price.PVP.IncludedSupplements.length > 0" class="body-2">
          <strong>Incluye:</strong>
          <p v-for="supplement in item.Price.PVP.IncludedSupplements">
            {{ supplement.Description }}
          </p>
        </div>
        <div v-if="item.Price.PVP.Boards.length > 0">
          <div v-for="board in item.Price.PVP.Boards">
            <strong class="body-2 semi"> {{ board.Description }}:</strong>
            <v-chip v-if="board.Amount == 0" size="small" variant="outlined" color="success" class="mx-1">
              Sin cargo
            </v-chip>
            <strong v-if="board.Amount > 0">
              {{ item.Price.Currency }} {{ board.Amount }}
            </strong>
          </div>
        </div>
        <div v-if="item.Price.PVP.MandatoryAtDestinationSupplements.length > 0" class="body-2">
          <strong>
            Pago en destino:
          </strong>
          <p v-for="supplement in item.Price.PVP.MandatoryAtDestinationSupplements"
            class="body-2 d-flex justify-space-between">
            <span>
              {{ item.Price.Currency }} {{ supplement.Amount }}
            </span>
            <span class="ml-2">
              {{ supplement.Description }}
            </span>
          </p>
        </div>
      </v-col>
      <v-divider class="ma-2" v-if="mode == 'grid' || isMobile"></v-divider>
      <v-col cols="12" :md="mode == 'list' ? '3' : '12'" :class="mode == 'list' ? 'pa-4' : 'px-4'"
        class="d-flex justify-center flex-column align-start">
        <!-- CONSULTAR POLITICAS -->
          <v-progress-circular indeterminate color="primary" v-if="!item.HaveCancellationPolicies"></v-progress-circular>
        <!-- POLITICAS CONSULTADAS -->
        <div v-else>
          <v-chip size="small" variant="outlined" color="error" class="my-1 mx-1"
            v-if="!item.NonRefundable && $dayjs(item.LastDayToCharge).isBefore($dayjs(), 'day')">
            Cancelación con cargo
          </v-chip>
          <v-chip size="small" variant="outlined" color="success" class="my-1 mx-1" v-else-if="!item.NonRefundable">
            Cancelación sin cargo
          </v-chip>
          <v-chip size="small" variant="outlined" color="secondary" class="my-1 mx-1" v-if="item.DirectChain">
           Cadena directa
          </v-chip>
          <v-chip size="small" variant="outlined" color="secondary" class="my-1 mx-1" v-if="item.ChainBrand != null">
            {{ item.ChainBrand.Key }}
          </v-chip>
          <v-chip size="small" variant="outlined" color="secondary" class="my-1 mx-1"
            v-if="item.Room.CurrentAllotment > 1 && item.Room.CurrentAllotment < 5">
            QUEDAN {{ item.Room.CurrentAllotment }} HABITACIONES!
          </v-chip>
          <v-chip size="small" variant="outlined" color="warning" class="my-1 mx-1" v-if="item.Room.CurrentAllotment == 1">
            QUEDA 1 HABITACION!
          </v-chip>
          <v-chip size="small" variant="outlined" color="info" v-if="item.Package" class="my-1 mx-1">
            Package Rate
          </v-chip>
          <v-chip size="small" v-if="item.NonRefundable" class="bg-error my-1 mx-1">
            No reembolsable
          </v-chip>
        </div>
      </v-col>
      <v-divider class="ma-2" v-if="mode == 'grid' || isMobile"></v-divider>
      <v-divider vertical class="ma-3" v-if="mode == 'list'"></v-divider>
      <!-- PRICE -->
      <v-col cols="12" :md="mode == 'list' ? '2' : '12'" :class="mode == 'list' ? 'py-3' : 'pb-3'">
        <v-row dense class="text-right"
          :class="mode == 'list' ? 'justify-space-between flex-column' : 'justify-space-around'">
          <v-col :class="isMobile ? 'py-4' : ''">
            <!-- <span class="body-2 text-secondary_text text-decoration-line-through" v-if="item.ProviderPrice > item.Price.PVP.Total">{{ item.Price.Currency }} {{
              item.ProviderPrice.toFixed(2) }}
            </span>
            <v-chip color="success" size="small" class="ml-1 semi"  v-if="item.ProviderPrice > item.Price.PVP.Total"> {{ item.SavingsPercentage.toFixed(0) }}% Off
            </v-chip> -->
            <h3 class="semi">
              <span class="body-2 text-secondary_text mr-1">{{ item.Price.Currency }}</span> {{
                item.Price.PVP.Total.toFixed(2) }}
              <v-btn variant="text" icon size="small" density="compact" color="success">
                <v-icon icon="mdi-tag"></v-icon>
                <v-menu activator="parent" width="180">
                  <v-card class="pa-4 body-1">
                    <p class="mb-2">
                      <span class="semi">Tarifa: </span> {{ item.Price.Currency }} {{
                        item.Price.PVP.Amount.toFixed(2) }}
                    </p>
                    <p>
                      <span class="semi">Impuestos: </span>
                      {{ item.Price.Currency }} {{ item.Price.PVP.TaxSummary.toFixed(2) }}
                    </p>
                  </v-card>
                </v-menu>
              </v-btn>
            </h3>
            <!-- <p class="body-2 text-secondary_text">{{ $t('per_night') }}</p> -->
          </v-col>
          <v-col :class="mode == 'list' ? 'pl-6' : 'text-center'">
            <div v-if="!item.HaveCancellationPolicies && !item.cancellationPoliciesFetched">
              <v-chip density="comfortable" rounded="xl" color="error" class="body-2 semi"
                :class="mode == 'list' ? 'mt-2' : 'mt-5'">
                No disponible
              </v-chip>
            </div>
            <div v-else>
              <div v-if="multiple">
                <v-btn color="primary" rounded="md" variant="flat" density="comfortable"
                  :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="unselectRoom()" v-if="selected">
                  <v-icon icon="mdi-minus-circle"></v-icon>Descartar</v-btn>
                <v-btn color="primary" variant="outlined" rounded="md" density="comfortable"
                  :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="selectRoom()"
                  :disabled="item.NonRefundable || (!item.HaveCancellationPolicies ? $dayjs(cancellationPolicies.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day') : $dayjs(item.LastDayToCharge).isBefore($dayjs(), 'day'))"
                  v-else> <v-icon icon="mdi-check-circle"></v-icon>Seleccionar</v-btn>
              </div>
              <div v-else>
                <div v-if="!item.HaveCancellationPolicies">
                  <v-btn color="primary" rounded="md" variant="flat" :block="mode == 'list'"
                    :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="$emit('book')"
                    v-if="cancellationPolicies.NonRefundable == true || $dayjs(cancellationPolicies.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day')"
                    :disabled="!can('SellNonRef', 'Bookings')">{{
                      $capitalize($t('get_book')) }}</v-btn>
                  <v-btn color="primary" rounded="md" variant="flat" :block="mode == 'list'"
                    :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="$emit('book')" v-else>{{
                      $capitalize($t('get_book')) }}</v-btn>
                </div>
                <div v-else>
                  <v-btn color="primary" rounded="md" variant="flat" :block="mode == 'list'"
                    :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="$emit('book')"
                    v-if="item.NonRefundable == true || $dayjs(item.LastDayToCharge).isBefore($dayjs().add(1, 'day'), 'day')"
                    :disabled="!can('SellNonRef', 'Bookings')">{{
                      $capitalize($t('get_book')) }} </v-btn>
                  <v-btn color="primary" rounded="md" variant="flat" :block="mode == 'list'"
                    :class="mode == 'list' ? 'mt-2' : 'mt-6'" @click="$emit('book')" v-else>{{

                      $capitalize($t('get_book')) }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
//MOBILE
const isMobile = useMobile()
const { can } = usePermissions();
const props = defineProps(["item", "mode", "multiple", "selected"]);

const emit = defineEmits(['select', 'unselect','hide'])

function selectRoom() {
  emit('select')

}
function unselectRoom() {
  emit('unselect')
}

//CANCELLATION

const showItem = ref(true);

async function hideIfNoCancellationPolicies() {
  if (props.item.HaveCancellationPolicies) {
    return;
  }
  try {
    await delay(15000); 
    if (!props.item.HaveCancellationPolicies) {
      showItem.value = false;
    }
  } catch (error) {
    console.error('Error ocurred while waiting:', error);
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onUpdated(() => {
  hideIfNoCancellationPolicies();
});


</script>

