import type { Campus, DriverReview, Ride, RideFilter, RideRequest, Student } from '../types/carpool.ts';

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const min = minStr || '00';
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${min} ${ampm}`;
}

export function calculateArrivalTime(departureTime: string, durationMins: number = 45): string {
  const [h, m] = departureTime.split(':').map((v) => parseInt(v, 10));
  if (isNaN(h) || isNaN(m)) return '';
  const totalMins = h * 60 + m + durationMins;
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  const hPad = newH.toString().padStart(2, '0');
  const mPad = newM.toString().padStart(2, '0');
  return `${hPad}:${mPad}`;
}

export function filterRides(rides: Ride[], filter: RideFilter): Ride[] {
  return rides
    .filter((ride) => {
      // Must not be cancelled
      if (ride.status === 'cancelled') return false;

      // Destination Campus filter
      if (
        filter.destinationCampus &&
        filter.destinationCampus !== 'all' &&
        ride.destinationCampus.toLowerCase() !== filter.destinationCampus.toLowerCase()
      ) {
        return false;
      }

      // Origin filter (matches origin area or any stop)
      if (filter.origin && filter.origin.trim() !== '') {
        const query = filter.origin.toLowerCase().trim();
        const originMatch = ride.originArea.toLowerCase().includes(query);
        const stopsMatch = ride.stops.some((s) => s.toLowerCase().includes(query));
        if (!originMatch && !stopsMatch) return false;
      }

      // Date filter
      if (filter.date && filter.date.trim() !== '') {
        if (ride.date !== filter.date) return false;
      }

      // Min seats filter
      if (filter.minSeats && filter.minSeats > 0) {
        if (ride.availableSeats < filter.minSeats) return false;
      }

      // Time of day filter
      if (filter.timeOfDay && filter.timeOfDay !== 'all') {
        const hour = parseInt(ride.departureTime.split(':')[0], 10);
        if (filter.timeOfDay === 'morning' && (hour < 6 || hour >= 11)) return false;
        if (filter.timeOfDay === 'midday' && (hour < 11 || hour >= 15)) return false;
        if (filter.timeOfDay === 'afternoon' && hour < 15) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'seats') {
        return b.availableSeats - a.availableSeats;
      }
      // default: departureTime (chronological by date + time)
      const dateA = `${a.date}T${a.departureTime}`;
      const dateB = `${b.date}T${b.departureTime}`;
      return dateA.localeCompare(dateB);
    });
}

export function requestSeat(
  rides: Ride[],
  rideId: string,
  passenger: Student,
  seatsRequested: number = 1,
  pickupNote: string = '',
  autoConfirm: boolean = true
): {
  success: boolean;
  updatedRides: Ride[];
  error?: string;
  newRequest?: RideRequest;
} {
  const rideIndex = rides.findIndex((r) => r.id === rideId);
  if (rideIndex === -1) {
    return { success: false, updatedRides: rides, error: 'Ride not found' };
  }

  const ride = rides[rideIndex];

  if (ride.status !== 'active') {
    return { success: false, updatedRides: rides, error: 'This ride is no longer active' };
  }

  if (ride.driverId === passenger.id) {
    return { success: false, updatedRides: rides, error: 'You cannot request a seat on your own ride' };
  }

  if (ride.availableSeats < seatsRequested) {
    return {
      success: false,
      updatedRides: rides,
      error: `Only ${ride.availableSeats} seat${ride.availableSeats === 1 ? '' : 's'} available`,
    };
  }

  // Check if passenger already has an active request
  const existingActive = ride.requests.find(
    (req) => req.passengerId === passenger.id && (req.status === 'accepted' || req.status === 'pending')
  );
  if (existingActive) {
    return {
      success: false,
      updatedRides: rides,
      error: 'You already have an active reservation or request for this ride',
    };
  }

  const newStatus = autoConfirm ? 'accepted' : 'pending';
  const newRequest: RideRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    rideId: ride.id,
    passengerId: passenger.id,
    passengerName: passenger.name,
    passengerCampus: passenger.campus,
    passengerMajor: passenger.major,
    passengerPhone: passenger.phone,
    passengerEmail: passenger.email,
    seatsRequested,
    pickupNote: pickupNote.trim(),
    status: newStatus,
    requestedAt: new Date().toISOString(),
  };

  const updatedRide: Ride = {
    ...ride,
    availableSeats: autoConfirm ? ride.availableSeats - seatsRequested : ride.availableSeats,
    requests: [newRequest, ...ride.requests],
  };

  const updatedRides = [...rides];
  updatedRides[rideIndex] = updatedRide;

  return {
    success: true,
    updatedRides,
    newRequest,
  };
}

export function cancelRequest(
  rides: Ride[],
  rideId: string,
  requestId: string
): { success: boolean; updatedRides: Ride[]; error?: string } {
  const rideIndex = rides.findIndex((r) => r.id === rideId);
  if (rideIndex === -1) {
    return { success: false, updatedRides: rides, error: 'Ride not found' };
  }

  const ride = rides[rideIndex];
  const reqIndex = ride.requests.findIndex((req) => req.id === requestId);
  if (reqIndex === -1) {
    return { success: false, updatedRides: rides, error: 'Request not found' };
  }

  const targetReq = ride.requests[reqIndex];
  const seatsToRestore = targetReq.status === 'accepted' ? targetReq.seatsRequested : 0;

  const updatedRequests = ride.requests.map((req) =>
    req.id === requestId ? { ...req, status: 'cancelled' as const } : req
  );

  const updatedRide: Ride = {
    ...ride,
    availableSeats: Math.min(ride.totalSeats, ride.availableSeats + seatsToRestore),
    requests: updatedRequests,
  };

  const updatedRides = [...rides];
  updatedRides[rideIndex] = updatedRide;

  return { success: true, updatedRides };
}

export function updateRequestStatus(
  rides: Ride[],
  rideId: string,
  requestId: string,
  newStatus: 'accepted' | 'declined'
): { success: boolean; updatedRides: Ride[]; error?: string } {
  const rideIndex = rides.findIndex((r) => r.id === rideId);
  if (rideIndex === -1) {
    return { success: false, updatedRides: rides, error: 'Ride not found' };
  }

  const ride = rides[rideIndex];
  const targetReq = ride.requests.find((req) => req.id === requestId);
  if (!targetReq) {
    return { success: false, updatedRides: rides, error: 'Request not found' };
  }

  if (targetReq.status === newStatus) {
    return { success: true, updatedRides: rides };
  }

  let seatDelta = 0;
  if (newStatus === 'accepted' && targetReq.status !== 'accepted') {
    if (ride.availableSeats < targetReq.seatsRequested) {
      return { success: false, updatedRides: rides, error: 'Not enough seats available to accept this request' };
    }
    seatDelta = -targetReq.seatsRequested;
  } else if (newStatus === 'declined' && targetReq.status === 'accepted') {
    seatDelta = targetReq.seatsRequested;
  }

  const updatedRequests = ride.requests.map((req) =>
    req.id === requestId ? { ...req, status: newStatus } : req
  );

  const updatedRide: Ride = {
    ...ride,
    availableSeats: Math.max(0, Math.min(ride.totalSeats, ride.availableSeats + seatDelta)),
    requests: updatedRequests,
  };

  const updatedRides = [...rides];
  updatedRides[rideIndex] = updatedRide;

  return { success: true, updatedRides };
}

export function createRide(
  rides: Ride[],
  input: {
    driver: Student;
    originArea: string;
    destinationCampus: Campus;
    date: string;
    departureTime: string;
    estimatedDurationMins?: number;
    totalSeats: number;
    carModel: string;
    carColor: string;
    licensePlateSnippet?: string;
    stops?: string[];
    luggageAllowance?: 'backpack_only' | 'small_bag' | 'large_luggage';
    preferences?: {
      ac: boolean;
      quietRide: boolean;
      music: boolean;
      femaleOnly?: boolean;
    };
    notes?: string;
  }
): { success: boolean; updatedRides: Ride[]; ride?: Ride; error?: string } {
  if (!input.originArea || input.originArea.trim() === '') {
    return { success: false, updatedRides: rides, error: 'Please enter departure area' };
  }
  if (!input.destinationCampus) {
    return { success: false, updatedRides: rides, error: 'Please select destination campus' };
  }
  if (!input.date) {
    return { success: false, updatedRides: rides, error: 'Please select travel date' };
  }
  if (!input.departureTime) {
    return { success: false, updatedRides: rides, error: 'Please enter departure time' };
  }
  if (!input.totalSeats || input.totalSeats < 1) {
    return { success: false, updatedRides: rides, error: 'Available seats must be at least 1' };
  }

  const newRide: Ride = {
    id: `ride_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    driverId: input.driver.id,
    driver: input.driver,
    originArea: input.originArea.trim(),
    destinationCampus: input.destinationCampus,
    date: input.date,
    departureTime: input.departureTime,
    estimatedDurationMins: input.estimatedDurationMins || 45,
    totalSeats: input.totalSeats,
    availableSeats: input.totalSeats,
    carModel: input.carModel?.trim() || 'Student Car',
    carColor: input.carColor?.trim() || 'Silver',
    licensePlateSnippet: input.licensePlateSnippet?.trim() || undefined,
    stops: input.stops ? input.stops.filter((s) => s.trim().length > 0) : [],
    luggageAllowance: input.luggageAllowance || 'backpack_only',
    preferences: input.preferences || { ac: true, quietRide: false, music: true },
    notes: input.notes?.trim() || '',
    status: 'active',
    requests: [],
    createdAt: new Date().toISOString(),
  };

  return {
    success: true,
    updatedRides: [newRide, ...rides],
    ride: newRide,
  };
}

export function cancelRide(
  rides: Ride[],
  rideId: string,
  driverId: string
): { success: boolean; updatedRides: Ride[]; error?: string } {
  const rideIndex = rides.findIndex((r) => r.id === rideId);
  if (rideIndex === -1) {
    return { success: false, updatedRides: rides, error: 'Ride not found' };
  }

  const ride = rides[rideIndex];
  if (ride.driverId !== driverId) {
    return { success: false, updatedRides: rides, error: 'Only the driver can cancel this ride' };
  }

  const updatedRide: Ride = {
    ...ride,
    status: 'cancelled',
    requests: ride.requests.map((req) => ({ ...req, status: 'cancelled' as const })),
  };

  const updatedRides = [...rides];
  updatedRides[rideIndex] = updatedRide;

  return { success: true, updatedRides };
}

export function calculateDriverRatingBreakdown(reviews: DriverReview[] = []): {
  counts: Record<number, number>;
  percentages: Record<number, number>;
  average: number;
  total: number;
} {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (!reviews || reviews.length === 0) {
    return {
      counts,
      percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      average: 5.0,
      total: 0,
    };
  }

  let sum = 0;
  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating)));
    counts[star] = (counts[star] || 0) + 1;
    sum += r.rating;
  });

  const total = reviews.length;
  const percentages: Record<number, number> = {
    5: Math.round((counts[5] / total) * 100),
    4: Math.round((counts[4] / total) * 100),
    3: Math.round((counts[3] / total) * 100),
    2: Math.round((counts[2] / total) * 100),
    1: Math.round((counts[1] / total) * 100),
  };

  const average = Math.round((sum / total) * 10) / 10;
  return { counts, percentages, average, total };
}

export function addDriverReview(
  students: Student[],
  rides: Ride[],
  driverId: string,
  reviewInput: {
    reviewerId: string;
    reviewerName: string;
    reviewerMajor?: string;
    rating: number;
    comment: string;
    tags?: string[];
  }
): {
  success: boolean;
  updatedStudents: Student[];
  updatedRides: Ride[];
  newReview?: DriverReview;
  error?: string;
} {
  if (reviewInput.reviewerId === driverId) {
    return {
      success: false,
      updatedStudents: students,
      updatedRides: rides,
      error: 'You cannot rate yourself as a driver.',
    };
  }

  const rating = Math.max(1, Math.min(5, Math.round(reviewInput.rating)));
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return {
      success: false,
      updatedStudents: students,
      updatedRides: rides,
      error: 'Please select a star rating between 1 and 5.',
    };
  }

  const newReview: DriverReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    driverId,
    reviewerId: reviewInput.reviewerId,
    reviewerName: reviewInput.reviewerName,
    reviewerMajor: reviewInput.reviewerMajor,
    rating,
    comment: reviewInput.comment.trim(),
    tags: reviewInput.tags || [],
    createdAt: new Date().toISOString(),
  };

  let updatedDriver: Student | null = null;
  const updatedStudents = students.map((stu) => {
    if (stu.id === driverId) {
      const existingReviews = stu.reviews || [];
      const newReviews = [newReview, ...existingReviews];
      const sum = newReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAverage = Math.round((sum / newReviews.length) * 10) / 10;
      updatedDriver = {
        ...stu,
        rating: newAverage,
        reviewCount: newReviews.length,
        reviews: newReviews,
        completedRidesCount: (stu.completedRidesCount || 10) + 1,
      };
      return updatedDriver;
    }
    return stu;
  });

  const updatedRides = rides.map((ride) => {
    if (ride.driverId === driverId) {
      const existingReviews = ride.driver.reviews || [];
      const newReviews = [newReview, ...existingReviews];
      const sum = newReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAverage = Math.round((sum / newReviews.length) * 10) / 10;
      return {
        ...ride,
        driver: {
          ...ride.driver,
          rating: newAverage,
          reviewCount: newReviews.length,
          reviews: newReviews,
          completedRidesCount: (ride.driver.completedRidesCount || 10) + 1,
        },
      };
    }
    return ride;
  });

  return {
    success: true,
    updatedStudents,
    updatedRides,
    newReview,
  };
}
