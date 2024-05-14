export default (serviceType: any) => {    
   switch (serviceType) {
      case 1:
        return 'mdi-bed';
      case 3:
        return 'mdi-airplane';
      case 4:
        return 'mdi-ferry';
      case 5:
        return 'mdi-train';
      case 7:
        return 'mdi-car-key';
      case 8:
        return 'mdi-camera-marker';
      default:
        return 'mdi-map-marker';
      
    }
}