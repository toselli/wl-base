<template>
    <v-no-ssr>
        <VueDatePicker class="search-datepicker" :class="compact ? '' : 'mt-2'" ref="dp" v-model="date" range :auto-position="false"             :multi-calendars="true" :teleport="true" :menu-class-name="isMobile ? 'search-datepicker-mobile' : 'search-datepicker-multiple'" :hide-offset-dates="true"
            :alt-position="isMobile ? mobilePosition : null" :enable-time-picker="false" :clearable="false" locale="es" month-name-format="long"
            :min-date="new Date()" :dark="theme.name != 'ThemeLight'">
           
            <!-- <template #month-year="{
            month,
            year,
            updateMonthYear,
            handleMonthYearChange
        }">
                <div class="text-center" style="width: 100%">
                    <v-btn variant="text" size="small" @click="handleMonthYearChange(false)">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    {{ dayjs().month(month).format('MMMM') }} {{ year }}
                    <v-btn variant="text" size="small" @click="handleMonthYearChange(true)">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </div>
            </template> -->
            <template #top-extra="{ value }">
                <div class="search-datepicker-multiple-header d-flex mb-2">
                    <div class="bg-secondary pa-2 rounded-md v-col v-col-4 mr-1" v-if="value">
                        <p class="mb-0 text-shade_light">{{ $t("from") }}</p>
                        <h4  class="mb-0  text-shade_light" v-if="value">
                            {{ $dayjs(value[0]).format('ddd D, MMM') }}
                        </h4>
                    </div>
                    <div class="pa-2 rounded-md v-col v-col-4 mr-1" :class="value && value.length > 1 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="mb-0" :class="value && value.length > 1 ? 'text-shade_light' : 'text-secondary_text'">{{ $t("nights") }}</p>
                        <h4  class="mb-0 text-shade_light"  v-if="value && value.length > 1">                          
                            {{ $dayjs(value[1]).diff($dayjs(value[0]), "day") }}                                                       
                        </h4>
                        <h5  class="body-2 mb-0 text-secondary_text" v-else>
                           ----
                        </h5>
                    </div>
                    <div class="pa-2 rounded-md v-col v-col-4" :class="value && value.length > 1 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="mb-0" :class="value && value.length > 1 ? 'text-shade_light' : 'text-secondary_text'">{{ $t("to") }}</p>
                        <h4 class="mb-0 text-shade_light"  v-if="value && value.length > 1">
                            {{ $dayjs(value[1]).format('ddd D, MMM') }}
                        </h4>
                        <h5  class="body-2 mb-0 text-secondary_text" v-else>
                            seleccionar fecha
                        </h5>
                    </div>
                </div>
            </template>
            <template #calendar-header="{ index, day }">
                <div class="body-1">
                    {{ day }}
                </div>
            </template>
            <template #action-buttons="{ value }">
                <div :set="nights = $dayjs(value[1]).diff($dayjs(value[0]), 'day')"></div>

                <v-btn variant="flat" rounded="md" color="secondary" :block="isMobile" size="large" @click="selectDate"
                    :disabled="value[0] == undefined || value[1] == undefined || nights == 0">
                    {{ $capitalize($t("confirm")) }}</v-btn>
            </template>
            <template #dp-input="{ }">
                <v-btn class="btn-search-date" variant="tonal">
                    <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                    {{ $dayjs(date[0]).format("DD/MM/YYYY") }} -
                    {{ $dayjs(date[1]).format("DD/MM/YYYY") }}
                </v-btn>
            </template>
        </VueDatePicker>
    </v-no-ssr>
</template>

<script setup>
import dayjs from "dayjs";
const isMobile = useMobile()

const props = defineProps(["compact", "themed", "searchedDate"]);
const emit = defineEmits(['update:selectedDate']);

import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

const mobilePosition = () => ({ top: 0, left: 0 });
const desktopPosition = () => ({ top: 150, left: 450 });

const date = ref({});
const dp = ref();

const selectDate = () => {
    dp.value.selectDate();
    emit('update:selectedDate', date.value);
};

watch(() => props.searchedDate, (newSearch, oldSearch) => {
    if (newSearch && newSearch.length > 0) {
        date.value = newSearch;
    }
}, { deep: true });


</script>