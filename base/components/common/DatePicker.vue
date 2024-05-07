<template>
    <v-no-ssr>
        <VueDatePicker class="search-datepicker" :class="compact ? '' : 'mt-2'" ref="dp" v-model="date"
            :range="multiple" :auto-position="false" :multi-calendars="multiple" :teleport="true"
            :menu-class-name="isMobile ? (multiple ? 'search-datepicker-mobile search-datepicker-multiple' : 'search-datepicker-mobile') : (multiple ? 'search-datepicker-menu search-datepicker-multiple' : 'search-datepicker-menu')"
            :hide-offset-dates="true" :alt-position="isMobile ? mobilePosition : null" :enable-time-picker="false"
            :auto-apply="!multiple" :clearable="false" locale="es" month-name-format="long" :min-date="minDate"
            :dark="theme.name != 'ThemeLight'">

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
            <template #top-extra="{ value }" v-if="multiple">
                <div class="search-datepicker-multiple-header d-flex mb-2">
                    <div class="pa-2 rounded-md v-col v-col-4 mr-1"
                        :class="value && value.length > 0 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="mb-0" :class="value && value.length > 0 ? 'text-shade_light' : 'text-secondary_text'">
                            {{ $t("from") }}</p>
                        <h4 class="mb-0 text-shade_light" v-if="value && value.length > 0">
                            {{ $dayjs(value[0]).format('ddd D, MMM') }}
                        </h4>
                        <h5 class="body-2 mb-0 text-secondary_text" v-else>
                            {{ $t("select_date") }}
                        </h5>
                    </div>
                    <div class="pa-2 rounded-md v-col v-col-4 mr-1"
                        :class="value && value.length > 1 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="mb-0" :class="value && value.length > 1 ? 'text-shade_light' : 'text-secondary_text'">
                            {{ labelDays }}</p>
                        <h4 class="mb-0 text-shade_light" v-if="value && value.length > 1">
                            {{ $dayjs(value[1]).diff($dayjs(value[0]), "day") }}
                        </h4>
                        <h5 class="body-2 mb-0 text-secondary_text" v-else>
                            ----
                        </h5>
                    </div>
                    <div class="pa-2 rounded-md v-col v-col-4"
                        :class="value && value.length > 1 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="mb-0" :class="value && value.length > 1 ? 'text-shade_light' : 'text-secondary_text'">
                            {{ $t("to") }}</p>
                        <h4 class="mb-0 text-shade_light" v-if="value && value.length > 1">
                            {{ $dayjs(value[1]).format('ddd D, MMM') }}
                        </h4>
                        <h5 class="body-2 mb-0 text-secondary_text" v-else>
                            {{ $t("select_date") }}
                        </h5>
                    </div>
                </div>
            </template>
            <template #top-extra="{ value }" v-else>
                <h4 class="body-1 text-center py-2">Seleccione una fecha</h4>
            </template>
            <template #calendar-header="{ index, day }">
                <div class="body-1">
                    {{ day }}
                </div>
            </template>
            <template #action-buttons="{ value }" v-if="multiple">
                <div :set="nights = $dayjs(value[1]).diff($dayjs(value[0]), 'day')"></div>
                <v-btn variant="flat" rounded="md" color="secondary" :block="isMobile" size="large" @click="selectDate"
                    :disabled="value[0] == undefined || value[1] == undefined || nights == 0">
                    {{ $capitalize($t("confirm")) }}</v-btn>
            </template>
            <template #dp-input="{ }">
                <v-btn class="btn-search-date" variant="tonal">
                    <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                    <span v-if="multiple">
                        <span v-if="date && date.length > 0"> {{ $dayjs(date[0]).format("DD/MM/YYYY") }} &nbsp;-&nbsp;{{
            $dayjs(date[1]).format("DD/MM/YYYY") }}
                        </span>
                        <span v-else class="text-secondary_text">Seleccionar fechas</span>
                    </span>
                    <span v-else>
                        <span v-if="date"> {{ $dayjs(date).format("DD/MM/YYYY") }}</span>
                        <span v-else class="text-secondary_text">Seleccionar fecha</span>
                    </span>
                </v-btn>
            </template>
        </VueDatePicker>
    </v-no-ssr>
</template>

<script setup>
import dayjs from "dayjs";
const isMobile = useMobile()

const props = defineProps(["compact", "multiple", "searchedDate", "labelDays", "minDate"]);
const emit = defineEmits(['update:selectedDate']);

import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

const mobilePosition = () => ({ top: 0, left: 0 });
const desktopPosition = () => ({ top: 150, left: 450 });

const date = ref();
const dp = ref();

const selectDate = () => {
    dp.value.selectDate();
    emit('update:selectedDate', date.value);
};


watchEffect(() => {
    if (props.searchedDate) {
        date.value = props.searchedDate;
    }
});
// watch(() => props.searchedDate, (newDate, oldDate) => {
//     if (props.multiple) {
//         if (newDate && newDate.length > 0) {
//             date.value = props.searchedDate;
//         }
//     } else {
//         if (newDate) {
//             date.value = props.searchedDate;
//         }
//     }
// }, { deep: true });

watch(() => date.value, () => {
    if (!props.multiple && date.value) {
        emit('update:selectedDate', date.value);
    }
}, { deep: true });


</script>