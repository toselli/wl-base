export default (type: any) => {
    switch (type) {
        case 'stays':
            return useStaysStore();
        case 'transfers':
            return useTransfersStore();
        case 'cars':
            return useCarsStore();
        case 'flights':
            return useFlightsStore();
        case 'assistances':
            return useAssStore();
        case 'circuits':
            return useCircuitsStore();
    }
}