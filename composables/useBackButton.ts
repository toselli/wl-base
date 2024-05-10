
let route = null;
export default () => {
    const webStore = useWebStore();
    route = useRoute()
    const serviceType = route.query.serviceType || webStore.getServiceType.code
    switch (serviceType) {
        case 'stays': backToAvailStays(); break;
        case 'transfers': backToResultsTransfers(); break;
        case 'cars': backToResultsCars(); break;
        case 'flights': backToResultsFlights(); break;
        case 'circuits': backToAvailCircuits(); break;
        default: break;
    }
}

function backToAvailCircuits() {
    if (route.path.includes('details')) {
        navigateTo({
            path: "/circuits/results",
            query: {
                currency: route.query.currency,
                cities: route.query.cities,
                countries: route.query.countries
            }
        })
    }
    else
        navigateTo({
            path: "/circuits/details",
            query: {
                currency: route.query.currency,
                cities: route.query.cities,
                countries: route.query.countries
            }
        })
}

function backToAvailStays() {
    navigateTo({
        path: "/stays/details",
        query: {
            id: route.query.property,
            checkIn: route.query.checkIn,
            checkOut: route.query.checkOut,
            currency: 'USD',
            occupancies: route.query.occupancies,
            placeid: route.query.placeid,
            place: route.query.place
        }
    });
}

function backToResultsTransfers() {
    navigateTo({
        path: "/transfers/results",
        query: {
            arrivalDate: route.query.arrivalDate,
            arrivalTime: route.query.arrivalTime,
            arrivalPointDataId: route.query.arrivalPointDataId,
            arrivalPointType: route.query.arrivalPointType,
            arrivalPointName: route.query.arrivalPointName,
            destinationPointDataId: route.query.destinationPointDataId,
            destinationPointType: route.query.destinationPointType,
            destinationPointName: route.query.destinationPointName,
            occupancies: route.query.occupancies,
        }
    });
}

function backToResultsCars() {
    navigateTo({
        path: "/cars/results",
        query: {
            isOnAirport: 'true',
            pickUpDate: route.query.pickUpDate,
            pickUpTime: route.query.pickUpTime,
            returnTime: route.query.returnTime,
            returnDate: route.query.returnDate,
            nationality: route.query.nationality,
            residence: route.query.residence,
            currency: route.query.currency,
            pickUpOfficeId: route.query.pickUpOfficeId,
            pickUpCityId: route.query.pickUpCityId,
            pickUpCityName: route.query.pickUpCityName,
        }
    });
}

function backToResultsFlights() {
    navigateTo({
        path: "/flights/results",
        // flightType=2&segments=2024-02-18!2024-02-25!COR!LIM&nationality=AR&residence=AR&currency=USD&occupancies=2;0**&ndc=
        query: {
            flightType: route.query.flightType,
            segments: route.query.segments,
            ationality: route.query.nationality,
            residence: route.query.residence,
            currency: route.query.currency,
            occupancies: route.query.occupancies
        }
    })
}