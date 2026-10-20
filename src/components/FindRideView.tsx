import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  PlusCircle,
  Users,
  Compass,
  ArrowUpDown,
  Car
} from 'lucide-react';
import type { Campus, Ride, RideFilter, Student } from '../types/carpool.ts';
import { filterRides } from '../utils/carpoolLogic.ts';
import { RideCard } from './RideCard.tsx';
import { POPULAR_ORIGIN_AREAS } from '../data/mockData.ts';

interface FindRideViewProps {
  rides: Ride[];
  currentStudent: Student;
  onSelectRide: (ride: Ride) => void;
  onOfferRide: () => void;
  initialCampus?: Campus;
}

export const FindRideView: React.FC<FindRideViewProps> = ({
  rides,
  currentStudent,
  onSelectRide,
  onOfferRide,
  initialCampus,
}) => {
  const [filter, setFilter] = useState<RideFilter>({
    origin: '',
    destinationCampus: initialCampus || 'all',
    date: '',
    timeOfDay: 'all',
    minSeats: 1,
    sortBy: 'departureTime',
  });

  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);

  // Filtered rides
  const filteredRides = useMemo(() => {
    return filterRides(rides, filter);
  }, [rides, filter]);

  const handleResetFilters = () => {
    setFilter({
      origin: '',
      destinationCampus: 'all',
      date: '',
      timeOfDay: 'all',
      minSeats: 1,
      sortBy: 'departureTime',
    });
  };

  const hasActiveFilters =
    filter.origin !== '' ||
    filter.destinationCampus !== 'all' ||
    filter.date !== '' ||
    filter.timeOfDay !== 'all' ||
    filter.minSeats! > 1 ||
    filter.sortBy !== 'departureTime';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#004D30] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Search & Reserve</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Find an LAU Student Ride
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse available carpools shared by verified LAU drivers heading to Beirut and Byblos campuses.
          </p>
        </div>

        <button
          onClick={onOfferRide}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#003822] font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center space-x-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Offer a Ride Instead</span>
        </button>
      </div>

      {/* Main Search & Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        {/* Row 1: Primary Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Departure Origin Input */}
          <div className="md:col-span-5 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Departure Area / Neighborhood
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-emerald-700 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Jounieh, Antelias, Tripoli, Kaslik, Metn..."
                value={filter.origin || ''}
                onChange={(e) => setFilter((prev) => ({ ...prev, origin: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Destination Campus Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Destination Campus
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, destinationCampus: 'all' }))}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  filter.destinationCampus === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, destinationCampus: 'Byblos' }))}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  filter.destinationCampus === 'Byblos'
                    ? 'bg-[#004D30] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Byblos
              </button>
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, destinationCampus: 'Beirut' }))}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  filter.destinationCampus === 'Beirut'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Beirut
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={filter.date || ''}
                onChange={(e) => setFilter((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Quick Origin Area Chips */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
              Popular Routes:
            </span>
            {POPULAR_ORIGIN_AREAS.slice(0, 6).map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => {
                  const cleanName = area.split(' ')[0];
                  setFilter((prev) => ({ ...prev, origin: cleanName }));
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-xs transition-colors border ${
                  filter.origin && area.toLowerCase().includes(filter.origin.toLowerCase())
                    ? 'bg-emerald-100 text-[#004D30] border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Controls: Time of Day & Sort */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Time of Day Pills */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Time:
            </span>
            {[
              { id: 'all', label: 'Any Time' },
              { id: 'morning', label: 'Morning (6-11 AM)' },
              { id: 'midday', label: 'Midday (11 AM-3 PM)' },
              { id: 'afternoon', label: 'Afternoon (3 PM+)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    timeOfDay: t.id as RideFilter['timeOfDay'],
                  }))
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter.timeOfDay === t.id
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Sort & Reset Actions */}
          <div className="flex items-center space-x-2 ml-auto">
            <div className="flex items-center space-x-1 text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                aria-label="Sort rides by"
                value={filter.sortBy || 'departureTime'}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    sortBy: e.target.value as RideFilter['sortBy'],
                  }))
                }
                className="bg-transparent text-xs font-semibold text-slate-700 py-1 focus:outline-none cursor-pointer"
              >
                <option value="departureTime">Sort: Earliest First</option>
                <option value="seats">Sort: Most Seats Open</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center space-x-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div>
          Showing <strong>{filteredRides.length}</strong> available{' '}
          {filteredRides.length === 1 ? 'ride' : 'rides'}
          {filter.destinationCampus !== 'all' && (
            <span> for <strong>LAU {filter.destinationCampus} Campus</strong></span>
          )}
          {filter.origin && (
            <span> from <strong>"{filter.origin}"</strong></span>
          )}
        </div>
      </div>

      {/* Rides Grid or Empty State */}
      {filteredRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              currentStudent={currentStudent}
              onSelectRide={onSelectRide}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            No Carpool Rides Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            There are currently no active rides matching your search criteria. Try broadening your departure area, clearing filters, or offer your own ride!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Search Filters</span>
            </button>
            <button
              onClick={onOfferRide}
              className="px-5 py-2 rounded-xl bg-[#004D30] hover:bg-[#003822] text-white font-bold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Offer a Ride on this Route</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
