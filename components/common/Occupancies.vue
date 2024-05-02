<template>
    <v-avatar color="secondary_text" size="x-small" class="mr-2" v-if="!compact">
        <v-icon icon="mdi-account" color="foreground" size="x-small"></v-icon> </v-avatar>
    <span class="body-1 semi" v-if="!compact">{{ $capitalize($t("travelers")) }}</span>
    <v-btn class="btn-search-pax" :class="compact ? '' : 'mt-2'" :variant="(compact && !isMobile) ? 'tonal' : themed"
        @click="openPaxDialog">
        <span v-if="serviceType == 'stays'">{{ occupancies.length }} Hab | </span>
        <v-icon class="mx-1">mdi-account</v-icon> {{
        totalAdults }}
       <span v-if="totalChildren > 0"> + <v-icon size="small" class="mx-1">mdi-baby-face-outline</v-icon> {{ totalChildren }}</span>
 
    </v-btn>
    <v-dialog v-model="paxDialog" width="450px" :scrim="false" :absolute="true" theme="ThemeLight">
        <v-card rounded="lg">
            <v-card-title>
                <span v-if="serviceType == 'stays'">{{ $capitalize($t("rooms")) }}</span>
                <span v-else>{{ $capitalize($t("travelers")) }}</span>
            </v-card-title>
            <v-card-text class="pa-3">
                <v-card class="pa-3 bg-midground mb-2" roundex="xl" variant="outlined" rounded="xl" flat
                    v-for="(room, i) in occupancies">
                    <v-row dense align="center">
                        <v-col cols="12" sm="2" v-if="occupancies.length > 1">
                            <v-btn variant="tonal" color="error" size="small" rounded="xl" class="mb-2"
                                @click="removeRoom(i)" icon="mdi-delete"></v-btn>
                        </v-col>
                        <v-col>
                            <v-row dense align="center">
                                <v-col>
                                    <h6 v-if="serviceType == 'stays'">{{ $capitalize($t("room")) }} {{ i + 1 }}</h6>
                                    <h4>{{ $capitalize($t("adults")) }}</h4>
                                    <p class="body-2">{{ $t("18_years_old") }}</p>
                                </v-col>
                                <v-col cols="7" sm="6" class="text-right">
                                    <v-btn variant="tonal" size="small" @click="subsAdult(i)"
                                        :disabled="room.Adults == 1" class="mr-3">-</v-btn>
                                    <span>{{ room.Adults }}</span>
                                    <v-btn variant="tonal" size="small" @click="addAdult(i)" class="ml-3">+</v-btn>
                                </v-col>
                            </v-row>
                            <v-row align="center">
                                <v-col>
                                    <h4>{{ $capitalize($t("children")) }}</h4>
                                </v-col>
                                <v-col cols="7" sm="6" class="text-right">
                                    <v-btn variant="tonal" size="small" @click="subsChild(i)"
                                        :disabled="room.Children == 0" class="mr-3">-</v-btn>
                                    <span>{{ room.Children }}</span>
                                    <v-btn variant="tonal" size="small" @click="addChild(i)" class="ml-3">+</v-btn>
                                </v-col>
                            </v-row>
                            <v-row justify="end">
                                <v-col cols="6" class="text-right px-4" v-if="room.Children > 0"
                                    v-for="n in room.Children">
                                    <v-no-ssr>
                                        <v-select :label="$capitalize($t('child_age'))" hide-details density="compact"
                                            variant="outlined" class="custom-text-field" :items="childrenAges"
                                            v-model="room.ChildrenAges[n - 1]"></v-select>
                                    </v-no-ssr>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
                <v-row dense class="mt-2" v-if="multiple">
                    <v-col cols="12" class="text-right">
                        <v-btn variant="tonal" rounded="xl" @click="addRoom">
                            {{ $capitalize($t("add_room")) }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row dense>
                    <v-col cols="5"><v-btn variant="flat" block rounded="xl"
                            @click="cancelPaxDialog">Cancelar</v-btn></v-col>
                    <v-col><v-btn color="secondary" block variant="flat" rounded="xl" @click="confirmPaxDialog">{{
        $capitalize($t("confirm")) }}</v-btn></v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps(['compact', 'themed', 'multiple', 'serviceType'])
const isMobile = useMobile();
const route = useRoute()

const occupancies = ref([]);
const occupanciesCopy = ref([])
const paxDialog = ref(false);
const childrenAges = [...Array(18).keys()]

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
    });
}

function removeRoom(index) {
    occupancies.value.splice(index, 1);
}

function addAdult(i) {
    occupancies.value[i].Adults++;
}

function subsAdult(i) {
    if (occupancies.value[i].Adults > 1) {
        occupancies.value[i].Adults--;
    }

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
            Children: 0,
            ChildrenAges: [],
        })
    }
    updateTotalPax();
})
const emit = defineEmits(['update:rooms']);
</script>