<template>
    <div class="mb-2">
        <v-form v-model=valid> <v-select v-model="rooms" bg-color="foreground" base-color="secondary_text"
                density="compact" :items="[...Array(10).keys()].map(x => x + 1)" variant="outlined" rounded="md">

            </v-select>
            <v-row dense align="center" v-for="(room, i) in occupancies">
                <v-col>
                    <v-row dense align="center">
                        <v-col cols="7">
                            <h4 class="semi my-0">{{ $capitalize($t("adults")) }}</h4>
                            <p class="body-2">{{ $capitalize($t("18_years_old")) }}</p>
                        </v-col>
                        <v-col cols="5" class="text-right d-flex justify-space-between">
                            <v-btn variant="tonal" color="secondary" rounded="sm" size="small" @click="subsAdult(i)"
                                :disabled="room.Adults == 1" class="mr-3"><v-icon size="18"
                                    icon="md:remove"></v-icon></v-btn>
                            <span>{{ room.Adults }}</span>
                            <v-btn variant="tonal" color="secondary" rounded="sm" size="small" @click="addAdult(i)"
                                class="ml-3"><v-icon size="18" icon="md:add"></v-icon></v-btn>
                        </v-col>
                    </v-row>
                    <v-row justify="start" dense>
                        <v-col :cols="room.Adults > 1 ? 6 : 12" v-if="room.Adults > 0" v-for="n in room.Adults">
                            <v-no-ssr>

                                <v-text-field rounded="sm" variant="outlined" v-model="room.AdultsAges[n - 1]"
                                    density="comfortable" type="number" :label="`${$capitalize($t('adult_age'))} ${n}`"
                                    hide-details single-line min=18 max=99 class="bg-foreground text-secondary_text "
                                    :rules="[() => room.AdultsAges[n - 1] > 17 && room.AdultsAges[n - 1] < 100]">

                                </v-text-field>

                            </v-no-ssr>
                        </v-col>
                    </v-row>
                    <v-row dense align="center">
                        <v-col cols="7" sm="7">
                            <h4 class="semi ">{{ $capitalize($t("children")) }}</h4>
                        </v-col>
                        <v-col cols="5" sm="5" class="text-right d-flex justify-space-between">
                            <v-btn variant="tonal" color="secondary" rounded="sm" size="small" @click="subsChild(i)"
                                :disabled="room.Children == 0" class="mr-3"><v-icon size="18"
                                    icon="md:remove"></v-icon></v-btn>
                            <span>{{ room.Children }}</span>
                            <v-btn variant="tonal" color="secondary" rounded="sm" size="small" @click="addChild(i)"
                                class="ml-3"><v-icon size="18" icon="md:add"></v-icon></v-btn>
                        </v-col>
                    </v-row>
                    <v-row justify="start" dense>
                        <v-col :cols="room.Children > 1 ? 6 : 12" v-if="room.Children > 0" v-for="n in room.Children">
                            <v-no-ssr>
                                <v-text-field rounded="sm" variant="outlined" v-model="room.ChildrenAges[n - 1]"
                                    density="comfortable" type="number" :label="`${$capitalize($t('adult_age'))} ${n}`"
                                    hide-details single-line min=1 max=17 class="bg-foreground text-secondary_text "
                                    :rules="[() => room.ChildrenAges[n - 1] > 0 && room.ChildrenAges[n - 1] < 18]">
                                </v-text-field>
                            </v-no-ssr>
                        </v-col>
                    </v-row>
                </v-col>
                <v-divider class="my-2" v-if="rooms > 1 && (i + 1) != rooms"></v-divider>
            </v-row></v-form>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['compact', 'themed', 'multiple', 'show-adult-ages', 'show-children-ages'])
const isMobile = useMobile();
const route = useRoute()
const rooms = ref(1)
const valid = defineModel('valid')
watch(rooms, () => {
    while (rooms.value > occupancies.value.length) {
        addRoom()
    }
    occupancies.value.splice(rooms.value)
})

const occupancies = ref([]);
const occupanciesCopy = ref([])
const paxDialog = ref(false);
const childrenAges = [...Array(18).keys()]
const adultAges = Array.from(new Array(82), (x, i) => i + 18)

function openPaxDialog() {
    paxDialog.value = true
    occupanciesCopy.value = useDeepCopy(occupancies.value)
}

function confirmPaxDialog() {
    paxDialog.value = false
    occupanciesCopy.value = []
    updateTotalPax()
}

function cancelPaxDialog() {
    paxDialog.value = false
    occupancies.value.splice(0, occupancies.value.length, ...useDeepCopy(occupanciesCopy.value));
    occupanciesCopy.value = []
    updateTotalPax();
}

function addRoom() {
    occupancies.value.push({
        Adults: 2,
        Children: 0,
        ChildrenAges: [],
        AdultsAges: [30, 30]
    });
}

function removeRoom(index) {
    occupancies.value.splice(index, 1);
}

function addAdult(i) {
    occupancies.value[i].Adults++;
    occupancies.value[i].AdultsAges = Array(occupancies.value[i].Adults).fill(30)
}

function subsAdult(i) {
    if (occupancies.value[i].Adults == 1) return;
    occupancies.value[i].Adults--;
    occupancies.value[i].AdultsAges = Array(occupancies.value[i].Adults).fill(30)
}

function addChild(i) {
    occupancies.value[i].Children++;
    occupancies.value[i].ChildrenAges.push('1');
}

function subsChild(i) {
    occupancies.value[i].Children--;
    occupancies.value[i].ChildrenAges.splice(-1, 1);
}

watch(occupancies.value, (newValue, oldValue) => {
    updateTotalPax();
},
    { deep: true });

const totalAdults = ref(0);
const totalChildren = ref(0);

function updateTotalPax() {
    let countA = 0;
    for (let i = 0; i < occupancies.value.length; i++) {
        countA += occupancies.value[i].Adults;
    }
    totalAdults.value = countA;
    let countC = 0;
    for (let i = 0; i < occupancies.value.length; i++) {
        countC += occupancies.value[i].Children;
    }
    totalChildren.value = countC;

    emit('update:rooms', occupancies)
}

function parseRoomsString() {
    const roomsArray = (route.query.occupancies as string).split('|').map(room => {
        const [adults, childrenAgesStr] = room.split(';');
        const [children, childrenAges] = childrenAgesStr ? childrenAgesStr.split('*') : ['', ''];

        return {
            Adults: parseInt(adults),
            Children: parseInt(children),
            ChildrenAges: childrenAges ? childrenAges.split(',') : [],
        };
    });

    return roomsArray;
}

onMounted(() => {
    if (route.query.occupancies) {
        occupancies.value = parseRoomsString();
    } else {
        occupancies.value.push({
            Adults: 2,
            AdultsAges: [30, 30],
            Children: 0,
            ChildrenAges: [],
            Infants: 0,
            Visible: true,
            SeniorAges: Array(Math.ceil((99 - 71))).fill(71).map((x, y) => x + y)
        })
    }
    updateTotalPax();
})
const emit = defineEmits(['update:rooms']);
</script>