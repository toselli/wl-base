<template>
    <div class="mb-2">
        <v-form v-model="valid"> 
            <v-row dense align="center">
                <v-col>
                    <v-row dense align="center" class="mb-2" v-for="(item, i) in occupancies">
                        <v-col cols="7">
                            <h4 class="semi body-1 my-0">{{ item.Name }}</h4>
                            <p class="body-2 text-secondary_text">
                                <span v-if="item.MinBuy > 0">Mínimo: {{ item.MinBuy}}  -</span> 
                                <span v-if="item.MaxBuy">Máximo: {{ item.MaxBuy}}</span> 
                            </p>
                        </v-col>
                        <v-col cols="5" class="text-right d-flex justify-space-between">
                            <v-btn variant="tonal" color="secondary" rounded="sm" size="small" @click="subsPerson(i)"
                                :disabled="item.Quantity == 0" class="mr-3"><v-icon size="18"
                                    icon="md:remove"></v-icon></v-btn>
                            <span>{{ item.Quantity }}</span>
                            <v-btn variant="tonal" color="secondary" rounded="sm" size="small" @click="addPerson(i)"
                                class="ml-3"><v-icon size="18" icon="md:add"></v-icon></v-btn>
                        </v-col>
                    </v-row>
                    <h4 class="body-1 text-right semi" v-if="totalPersons > 0">Total: {{ totalPersons }}</h4>
                </v-col>
            </v-row>
            </v-form>
    </div>
</template>

<script setup>
const props = defineProps(['compact', 'themed', 'occupancies'])
const isMobile = useMobile();
const route = useRoute()
const valid = defineModel('valid')
const totalPersons = ref(null)

function addPerson(i) {
    props.occupancies[i].Quantity ++
}

function subsPerson(i) {
    props.occupancies[i].Quantity --
}
watch(props.occupancies, (newValue, oldValue) => {
    updateTotalPersons();
},
    { deep: true });


function updateTotalPersons() {
    let countA = 0;
    for (let i = 0; i < props.occupancies.length; i++) {
        countA += props.occupancies[i].Quantity;
    }
    totalPersons.value = countA;

    emit('update:occupancies', props.occupancies)
}


const emit = defineEmits(['update:occupancies']);
</script>