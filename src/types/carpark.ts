export type VehicleType = 'car' | 'motorcycle' | 'heavyVehicle';

export type CarparkOperator = 'HDB' | 'URA' | 'Commercial' | 'Hospital' | 'LTA';

export type SingaporeRegion = 'Central' | 'East' | 'West' | 'North' | 'North-East';

export type CarparkType = 'Multi-Storey MSCP' | 'Basement' | 'Surface' | 'Mechanized';

export interface CarparkRates {
  weekdayDay: string;
  weekdayNight: string;
  weekendSat: string;
  weekendSunPH: string;
  gracePeriodMins: number;
  freeParking?: string;
  hourlyEstimate: number; // in SGD for sorting
}

export interface CarparkFeatures {
  hasEVCharging: boolean;
  hasCashcardTopup: boolean;
  heightClearanceM: number;
  isGantryElectronic: boolean;
  nightParking: boolean;
  isSheltered: boolean;
  wheelchairAccessible: boolean;
}

export interface HourlyTrend {
  hour: string; // "08:00", "12:00", etc.
  occupancyPercent: number;
}

export interface Carpark {
  id: string;
  code: string; // e.g. "ACB", "HE12", "ION", "MBS"
  name: string;
  address: string;
  postalCode?: string;
  area: string; // e.g. "Orchard", "Marina Bay", "Jurong Gateway", "Tampines Central"
  region: SingaporeRegion;
  lat: number;
  lng: number;
  operator: CarparkOperator;
  carparkType: CarparkType;
  totalLots: {
    car: number;
    motorcycle?: number;
    heavyVehicle?: number;
  };
  availableLots: {
    car: number;
    motorcycle?: number;
    heavyVehicle?: number;
  };
  rates: CarparkRates;
  features: CarparkFeatures;
  lastUpdated: string;
  hourlyTrends: HourlyTrend[];
  isRealtimeSynced: boolean;
  distanceKm?: number;
}

export interface CarparkFilterState {
  searchQuery: string;
  region: string;
  area: string;
  operator: string;
  vehicleType: VehicleType | 'all' | 'ev';
  minLots: number;
  sortBy: 'availability' | 'lots' | 'rate' | 'name' | 'distance';
  onlyWithFreeParking: boolean;
  onlyEV: boolean;
  viewMode: 'split' | 'map' | 'list';
}

export interface DestinationHub {
  name: string;
  area: string;
  lat: number;
  lng: number;
  description: string;
}
