import { HubConnectionBuilder } from '@microsoft/signalr';
import { ref, computed } from 'vue';

let connectionInstance = null;


const useSignalR = (url: string, _handleDisconnect: any) => {

   const isConnected = ref(false);

   const startConnection = async () => {
      try {
         if (!connectionInstance) {
            connectionInstance = new HubConnectionBuilder()
               .withUrl(url)
               .withAutomaticReconnect()
               .build();
            connectionInstance.serverTimeoutInMilliseconds = 1000000;
            await connectionInstance.start();
            isConnected.value = true;
            connectionInstance.on('Disconnect', () => {
               handleDisconnect();
             });
         }
      } catch (error) {
         console.error('Error al conectar: ', error);
      }
   };

   const handleDisconnect = _handleDisconnect;

   const stopConnection = async () => {
      if (isConnected.value) {
         try {
            await connectionInstance.stop();
            // No es necesario connectionInstance.dispose() aquí
            isConnected.value = false;
         } catch (error) {
            console.error('Error al desconectar: ', error);
         }
      }
   };

   const invokeServerMethod = async (methodName, ...args) => {
      if (isConnected.value) {
         try {
            return await connectionInstance.invoke(methodName, ...args);
         } catch (error) {
            console.error(`Error al invocar el método ${methodName}: `, error);
         }
      }
   };

   const subscribeToEvent = async (eventName, callback) => {
      if (isConnected.value) {
         connectionInstance.on(eventName, callback);
      }
   };

   const unsubscribeFromEvent = async (eventName, callback) => {
      connectionInstance.off(eventName, callback);
   };

   const isConnectedComputed = computed(() => isConnected.value);

   return {
      isConnected: isConnectedComputed,
      startConnection,
      stopConnection,
      invokeServerMethod,
      subscribeToEvent,
      unsubscribeFromEvent,
   };
};

export default useSignalR;
