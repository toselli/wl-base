<template>
    <div :class="vertical ? 'divider-icon divider-icon-vertical' : 'divider-icon'">
        <div class="divider-icon-line"></div>
        <v-btn icon size="x-small" variant="outlined" class="divider-icon-icon" v-if="button"><v-icon small>{{ icon }}</v-icon></v-btn>
        <v-icon size="small" v-else class="py-1 ml-n1">{{ icon }}</v-icon>
        <div class="divider-icon-line"></div>
    </div>
</template>
    
<script>
export default {
    name: 'divider-icon',
    props: {
        icon: {
            type: String,
            required: true,
            default: null
        },
        vertical: {
            type: Boolean,
            required: false,
            default: false
        },
        button: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
</script>
    
<style scoped>
.divider-icon {
    display: flex;
    position: relative;
}

.divider-icon-vertical {
    flex-direction: column;
}

.divider-icon-line {
    width: 100%;
    position: relative;
    height: 100%;
    border-bottom: 1px solid;
    border-color: rgba(0, 0, 0, 0.12);
}

.divider-icon-vertical .divider-icon-line {
    border-left: 1px solid;
    border-bottom: none;
    border-color: rgba(0, 0, 0, 0.12) !important;
}

.theme--dark .divider-icon-line {
    border-color: rgba(255, 255, 255, 0.12)
}

.divider-icon-icon {
    position: relative;
    height: auto !important;
    padding: 4px;
    margin: -3px 0 0 0;
}

.divider-icon-vertical .divider-icon-icon {
    border-width: 1px;
    border-style: solid;
    margin: 0 0 0 -10px;
    border-color: rgba(0, 0, 0, 0.12);
}

.theme--dark .divider-icon-icon {
    border-color: rgba(0, 0, 0, 0.12);
}
</style>
    