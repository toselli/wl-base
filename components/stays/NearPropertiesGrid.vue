<template>
  <v-card flat class="mb-3 bg-secondary_lighten" rounded="xl">
    <v-card-text class="pa-6">
      <h4 class="text-h6 mb-5 text-center">Aquí te mostramos alojamientos cercanos</h4>
      <v-row>
        <v-col cols="3" v-for="item in nearProperties.slice(0,4)">
          <stays-list-near-properties-card :location="principal.Location" mode="grid" :item="item" class="mb-3" @goTo="goToDetails(item)"
            @goTotab="goToDetailsNewTab(item)"></stays-list-near-properties-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps(["items", "principal"]);
const nearProperties = computed(() => {
  return props.items.filter(item => item.Name !== props.principal.Name);
});

const route = useRoute();

const emit = defineEmits(['goToTab'])

function goToDetails(item) {
  navigateTo({
    path: "/stays/details",
    query: {
      id: item.Id,
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      currency: 'USD',
      occupancies: route.query.occupancies,
    },
    open: {
      target: '_blank'
    }
  });
}
const router = useRouter();
function goToDetailsNewTab(item) {
  let routeData = router.resolve({
    path: "/stays/details",
    query: {
      id: item.Id,
      checkIn: route.query.checkIn,
      checkOut: route.query.checkOut,
      currency: 'USD',
      occupancies: route.query.occupancies,
    }
  });
  window.open(routeData.href, '_blank');
}
</script>
