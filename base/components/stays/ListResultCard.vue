<template>
  <v-card rounded="lg" class="list-result-card fill-height" flat @click="handleCardClick"
    @click.middle.prevent="$emit('goTotab')">
    <v-row dense no-gutters :class="mode == 'list' ? '' : 'fill-height'">
      <v-col cols="12" :lg="mode == 'list' ? '3' : '12'" class="pa-0">
        <v-img :src="cleanThumbUrl(item.Thumb)" height="164px" cover lazy-src="/base/img/services/hotel_no_image.png"
          :class="mode == 'list' ? '' : 'mb-1'"></v-img>
      </v-col>
      <v-col :class="mode == 'list' ? 'pa-4' : 'px-4'">
      <span v-if="item.isHotelCollect">Collect</span>
        <v-rating :model-value="item.Rating" density="compact" size="small" color="orange" v-if="item.Rating" readonly
          half-increments></v-rating>
        <h3 :class="!item.Rating ? 'mt-2' : ''">
          {{ item.Name }}
        </h3>
        <p class="body-2 semi mt-1 mb-0" v-if="!hideInfo">
          <v-icon icon="mdi-map-marker" size="small"></v-icon>
          <span >{{ item.Address }}, {{ item.City }}</span>
        </p>
        <div class="body-2 text-secondary_text mt-4" v-if="!hideInfo && mode == 'list' && item.GuestRatingAverage">
          <h3 class="float-left mr-1" :class="item.GuestRatingAverage > 3 ? 'bg-success pa-1 rounded-sm' : ''">{{
    item.GuestRatingAverage }} </h3>
          <h4 v-if="item.GuestRatingQualification" class="mb-2">{{
    $capitalize($t('guestRating.' + item.GuestRatingQualification)) }} </h4>
          <span class="body-3">({{ item.GuestRatingCount }} {{ $t('reviews') }})</span>
        </div>
      </v-col>
      <v-col cols="12" :lg="mode == 'list' ? '3' : '12'" class="pa-4  d-flex justify-space-between flex-column">
        <v-row dense no-gutters>
          <v-col v-if="!hideInfo && mode == 'grid'" cols="5">
            <div class="body-2 text-secondary_text mt-4" v-if="item.GuestRatingAverage">
              <h3 class="float-left mr-1" :class="item.GuestRatingAverage > 3 ? 'bg-success pa-1 rounded-sm' : ''">{{
    item.GuestRatingAverage }} </h3>
              <h4 v-if="item.GuestRatingQualification" class="mb-2">{{
    $capitalize($t('guestRating.' + item.GuestRatingQualification)) }} </h4>
              <span class="body-3">({{ item.GuestRatingCount }} {{ $t('reviews') }})</span>
            </div>
          </v-col>
          <v-col class="text-right d-flex justify-space-between flex-column">
            <p class="body-2 text-secondary_text mb-0">{{ $capitalize($t('start_at')) }}</p>
            <h2 v-if="!item.previousPrice">
              <span class="body-2 text-secondary_text mr-1">{{ item.Currency }}</span>{{ item.Total.toFixed(2) }} 
            </h2>
            <div v-else>
              <v-tooltip location="right" v-if="item.previousPrice.length > 1">
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <h5 class="text-decoration-line-through text-border" v-if="item.previousPrice">
                      <span class="body-2 mr-1">{{ item.Currency }}</span>{{ item.previousPrice[0].toFixed(2) }}
                    </h5>
                    <h2>
                      <span class="body-2 text-secondary_text mr-1">{{ item.Currency }}</span>{{ item.Total.toFixed(2)
                      }}
                    </h2>
                  </div>
                </template>
                <span>
                  <h5 class="text-decoration-line-through text-border" v-for="(itemprice, i) in item.previousPrice"
                    :key="i">
                    <span class="body-2 mr-1">{{ item.Currency }}</span>{{ itemprice.toFixed(2) }}
                  </h5>
                  <h5 class="text-border "> <span class="body-2 mr-1">{{ item.Currency }}</span>{{ item.Total.toFixed(2)
                    }}
                  </h5>
                </span>
              </v-tooltip>
              <div v-else>
                <h5 class="text-decoration-line-through text-border">
                  <span class="body-2 mr-1">{{ item.Currency }}</span>{{ item.previousPrice[0].toFixed(2) }}
                </h5>
                <h2>
                  <span class="body-2 text-secondary_text mr-1">{{ item.Currency }}</span>{{ item.Total.toFixed(2) }}
                </h2>
              </div>
            </div>
          </v-col>
        </v-row>
        <!-- <p class="body-2 text-secondary_text">{{ $t('per_night') }}</p> -->
        <v-btn color="primary" rounded="md" variant="flat" :class="mode == 'list' ? 'mt-6' : 'mt-2'" @click="$emit('goTo')"
          @click.middle.prevent="$emit('goTotab')">{{ $capitalize($t('view_availability')) }}</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps(["item", "mode","hideInfo"]);

const emit = defineEmits(['goTo', 'goTotab'])

const cleanThumbUrl = (url) => {
  const baseUrl = "https://media.agenciavirtual.net/public/prop/";
  const queryParams = "?w=300&h=300&mode=crop&quality=75";

  if (url.indexOf("http") !== url.lastIndexOf("http")) {
    url = url.replace(baseUrl, "");
    url = url.replace(queryParams, "");
  }
  return url;
}

const handleCardClick = (event) => {
  const isCtrlPressed = event.ctrlKey;

  if (event.button === 1 || isCtrlPressed) {

    emit('goTotab');
  } else {
    emit('goTo');
  }
};
</script>
