export default (serviceType: any) => {    
   switch (serviceType) {
      case 1:
        return 'mdi-bed';
      case 3:
        return 'mdi-airplane';
      case 4:
        return 'mdi-ferry';
      default:
        return 'mdi-map-marker';
    }
}