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
        <v-chip :color="tagColor.getTagColor(post.tag.id)" variant="tonal" size="small" density="confortable">
          {{ post.tag.name }}
        </v-chip>
        <h2 class="text-h2 semi mb-4">{{ post.title }}</h2>
        <v-card rounded="xl" class="mb-3" flat>
          <v-img  :src="post.bannerUrl" cover></v-img>
        </v-card>
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
        <div v-html="post.content" class="body-1 px-2 px-md-12"></div>
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
        <v-card rounded="xl" class="mt-8" v-if="post.price" flat>
          <v-img :height="isMobile ? '200': '150'" :src="post.bannerUrl" cover class="overlay-img">
            <v-row dense align="center" justify="center" class="fill-height">
              <v-col cols="12" md="6" class="px-8 text-white">
                <h3>¡Vive momentos inolvidables!</h3>
                <h4>
                  Descubre destinos únicos con nuestro paquete vacacional.
                </h4>
              </v-col>
              <v-col class="mx-12 justify-right d-flex flex-column">
              <div class="text-white text-right">
                <span class="body-1" v-if="post.pricePrefix">{{ post.pricePrefix + ' ' }}</span>
                <span class="body-1 semi" v-if="post.currency">{{ post.currency }}</span>
                <span class="text-h3 semi" v-if="post.price">{{ post.price }}</span>
              </div>
                <v-btn color="primary" variant="flat" rounded="xl" class="mt-3" @click="viewRequestForm">
                  Consultar sobre esta promoción
                </v-btn>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
        <v-dialog width="850" v-model="requestFormDialog" :scrollable="false">
          <contact-form-card :subject="post.title" />
        </v-dialog>
        <v-row class="mt-4">
          <v-col>
            <v-tabs v-model="contentTabs" color="primary" align-tabs="start">
              <v-tab :value="1" v-if="post.itinerary">Itinerario</v-tab>
              <v-tab :value="2" v-if="post.flights">Vuelos</v-tab>
              <v-tab :value="3" v-if="post.hotels">Hoteles</v-tab>
              <v-tab :value="4" v-if="post.includes">Incluye/No incluye</v-tab>
            </v-tabs>
            <v-window v-model="contentTabs">
              <v-window-item :value="1" v-if="post.itinerary">
                <div v-html="post.itinerary" class="body-1 pa-6"></div>
              </v-window-item>
              <v-window-item :value="2" v-if="post.flights">
                <div v-html="post.flights" class="body-1 pa-6"></div>
              </v-window-item>
              <v-window-item :value="3" v-if="post.hotels">
                <div v-html="post.hotels" class="body-1 pa-6"></div>
              </v-window-item>
              <v-window-item :value="4" v-if="post.includes">
                <div v-html="post.includes" class="body-1 pa-6"></div>
              </v-window-item>
            </v-window>
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

const { toTop } = useScroll();


onMounted(() => {
  fetchPost()
  toTop()
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

const requestFormDialog = ref(false)

function viewRequestForm() {
  requestFormDialog.value = true
}

const contentTabs = ref(1)

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
  background-color:rgba(0,0,0,.3);
}
.overlay-img .v-row {
  position: absolute;
  width: 100%;
  z-index: 1;
}
</style>