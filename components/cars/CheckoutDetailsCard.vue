<template>
    <v-card color="background" rounded="lg" class="pa-3 mb-2" flat v-for="(booking, index) in services">
        <v-row dense class="bg-white rounded-lg mx-1">
            <v-col cols="4" lg="4" class="pa-1 bg-white rounded-lg d-flex align-center">
                <v-img
                    :src="'https://th.bing.com/th/id/R.06311a969a32d201cac59cca66853da4?rik=oTHWlCv0SO%2f%2bZQ&riu=http%3a%2f%2fwww.pngmart.com%2ffiles%2f10%2fWhite-Toyota-Camry-PNG-Photo.png&ehk=q3oIAV9juV847DXjEow9Qceo0OUAXCqjwMqja6cBdLo%3d&risl=&pid=ImgRaw&r=0'"></v-img>

            </v-col>
            <v-col cols="8" lg="8">
                <v-sheet class="bg-foreground mt-n1"  rounded="lg">
                    <v-list class="bg-transparent body-2 text-secondary_text">
                        <v-list-item class="bg-midground d-flex flex-row justify-content-around">
                            <v-list-item-title>
                                <h3 class="text-h5 semi">
                                    {{ booking.Car.VehicleDetail.VehicleName }}
                                </h3>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <h5 class="text-black">
                                    Traslado privado
                                </h5>
                            </v-list-item-subtitle>
                        </v-list-item>
                        <div class="ml-3 mt-2">

                            <div>
                                <v-icon icon="mdi-bag-suitcase"></v-icon> Maletas: {{ booking.Car.VehicleDetail.BagBigCount
                                }}
                            </div>
                            <div>
                                <v-icon icon="mdi-account-multiple"></v-icon> Adultos: {{
                                    booking.Car.VehicleDetail.AdultsCount
                                }}
                            </div>
                            <div>
                                <v-icon icon="mdi-car-door"></v-icon> Puertas: {{ booking.Car.VehicleDetail.BagBigCount }}
                            </div>
                            <div v-if="booking.Car.VehicleDetail.HasAirCondition">
                                <v-icon icon="mdi-snowflake"></v-icon> Aire acondicionado
                            </div>
                        </div>
                    </v-list>
                </v-sheet>

            </v-col>
        </v-row>
        <v-row dense>
            <v-col>

                <v-sheet class="mt-1 bg-foreground pa-1"  rounded="lg">
                    <p :class="compact ? 'body-3' : 'body-2'" class="text-secondary_text">Recogida</p>

                    <div class="body-2 text-primary_text semi pa-1 d-flex">
                        <v-icon icon="mdi-map-marker" class="mr-1"></v-icon>
                        <span class="body-2 text-primary_text semi"> {{ booking.PickUpOfficeName }}</span>

                    </div>
                    <div class="body-2 text-primary_text semi pa-1 d-flex">
                        <v-icon icon="mdi-calendar" class="mr-1"></v-icon>
                        <span class="body-2 text-primary_text semi"> {{
                            $dayjs(booking.BeginService).format('DD-MM-YYYY') }}</span>
                    </div>

                    <div class="body-2 text-primary_text semi pa-1 d-flex">
                        <v-icon icon="mdi-clock-outline" class="mr-1"></v-icon>
                        <span class="body-2 text-primary_text semi"> {{ booking.BeginServiceString.split(' ')[1] }}</span>
                    </div>


                </v-sheet>
                <v-sheet class="mt-1 bg-foreground pa-1"  rounded="lg">
                    <p :class="compact ? 'body-3' : 'body-2'" class="text-secondary_text">Devolución</p>

                    <div class="body-2 text-primary_text semi pa-1 d-flex">
                        <v-icon icon="mdi-map-marker" class="mr-1"></v-icon>
                        <span class="body-2 text-primary_text semi"> {{ booking.ReturnOfficeName }}</span>

                    </div>
                    <div class="body-2 text-primary_text semi pa-1 d-flex">
                        <v-icon icon="mdi-calendar" class="mr-1"></v-icon>
                        <span class="body-2 text-primary_text semi"> {{
                            $dayjs(booking.EndService).format('DD-MM-YYYY') }}</span>
                    </div>

                    <div class="body-2 text-primary_text semi pa-1 d-flex">
                        <v-icon icon="mdi-clock-outline" class="mr-1"></v-icon>
                        <span class="body-2 text-primary_text semi"> {{ booking.EndServiceString.split(' ')[1] }}</span>
                    </div>


                </v-sheet>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
const props = defineProps(["compact", "services"]);
const route = useRoute();
</script>