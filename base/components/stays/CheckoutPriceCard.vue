<template>
  <v-card v-for="(service, index) in services" v-if="services.length > 1" class="pa-3 bg-transparent mb-2" rounded="lg" flat>
    
    <h5 class="mb-2 ml-2" v-if="services.length > 1">Habitación {{ index + 1 }} <span class="body-3">- {{
      service.Room.Description }}</span></h5>
    <v-alert border="start" variant="tonal" rounded="lg" density="compact" class="text-primary_text bg-secondary_lighten"
      v-if="services.length > 1">
      <v-row>
        <v-col>
          <h4 class="body-1">Precio de venta
          </h4>
        </v-col>
        <v-col class="text-right" v-if="service.Price">
          <h4 class="body-1 semi">{{ service.Price.Currency }} {{ service.Price.PVP.Total.toFixed(2)
          }}</h4>
        </v-col>
      </v-row>
    </v-alert>
    <v-expansion-panels selected-class="foreground" class="my-1" v-if="services.length > 1">
      <v-expansion-panel rounded="lg" elevation="0">
        <v-expansion-panel-title class="body-2 semi">Detalle de habitación</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense>
            <v-col>
              <h5>Comisión {{ price.DiscountPercent * 100 }}</h5>
            </v-col>
            <v-col class="text-right">
              <span class="body-2">{{ service.Price.Currency }} {{
                service.Price.Discount.toFixed(2)
              }}</span>
            </v-col>
            <v-divider />
          </v-row>
          <v-row dense v-for="tax in service.Price.Net.Taxes">
            <v-col>
              <h5>+ {{ tax.TaxTypeName }}</h5>
            </v-col>
            <v-col class="text-right">
              <span class="body-2">{{ service.Price.Currency }} {{ tax.Amount.toFixed(2) }}</span>
            </v-col>
            <v-divider />
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels v-if="service.Room && service.Room.NightlyRates.length > 0" selected-class="foreground">
      <v-expansion-panel rounded="lg" elevation="0">
        <v-expansion-panel-title class="body-2 semi">Tarifas por noche</v-expansion-panel-title>
        <v-expansion-panel-text v-for="rate in service.Room.NightlyRates">
          <v-row dense>
            <v-col> <span class="body-2">{{ $dayjs(rate.Date).format('D MMM YYYY') }}</span>
            </v-col>
            <v-col class="text-right">
              <span class="body-2">{{ service.Price.Currency }} {{ rate.Amount.toFixed(2) }}</span>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
  <v-alert border="start" variant="tonal" color="secondary" rounded="lg" class="mt-2">
    <v-row>
      <v-col>
        <h4 class="text-h6">Precio total de venta <span class="body-3">(incluye impuestos)</span>
        </h4>
      </v-col>
      <v-col class="text-right">
        <h4 class="text-h6 semi">{{ services[0].Price.Currency }} {{ priceTotal.toFixed(2)
        }}</h4>
      </v-col>
    </v-row>
  </v-alert>
  <v-expansion-panels selected-class="foreground" class="mt-2">
    <v-expansion-panel rounded="xl" elevation="0">
      <v-expansion-panel-title class="body-1 semi">Detalle de compra</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row dense>
          <v-col>
            <h5>Comisión  {{ price.DiscountPercent * 100 }}%</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{
              priceDiscount.toFixed(2)
            }}</span>
          </v-col>
          <v-divider />
        </v-row>
        <v-row dense v-for="(totalAmount, taxTypeName) in taxTotals">
          <v-col>
            <h5>+ {{ taxTypeName }}</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{ totalAmount.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
        <v-row dense>
          <v-col>
            <h5 class="primary semi">Neto a pagar</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2 semi">{{ services[0].Price.Currency }} {{ price.Net.Total.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
        <v-row dense>
          <v-col>
            <h5>Precio sugerido</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{ price.PVP.Amount.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-expansion-panels selected-class="foreground" class="mt-2">
  <v-expansion-panel rounded="xl" elevation="0" v-if="!retail">
      <v-expansion-panel-title class="body-1 semi">Percepciones</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row v-if="price.RG3819 > 0">
          <v-col cols="7">
            <h5> Percepción Pago en Efectivo (RG 3819)</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{ price.RG3819.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
        <v-row v-if="price.RG4659 > 0">
          <v-col cols="7">
            <h5> Percepción Impuesto PAIS (RG 4659)</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{ price.RG4659.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
        <v-row v-if="price.RG4815 > 0">
          <v-col cols="7">
            <h5> Percepción Impuesto a las Ganancias (RG 4815)</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{ price.RG4815.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
        <v-row v-if="price.RG5272 > 0">
          <v-col cols="7">
            <h5> Percepción a Bienes Personales (RG 5272)</h5>
          </v-col>
          <v-col class="text-right">
            <span class="body-2">{{ services[0].Price.Currency }} {{ price.RG5272.toFixed(2) }}</span>
          </v-col>
          <v-divider />
        </v-row>
      </v-expansion-panel-text>
  </v-expansion-panel>
  </v-expansion-panels>
</template>


<script setup>
const props = defineProps(['services','price','retail']);

// MULTIPLE ROOMS

const priceTotal = computed(() => {
  return props.services.reduce((acc, price) => acc + price.Price.PVP.Total, 0)
})

const priceDiscount = computed(() => {
  return props.services.reduce((acc, price) => acc + price.Price.Discount, 0)
})

const taxTotals = computed(() => {
  const totals = {};
  props.services.forEach((service) => {
    const taxes = service.Price.Net.Taxes;
    taxes.forEach((tax) => {
      const taxTypeName = tax.TaxTypeName;
      const amount = tax.Amount;
      if (totals[taxTypeName]) {
        totals[taxTypeName] += amount;
      } else {
        totals[taxTypeName] = amount;
      }
    });
  });
  return totals;
});

</script>
