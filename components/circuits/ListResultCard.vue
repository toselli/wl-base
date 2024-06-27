<template>
    <v-card rounded="lg" class="list-result-card fill-height" flat >
        <v-container fluid class="pa-0" :class="mode == 'list' ? '' : 'full-height'">
            <v-row dense no-gutters :class="mode == 'list' ? '' : 'full-height'">
                <v-col cols="12" :md="mode == 'list' ? '3' : '12'">
                    <v-img class="fill-height" :src="service.Thumbnail" max-height="205" cover style="cursor:pointer;"
                        position="0 0" lazy-src="/base/img/services/circuits_no_image.png"  @click="$emit('selected', service.CatalogId)"></v-img>
                </v-col>
                <v-col cols="12" :md="mode == 'list' ? '6' : '12'" class="pa-3">
                    <h3 class="semi" style="cursor:pointer"  @click="$emit('selected', service.CatalogId)">{{ service.Name }}</h3>
                    <p class="body-2 mb-2 text-success">({{service.ProviderName}})</p>
                    <p class="body-2 semi my-1">
                    <v-icon icon="mdi-calendar" size="small"></v-icon> {{ service.Duration }} días
                    </p>
                    <p class="body-2 semi my-1">Visitando: <span class="semi text-secondary_text" style="text-transform: capitalize;">{{
            service.Cities.map(x =>
                x.Value.toLocaleLowerCase()).join(',') }}</span></p>
                    <p class="body-2 semi mb-2">Pernoctando en: <span class="semi text-secondary_text" style="text-transform: capitalize;">{{
            formatNightlyCities(service.NightlyCities.toLocaleLowerCase()) }}</span></p>
                    <p class="body-2 semi mb-0">Salidas en:</p>
                    <span class="body-2 text-secondary_text semi">
                        {{ formattedMonths }}
                    </span>
                    <v-btn class="ma-1" color="secondary" rounded="md" variant="tonal" size="small"
                        @click.prevent="departuresDialog = true" v-if="departuresList.length > 2">
                        <span class="body-3 semi"> {{ service.Departures ? 'Ver todas' : 'No hay salidas' }}</span>
                    </v-btn>
                </v-col>
                <v-col cols="12" :md="mode == 'list' ? '3' : '12'" :class="mode == 'list' ? 'text-right pa-3' : 'pa-3'">
                    <v-row dense :class="mode == 'list' ? 'flex-column' : 'full-height align-end'">
                        <v-col :class="mode == 'list' ? '' : ''">
                            <span class="body-3 text-secondary_text">Desde</span>
                            <h2 class="semi">
                                <span class="body-2 semi d-inline">
                                    {{ service.Currency }}
                                </span>
                                {{ service.FromPrice.toFixed(2) }}
                            </h2>
                        </v-col>
                        <v-col :class="mode == 'list' ? 'flex-column' : ''">
                            <v-btn color="primary" rounded="md" variant="flat" class="mt-6"
                                @click="$emit('selected', service.CatalogId)" :block="mode == 'grid'">
                                {{ $capitalize($t('view_availability')) }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-dialog width="500" v-model="departuresDialog" @update:model-value="">
                <v-card rounded="md" class="list-result-card fill-height" flat>
                    <v-toolbar class="bg-foreground">
                        <v-container class="d-flex align-center pa-n2">
                            <div>
                                <span style="font-size:18px">
                                    Salidas
                                </span>
                                <span class="ml-2 body-1 semi text-secondary_text">
                                    <span>{{ $sentence(service.Name) }}</span>
                                </span>
                            </div>
                            <span class="ml-auto">
                                <v-icon icon="md:close" @click="departuresDialog = false"></v-icon>
                            </span>
                        </v-container>
                    </v-toolbar>
                    <v-card-text class="bg-background">
                        <v-list class="bg-foreground px-3" rounded="lg">
                            <v-list-item rounded="sm" :class="i % 2 == 0 ? 'bg-foreground' : 'bg-background'"
                                v-for="(departure, i) in departuresList">
                              <p v-html="departure"></p> 
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
const props = defineProps(['service', 'mode'])
const service = props.service as import('~/interfaces/services/circuits/ListResponse').CircuitService;
const departuresDialog = ref(false)

function formatNightlyCities(nightlyCities) {
    nightlyCities = nightlyCities.replace(RegExp('\<[a-z\s\/]+>', 'gmi'), '')
    return nightlyCities.split('\n').join(', ')
}

const formattedMonths = computed(() => {
    const regex = /<b>([\s\S]*?)<\/b>/g
    let matches;
    let months = [];
    while ((matches = regex.exec(service.Departures)) !== null) {
        months.push(matches[1]);
    }
    return months.join(', ');
});

const departuresList = computed(() => {
    return service.Departures.replace(RegExp('^<br\s?/>'), '').split('<br/>')
})

const emit = defineEmits(['selected'])
</script>