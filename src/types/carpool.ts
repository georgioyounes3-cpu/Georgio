export type Campus = 'Beirut' | 'Byblos';

export interface DriverReview {
  id: string;
  driverId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerMajor?: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  campus: Campus;
  major: string;
  year: string;
  phone: string;
  email: string;
  whatsapp: string;
  avatarUrl?: string;
  verifiedStudent: boolean;
  carModel?: string;
  carColor?: string;
  rating?: number; // average e.g. 4.9
  reviewCount?: number;
  reviews?: DriverReview[];
  onTimeRate?: number; // percentage e.g. 98
  completedRidesCount?: number;
}

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface RideRequest {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  passengerCampus: Campus;
  passengerMajor: string;
  passengerPhone: string;
  passengerEmail: string;
  seatsRequested: number;
  pickupNote: string;
  status: RequestStatus;
  requestedAt: string;
}

export type LuggageSize = 'backpack_only' | 'small_bag' | 'large_luggage';

export interface RidePreferences {
  ac: boolean;
  quietRide: boolean;
  music: boolean;
  femaleOnly?: boolean;
}

export interface Ride {
  id: string;
  driverId: string;
  driver: Student;
  originArea: string;
  destinationCampus: Campus;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:MM (24h)
  estimatedDurationMins?: number;
  totalSeats: number;
  availableSeats: number;
  carModel: string;
  carColor: string;
  licensePlateSnippet?: string;
  stops: string[];
  luggageAllowance: LuggageSize;
  preferences: RidePreferences;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  requests: RideRequest[];
  createdAt: string;
}

export interface RideFilter {
  origin?: string;
  destinationCampus?: string; // 'all' or 'Beirut' or 'Byblos'
  date?: string;
  timeOfDay?: 'all' | 'morning' | 'midday' | 'afternoon';
  minSeats?: number;
  sortBy?: 'departureTime' | 'seats';
}
