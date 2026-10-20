import React from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Car,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  VolumeX,
  Music,
  Wind,
  Luggage,
  Star
} from 'lucide-react';
import type { Ride, Student } from '../types/carpool.ts';
import { formatTime12h } from '../utils/carpoolLogic.ts';

interface RideCardProps {
  ride: Ride;
  currentStudent: Student;
  onSelectRide: (ride: Ride) => void;
  onRequestSeatQuick?: (ride: Ride) => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  currentStudent,
  onSelectRide,
}) => {
  const isDriver = ride.driverId === currentStudent.id;
  const hasUserRequested = ride.requests.some(
    (req) => req.passengerId === currentStudent.id && req.status !== 'cancelled'
  );
  const userRequest = ride.requests.find((req) => req.passengerId === currentStudent.id);

  // Campus theme colors
  const isByblos = ride.destinationCampus === 'Byblos';
  const campusBadgeBg = isByblos
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : 'bg-blue-50 text-blue-800 border-blue-200';

  return (
    <article
      data-testid="ride-card"
      className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
    >
      {/* Card Header: Driver Info & Date */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 to-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Driver Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#004D30] text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm">
                {ride.driver.name.charAt(0)}
              </div>
              {ride.driver.verifiedStudent && (
                <span
                  title="Verified LAU Student"
                  className="absolute -bottom-1 -right-1 bg-white text-[#004D30] rounded-full p-0.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100" />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {ride.driver.name}
                </h3>
                {isDriver && (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    You
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">
                {ride.driver.major} • {ride.driver.campus} Campus
              </p>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>{(ride.driver.rating || 4.9).toFixed(1)}</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  ({ride.driver.reviewCount || ride.driver.reviews?.length || 14})
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  • {ride.driver.onTimeRate || 98}% on-time
                </span>
              </div>
            </div>
          </div>

          {/* Date & Departure Badge */}
          <div className="text-right flex-shrink-0">
            <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#004D30] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <Clock className="w-3.5 h-3.5 text-[#004D30]" />
              <span>{formatTime12h(ride.departureTime)}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-end space-x-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{ride.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Section */}
      <div className="p-4 sm:p-5 flex-1">
        <div className="flex items-start space-x-3">
          {/* Timeline visualization */}
          <div className="flex flex-col items-center pt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-100" />
            <div className="w-0.5 h-10 bg-slate-200 my-1 border-dashed" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
          </div>

          <div className="flex-1 space-y-3">
            {/* Origin */}
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Departure Area
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {ride.originArea}
              </p>
              {ride.stops && ride.stops.length > 0 && (
                <div className="text-[11px] text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-600">Pickups along route: </span>
                  {ride.stops.join(' • ')}
                </div>
              )}
            </div>

            {/* Destination Campus */}
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Destination
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${campusBadgeBg}`}>
                  LAU {ride.destinationCampus} Campus
                </span>
                {ride.estimatedDurationMins && (
                  <span className="text-[11px] text-slate-400">
                    ~{ride.estimatedDurationMins} mins
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Car & Amenities / Tags */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
          <div className="flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
            <Car className="w-3 h-3 text-slate-500" />
            <span>{ride.carColor} {ride.carModel}</span>
          </div>

          {ride.preferences.ac && (
            <span className="inline-flex items-center space-x-0.5 text-[11px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100" title="AC available">
              <Wind className="w-3 h-3" />
              <span>AC</span>
            </span>
          )}

          {ride.preferences.femaleOnly && (
            <span className="inline-flex items-center text-[11px] text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100 font-medium">
              Female Only
            </span>
          )}

          {ride.preferences.quietRide ? (
            <span className="inline-flex items-center space-x-0.5 text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded" title="Quiet study ride">
              <VolumeX className="w-3 h-3 text-slate-400" />
              <span>Quiet Ride</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-0.5 text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded" title="Music on">
              <Music className="w-3 h-3 text-slate-400" />
              <span>Music OK</span>
            </span>
          )}

          {ride.luggageAllowance === 'backpack_only' && (
            <span className="inline-flex items-center space-x-0.5 text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              <Luggage className="w-3 h-3 text-slate-400" />
              <span>Backpack</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Seats, Contribution & CTA Button */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          {/* Seats left indicator */}
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-slate-500" />
            <span
              className={`text-xs font-bold ${
                ride.availableSeats === 1
                  ? 'text-amber-600'
                  : ride.availableSeats === 0
                  ? 'text-rose-600'
                  : 'text-slate-800'
              }`}
            >
              {ride.availableSeats === 0
                ? 'Full'
                : `${ride.availableSeats} of ${ride.totalSeats} seats left`}
            </span>
          </div>

          {/* Free Ride Badge */}
          <div className="mt-1">
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
              Free Student Ride
            </span>
          </div>
        </div>

        {/* Action button */}
        <div>
          {hasUserRequested ? (
            <button
              onClick={() => onSelectRide(ride)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-100 text-[#004D30] border border-emerald-300 hover:bg-emerald-200 transition-colors flex items-center space-x-1"
            >
              <span>{userRequest?.status === 'accepted' ? 'Booked ✓' : 'Requested'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : isDriver ? (
            <button
              onClick={() => onSelectRide(ride)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors flex items-center space-x-1"
            >
              <span>Manage Ride</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : ride.availableSeats === 0 ? (
            <button
              onClick={() => onSelectRide(ride)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed"
            >
              Ride Full
            </button>
          ) : (
            <button
              onClick={() => onSelectRide(ride)}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#004D30] text-white hover:bg-[#003822] shadow-sm hover:shadow transition-all flex items-center space-x-1.5 group-hover:bg-[#003822]"
            >
              <span>View & Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
