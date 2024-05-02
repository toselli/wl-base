
export interface SetTransferDetailsRequest {
    flightDetailsIn?: FlightInfo;
    flightDetailsOut?: FlightInfo;
    pointDetailsIn?: TravelInfo;
    pointDetailsOut?: TravelInfo;
    pickupDetailsIn?: PickupInfo;
    pickupDetailsOut?: PickupInfo;
    transferOptionSelectedIn : number;
    transferOptionSelectedOut : number;
    basketId?: string;
}

export interface FlightInfo {
    airline: DataRef;
    flightNumber: string;
    flightDate: Date|string;
    departure: FlightInfoLeg;
    arrival: FlightInfoLeg;
}

export interface FlightInfoLeg {
    dateAndTime: Date | null;
    airport: DataRef;
}

export interface DataRef {
    Key: string;
    Value: string;
}

export interface PickupInfo {
    pickupLocation: DataRef;
    dropoffLocation: DataRef;
    reference: string;
    flightTime: Date | null;
}

export interface PointInfo {
    country: string;
    city: string;
    address: string;
    observation: string;
}

export interface TravelInfo {
    origin?: PointInfo;
    destination?: PointInfo;
    departure?: Date | null;
    arrival?: Date | null;
}