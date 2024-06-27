<template>
    <v-no-ssr>
        <VueDatePicker class="search-datepicker" :class="compact ? '' : 'mt-2'" ref="dp" v-model="date"
            @internal-model-change="handleInternal" :range="multiple" :auto-position="false" :multi-calendars="multiple"
            :teleport="true"
            :menu-class-name="getMenuClassName"
            :hide-offset-dates="true" :alt-position="isMobile ? mobilePosition : null" :enable-time-picker="false"
            :auto-apply="!multiple" :clearable="false" locale="es" month-name-format="long" :min-date="minDate"
            :dark="theme.name != 'ThemeLight'">
            <template #top-extra="{ value }" v-if="multiple">

                <div class="search-datepicker-multiple-bar d-flex justify-space-between" v-if="isMobile"><span
                        class="pa-2 text-primary_text body-1 semi">Seleccionar fechas</span>
                    <button @click="closeMenu" class="body-1 semi text-secondary bg-foreground rounded-md px-3 py-1">
                        X</button>
                </div>
                <div class="search-datepicker-multiple-header d-flex mb-2">
                    <div class="pa-2 rounded-md v-col v-col-4 mr-1"
                        :class="value && value.length > 0 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="body-2 mb-0"
                            :class="value && value.length > 0 ? 'text-shade_light' : 'text-secondary_text'">
                            {{ $t("from") }}</p>
                        <h4 class="text-h6 semi  mb-0 mt-2 text-shade_light" v-if="value && value.length > 0">
                            {{ $dayjs(value[0]).format('ddd D, MMM') }}
                        </h4>
                        <h5 class="body-3 mb-0 mt-1 text-secondary_text" v-else>
                            {{ $t("select_date") }}
                        </h5>
                    </div>
                    <div class="pa-2 rounded-md v-col v-col-4 mr-1"
                        :class="value && value.length > 1 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <div  v-if="isMobile">
                            <p class="body-2 mb-0 text-secondary_text" v-if="value && value.length < 2 && isMobile">
                           {{ labelDays }}</p> 
                           <h5 class="body-3 mb-0 mt-1 text-secondary_text"  v-if="value && value.length < 2">
                           --------
                        </h5>
                            <p class="body-2 mb-0 text-shade_light" v-if="value && value.length > 1 && isMobile">
                           {{ labelDays }}</p> 
                        <h4 class="text-h6 semi mb-0 mt-2 text-shade_light" v-if="value && value.length > 1  && isMobile">
                            {{ $dayjs(value[1]).diff($dayjs(value[0]), "day") }}
                        </h4>
                        </div>
                       
                        <h5 class="body-3 mb-0 mt-1 text-secondary_text"  v-if="value && value.length == 0">
                           ----
                        </h5>
                        <div  v-if="value && value.length > 0  && !isMobile" class="d-flex pt-1" :class="value && value.length == 2 ? 'text-shade_light' : 'text-secondary_text'">
                            <span class=" body-2 mr-4 ml-2 text-right">Ingrese <br> {{ labelDays }}</span>
                            <input v-model="selectDays" id="daysInput" class="days-text-field body-1"  @keyup.enter="selectDate" />
                        </div>
                        
                    </div>
                    <div class="pa-2 rounded-md v-col v-col-4"
                        :class="value && value.length > 1 ? 'bg-secondary' : 'v-card--variant-outlined secondary'">
                        <p class="body-2 mb-0"
                            :class="value && value.length > 1 ? 'text-shade_light' : 'text-secondary_text'">
                            {{ $t("to") }}</p>
                        <h4 class="text-h6 semi mb-0 mt-2 text-shade_light" v-if="value && value.length > 1">
                            {{ $dayjs(value[1]).format('ddd D, MMM') }}
                        </h4>
                        <h5 class="body-3 mb-0 mt-1 text-secondary_text" v-else>
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
                <div v-if="Array.isArray(value) && value.length >= 2">
                    <div :set="$dayjs(value[1]) ? nights = $dayjs(value[1]).diff($dayjs(value[0]), 'day') : ''"></div>
                </div>
                <v-btn variant="flat" rounded="md" color="secondary" :block="isMobile" size="large" @click="selectDate"
                :disabled="!Array.isArray(value) || value.length < 2 || value[0] == undefined || value[1] == undefined || nights == 0">
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
const dayjs = useDayjs()
const isMobile = useMobile()

const props = defineProps(["compact", "multiple", "searchedDate", "labelDays", "minDate"]);
const emit = defineEmits(['update:selectedDate']);

import { useTheme } from 'vuetify/framework';
const theme = ref(useTheme())

const mobilePosition = () => ({ top: 0, left: 0 });
const desktopPosition = () => ({ top: 150, left: 450 });

const getMenuClassName = computed(() => {
  if (isMobile.value) {
    return props.multiple ? 'search-datepicker-mobile search-datepicker-multiple' : 'search-datepicker-mobile';
  } else if (props.compact) {
    return props.multiple ? 'search-datepicker-menu search-datepicker-multiple-compact' : 'search-datepicker-menu search-datepicker-compact';
  } else {
    return props.multiple ? 'search-datepicker-menu search-datepicker-multiple' : 'search-datepicker-menu';
  }
});

const date = ref();
const dp = ref();

const selectDate = () => {
    if (selectDays.value > 0) {
        dp.value.selectDate();
        emit('update:selectedDate', date.value);
    } else {
        console.error('El número de días debe ser mayor a 0');
    }
};

const closeMenu = () => {
    dp.value.closeMenu();
};


watchEffect(() => {
    if (props.searchedDate) {
        date.value = props.searchedDate;
    }
});

const selectDays = ref(null)
const startDate = ref()

const days = Array.from({ length: 30 }, (_, i) => i + 1);

const handleInternal = (date) => {
    if (date && date.length == 1) {
        startDate.value = date;
    } else if (date && date.length == 2) {
        const startDateObject = dayjs(date[0]);
        const endDateObject = dayjs(date[1]);
        if (startDateObject.isValid() && endDateObject.isValid()) {
            const daysDifference = endDateObject.diff(startDateObject, 'day');
            selectDays.value = daysDifference;
        }
    }
};

watch(() => selectDays.value, () => {
    if (props.multiple && selectDays.value !== null && dp.value && startDate.value) {
        try {
            const startDateObject = dayjs(startDate.value);
            if (!startDateObject.isValid()) {
                console.error('Invalid start date');
                return;
            }

            const newEndDate = startDateObject.add(selectDays.value, 'day');
            if (!newEndDate.isValid()) {
                console.error('Invalid end date');
                return;
            }

            dp.value.updateInternalModelValue([startDateObject.toDate(), newEndDate.toDate()]);
        } catch (error) {
            console.error('Error updating date:', error);
        }
    }
});

watch(() => startDate.value, (newValue) => {
    if (newValue) {
        selectDays.value = null;
        nextTick(() => {
            const inputElement = document.getElementById('daysInput');
            if (inputElement) {
                inputElement.focus();
            }
        });
    }
});


watch(() => date.value, () => {
    if (!props.multiple && date.value) {
        emit('update:selectedDate', date.value);
    }
}, { deep: true });


</script>