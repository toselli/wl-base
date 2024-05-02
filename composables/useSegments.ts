import dayjs from "dayjs";
export default () => {
    const route = useRoute();
    const strSegments = route.query.segments  ? (route.query.segments as string)?.split('|')  : []
    const segments = []
    for (let segment of strSegments) {
        const parts = segment.split('!')
        if (!parts) continue;
        const departureDate = parts[0]
        const arrivalDate = parts[1]
        const originLocationCode = parts[2]
        const destinationLocationCode = parts[3]

        const partialSegment = {
            DepartureDate: dayjs(departureDate).toISOString(),
            OriginLocationCode: originLocationCode,
            DestinationLocationCode: destinationLocationCode
        }

        if (arrivalDate) {
            Object.assign(partialSegment, {
                ArrivalDate: dayjs(arrivalDate).toISOString()
            })
        }
        segments.push(partialSegment)

    }

    return segments;
}