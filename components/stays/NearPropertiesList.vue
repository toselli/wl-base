<template>
  <v-card flat class="mb-3 bg-midground" rounded="xl">
    <v-card-text class="pa-6">
      <h4 class="text-h6 mb-5">Hoteles cercanos</h4>
      <div v-for="item in nearProperties">
        <stays-list-near-properties-card :item="item" class="mb-3" @goTo="goToDetails(item)"
          @goTotab="goToDetailsNewTab(item)"></stays-list-near-properties-card>
      </div>
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
  emit('goToTab')
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
