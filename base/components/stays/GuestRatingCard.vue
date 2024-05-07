<template>
  <v-container>
    <v-row justify="space-between" v-if="property.Details">
          <v-sheet rounded="lg" color="secondary_lighten" class="d-flex align-center justify-center text-center mt-3 ml-3"
            width="65" v-if="property.Details.GuestRatingOverall">
            <h3 class="text-h3 semi">{{ property.Details.GuestRatingOverall }}</h3>
          </v-sheet>
          <v-col class="mt-2">
            <h4>{{ $capitalize($t(property.Details.GuestRatingQualification)) }}</h4>
            <p class="body-3">Calificación de los huéspedes</p>
            <p class="body-3">{{ property.Details.GuestRatingCount }} opiniones</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row class="mt-1" v-if="property.Details.GuestRatingCleanliness">
              <v-col class="body-3">{{ $capitalize($t('guestRating.cleanliness')) }}</v-col>
              <v-col class="body-2 text-right">{{ property.Details.GuestRatingCleanliness }}/5</v-col>
            </v-row>
            <var :set="ratingCleanlinessPercent = property.Details.GuestRatingCleanliness * 100 / 5"></var>
            <v-progress-linear color="primary" class="mt-2" height="12" :buffer-value="100" v-if="property.Details.GuestRatingCleanliness"
              v-model="ratingCleanlinessPercent"></v-progress-linear>
            <v-row class="mt-1" v-if="property.Details.GuestRatingAmenities">
              <v-col class="body-3">{{ $capitalize($t('guestRating.amenities')) }}</v-col>
              <v-col class="body-2 text-right">{{ property.Details.GuestRatingAmenities }}/5</v-col>
            </v-row>
            <var :set="ratingAmentiesPercent = property.Details.GuestRatingAmenities * 100 / 5"></var>
            <v-progress-linear color="primary" class="mt-2" height="12" :buffer-value="100"  v-if="property.Details.GuestRatingAmenities"
              v-model="ratingAmentiesPercent"></v-progress-linear>
            <v-row class="mt-1" v-if="property.Details.GuestRatingComfort">
              <v-col class="body-3">{{ $capitalize($t('guestRating.comfort')) }}</v-col>
              <v-col class="body-2 text-right">{{ property.Details.GuestRatingComfort }}/5</v-col>
            </v-row>
            <var :set="ratingComfortPercent = property.Details.GuestRatingComfort * 100 / 5"></var>
            <v-progress-linear color="primary" class="mt-2" height="12" :buffer-value="100" v-if="property.Details.GuestRatingComfort"
              v-model="ratingComfortPercent"></v-progress-linear>
          </v-col>
          <v-col>
            <v-row class="mt-1" v-if="property.Details.GuestRatingService">
              <v-col class="body-3">{{ $capitalize($t('guestRating.service')) }}</v-col>
              <v-col class="body-2 text-right">{{ property.Details.GuestRatingService }}/5</v-col>
            </v-row>
            <var :set="ratingServicePercent = property.Details.GuestRatingService * 100 / 5"></var>
            <v-progress-linear color="primary" class="mt-2" height="12" :buffer-value="100" v-if="property.Details.GuestRatingService"
              v-model="ratingServicePercent"></v-progress-linear>
            <v-row class="mt-1" v-if="property.Details.GuestRatingCondition">
              <v-col cols="9" class="body-3">{{ $capitalize($t('guestRating.condition')) }}</v-col>
              <v-col cols="3" class="body-2 text-right">{{ property.Details.GuestRatingCondition }}/5</v-col>
            </v-row>
            <var :set="ratingConditionPercent = property.Details.GuestRatingCondition * 100 / 5"></var>
            <v-progress-linear color="primary" class="mt-2" height="12" :buffer-value="100" v-if="property.Details.GuestRatingCondition"
              v-model="ratingConditionPercent"></v-progress-linear>

            <v-row class="mt-1" v-if="property.Details.GuestRatingNeighborhood">
              <v-col class="body-3">{{ $capitalize($t('guestRating.neighborhood')) }}</v-col>
              <v-col class="body-2 text-right">{{ property.Details.GuestRatingNeighborhood }}/5</v-col>
            </v-row>
            <var :set="ratingNeighborhoodPercent = property.Details.GuestRatingNeighborhood * 100 / 5"></var>
            <v-progress-linear color="primary" class="mt-2" height="12" :buffer-value="100" v-if="property.Details.GuestRatingNeighborhood"
              v-model="ratingNeighborhoodPercent"></v-progress-linear>

          </v-col>
        </v-row>
  </v-container>
</template>

<script setup>
const props = defineProps(["property"]);
</script>
