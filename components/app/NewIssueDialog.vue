<template>
  <v-dialog v-model="show" width="850px">
    <v-card flat class="background pt-2 rounded-md px-4 py-5">
      <h3>Reportar error o sugerencia       
      <v-btn icon="mdi-window-close" variant="flat" class="float-right" @click="show = false">
      </v-btn>
      </h3>

      <v-form v-model="validIssue" v-on:submit.prevent="saveIssue">
        <v-card-text class="pa-0">
          <v-container>
            <v-row dense>
              <v-col>
                <v-select density="compact" :items="categories" variant="outlined" class="body-1" background-color="foreground"
                  v-model="issue.category" label="Tipo de error" color="secondary"></v-select>
              </v-col>
              <v-col>
                <v-text-field density="compact" variant="outlined" class="body-2" background-color="foreground"
                  v-model="issue.link" label="Link al error" hint="Copia y pega el link de la página" color="secondary"></v-text-field>

              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-textarea density="compact" variant="outlined" class="body-2" background-color="foreground" required
                  v-model="issue.description" label="Describa el error"
                  hint="Detalles respecto al comportamiento del error, asi como el comportamiento esperado">
                </v-textarea>
              </v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col class="text-center">
                <v-file-input v-model="file" density="compact" hint="Seleccione un archivo" class="body-2" 
                  color="secondary" background-color="foreground" label="Adjunte captura de pantalla si es necesario" variant="outlined" prepend-icon="mdi-paperclip"
                  @change="onFilePicked" :disabled="processing">
                </v-file-input>
                <v-row dense>
                  <v-col cols="3" v-for="image in issue.screens" :key="image">

                    <v-img contain :src="image" width="">
                      <v-btn size="sm" class="white text-red float-right" icon="mdi-delete"
                      @click="removeImage(image)"></v-btn>
                      </v-img>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-center background">
          <v-btn color="primary" type="submit" :disabled="processing" variant="flat"
            class="rounded-md px-8">Enviar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-dialog v-model="thankYouDialog" width="400px" persistent>
    <v-card>
      <v-card-title class="headline">¡Gracias por tu feedback!</v-card-title>
      <v-card-text>Tu reporte ha sido enviado exitosamente. ¡Agradecemos tu colaboración!</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="thankYouDialog = false; show = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-dialog>
</template>


<script setup>
// Importa las funciones necesarias
import { useFirebaseStorage, useStorageFile } from 'vuefire';
import { ref as storageRef } from 'firebase/storage';

// Define tus datos reactivos
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
});
const show = ref(false);
const thankYouDialog = ref(false);

watchEffect(() => {
  show.value = props.modelValue;
});

watch(show, (newValue, oldValue) => {
  if (newValue === false && oldValue === true) {
    emit('close');
  }
});

const validIssue = ref(false);
const processing = ref(false);

const categories = ref([
  'Visual',
  'Funcionalidad',
  'Reservas',
  'Otro',
]);

const file = ref(null)
const issue = ref({
  category: '',
  link: '',
  description: '',
  screens: [],
});

const store = useIssuesStore();

// Función para guardar el problema
const saveIssue = async (e) => {
  e.preventDefault();
  const dateTime = new Date();
  let payload = {
    category: issue.value.category,
    link: issue.value.link,
    description: issue.value.description,
    screens: issue.value.screens,
    date: dateTime.toISOString(),
    status: 'pending',
    user: {
      name: props.user.FirstName + ' ' + props.user.LastName,
      id: props.user.Id
    },
  }
  await store.createIssue(payload)
  issue.value = {
    category: '',
    link: '',
    description: '',
    screens: [],
  };
  file.value = null;
  thankYouDialog.value = true;
};

// Función para manejar la selección de archivos
const onFilePicked = async () => {
  if (file.value) {
    uploadPicture(file.value);
  }
};

// Función para subir la imagen
const uploadPicture = async (file)  => {
  processing.value = true
  if (file) {
    await upload(file);
    issue.value.screens.push(url.value);
    processing.value = false
  }
};

// Función para eliminar una imagen seleccionada
const removeImage = (image) => {
  const indexOf = issue.value.screens.indexOf(image);
  if (indexOf > -1) {
    issue.value.screens.splice(indexOf, 1);
  }
};


// Utiliza 'useStorageFile' para subir archivos
const storage = useFirebaseStorage();
const storageBucket = () => storageRef(storage, 'issues/' + (props.user.value?.id || ''));
const storageSource = () => file.value ? storageRef(storageBucket(), file.value.name) : null;

const {
  upload,
  uploadProgress: progress,
  uploadError: error,
  url,
  snapshot,
  uploadTask,
  metadata,
} = useStorageFile(storageSource);


const emit = defineEmits(['update:modelValue']);

</script>