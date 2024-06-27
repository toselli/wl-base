<template>
    <v-card rounded="lg" class="list-result-card fill-height" flat>
        <v-container fluid class="pa-0" :class="mode == 'list' ? '' : 'full-height'">
            <v-row dense no-gutters :class="mode == 'list' ? '' : 'full-height'">
                <v-col cols="12" :md="mode == 'list' ? '3' : '12'">
                    <v-img class="fill-height" :src="service.ThumbUrl" max-height="205" cover style="cursor:pointer;"
                        position="0 0" lazy-src="/base/img/services/circuits_no_image.png"
                        @click="$emit('selected', service.ProductCode)"></v-img>
                </v-col>
                <v-col cols="12" :md="mode == 'list' ? '6' : '12'" class="pa-3">
                    <v-rating :model-value="service.Rating" density="compact" size="small" color="orange"
                        v-if="service.Rating" readonly half-increments></v-rating>
                    <h3 class="semi" style="cursor:pointer" @click="$emit('selected', service.ProductCode)">    {{ service.Title }}
                    </h3>
                    <p class="body-2 semi my-1">
                        <template v-if="service.Duration > 24">
      <v-icon icon="mdi-calendar" size="small"></v-icon> {{ days }} día<span v-if="days > 1">s</span> 
      <v-icon icon="mdi-clock-outline" size="small" class="ml-1"></v-icon> {{ remainingHours }} hs.
    </template>
    <template v-else>
      <v-icon icon="mdi-clock-outline" size="small"></v-icon> {{ service.Duration }} hs.
    </template>
                    </p>
                    <p class="body-2 mb-2 text-success">({{ service.ProviderRef }})</p>
                    <p class="body-2 mb-2">{{ service.Description }}</p>

                </v-col>
                <v-col cols="12" :md="mode == 'list' ? '3' : '12'" :class="mode == 'list' ? 'text-right pa-3' : 'pa-3'">
                    <v-row dense :class="mode == 'list' ? 'flex-column' : 'full-height align-end'">
                        <v-col :class="mode == 'list' ? '' : ''" cols="5" v-if="service.Amount">
                            <span class="body-3 text-secondary_text">Desde</span>
                            <h2 class="semi">
                                <span class="body-2 semi d-inline">
                                    {{ service.Currency }}
                                </span>
                                {{ service.Amount.toFixed(2) }}
                            </h2>
                        </v-col>
                        <v-col :class="mode == 'list' ? 'flex-column' : ''">
                            <v-btn color="primary" rounded="md" variant="flat" 
                                @click="$emit('selected', service.ProductCode)" :block="mode == 'grid'">
                                {{ $capitalize($t('view_availability')) }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps(['service', 'mode'])
const service = props.service as import('~/interfaces/services/sightseeing/ListResponse').SightseeingService;

const emit = defineEmits(['selected'])

const days = computed(() => {
  return Math.floor(service.Duration / 24);
});

const remainingHours = computed(() => {
  return service.Duration % 24;
});

</script>