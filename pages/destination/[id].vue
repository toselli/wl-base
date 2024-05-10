<template>
  <v-container class="post-container" v-if="post">
    <v-row dense>
            <v-col>
                <v-btn prepend-icon="mdi-chevron-left" rounded="xl" density="comfortable" variant="outlined" @click="backToHome">
                    Volver</v-btn>
            </v-col>
        </v-row>
    <v-row class="mt-1">
      <v-col>
        <v-card rounded="xl" class="mb-3" flat>
          <v-img :src="post.bannerUrl" height="120" cover class="pa-12">
          </v-img>
        </v-card>
        <v-chip :color="tagColor.getTagColor(post.tag.id)" size="small" density="confortable" variant="tonal">
          {{ post.tag.name }}
        </v-chip>
        <h2 class="text-h2 semi mb-4">{{ post.title }}</h2>
        <v-row class="mb-6" dense v-if="post.gallery && post.gallery.length > 0">
          <v-col cols="3" v-for="(img, i) in post.gallery" :key="i" rounded="xl">
            <v-card rounded="lg" @click="showGalleryDialog(i)">
              <v-img :src="img" rounded="xl"></v-img>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog width="650" v-model="galleryDialog">
          <v-card rounded="lg">
            <v-carousel show-arrows="hover" hide-delimiters height="100%" v-model="galleryCarousel">
              <v-carousel-item v-for="item in post.gallery " :key="item">
                <v-img :src="item" :loading="true">
                  <v-btn icon="mdi-close" class="float-right ma-3" density="compact" fab
                    @click="galleryDialog = false"></v-btn>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-dialog>
        <div v-html="post.content" class="body-1 px-12"></div>
        <v-row v-if="post.downloadPdfButtonText || post.downloadFlyerButtonText">
          <v-col class="text-center mt-6" v-if="post.downloadPdfButtonText">
            <v-btn color="primary" variant="flat" rounded="xl" @click="downloadPdf">
              {{ post.downloadPdfButtonText }}
            </v-btn>
          </v-col>
          <v-col class="text-center mt-6" v-if="post.downloadFlyerButtonText">
            <v-btn color="primary" variant="flat" rounded="xl" @click="downloadFlyer">
              {{ post.downloadFlyerButtonText }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="getToursPost && getToursPost.length > 0">
          <v-col cols="12">
            <h4 class="text-secondary_text mt-6">Paquetes vacacionales en este destino</h4>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" md="4" v-for="post in getToursPost" :key="post">
                <PostsTourCard :post="post" class="ma-2" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
const route = useRoute()
const store = usePostsStore()

//MOBILE
const isMobile = useMobile()

const loading = ref(false)
const post = ref(null)

async function fetchPost() {
  try {
    loading.value = true
    await useNuxtApp().$toast.promise(store.fetchPostById(route.params.id), {
      error: 'Error al obtener los datos'
    })
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

watchEffect(() => {
  post.value = store.getPost;
});

onMounted(() => {
  fetchPost()
});

const tagColor = useTagColor();

const galleryDialog = ref(false)
const galleryCarousel = ref(0)

function showGalleryDialog(i) {
  galleryDialog.value = true
  galleryCarousel.value = i
}

function downloadPdf() {
  navigateTo(post.value.pdfUrl, {
    external: true, open: {
      target: '_blank'
    }
  })
}
function downloadFlyer() {
  navigateTo(post.value.flyerUrl, {
    external: true, open: {
      target: '_blank'
    }
  })
}

//TOURS

const posts = ref([])
async function fetchTours() {
    try {
        loading.value = true
        await useNuxtApp().$toast.promise(store.fetchPosts, {
            error: 'Error al obtener los datos'
        })
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

watchEffect(() => {
    posts.value = store.getPosts;
});

const { toTop } = useScroll();

onMounted(() => {
   fetchTours()
   toTop()
});

const getToursPost = computed(() => {
    if (posts.value.length > 0)
        return posts.value.filter((tour) => tour.category.id === 2 && tour.destination === post.value.destination);
});

function backToHome() {
    navigateTo('/')
}


</script>

<style>
.overlay-img {
  position: relative;
}

.overlay-img::before {
  content: "";
  position: absolute;
  top: 0;
  z-index: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
}

.overlay-img .v-row {
  position: absolute;
  width: 100%;
  z-index: 1;
}
</style>