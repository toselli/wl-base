<template>
  <v-container fluid class="pa-0">
    <v-card class="footer bg-primary_text pa-6" rounded="xl" theme="ThemeLight">
      <v-container class="pb-0">
        <v-row justify="center" class="pb-0">
          <v-col cols="12" md="3" class="pb-0">
            <CommonLogoDark class="mb-8" :height="70" />
            

          </v-col>
          <v-col cols="12" md="6" class="pb-0">

                <h5 class="body-1  semi mb-4">
                  Contacto
                </h5>
                <h5 class="body-2">
              <v-btn variant="text" size="small" href="tel:+081088867355"> <v-icon icon="mdi-phone" class="mr-2"></v-icon>
                0810-88867355</v-btn>
            </h5>
            <h5 class="body-2">
              <v-btn variant="text" size="small" href="mailto:info@ebooking.com.ar"><v-icon icon="mdi-email"
                  class="mr-2"></v-icon>info@ebooking.com.ar</v-btn>
            </h5>


          </v-col>
          <v-col cols="12" md="3">
                <h5 class="body-1  semi mb-4">
                  Nuestras redes
                </h5>
                <h5 class="body-2">
                  <v-btn variant="text" size="small" href="https://www.facebook.com/ebookingArgentina" target="_blank">
                    <v-icon icon="mdi-facebook" class="mr-2"></v-icon> Visitanos en Facebook</v-btn>
                </h5>
                <h5 class="body-2">
                  <v-btn variant="text" size="small"
                    href="https://api.whatsapp.com/send?phone=+5493512233551&text=Quiero%20consultar%20sobre%20mi%20pr%C3%B3ximo%20viaje..."
                    target="_blank"> <v-icon icon="mdi-whatsapp" class="mr-2"></v-icon> Escribinos por WhatsApp</v-btn>
                </h5>
              </v-col>
        </v-row>
        <v-row dense justify="center" >
          <v-col cols="12" lg="4" class="text-center" >
            <v-img src="/img/footer_logos.png" width="400" class="mt-8 mx-auto"></v-img>
            <p class="body-2 mt-6 d-flex align-center justify-center">
              Developed by
              <TplusDLogo width="100" height="14" :dark="true" class="mx-3" />
            </p>
          </v-col>
          <!-- <v-col cols="12" lg="4">
            <a href="http://qr.afip.gob.ar/?qr=OcIegXo7eSHm909lu0vAHg,," target="_blank">
              <v-img src="https://afip.gob.ar/images/f960/DATAWEB.jpg" height="60px"></v-img>
            </a>
          </v-col> -->
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>

</script>
