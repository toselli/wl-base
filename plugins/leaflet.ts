import { LMap, LTileLayer, LMarker, LPopup, LTooltip, LControlZoom} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('LMap', LMap);
    nuxtApp.vueApp.component('LControlZoom', LControlZoom);
    nuxtApp.vueApp.component('LTileLayer', LTileLayer);
    nuxtApp.vueApp.component('LPopup', LPopup);
    nuxtApp.vueApp.component('LMarker', LMarker);
    nuxtApp.vueApp.component('LTooltip', LTooltip);
    return {
        provide: { LMap, LTileLayer, LMarker, LPopup, LTooltip, LControlZoom},
      };
      
});