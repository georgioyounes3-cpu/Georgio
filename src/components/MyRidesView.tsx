import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  Phone,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  Search,
  Check,
  X,
  Compass,
  Luggage,
  ShieldCheck
} from 'lucide-react';
import type { Ride, Student, RideRequest } from '../types/carpool.ts';
import { formatTime12h } from '../utils/carpoolLogic.ts';

interface MyRidesViewProps {
  rides: Ride[];
  currentStudent: Student;
  onSelectRide: (ride: Ride) => void;
  onFindRide: () => void;
  onOfferRide: () => void;
  onCancelRequest: (rideId: string, requestId: string) => void;
  onUpdateRequestStatus: (rideId: string, requestId: string, status: 'accepted' | 'declined') => void;
  onCancelRide: (rideId: string) => void;
}

export const MyRidesView: React.FC<MyRidesViewProps> = ({
  rides,
  currentStudent,
  onSelectRide,
  onFindRide,
  onOfferRide,
  onCancelRequest,
  onUpdateRequestStatus,
  onCancelRide,
}) => {
  const [activeTab, setActiveTab] = useState<'driving' | 'booked'>('booked');

  // Filter rides offered by this student
  const drivingRides = rides.filter(
    (r) => r.driverId === currentStudent.id && r.status !== 'cancelled'
  );

  // Filter rides booked or requested by this student
  const bookedRidesWithRequests = rides
    .map((ride) => {
      const myReq = ride.requests.find(
        (req) => req.passengerId === currentStudent.id && req.status !== 'cancelled'
      );
      if (!myReq) return null;
      return { ride, request: myReq };
    })
    .filter((item): item is { ride: Ride; request: RideRequest } => item !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#004D30] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            My Commute Rides
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your offered carpools, view passenger requests, and track your booked seats.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            onClick={onFindRide}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Rides</span>
          </button>
          <button
            onClick={onOfferRide}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#003822] text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Offer a Ride</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('booked')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'booked'
              ? 'border-[#004D30] text-[#004D30]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Seats I've Booked</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'booked'
                ? 'bg-emerald-100 text-[#004D30]'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {bookedRidesWithRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('driving')}
          className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'driving'
              ? 'border-[#004D30] text-[#004D30]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Rides I'm Driving</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'driving'
                ? 'bg-emerald-100 text-[#004D30]'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {drivingRides.length}
          </span>
        </button>
      </div>

      {/* Content Tab 1: Booked Rides */}
      {activeTab === 'booked' && (
        <div className="space-y-4">
          {bookedRidesWithRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookedRidesWithRequests.map(({ ride, request }) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Status Banner */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        request.status === 'accepted'
                          ? 'bg-emerald-100 text-[#004D30]'
                          : request.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {request.status === 'accepted' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Seat Confirmed</span>
                        </>
                      ) : (
                        <>
                          <Clock3 className="w-3.5 h-3.5" />
                          <span>Pending Driver Approval</span>
                        </>
                      )}
                    </span>

                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded border border-emerald-200">
                      Free Commute
                    </span>
                  </div>

                  {/* Route & Schedule */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {ride.originArea} → LAU {ride.destinationCampus} Campus
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ride.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{formatTime12h(ride.departureTime)}</span>
                      </span>
                      <span>•</span>
                      <span>{request.seatsRequested} {request.seatsRequested === 1 ? 'seat' : 'seats'}</span>
                    </div>
                  </div>

                  {/* Driver Card & Contact */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#004D30] text-amber-300 font-bold flex items-center justify-center text-xs">
                        {ride.driver.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {ride.driver.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ride.carColor} {ride.carModel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <a
                        href={`https://wa.me/${ride.driver.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        title="Message driver on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`tel:${ride.driver.phone}`}
                        className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Call driver"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {request.pickupNote && (
                    <div className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      <span className="font-semibold text-emerald-900">Your pickup note: </span>
                      <span>{request.pickupNote}</span>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectRide(ride)}
                      className="text-xs font-semibold text-[#004D30] hover:underline flex items-center space-x-1"
                    >
                      <span>View Full Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Cancel your seat reservation?')) {
                          onCancelRequest(ride.id, request.id);
                        }
                      }}
                      className="text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors"
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                No Booked Rides Yet
              </h3>
              <p className="text-xs text-slate-500">
                You haven't requested any seats on campus carpools yet. Search available rides heading to Beirut or Byblos.
              </p>
              <button
                onClick={onFindRide}
                className="px-5 py-2.5 rounded-xl bg-[#004D30] text-white text-xs font-bold hover:bg-[#003822] shadow-xs transition-colors"
              >
                Find a Ride
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content Tab 2: Driving Rides */}
      {activeTab === 'driving' && (
        <div className="space-y-4">
          {drivingRides.length > 0 ? (
            <div className="space-y-5">
              {drivingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
                >
                  {/* Ride Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          LAU {ride.destinationCampus} Campus
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ride.date}</span>
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-bold text-[#004D30] flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime12h(ride.departureTime)}</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {ride.originArea} → LAU {ride.destinationCampus}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Vehicle: {ride.carColor} {ride.carModel} • Free Student Ride
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-800 block">
                          {ride.availableSeats} of {ride.totalSeats} seats left
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {ride.requests.filter((r) => r.status === 'accepted').length} confirmed
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm('Cancel this entire ride offer?')) {
                            onCancelRide(ride.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                      >
                        Cancel Ride
                      </button>
                    </div>
                  </div>

                  {/* Passenger Requests Section */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Passenger Requests ({ride.requests.length})
                    </h4>

                    {ride.requests.length === 0 ? (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        No student passenger requests yet. Your ride is visible in the carpool directory!
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {ride.requests.map((req) => (
                          <div
                            key={req.id}
                            className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900">
                                  {req.passengerName}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  ({req.passengerMajor})
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    req.status === 'accepted'
                                      ? 'bg-emerald-100 text-[#004D30]'
                                      : req.status === 'declined'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {req.status.toUpperCase()}
                                </span>
                              </div>

                              <p className="text-slate-600">
                                Requesting <strong>{req.seatsRequested} seat{req.seatsRequested > 1 ? 's' : ''}</strong>
                                {req.pickupNote && (
                                  <span> • Pickup: <em>"{req.pickupNote}"</em></span>
                                )}
                              </p>
                            </div>

                            {/* Actions / Contact */}
                            <div className="flex items-center space-x-2 self-start sm:self-center">
                              {/* WhatsApp / Phone links */}
                              <a
                                href={`https://wa.me/${req.passengerPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                title="Message on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${req.passengerPhone}`}
                                className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                                title="Call passenger"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* Driver approve / decline controls */}
                              {req.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() =>
                                      onUpdateRequestStatus(ride.id, req.id, 'accepted')
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 flex items-center space-x-1"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      onUpdateRequestStatus(ride.id, req.id, 'declined')
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-rose-100 hover:text-rose-700 flex items-center space-x-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Decline</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                You Haven't Offered Any Rides
              </h3>
              <p className="text-xs text-slate-500">
                Are you driving to LAU Beirut or Byblos? Post your ride to help fellow students and split gas!
              </p>
              <button
                onClick={onOfferRide}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#003822] text-xs font-bold shadow-xs transition-colors"
              >
                Offer a Ride Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
