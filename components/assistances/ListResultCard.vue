<template>
    <v-card flat rounded="lg" class="list-result-card fill-height pa-5" :id="service.Id">
        <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
            <v-col cols="2" :class="mode == 'list' ? 'pa-4' : 'px-4'">
                <v-img :src="src" height="110px" class="mx-auto">
                </v-img>
            </v-col>
            <v-col cols="7">
                <h3 class="semi">{{ service.ProductSingleName }}</h3>
                <p class="body-2 mt-2 mb-2" v-for="attr in service.Attributes.slice(0, 3)">
                <div class="d-flex justify-space-between">
                    <span>{{ attr.VisibleName }}</span>
                    <span class="bold">{{ attr.Unit }} {{ attr.Value }}</span>
                </div>
                </p>
                <v-btn rounded variant="tonal" size="x-small" color="secondary" @click="detailsDialog = true">
                    <span class="semi">Ver detalles</span>
                </v-btn>
                <v-dialog width="510px" height="510px" v-model="detailsDialog">
                    <v-card flat rounded="lg" class="list-result-card fill-height py-2" :id="service.Id">
                        <v-card-title>

                            <div class="d-flex justify-space-between">
                                <h5 class="ml-4 semi">Información de la asistencia</h5>
                                <v-icon icon="md:close" @click="detailsDialog = false"></v-icon>
                            </div>

                        </v-card-title>
                        <v-card-text class="bg-background">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field variant="outlined" class="mb-2" hide-details
                                        density="compact" label="Realiza una búsqueda específica"
                                        v-model="attributeSearch" ref="prompRef"
                                        placeholder="Realiza una búsqueda específica" prepend-inner-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-card rounded="md" class="foreground pa-3" variant="flat">
                                <v-row class="body-2 py-2 rounded-md" dense v-for="(attr, index) in filteredAttributes"
                                :class="index % 2 !== 0 ? 'bg-background' : 'bg-foreground'">
                                <v-col cols="9" class="d-inline-block text-truncate px-3">
                                    <v-icon color="success" icon="md:check" class="mr-2" size="16"></v-icon>
                                    <span>
                                        {{ attr.VisibleName }}
                                    </span>
                                </v-col>
                                <v-col cols=3 class="text-end pr-4">
                                    <span class="semi text-end">{{ attr.Value }} {{ attr.Unit }}</span>
                                </v-col>
                            </v-row>
                            </v-card>

                            

                        </v-card-text>
                    </v-card>
                </v-dialog>

            </v-col>
            <v-col cols="3">
                <v-sheet class="d-flex align-end flex-column fill-height">
                    <div>

                        <h2 class="semi">
                            <span class="body-2 text-secondary_text">{{ service.Currency }}
                            </span>
                            {{ service.Total.toFixed(2) }}
                        </h2>
                    </div>
                    <v-btn color="primary" variant="flat" class="mt-auto" style="border-radius:10px" @click="addToCart">
                        Seleccionar
                    </v-btn>
                </v-sheet>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { AssistanceSearchResponse, Attribute } from '~/interfaces/services/assistances/search-response';
const isMobile = useMobile();
const runtimeConfig = useRuntimeConfig()
const props = defineProps(['service', 'index', 'mode'])
const service = props.service as AssistanceSearchResponse
const src = runtimeConfig.public.ebookingCdn + 'providers/' + service.ProviderRef.Key + '.png'
const detailsDialog = ref(false)
const attributeSearch = ref('')
const filteredAttributes = ref(useDeepCopy(service.Attributes))
const toggleSort = ref(false)

const toggle = () => {
    toggleSort.value = !toggleSort.value
}

watch(attributeSearch, (newValue, oldValue) => {
    let attrs = useDeepCopy(service.Attributes)
    attrs = attrs.filter(x => x.VisibleName.toLowerCase().includes(newValue.toLowerCase()))
    filteredAttributes.value = attrs;
})

watch(toggleSort, (newValue, oldValue) => {
    function asc(a, b) {
        return (Number.parseFloat(a.Value) | 0) - (Number.parseFloat(b.Value) | 0);
    }

    function desc(a, b) {
        return Number.parseFloat(b.Value) | 0 - Number.parseFloat(a.Value) | 0
    }
    const pricedAttributes = useDeepCopy(filteredAttributes.value.filter(x => x.Value))
    const nonPricedAttributes = useDeepCopy(filteredAttributes.value.filter(x => !x.Value))
    pricedAttributes.sort(newValue ? asc : desc)
    pricedAttributes.push(...nonPricedAttributes)
    filteredAttributes.value = pricedAttributes;
})

function addToCart() {
    emit('addToCart', props.service.Id)
}

const emit = defineEmits(['addToCart'])
</script>