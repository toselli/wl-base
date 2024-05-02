<template>
    <v-container class="content-container">
        <v-row dense>
            <v-col>
                <v-btn prepend-icon="mdi-chevron-left" rounded="xl" variant="outlined" density="comfortable"
                    @click="useBackButton"> Volver</v-btn>
            </v-col>
        </v-row>

        <v-row v-if="getCatalog.Images">
            <v-col class="bg-background">
                <v-row dense>
                    <v-col :cols="getCatalog.Images.length > 1 ? 7 : 12" class="bg-background">
                        <v-card rounded="md" class="fill-height">
                            <v-img cover class="fill-height" rounded="md" :src="getCatalog.Images[0]"></v-img>
                        </v-card>
                    </v-col>
                    <v-col cols="5">
                        <v-row dense>
                            <v-col cols="12" v-if="getCatalog.Images.length > 1" class="bg-background">
                                <v-card rounded="md" class="fill-height">
                                    <v-img cover class="fill-height" rounded="md" :src="getCatalog.Images[1]"></v-img>
                                </v-card>
                            </v-col>
                            <v-col cols="12" v-if="getCatalog.Images.length > 2" class="bg-background">
                                <v-card rounded="md" class="fill-height">
                                    <v-img cover class="fill-height" rounded="md" :src="getCatalog.Images[2]"></v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols=8>
                <v-card rounded="lg" class="bg-midground" flat>
                    <v-card-text>
                        <h1 class="semi text-primary_text">
                            {{ getCatalog.Name }}
                        </h1>
                        <p class="body-1 my-3 d-flex">
                            <span class="body-1 semi"><v-icon icon="md:date_range" size="small"></v-icon> Duración:
                                <span class="text-secondary_text" v-if="getCatalog.Durations"> {{
                                    getCatalog.Durations[0].Value }}</span>

                            </span>
                            <span class="ml-3" v-if="getCatalog && getCatalog.Cities">
                                <v-icon icon="md:hotel" size="small" class="mr-1"></v-icon>
                                <span class="semi">Pernoctando en: </span>
                                <span class="text-secondary_text">{{ getCatalog.Cities.map(x => x.Value).join(',') }}</span>
                            </span>
                        </p>
                    </v-card-text>
                    <v-card-text>
                        <v-btn-toggle mandatory v-model="tab" color="secondary" class="bg-foreground pa-1 mb-2"
                        variant="flat" rounded="md">
                            <v-btn rounded="lg">
                                Información general
                            </v-btn>
                            <v-btn rounded="lg">
                                Itinerario
                            </v-btn>
                        </v-btn-toggle>
                        <v-card class="bg-background pa-3" flat rounded="lg">
                            <v-card rounded="lg" class="bg-foreground mb-3" flat v-if="getCatalog.Cities">
                                <v-card-text>
                                    <h4 class="semi mb-2">Destinos</h4>
                                    <v-list class="ml-1">
                                        <li class="body-1 mb-6 text-secondary_text" v-for="dest in getCatalog.Cities">
                                            {{ dest.Value }}
                                        </li>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                            <v-card rounded="lg" class="bg-foreground my-3" flat v-if="getCatalog.Included">
                                <v-card-text>
                                    <h4 class="semi mb-2">Incluye</h4>
                                    <v-list class="ml-1">
                                        <li class="body-1 mb-6 text-secondary_text" v-for="incl in getCatalog.Included">
                                            {{ incl }}
                                        </li>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                            <v-card rounded="lg" class="bg-foreground my-3" flat v-if="getCatalog.Excluded">
                                <v-card-text>
                                    <h4 class="semi mb-2">Excluye</h4>
                                    <v-list class="ml-1">
                                        <li class="body-1 mb-6 text-secondary_text" v-for="excl in getCatalog.Excluded">
                                            {{ excl }}
                                        </li>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                            <v-card rounded="lg" class="bg-foreground mt-3" flat
                                v-if="getCatalog && getCatalog.ExpectedHotels && getCatalog.ExpectedHotels.length > 0">
                                <v-card-text>
                                    <h4 class="semi mb-2">Hoteles</h4>
                                    <v-list class="ml-1">
                                        <li class="body-1 mb-6 text-secondary_text"
                                            v-for="hotel in getCatalog.ExpectedHotels">
                                            {{ hotel }}
                                        </li>
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card variant="outlined" class="border border-secondary bg-foreground pa-3" rounded="lg">
                    <!-- chanchada -->
                    <span class="border fill-height  ml-5" style="max-height:80%"></span>
                    <v-expansion-panels multiple :mandatory="true" v-model="openPanels">
                        <v-expansion-panel rounded="lg" class="mb-3 bg-background border-secondary_lighten" elevation="0">
                            <v-expansion-panel-title>
                                <v-btn class="mr-2" icon rounded="md" size="small" flat
                                    color="secondary_lighten"><v-icon size="20" icon="md:timelapse"
                                        color="secondary"></v-icon></v-btn>
                                <span class="body-1 semi">Duración</span>
                            </v-expansion-panel-title>

                            <v-expansion-panel-text>
                                <v-select bg-color="foreground" base-color="secondary_text" density="compact"
                                    v-model="durationSelected" label="Duración" :items="getCatalog.Durations"
                                    variant="outlined" rounded="md" item-name="Value">
                                    <template v-slot:item="{ props, item }">
                                        <span class="px-2 text-secondary_text" v-bind="props">
                                            {{ item.raw?.Value }}
                                        </span>
                                    </template>
                                    <template v-slot:selection="{ item }">
                                        {{ item.raw?.Value }}
                                    </template>
                                    <template v-slot:label>

                                    </template>
                                </v-select>
                            </v-expansion-panel-text>
                            <template v-slot:prepend-inner>
                                <v-icon icon="md:timelapse" color="secondary"></v-icon>
                            </template>
                        </v-expansion-panel>
                        <v-expansion-panel rounded="md" class="mb-3 bg-background border-secondary_lighten" elevation="0">
                            <v-expansion-panel-title>
                                <v-btn class="mr-2" icon rounded="md" size="small" flat
                                    color="secondary_lighten"><v-icon icon="md:date_range" color="secondary"
                                        size="20"></v-icon></v-btn>
                                <span class="body-1 semi">Fechas disponibles</span>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <div class="d-flex px-2 align-center mb-2">
                                    <div>
                                        <span class="body-2 semi text-secondary_text">
                                            {{ indexDisplay + 1 }} fechas de {{ presetDates.length }}
                                        </span>
                                    </div>
                                    <div class="ml-auto">
                                        <v-btn name="prev" class=mr-1 rounded="sm" stacked size="32"
                                            :disabled="indexDisplay == 0" variant="outlined" color=secondary
                                            @click="indexDisplay--">
                                            <v-icon size=16 icon=md:chevron_left></v-icon>
                                        </v-btn>
                                        <v-btn name="next" class=ml-1 rounded="sm" stacked size="32"
                                            :disabled="indexDisplay >= presetDates.length - 1" variant="outlined"
                                            color=secondary @click="indexDisplay++">
                                            <v-icon size=16 icon=md:chevron_right></v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                                <div>
                                    <v-no-ssr>
                                        <VueDatePicker inline v-model="displayDates" :dark="theme.name == 'ThemeDark'"
                                            :loading="!durationSelected" auto-apply prevent-min-max-navigation :key="dpKey"
                                            :hide-offset-dates="true" :enable-time-picker="false" range
                                            style="display: inline;"
                                            :auto-range="durationSelected ? durationSelected.Key - 1 : 0"
                                            :allowed-dates="allowedDepartures.map(x => new Date(x.Date))">

                                            <template #month-year="{
                                                month,
                                                year
                                            }">
                                                <v-row align="center">
                                                    <v-col class="text-center">
                                                        <span class="text-center body-1 text-secondary_text">{{
                                                            $capitalize(dayjs(`${year}-${month
                                                                + 1}-15`).format("MMMM YYYY")) }}
                                                        </span>
                                                    </v-col>
                                                </v-row>
                                            </template>
                                            <template #calendar-header="{ index, day }">
                                                <div class="body-2 text-secondary_text">
                                                    {{ week[index] }}
                                                </div>
                                            </template>
                                            <template #day="{ day, date }">
                                                <template
                                                    v-if="allowedDepartures.map(x => dayjs(x.Date).toISOString()).includes(dayjs(date).toISOString())">
                                                    <v-btn @click.prevent="selectDate(date)" rounded="sm"
                                                        class="body-2 semi" block
                                                        :variant="selectedDate.getTime() == date.getTime() ? 'flat' : 'outlined'"
                                                        :class="selectedDate.getTime() == date.getTime() ? 'bg-transparent' : 'bg-' + dayClass(date) + '_lighten'"
                                                        :color="selectedDate.getTime() == date.getTime() ? 'secondary' : dayClass(date)">
                                                        {{ day }}
                                                    </v-btn>

                                                </template>
                                                <template v-else><span class="body-2">{{ day }}</span></template>
                                            </template>

                                        </VueDatePicker>
                                    </v-no-ssr>
                                </div>
                                <v-sheet class="price-sheet d-flex">
                                    <span class="fw-400">Desde</span>
                                    <span class="ml-auto">
                                        <span class="body-1 text-secondary_text mr-1">{{ departureSelected?.Currency ||
                                            currency }}</span>
                                        <span class="bold" v-if="departureSelected">{{ departureSelected.Amount }}</span>
                                        <span class="bold" v-else>0</span>
                                    </span>
                                </v-sheet>
                            </v-expansion-panel-text>

                        </v-expansion-panel>
                        <v-expansion-panel v-if="getCatalog.MealPlans && getCatalog.MealPlans.length > 0" rounded="md"
                            class="mb-3 bg-background border-secondary_lighten" elevation="0">
                            <v-expansion-panel-title>
                                <v-btn class="mr-2" icon rounded="md" size="20" flat
                                    color="secondary_lighten"><v-icon icon="md:restaurant"
                                        color="secondary"></v-icon></v-btn>
                                <span class="body-1 semi">Plan comidas</span>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>

                                <v-select bg-color="foreground" base-color="secondary_text" density="compact"
                                    v-model="mealPlanSelected" :items="getCatalog.MealPlans" variant="outlined" rounded="md"
                                    return-object>
                                    <template v-slot:item="{ item, props }">
                                        <div class="pa-3 text-secondary_text" v-bind="props">
                                            {{ item.raw.Value }}
                                        </div>
                                    </template>

                                    <template v-slot:selection="{ item }">
                                        <div class="text-secondary_text">
                                            {{ item.raw.Value }}
                                        </div>
                                    </template>
                                </v-select>

                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel rounded="md" class="mb-3 bg-background border-secondary_lighten" elevation="0"
                            value=10>
                            <v-expansion-panel-title>
                                <v-btn class="mr-2" icon rounded="md" size="small" flat
                                    color="secondary_lighten"><v-icon icon="md:hotel" size="20"
                                        color="secondary"></v-icon></v-btn>
                                <span class="body-1 semi">Habitaciones</span>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <CircuitsOccupanciesCard @update:rooms="setOccupancies" :compact="false" themed="default"
                                    v-model:valid="valid" multiple="true" />
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-row>
                        <v-col>
                            <v-btn block color="primary" rounded="md" variant="flat" size="large" @click="searchAvail"
                                :loading="availLoading" :disabled="!isSelectedDateAvailable || !valid">
                                Buscar disponibilidad
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

        </v-row>

        <v-dialog width=897px v-model="stepperDialog" persistent>
            <v-card rounded="md" class="list-result-card" flat elevation="0">
                <v-toolbar class="bg-foreground mb-n5">
                    <v-container class="d-flex align-center">
                        <div>
                            <span style="font-size:18px" class="text-primary_text">
                                Complete el circuito
                            </span>
                            <span class="ml-2 body-1 semi text-secondary_text">
                                <span>{{ $sentence(getCatalog.Name) }}</span>
                            </span>
                        </div>
                        <span class="ml-auto d-flex ">
                            <!-- <v-icon icon="md:remove" color="secondary_text" class="mr-2" @click="stepperDialog = false"></v-icon> -->
                            <v-icon icon="md:close" color="secondary_text" @click="stepperDialog = false"></v-icon>
                        </span>
                    </v-container>
                </v-toolbar>
                <v-stepper v-model="steps" rounded="sm" linear>
                    <template v-slot:default="{ prev, next }">
                        <v-stepper-header selected-class="selected-step">
                            <v-stepper-item value=0 :rules="[() => steps > 0]"
                                :error-icon="steps == 0 ? 'md:edit' : 'md:lock'" :complete="steps > 1">
                                <span class="body-1"> Seleccione habitación</span>
                            </v-stepper-item>
                            <v-divider></v-divider>
                            <v-stepper-item :rules="rules.startEndRules" :error-icon="steps == 1 ? 'md:edit' : 'md:lock'"
                                value=1 class="text-left">
                                <span class="body-1"> Inicio y fin del circuito</span>
                            </v-stepper-item>
                            <v-divider></v-divider>
                            <v-stepper-item :rules="rules.extraNightsRules" :disabled="!getPrebooking.CanSelectExtraNights"
                                :error-icon="steps == 2 ? 'md:edit' : 'md:lock'"
                                :subtitle="getPrebooking.CanSelectExtraNights ? '' : steps > 0 ? 'No tiene' : 'Selecciona una habitación'"
                                :color="steps == 3 ? 'primary' : 'secondary_lighten'" value=2 class="text-left">
                                <span class="body-1"> Noches extra</span>
                            </v-stepper-item>
                            <v-divider></v-divider>
                            <v-stepper-item :rules="rules.transferRules" :error-icon="steps == 3 ? 'md:edit' : 'md:lock'"
                                :subtitle="getPrebooking.CanSelectTransfers ? '' : steps > 0 ? 'No tiene' : 'Selecciona una habitación'"
                                :disabled="!getPrebooking.CanSelectTransfers" class="text-left"
                                :color="steps == 3 ? 'primary' : 'secondary_lighten'" value=3>
                                <span class="body-1"> Traslados </span>
                            </v-stepper-item>
                        </v-stepper-header>

                        <v-stepper-window>
                            <v-stepper-window-item class="bg-background" value=0>
                                <v-card flat class="bg-background pa-5">
                                    <v-card class="my-3" rounded="lg" flat v-for="room in getAvail[0].Rooms"
                                        :class="roomSelected == room ? 'card-selected' : ''">
                                        <v-row dense class="py-6 px-3" align="center">
                                            <v-col cols="5" class="d-flex align-center">
                                                <span class="body-1 semi">{{ room.Room }}</span>
                                                <v-divider vertical style="height:40px" class="d-inline ml-auto ">
                                                </v-divider>
                                            </v-col>
                                            <v-col>
                                                <p class="body-2 semi mb-n1">Incluye:</p>
                                                <span class="body-2 text-secondary_text">Sólo habitación</span>
                                            </v-col>
                                            <v-col>
                                                <span class="text-secondary_text"> {{ room.Price.Currency }}</span>
                                                <h3 class="semi d-inline ml-1">{{ room.Price.PVP.Amount.toFixed(2) }}</h3>
                                            </v-col>
                                            <v-col cols=2 class="d-flex">
                                                <v-btn class="btn btn-primary ml-auto"
                                                    :variant="roomSelected == room ? 'outlined' : 'flat'" color="primary"
                                                    rounded="sm" @click="roomSelected = room">{{ roomSelected != room ?
                                                        'Seleccionar' : 'Seleccionado' }}
                                                    <template v-slot:prepend>
                                                        <v-icon size="20" v-if="roomSelected == room">
                                                            md:check_circle</v-icon>
                                                    </template></v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-card>
                            </v-stepper-window-item>
                            <v-stepper-window-item :disabled="!getPrebooking.CanCustomizeItinerary" value=1>
                                <v-card flat class="bg-background pa-5" elevation="0">
                                    <v-row dense no-gutters align=center justify=center>
                                        <v-col>
                                            <v-card flat class="bg-midground px-3 mb-2 text-center" rounded=lg>
                                                <v-card-title class="d-flex justify-center"
                                                    v-if="(!startSelected || !endSelected)">
                                                    <h4 style="font-weight: 400; font-size:16px"
                                                        v-if="getItineraryCollection.some(x => x.IsStartAvailable || x.IsEndAvailable)">
                                                        Selecciona fecha/ciudad de
                                                        <span class="bold" v-if="!startSelected">comienzo</span>
                                                        <span class="bold" v-else-if="!endSelected">fin</span>
                                                        del circuito
                                                    </h4>
                                                    <div class="text-warning body-2 mt-4 text-center align-items-center" v-else>
                                                        <span> No hay incorporaciones ni salidas para este catálogo. Si cree que esto es
                                                            un error, contáctese con el administrador.
                                                        </span>
                                                    </div>
                                                </v-card-title>
                                                <v-card-text>
                                                    <v-card :disabled="isCityDisabled(city)"
                                                        v-for="city in getItineraryCollection"
                                                        :variant="city === startSelected || city === endSelected ? 'outlined' : 'default'"
                                                        class=" pa-4 my-3" rounded="lg"
                                                        :class="city === startSelected || city === endSelected ? 'card-selected' : ''">

                                                        <v-row align=center justify=center>
                                                            <v-col class="body-1 d-flex align-center justify-space-between"
                                                                cols="12">
                                                                <span class="text-secondary_text">Día {{ city.DayIndex + 1
                                                                }}</span>
                                                                <span class="text-secondary_text"> {{
                                                                    dayjs(getPrebooking.Services[0].BeginService).add(city.Index
                                                                        + 1, 'days').format('DD/MM/YYYY') }}
                                                                </span>


                                                                <span class="semi">{{ city.Value }}</span>
                                                                <span>
                                                                    <v-btn
                                                                        :variant="city === startSelected || city === endSelected ? 'outlined' : 'default'"
                                                                        color=primary rounded="md" @click="selectCity(city)"
                                                                        :disabled="isCityDisabled(city)">
                                                                        <template v-slot:prepend>
                                                                            <v-icon size="20"
                                                                                v-if="city === startSelected || city === endSelected">
                                                                                md:check_circle</v-icon>
                                                                        </template>
                                                                        Seleccionar
                                                                    </v-btn>
                                                                </span>
                                                            </v-col>
                                                        </v-row>

                                                    </v-card>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>


                                </v-card>
                            </v-stepper-window-item>
                            <v-stepper-window-item :disabled="!getPrebooking.CanSelectExtraNights" value=2>
                                <v-card flat class="bg-background pa-5" elevation="0">

                                    <v-row dense no-gutters align=center justify=center>
                                        <v-col cols="5">
                                            <v-card flat class="bg-foreground pa-5 text-center" rounded=lg>
                                                <p class="body-1 semi">
                                                    Noches extra antes del circuito
                                                </p>
                                                <v-card-actions>
                                                    <v-row dense justify=center align=center>
                                                        <v-col cols="5" class="d-flex justify-space-between align-center">
                                                            <v-btn color="secondary" variant="flat" class="py-1" size=xs
                                                                rounded="sm" @click="preNightsIndex--"
                                                                :disabled="!preNightsIndex">
                                                                <v-icon icon="md:remove" size=20></v-icon>
                                                            </v-btn>
                                                            <h4 class="text-center ml-2">{{ preNightsSelected }}</h4>
                                                            <v-btn color="secondary" variant="flat" size=xs rounded="sm"
                                                                :disabled="preNightsIndex >= (service.Catalog.ExtraNightsInfo.PreNights.length - 1) || nightsFullyAlloted"
                                                                class="py-1" @click="preNightsIndex++">
                                                                <v-icon icon="md:add" size=20></v-icon>
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-actions>
                                            </v-card>
                                            <v-card flat class="bg-foreground pa-5 mt-3 text-center" rounded=lg>
                                                <p class="body-1 semi">
                                                    Noches extra después del circuito
                                                </p>
                                                <v-card-actions>
                                                    <v-row dense justify=center align=center>
                                                        <v-col cols="5" class="d-flex justify-space-between align-center">
                                                            <v-btn color="secondary" variant="flat" class="py-1" size=xs
                                                                rounded="sm" :disabled="!postNightsIndex"
                                                                @click="postNightsIndex--">
                                                                <v-icon icon="md:remove" size=20></v-icon>
                                                            </v-btn>
                                                            <h4 class="text-center ml-2">{{ postNightsSelected }}</h4>
                                                            <v-btn color="secondary"
                                                                :disabled="postNightsIndex >= (service.Catalog.ExtraNightsInfo.PostNights.length - 1) || nightsFullyAlloted"
                                                                variant="flat" class="py-1" size=xs rounded="sm"
                                                                @click="postNightsIndex++">
                                                                <v-icon icon="md:add" size=20></v-icon>
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row dense no-gutters>
                                        <v-col class="text-center">
                                            <span class="body-2 text-warning">Máximo: {{
                                                service.Catalog.ExtraNightsInfo.MaxNights }} noches</span>
                                        </v-col>
                                    </v-row>

                                </v-card>
                            </v-stepper-window-item>
                            <v-stepper-window-item value=3>
                                <CircuitsTransfersCard v-model:valid="validTransfers" v-model:in="transferIn"
                                    v-model:out="transferOut" v-model:modeIn="transferInMode"
                                    v-model:modeOut="transferOutMode" />
                            </v-stepper-window-item>

                        </v-stepper-window>
                        <v-stepper-actions class="pa-5 px-7 bg-midground">
                            <template v-slot:next>
                                <v-btn v-if="steps == 1 || steps == 2" variant="text" class="ml-auto mr-3"
                                    color="secondary_text" dark @click="next" size="large" rounded="sm">
                                    Omitir
                                </v-btn>
                                <v-btn class="btn btn-primary" :class="steps == 1 || steps == 2 ? '' : 'ml-auto'"
                                    :disabled="(steps == 0 && !roomSelected) || (steps == 1 && (!startSelected || !endSelected)) || (steps == 2 && (!preNightsSelected && !postNightsSelected)) || (steps == 3 && !validTransfers)"
                                    size="large" flat color="primary" rounded="sm" :loading="loadingNext"
                                    @click="customNext">{{ steps == 3 ? 'Agregar al carrito' : 'Siguiente' }}</v-btn>
                            </template>
                            <template v-slot:prev>

                            </template>
                        </v-stepper-actions>

                    </template>
                </v-stepper>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import VueDatePicker from "@vuepic/vue-datepicker";
import { CircuitAvailRequest } from "~/interfaces/services/circuits/AvailRequest";
import { useTheme } from 'vuetify/framework';
import { FlightInfo, PointInfo, SetTransferDetailsRequest, TravelInfo } from "~/interfaces/services/circuits/SetTransferDetailsRequest";
import { PhoneSingleFactorInfoOptions } from "firebase/auth";
const theme = ref(useTheme())
const route = useRoute()
const store = useCircuitsStore();
const { getCatalog, getAvail, getPrebooking } = storeToRefs(store)
const { fetchCatalog, getAvailability } = store;
const tab = ref(0)
const openPanels = ref([1, 2, 3])
const durationSelected = ref({})
const mealPlanSelected = ref({})
const selectedDate = ref(new Date())
const displayDates: Ref<Date[]> = ref([])
const indexDisplay = ref(0)
const stepperDialog = ref(false)
const steps = ref(0)
const availLoading = ref(false)
const week = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']
const loadingNext = ref(false)
const presetDates: Ref<{
    label: string;
    value: Date[] | string[] | string | Date;
    style?: Record<string, string>;
    slot?: string;
    noTz?: boolean;
}[]> = ref([])
const highlightedDates = ref([])
const roomSelected = ref(null)
const valid = ref(false)

const dayClass = (date: Date) => {
    let classTag = ''
    const exists = presetDates.value.map(x => dayjs(x.value[0]).toISOString()).includes(dayjs(date).toISOString());
    if (exists) {
        const pd = presetDates.value.find(x => dayjs(x.value[0]).toISOString() == dayjs(date).toISOString())

        switch (pd.slot) {
            case 'avail': {
                classTag = 'success'
            }; break;
            case 'noavail': {
                classTag = 'error'
            }; break;
            case 'onrq': classTag = 'warning'; break;
        }


    }
    return classTag;

}


const currency = ref(route.query.currency ? (route.query.currency as string) : 'USD')

const service = computed(() => {
    if (getPrebooking.value && getPrebooking.value.Services) {
        return getPrebooking.value.Services[0]
    }
})

const allowedDepartures = ref([])
onMounted(async () => {
    if (!route.query) return;
    const catalogId = route.query.catalogId as string
    store.basketId = route.query.basketId as string
    currency.value = route.query.currency;
    fetchCatalog({ catalogId: catalogId, currency: route.query.currency as string })
        .then(() => {
            durationSelected.value = getCatalog.value.Durations ? getCatalog.value.Durations[0] : null
            mealPlanSelected.value = getCatalog.value.MealPlans ? getCatalog.value.MealPlans[0] : null
            allowedDepartures.value = getCatalog.value.Departures.filter(x => dayjs(x.Date).toDate() >= new Date());
            const dep = allowedDepartures.value[0]
            startDate.value = dep.Date
            selectDate(new Date(dep.Date))
            isSelectedDateAvailable.value = dep.Availability < 2
            for (let departure of allowedDepartures.value) {
                const dur = Number.parseInt(durationSelected.value.Key);
                let tag = 'avail'
                switch (departure.Availability) {
                    case 0: { tag = 'avail'; }; break;
                    case 2: tag = 'noavail'; break;
                    case 1: tag = 'onrq'; break;
                }
                const dateCopy = useDeepCopy(departure.Date)
                const end = dayjs(dateCopy).add(dur - 1, 'days').toDate()
                presetDates.value.push({
                    label: dayjs(departure.Date).format('DD/MM'),
                    value: [new Date(departure.Date), new Date(end)],
                    slot: `${tag}`
                })


            }
            indexDisplay.value = 1
        })


})

watch(indexDisplay, (after, before) => {
    if (after >= getCatalog.value.Departures.length) {
        indexDisplay.value = getCatalog.value.Departures.length - 1
        return
    }

    if (after < 0) {
        indexDisplay.value = 0
        return
    }

    const departure = getCatalog.value.Departures[before];
    if (!departure) return;
    let month = new Date(departure.Date).getMonth()
    if (new Date(getCatalog.value.Departures[after].Date).getMonth() == month) {
        return after > before ? indexDisplay.value++ : indexDisplay.value--;
    }
    selectDate(new Date(getCatalog.value.Departures[after].Date))

})

const departureSelected = computed(() => {
    if (getCatalog.value && getCatalog.value.Departures)
        return getCatalog.value.Departures.find(x => dayjs(x.Date).format('YYYY-MM-DD') == dayjs(selectedDate.value).format('YYYY-MM-DD'))
})

const isSelectedDateAvailable = ref(false)
const selectDate = (date) => {
    const dep = getCatalog.value.Departures.find(x => dayjs(x.Date).format('YYYY-MM-DD') == dayjs(date).format('YYYY-MM-DD'))
    isSelectedDateAvailable.value = dep.Availability < 2;
    const duration = Number.parseInt(durationSelected.value.Key);
    const endDate = dayjs(date).add(duration - 1, 'days')
    displayDates.value = [date, endDate];
    selectedDate.value = date
}

const searchAvail = (async () => {
    availLoading.value = true
    const catalogId = route.query.catalogId as string
    const payload: CircuitAvailRequest = {
        catalogId: catalogId,
        categoryId: null,
        mealplan: mealPlanSelected.value ? mealPlanSelected.value.Key : null,
        nationality: "AR",
        currency: currency.value,
        duration: durationSelected.value.Key,
        occupancies: occupancies.value,
        residence: "AR",
        Departure: selectedDate.value.toISOString()
    };
    await useNuxtApp().$toast.promise(
        getAvailability(payload), {
        pending: "Buscando disponibilidad",
        success: "Hay disponibilidad",
        error: "No hay disponibilidad",
    })
        .then(() => {
            if (getAvail.value.length)
                stepperDialog.value = true
        })
        .finally(() => {
            availLoading.value = false
        })
})

watch(stepperDialog, (value) => {
    if (!value) {
        roomSelected.value = null
    }
})
const startSelected = ref(null)
const endSelected = ref(null)

const selectCity = (city) => {
    if (!startSelected.value) {
        if (endSelected.value) {
            if (endSelected.value == city) {
                endSelected.value = null
                return;
            }

            if (city.Index < endSelected.value.Index) {
                startSelected.value = city;
                return;
            }
        }
        else {
            startSelected.value = city;
            return;
        }
    }
    else {
        if (startSelected.value == city) {
            startSelected.value = null;
            return
        }

        if (endSelected.value == city) {
            endSelected.value = null
            return;
        }

        if (city.Index > startSelected.value.Index) {

            endSelected.value = city;
        }
    }
}

const isCityDisabled = (city) => {
    return (!city.IsStartAvailable && !startSelected.value) || (!city.IsEndAvailable && !endSelected.value)
        || (endSelected.value && city.Index > endSelected.value.Index)
        || (startSelected.value && city.Index < startSelected.value.Index)
        || ((startSelected.value && endSelected.value) && (startSelected.value !== city && endSelected.value !== city))
}

const getItineraryCollection = computed(() => {
    const coll = []
    for (let item of getCatalog.value.Itinerary) {
        const cities = item.Cities.filter(x => x.IsStartAvailable || x.IsEndAvailable)
        for (let city of cities) {
            city.DayIndex = item.Index;
        }
        coll.push(...cities)
    }

    return coll;
})

const preNightsIndex = ref(0)
const postNightsIndex = ref(0)
const preNightsSelected = computed(() => {
    const test = service.value.Catalog.ExtraNightsInfo.PreNights[preNightsIndex.value]
    return test;

})
const postNightsSelected = computed(() => {
    return service.value.Catalog.ExtraNightsInfo.PostNights[postNightsIndex.value]
})
watch(preNightsIndex, () => {
    if (preNightsIndex.value < 0)
        preNightsIndex.value = 0
})

watch(postNightsIndex, () => {

    if (postNightsIndex.value < 0)
        postNightsIndex.value = 0
})

const nightsFullyAlloted = computed(() => {
    const max = service.value.Catalog.ExtraNightsInfo.MaxNights
    const disabled = postNightsSelected.value + preNightsSelected.value >= max;
    return disabled;
})

const occupancies = ref([])
const setOccupancies = ($e) => {
    occupancies.value = $e.value

}

//#region TRANSFERS
const validTransfers = ref(false)
const transferIn = ref({})
const transferOut = ref({})
const transferInMode = ref({ "Key": "1", "Value": "No Contratado" })
const transferOutMode = ref({ "Key": "1", "Value": "No Contratado" })
//#endregion

const startDate = ref(new Date());
const dpKey = ref(0)
onUpdated(() => {
    dpKey.value++
})

const rules = ref({
    startEndRules: [() => steps.value > 0 ? (getPrebooking.value && getPrebooking.value.CanCustomizeItinerary ? (steps.value > 1) : 'No tiene') : "Selecciona una habitación"],
    extraNightsRules: [() => steps.value > 0 ? (getPrebooking.value && getPrebooking.value.CanSelectExtraNights ? (steps.value > 2) : 'No tiene') : "Selecciona una habitación"],
    transferRules: [() => steps.value > 0 ? (getPrebooking.value && getPrebooking.value.CanSelectTransfers ? (steps.value > 3) : 'No tiene') : "Selecciona una habitación"],
})

const customNext = async () => {
    loadingNext.value = true
    switch (Number.parseInt(steps.value)) {
        case 0: {
            const payload = {
                "selectedServices": [roomSelected.value.ServiceId],
                "selectedSupplements": [],
                "basketId": store.basketId,
                "websiteId": useRuntimeConfig().public.websiteId,
                "availUrl": route.fullPath
            }


            await useNuxtApp().$toast.promise(
                store.addService(payload), {
                pending: "Preparando su reserva",
            })
                .then(async () => {
                    const payload = {
                        basketId: store.basketId,
                        currency: currency.value
                    }
                    await useNuxtApp().$toast.promise(
                        store.getBasket(payload), {

                        error: "Hubo un error",
                    })
                        .then(() => {

                            if (store.preBooking.CanCustomizeItinerary) {
                                steps.value = 1
                                return
                            }
                            if (store.preBooking.CanSelectExtraNights) {
                                steps.value = 2
                                return
                            }
                            if (store.preBooking.CanSelectTransfers) {
                                steps.value = 3
                                return
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                        .finally(() => { loadingNext.value = false })

                })
                .catch(() => {
                    loadingNext.value = false
                })
                .finally(() => {

                })
        }; break;
        case 1: {
            // const {basketId, beginIndexDay,  beginIndexCity,  endIndexDay,  endIndexCity} = payload;
            const payload = {
                basketId: store.basketId,
                beginIndexCity: startSelected.value.Index,
                beginIndexDay: startSelected.value.DayIndex,
                endIndexCity: endSelected.value.Index,
                endIndexDay: endSelected.value.DayIndex
            }

            await useNuxtApp().$toast.promise(
                store.setStartEnd(payload), {
                pending: "Modificando itinerario",
                success: "Itinerario actualizado!",
                error: "Hubo un error",
            })
                .then(() => {
                    steps.value++
                })
                .catch(() => { })
                .finally(() => { loadingNext.value = false })
        }; break;
        case 2: {
            // circuitService/setExtraNights?basketId=65ccf07b270fd03d8a4ae7ab&extraPreNights=1&extraPostNights=1
            const payload = {
                basketId: store.basketId,
                extraPreNights: preNightsSelected.value,
                extraPostNights: postNightsSelected.value
            }

            await useNuxtApp().$toast.promise(
                store.setExtraNights(payload), {
                pending: "Agregando noches",
                success: "Noches agregadas",
                error: "Hubo un error",
            })
                .then(() => {
                    steps.value++
                })
                .catch(() => { })
                .finally(() => { loadingNext.value = false })
        }; break;
        case 3: {
            const payload: SetTransferDetailsRequest = {
                transferOptionSelectedIn: parseInt(transferInMode.value.Key),
                transferOptionSelectedOut: parseInt(transferOutMode.value.Key)
            }

            switch (transferInMode.value.Key) {
                case '1':
                case '5': break;
                case '2': {
                    const FlightDetailsIn: FlightInfo = {
                        airline: transferIn.value.airline,
                        flightNumber: transferIn.value.flightNumber,
                        flightDate: dayjs(transferIn.value.date).toISOString(),
                        departure: {
                            airport: transferIn.value.departureAirport,
                            dateAndTime: transferIn.value.departureDate,
                        },
                        arrival: {
                            airport: transferIn.value.arrivalAirport,
                            dateAndTime: transferIn.value.arrivalDate,
                        }

                    };


                    Object.assign(payload, FlightDetailsIn);
                }; break;
                case '3': {
                    const PointDetailsIn: TravelInfo = {
                        origin: {
                            city: transferIn.value.city,
                            country: transferIn.value.country,
                            address: transferIn.value.address
                        } as PointInfo,
                        departure: transferIn.value.date
                    }

                    Object.assign(payload, PointDetailsIn);

                }
            }

            switch (transferOutMode.value.Key) {
                case '2': {
                    const FlightDetailsOut: FlightInfo = {
                        airline: transferOut.value.airline,
                        flightNumber: transferOut.value.flightNumber,
                        flightDate: dayjs(transferOut.value.date).toISOString(),
                        departure: {
                            airport: transferOut.value.departureAirport,
                            dateAndTime: transferOut.value.departureDate,
                        },
                        arrival: {
                            airport: transferOut.value.arrivalAirport,
                            dateAndTime: transferOut.value.arrivalDate,
                        }

                    };

                    Object.assign(payload, FlightDetailsOut);
                }; break;
                case "3": {
                    const PointDetailsOut: TravelInfo = {
                        destination: {
                            city: transferOut.value.city,
                            country: transferOut.value.country,
                            address: transferOut.value.address
                        } as PointInfo,
                        departure: transferIn.value.date
                    }

                    Object.assign(payload, PointDetailsOut);
                }; break;
            }

            await useNuxtApp().$toast.promise(
                store.setStartEnd(payload), {
                pending: "Configurando traslados",
                success: "Agregado al carrito",
                error: "Hubo un error",
            })
                .then(() => {
                    navigateTo({
                        path: "/checkout/",
                        query: {
                            id: service.value.Id,
                            serviceType: 'circuits',
                            currency: currency.value
                        },
                    });
                })
                .catch(() => { })
                .finally(() => { loadingNext.value = false })
        }; break;
    }
}

</script>

<style>
.v-stepper-window {
    margin: 0;
}

.price-sheet {
    border: 1px solid rgb(var(--v-theme-secondary));
    border-left: 4px solid rgb(var(--v-theme-secondary));
    border-radius: 12px;
    padding: 16px;
    margin-top: 8px;
    background-color: rgb(var(--v-theme-secondary_lighten));
}

.v-expansion-panel-title,
.v-expansion-panel-title__overlay {
    border-radius: 12px !important;
}


.dp__cell_inner {
    border-radius: 6px !important;
}


.dp__range_between .v-btn,
.dp__range_end .v-btn {
    z-index: 0 !important;
    background-color: transparent !important;
    border-color: transparent !important;
    color: whitesmoke !important;

}

.dp__range_between {
    color: whitesmoke !important;
    background-color: rgb(var(--v-theme-secondary)) !important;
    z-index: 5 !important
}


.v-stepper-item--complete .v-stepper-item__avatar {
    background-color: rgb(var(--v-theme-success)) !important
}

.v-stepper-item--error {
    color: rgb(var(--v-theme-secondary_text)) !important;
}

.v-stepper-item--error .v-stepper-item__avatar {
    background-color: rgb(var(--v-theme-secondary_text)) !important;
}

.v-stepper-header {
    box-shadow: 0px 0px 0px 0px !important;
}

.v-stepper-item--selected>div>span {
    font-weight: bold !important
}

.card-selected {
    border: 1px solid rgb(var(--v-theme-primary)) !important;
    background-color: rgb(var(--v-theme-foreground)) !important;
}</style>