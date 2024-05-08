<template>
  <v-container fluid class="pa-0">
    <v-card class="footer bg-primary_text pa-6" rounded="xl" theme="ThemeLight">
      <v-container class="pb-0">
        <v-row justify="center" class="pb-0">
          <v-col cols="12" md="3" class="pb-0">
            <CommonLogoDark class="mb-8" :height="50" />
            <h5 class="body-2">
              <v-btn variant="text" size="small" href="tel:+081088867355"> <v-icon icon="mdi-phone" class="mr-2"></v-icon>
                0810-88867355</v-btn>
            </h5>
            <h5 class="body-2">
              <v-btn variant="text" size="small" href="mailto:info@ebooking.com.ar"><v-icon icon="mdi-email"
                  class="mr-2"></v-icon>info@ebooking.com.ar</v-btn>
            </h5>

          </v-col>
          <v-col cols="12" md="9" class="pt-lg-12  pb-0">
            <v-row>
              <v-col cols="12" md="4">
                <!--<h5 class="body-1 semi mb-4">
                  Empresa
                </h5>
                <v-list density="compact" class="bg-transparent">
                   <v-list-item class="body-2" href="/posts/Novedades">
                    Novedades
                  </v-list-item> 
                </v-list>-->
              </v-col>
              <v-col cols="12" md="4">
                <!--<h5 class="body-1  semi mb-4">
                  Explorar
                </h5>
                 <v-list density="compact" class="bg-transparent">
                  <v-list-item class="body-2" href="/posts/Paquetes%20%2f%20Ofertas">
                    Paquetes vacacionales
                  </v-list-item>
                  <v-list-item class="body-2" href="/posts/Información%20sobre%20destinos">
                    Destinos recomendados
                  </v-list-item>
                </v-list> -->
              </v-col>
              <v-col cols="12" md="4">
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
          </v-col>
        </v-row>
        <v-row dense align="center">
          <v-col cols="12" lg="4">
            <p class="body-2 text-center mt-4">
              SANTA CATALINA VIAJES S.R.L. - Legajo Nro. 3148

            </p>
          </v-col>
          <v-col cols="12" lg="4">

            <p class="body-2 text-center mt-4 d-flex align-center justify-center">
              Developed by
              <TplusDLogo width="100" height="14" :dark="true" class="mx-3" />
            </p>
          </v-col>
          <v-col cols="12" lg="4">
            <a href="http://qr.afip.gob.ar/?qr=OcIegXo7eSHm909lu0vAHg,," target="_blank">
              <v-img src="https://afip.gob.ar/images/f960/DATAWEB.jpg" height="60px"></v-img>
            </a>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>

</script>
