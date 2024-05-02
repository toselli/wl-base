<template>
  <v-card variant="outlined" class="pa-3 mb-2" rounded="lg" v-for="review in guestReviews.slice(0, limit)">
    <v-row>
      <v-col cols="2">
        <v-sheet rounded="lg" color="secondary_lighten" class="d-flex align-center justify-center text-center mr-2 py-2"
          width="50">
          <h3 class="text-h3 semi">{{ review.rating.substr(0, 1) }}</h3>
        </v-sheet>
      </v-col>
      <v-col cols="10">
        <img src="/img/reviews/ExpediaLogo_Color.png" v-if="review.verification_source == 'expedia'" height="30"
          class="float-right" />
        <img src="/img/reviews/Hotels_Logo_Horizontal_RED_RGB_TM.png" v-if="review.verification_source == 'hotelscom'"
          height="20" class="float-right" />
        <img src="/img/reviews/VRBO_logo_color_White.jpg" v-if="review.verification_source == 'vrbo'" height="20"
          class="float-right" />
        <h3 class="text-h6 semi">{{ $capitalize($t(review.qualification)) }}</h3>
        <p class="body-2 mb-1">{{ review.reviewer_name }} - {{ review.date_submitted }}</p>
        <p class="body-2">{{ review.text }}</p>
      </v-col>
    </v-row>
  </v-card>
  <v-col cols="12" v-if="guestReviews.length > limit" class="text-center ">
    <v-btn variant="outlined" size="small" rounded="xl" @click="viewMoreReviews">Mostrar más opiniones</v-btn>
  </v-col>
</template>

<script setup>
const props = defineProps(["guestReviews"]);
const limit = ref(5)

function viewMoreReviews() {
  limit.value = limit.value + 18
}
</script>
