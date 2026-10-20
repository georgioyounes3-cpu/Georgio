import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterRides,
  requestSeat,
  cancelRequest,
  updateRequestStatus,
  createRide,
  cancelRide,
  formatTime12h,
  calculateDriverRatingBreakdown,
  addDriverReview,
} from './carpoolLogic.ts';
import type { Ride, Student } from '../types/carpool.ts';

const mockDriver: Student = {
  id: 'stu_1',
  name: 'Jad El Khoury',
  campus: 'Byblos',
  major: 'Computer Science',
  year: 'Junior (3rd Year)',
  phone: '+961 70 123 456',
  email: 'jad.khoury@lau.edu',
  whatsapp: '+96170123456',
  verifiedStudent: true,
  carModel: 'Honda Civic',
  carColor: 'Dark Blue',
};

const mockPassenger1: Student = {
  id: 'stu_2',
  name: 'Maya Haddad',
  campus: 'Byblos',
  major: 'Architecture',
  year: 'Senior (4th Year)',
  phone: '+961 71 987 654',
  email: 'maya.haddad@lau.edu',
  whatsapp: '+96171987654',
  verifiedStudent: true,
};

const mockPassenger2: Student = {
  id: 'stu_3',
  name: 'Anthony Matar',
  campus: 'Beirut',
  major: 'Business',
  year: 'Sophomore (2nd Year)',
  phone: '+961 03 456 789',
  email: 'anthony.matar@lau.edu',
  whatsapp: '+96103456789',
  verifiedStudent: true,
};

const sampleRides: Ride[] = [
  {
    id: 'ride_101',
    driverId: 'stu_1',
    driver: mockDriver,
    originArea: 'Jounieh (Kaslik)',
    destinationCampus: 'Byblos',
    date: '2026-10-20',
    departureTime: '08:00',
    totalSeats: 3,
    availableSeats: 3,
    carModel: 'Honda Civic',
    carColor: 'Dark Blue',
    stops: ['Sarba', 'Maameltein', 'Tabarja'],
    luggageAllowance: 'backpack_only',
    preferences: { ac: true, quietRide: false, music: true },
    status: 'active',
    requests: [],
    createdAt: '2026-10-17T08:00:00Z',
  },
  {
    id: 'ride_102',
    driverId: 'stu_4',
    driver: {
      id: 'stu_4',
      name: 'Lea Frem',
      campus: 'Beirut',
      major: 'Civil Engineering',
      year: 'Senior',
      phone: '+961 76 555 123',
      email: 'lea.frem@lau.edu',
      whatsapp: '+96176555123',
      verifiedStudent: true,
    },
    originArea: 'Antelias (Highway)',
    destinationCampus: 'Beirut',
    date: '2026-10-20',
    departureTime: '07:30',
    totalSeats: 2,
    availableSeats: 1,
    carModel: 'Kia Picanto',
    carColor: 'White',
    stops: ['Dbayeh', 'Jal El Dib'],
    luggageAllowance: 'small_bag',
    preferences: { ac: true, quietRide: true, music: false, femaleOnly: true },
    status: 'active',
    requests: [],
    createdAt: '2026-10-17T09:00:00Z',
  },
  {
    id: 'ride_103',
    driverId: 'stu_5',
    driver: {
      id: 'stu_5',
      name: 'Rami Zein',
      campus: 'Byblos',
      major: 'Mechanical Engineering',
      year: 'Junior',
      phone: '+961 70 888 999',
      email: 'rami.zein@lau.edu',
      whatsapp: '+96170888999',
      verifiedStudent: true,
    },
    originArea: 'Tripoli (Mina)',
    destinationCampus: 'Byblos',
    date: '2026-10-21',
    departureTime: '13:00',
    totalSeats: 4,
    availableSeats: 4,
    carModel: 'Renault Duster',
    carColor: 'Silver',
    stops: ['Qalamoun', 'Chekka', 'Batroun'],
    luggageAllowance: 'large_luggage',
    preferences: { ac: true, quietRide: false, music: true },
    status: 'active',
    requests: [],
    createdAt: '2026-10-17T10:00:00Z',
  },
];

test('format helpers format 12-hour time cleanly', () => {
  assert.equal(formatTime12h('08:00'), '8:00 AM');
  assert.equal(formatTime12h('13:30'), '1:30 PM');
  assert.equal(formatTime12h('00:15'), '12:15 AM');
});

test('filterRides correctly filters by campus, origin, date and time of day', () => {
  // Filter by Byblos campus
  const byblosOnly = filterRides(sampleRides, { destinationCampus: 'Byblos' });
  assert.equal(byblosOnly.length, 2);

  // Filter by Beirut campus
  const beirutOnly = filterRides(sampleRides, { destinationCampus: 'Beirut' });
  assert.equal(beirutOnly.length, 1);
  assert.equal(beirutOnly[0].id, 'ride_102');

  // Filter by origin area (Kaslik in Jounieh)
  const kaslikSearch = filterRides(sampleRides, { origin: 'Kaslik' });
  assert.equal(kaslikSearch.length, 1);
  assert.equal(kaslikSearch[0].id, 'ride_101');

  // Filter by intermediate stop (Batroun on Tripoli route)
  const batrounSearch = filterRides(sampleRides, { origin: 'Batroun' });
  assert.equal(batrounSearch.length, 1);
  assert.equal(batrounSearch[0].id, 'ride_103');

  // Filter by morning time (06:00 to 11:00)
  const morningRides = filterRides(sampleRides, { timeOfDay: 'morning' });
  assert.equal(morningRides.length, 2);

  // Filter by midday time (11:00 to 15:00)
  const middayRides = filterRides(sampleRides, { timeOfDay: 'midday' });
  assert.equal(middayRides.length, 1);
  assert.equal(middayRides[0].id, 'ride_103');
});

test('requestSeat reserves seats, updates availability, and prevents self-booking or duplicate booking', () => {
  // Prevent driver booking their own ride
  const selfBook = requestSeat(sampleRides, 'ride_101', mockDriver, 1, 'Near Kaslik');
  assert.equal(selfBook.success, false);
  assert.match(selfBook.error || '', /cannot request a seat on your own ride/i);

  // Valid passenger booking 2 seats
  const validBook = requestSeat(sampleRides, 'ride_101', mockPassenger1, 2, 'Pick me up near ATCL');
  assert.equal(validBook.success, true);
  assert.ok(validBook.newRequest);
  assert.equal(validBook.newRequest.seatsRequested, 2);
  assert.equal(validBook.newRequest.status, 'accepted');

  const updatedRide = validBook.updatedRides.find((r) => r.id === 'ride_101')!;
  assert.equal(updatedRide.availableSeats, 1); // was 3, 2 requested = 1 remaining

  // Prevent duplicate booking by the same student on the same ride
  const duplicateBook = requestSeat(validBook.updatedRides, 'ride_101', mockPassenger1, 1);
  assert.equal(duplicateBook.success, false);
  assert.match(duplicateBook.error || '', /already have an active reservation/i);

  // Reject booking when requested seats exceed remaining seats
  const overBook = requestSeat(validBook.updatedRides, 'ride_101', mockPassenger2, 2);
  assert.equal(overBook.success, false);
  assert.match(overBook.error || '', /Only 1 seat available/i);
});

test('cancelRequest restores seats properly', () => {
  const initialBook = requestSeat(sampleRides, 'ride_101', mockPassenger1, 1, 'Near Sarba');
  assert.equal(initialBook.success, true);
  const reqId = initialBook.newRequest!.id;

  const afterCancel = cancelRequest(initialBook.updatedRides, 'ride_101', reqId);
  assert.equal(afterCancel.success, true);
  const ride = afterCancel.updatedRides.find((r) => r.id === 'ride_101')!;
  assert.equal(ride.availableSeats, 3); // back to 3
  const req = ride.requests.find((r) => r.id === reqId)!;
  assert.equal(req.status, 'cancelled');
});

test('createRide adds a new validated ride to the list', () => {
  const res = createRide(sampleRides, {
    driver: mockDriver,
    originArea: 'Mansourieh (Old Road)',
    destinationCampus: 'Beirut',
    date: '2026-10-22',
    departureTime: '08:30',
    totalSeats: 3,
    carModel: 'Honda Civic',
    carColor: 'Dark Blue',
    stops: ['Hazmieh', 'Museum'],
    notes: 'Leaving on time for 9 AM class',
  });

  assert.equal(res.success, true);
  assert.ok(res.ride);
  assert.equal(res.updatedRides.length, sampleRides.length + 1);
  assert.equal(res.ride.availableSeats, 3);
  assert.equal(res.ride.originArea, 'Mansourieh (Old Road)');
  assert.equal(res.ride.destinationCampus, 'Beirut');
});

test('calculateDriverRatingBreakdown accurately computes star counts, percentages, and average', () => {
  const reviews = [
    { id: 'r1', driverId: 'd1', reviewerId: 'p1', reviewerName: 'Maya', rating: 5, comment: 'Great', createdAt: '' },
    { id: 'r2', driverId: 'd1', reviewerId: 'p2', reviewerName: 'Jad', rating: 5, comment: 'Punctual', createdAt: '' },
    { id: 'r3', driverId: 'd1', reviewerId: 'p3', reviewerName: 'Lea', rating: 4, comment: 'Good', createdAt: '' },
  ];

  const breakdown = calculateDriverRatingBreakdown(reviews);
  assert.equal(breakdown.total, 3);
  assert.equal(breakdown.counts[5], 2);
  assert.equal(breakdown.counts[4], 1);
  assert.equal(breakdown.counts[3], 0);
  assert.equal(breakdown.average, 4.7);
  assert.equal(breakdown.percentages[5], 67);
  assert.equal(breakdown.percentages[4], 33);
});

test('addDriverReview prevents self-review and records passenger review with updated average', () => {
  const driverStu: Student = { ...mockDriver, id: 'driver_test', reviews: [] };
  const passengerStu: Student = { ...mockPassenger1, id: 'pass_test' };
  const rideTest: Ride = { ...sampleRides[0], driverId: 'driver_test', driver: driverStu };

  // Attempting to self-rate
  const selfRes = addDriverReview([driverStu], [rideTest], 'driver_test', {
    reviewerId: 'driver_test',
    reviewerName: 'Driver',
    rating: 5,
    comment: 'I am awesome',
  });
  assert.equal(selfRes.success, false);
  assert.match(selfRes.error || '', /cannot rate yourself/i);

  // Valid passenger review
  const validRes = addDriverReview([driverStu], [rideTest], 'driver_test', {
    reviewerId: 'pass_test',
    reviewerName: 'Maya Haddad',
    reviewerMajor: 'Architecture',
    rating: 5,
    comment: 'Always right on time at Antelias!',
    tags: ['Always on Time', 'Safe Driver'],
  });

  assert.equal(validRes.success, true);
  assert.ok(validRes.newReview);
  assert.equal(validRes.newReview.rating, 5);
  assert.equal(validRes.newReview.comment, 'Always right on time at Antelias!');

  const updatedDriver = validRes.updatedStudents.find((s) => s.id === 'driver_test')!;
  assert.equal(updatedDriver.rating, 5.0);
  assert.equal(updatedDriver.reviewCount, 1);
  assert.equal(updatedDriver.reviews?.length, 1);

  const updatedRide = validRes.updatedRides.find((r) => r.driverId === 'driver_test')!;
  assert.equal(updatedRide.driver.rating, 5.0);
  assert.equal(updatedRide.driver.reviewCount, 1);
});

