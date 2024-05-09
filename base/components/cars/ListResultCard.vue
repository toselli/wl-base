<template>
    <v-card rounded="lg" class="list-result-card fill-height" flat :id="service.Id">
        <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
            <v-col :lg="mode == 'list' ? '2' : '12'" class="pa-1 bg-white">
                <v-img :src="car.PictureUrl" height="150px" contain></v-img>
                <v-img :src="runtimeConfig.public.ebookingCdn+'providers/'+service.ProviderRef.Key+'.png'" height="30px" width="80" class="mx-auto" contain ></v-img>
            </v-col>
            <v-col :lg="mode == 'list' ? '7' : '12'" :class="mode == 'list' ? 'pa-4' : 'px-4'">
                <h3 class="text-h5 semi">
                    {{ car.VehicleName }}
                </h3>
                <p class="my-2 d-flex flex-row justify-content-around" :class="mode == 'list' ? 'body-3' : 'body-3'">
                    <span class="mr-2">
                        <v-icon icon="mdi-bag-suitcase"></v-icon> Maletas: {{ car.BagBigCount }}
                    </span>
                    <span class="mr-2">
                        <v-icon icon="mdi-account-multiple"></v-icon> Adultos: {{ car.AdultsCount }}
                    </span>
                    <span class="mr-2">
                        <v-icon icon="mdi-car-door"></v-icon> Puertas: {{ car.BagBigCount }}
                    </span>
                    <span v-if="car.HasAirCondition">
                        <v-icon icon="mdi-snowflake"></v-icon> Aire acondicionado
                    </span>
                </p>
                <p class="body-2 text-primary_text semi fw-bold">
                    {{ service.Car.RateDefaultName }}:
                </p>
                <p class="text-secondary_text body-2 text-wrap overflow-show mt-2">
                    <span class="pa-1" v-for="cover in service.Car.Coverage">
                        <v-icon icon="mdi-check"></v-icon>
                        {{ cover.Description }}
                    </span>
                </p>
            </v-col>
            <v-col :lg="mode == 'list' ? '3' : '12'" class="pa-4 d-flex justify-space-between " :class="mode == 'list' ? 'flex-column text-right' : ''">
                <h3 class="text-h4 semi pr-4" :class="mode == 'list' ? 'pt-4' : ''">
                        <span class="body-2 text-secondary_text">{{ service.Currency }}</span>
                        {{ service.Total.toFixed(2) }}
                        <span class="d-block body-2 text-secondary_text">
                            + {{ service.Currency }} {{ service.Taxes.toFixed(2) }} de impuestos
                        </span>
                    </h3>
                <div>
                    <v-btn color="primary" class="px-4" rounded="md" variant="flat" @click="addService">{{
                        $capitalize($t('get_book'))
                    }}</v-btn>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>
  
<script setup lang="ts">
import type { CarService, VehicleDetail } from '~/interfaces/services/cars/search-response';

const props = defineProps(['item', 'mode', 'selected']);

const emit = defineEmits(['goTo', 'select', 'unselect'])

const service = props.item as CarService;
const car = props.item.Car.VehicleDetail as VehicleDetail;

const addService = () => {
    let payload = {
        service: props.item.Id
    };
    emit('goTo', payload)
}

const route = useRoute();

const runtimeConfig = useRuntimeConfig()

</script>
  
<style>
.btn-share {
    position: absolute;
    right: 5px;
    top: 5px
}
</style>