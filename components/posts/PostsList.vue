<template>
  <div>
    <CommonSearch />
    <v-container class="content-container">
      <v-row v-if="posts.length > 0">
        <v-col cols="12" md="2">
          <h6 class="body-1 text-secondary_text mt-6">Paquetes vacacionales</h6>
          <h3 class="text-h3 mt-1">Estas son nuestras ofertas del mes</h3>
          <v-btn rounded="xl"  variant="flat" color="primary" append-icon="chevron-right" class="mt-3"
            @click="viewPostCategory('Paquetes%20%2f%20Ofertas')">Ver todos</v-btn>
        </v-col>
        <!-- <v-col cols="12" md="10">
                    <v-slide-group :show-arrows="!isMobile">
                        <v-slide-group-item v-for="post in getToursPost" :key="post">
                            <PostsTourCard :post="post" class="ma-2" />
                        </v-slide-group-item>
                    </v-slide-group>
                </v-col> -->
        <v-col cols="12" md="10">
          <v-carousel height="320" show-arrows="hover" hide-delimiters progress="primary" v-if="isMobile">
            <v-carousel-item v-for="(post, index) in getToursPost" :key="index">
              <v-row dense class="mt-2">
                <v-col cols="12">
                  <PostsTourCard :post="post" />
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
          <v-carousel height="320" show-arrows="hover" hide-delimiters progress="primary" v-else>
            <v-carousel-item v-for="(chunk, index) in chunkedToursPosts" :key="index">
              <v-row dense class="mt-2">
                <v-col cols="12" md="4" v-for="post in chunk" :key="post.id">
                  <PostsTourCard :post="post" />
                </v-col>
              </v-row>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
      <v-row v-if="posts.length > 0">
        <v-col cols="12">
          <h6 class="body-1 text-secondary_text mt-6">Destinos recomendados</h6>
          <h3 class="text-h3 mt-1">Descubrí estos lugares con nosotros</h3>
        </v-col>
        <v-col v-for="post in getDestinationPost" :key="post" cols="12">
          <posts-destination-card :post="post" class="ma-1" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12"> <contact-form-card /> </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>

//MOBILE
const isMobile = useMobile();
const route = useRoute();
const store = usePostsStore();
const loading = ref(false);
const posts = ref([]);
async function fetchPosts() {
  try {
    loading.value = true;
    await useNuxtApp().$toast.promise(store.fetchPosts, {
      error: "Error al obtener los datos",
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}


watchEffect(() => {
  posts.value = store.getPosts.value;
});

onMounted(() => {
  fetchPosts();
});

const getToursPost = computed(() => {
  if (posts.value.length > 0)
    return posts.value.filter(
      (post) => post.category.id === 2 && post.onHome === true
    );
});
const getDestinationPost = computed(() => {
  if (posts.value.length > 0)
    return posts.value.filter(
      (post) => post.category.id === 3 && post.onHome === true
    );
});

const chunkedToursPosts = computed(() => {
  return chunkArray(getToursPost.value, 3);
});

function chunkArray(array, chunkSize) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

function viewPostCategory(category) {
  navigateTo("/posts/" + category, {});
}
</script>
  
<style>
.search-tab {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 24px 24px 0 0;
}
</style>
