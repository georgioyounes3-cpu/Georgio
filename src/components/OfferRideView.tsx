import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Luggage,
  Wind,
  VolumeX,
  Music
} from 'lucide-react';
import type { Campus, Ride, Student } from '../types/carpool.ts';
import { POPULAR_ORIGIN_AREAS } from '../data/mockData.ts';
import { formatTime12h } from '../utils/carpoolLogic.ts';

interface OfferRideViewProps {
  currentStudent: Student;
  onSubmitRide: (rideData: {
    originArea: string;
    destinationCampus: Campus;
    date: string;
    departureTime: string;
    estimatedDurationMins: number;
    totalSeats: number;
    carModel: string;
    carColor: string;
    licensePlateSnippet?: string;
    stops: string[];
    luggageAllowance: 'backpack_only' | 'small_bag' | 'large_luggage';
    preferences: {
      ac: boolean;
      quietRide: boolean;
      music: boolean;
      femaleOnly?: boolean;
    };
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export const OfferRideView: React.FC<OfferRideViewProps> = ({
  currentStudent,
  onSubmitRide,
  onCancel,
}) => {
  // Form State
  const [originArea, setOriginArea] = useState<string>('');
  const [destinationCampus, setDestinationCampus] = useState<Campus>(
    currentStudent.campus || 'Byblos'
  );
  // Default to tomorrow or today
  const defaultDate = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(defaultDate);
  const [departureTime, setDepartureTime] = useState<string>('08:00');
  const [estimatedDurationMins, setEstimatedDurationMins] = useState<number>(35);
  const [totalSeats, setTotalSeats] = useState<number>(3);

  // Car details
  const [carModel, setCarModel] = useState<string>(currentStudent.carModel || 'Honda Civic');
  const [carColor, setCarColor] = useState<string>(currentStudent.carColor || 'Navy Blue');
  const [licensePlateSnippet, setLicensePlateSnippet] = useState<string>('');

  // Stops
  const [stops, setStops] = useState<string[]>([]);
  const [currentStopInput, setCurrentStopInput] = useState<string>('');

  // Preferences
  const [ac, setAc] = useState<boolean>(true);
  const [quietRide, setQuietRide] = useState<boolean>(false);
  const [music, setMusic] = useState<boolean>(true);
  const [femaleOnly, setFemaleOnly] = useState<boolean>(false);
  const [luggageAllowance, setLuggageAllowance] = useState<'backpack_only' | 'small_bag' | 'large_luggage'>('backpack_only');
  const [notes, setNotes] = useState<string>('');

  // Validation errors
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddStop = () => {
    if (currentStopInput.trim() && !stops.includes(currentStopInput.trim())) {
      setStops([...stops, currentStopInput.trim()]);
      setCurrentStopInput('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originArea.trim()) {
      setErrorMessage('Please enter your departure area or neighborhood.');
      return;
    }
    if (!date) {
      setErrorMessage('Please choose a travel date.');
      return;
    }
    if (!departureTime) {
      setErrorMessage('Please choose a departure time.');
      return;
    }
    if (totalSeats < 1) {
      setErrorMessage('Available seats must be at least 1.');
      return;
    }

    setErrorMessage(null);

    onSubmitRide({
      originArea: originArea.trim(),
      destinationCampus,
      date,
      departureTime,
      estimatedDurationMins,
      totalSeats,
      carModel: carModel.trim() || 'Student Vehicle',
      carColor: carColor.trim() || 'Silver',
      licensePlateSnippet: licensePlateSnippet.trim() || undefined,
      stops,
      luggageAllowance,
      preferences: {
        ac,
        quietRide,
        music,
        femaleOnly,
      },
      notes: notes.trim(),
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold text-[#004D30] uppercase tracking-wider">
          Student Driver Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-0.5">
          Offer a Ride to Campus
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Share your empty seats, help classmates get to campus, and split fuel costs.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* Section 1: Route & Destination */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#004D30] text-amber-300 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Route & Destination Campus</span>
            </h2>

            {/* Destination Campus Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Which LAU campus are you driving to? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDestinationCampus('Byblos')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    destinationCampus === 'Byblos'
                      ? 'border-[#004D30] bg-emerald-50/70 text-[#004D30] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LAU Byblos Campus</span>
                    {destinationCampus === 'Byblos' && (
                      <CheckCircle2 className="w-4 h-4 text-[#004D30]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Blat, Jbeil • Engineering, Med, Architecture
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationCampus('Beirut')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    destinationCampus === 'Beirut'
                      ? 'border-blue-900 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LAU Beirut Campus</span>
                    {destinationCampus === 'Beirut' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-900" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Koreitem / Hamra • Business, Arts & Sciences
                  </p>
                </button>
              </div>
            </div>

            {/* Departure Origin Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Departure Area / Neighborhood *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-emerald-700 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jounieh (Kaslik), Antelias Highway, Tripoli (Mina)..."
                  value={originArea}
                  onChange={(e) => setOriginArea(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              {/* Quick-Pick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-400 font-semibold">Quick picks:</span>
                {POPULAR_ORIGIN_AREAS.slice(0, 5).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setOriginArea(area)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Intermediate Pickup Stops */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Intermediate Pickup Stops along route (Optional)
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Landmarks where you can safely pull over to pick up students (e.g. footbridge, gas station, highway exit).
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Jal El Dib Footbridge, Tabarja exit..."
                  value={currentStopInput}
                  onChange={(e) => setCurrentStopInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStop();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              {stops.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {stops.map((stop, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg"
                    >
                      <span>📍 {stop}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(idx)}
                        className="text-emerald-700 hover:text-rose-600"
                        title="Remove stop"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Date, Time & Estimated Duration */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#004D30] text-amber-300 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Schedule & Timing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Travel Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departure Time *
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Est. Commute (minutes)
                </label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={estimatedDurationMins}
                  onChange={(e) => setEstimatedDurationMins(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Available Seats */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#004D30] text-amber-300 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Available Seats</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Passenger Seats *
              </label>
              <div className="grid grid-cols-4 gap-2 max-w-md">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setTotalSeats(count)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      totalSeats === count
                        ? 'bg-[#004D30] text-white border-[#004D30] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {count} {count === 1 ? 'seat' : 'seats'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-2 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 inline-block">
                All LAU student carpool rides are 100% free community rides.
              </p>
            </div>
          </div>

          {/* Section 4: Vehicle & Ride Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#004D30] text-amber-300 text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span>Vehicle Details & Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Car Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kia Rio, Honda Civic"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Car Color
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silver, White, Dark Blue"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Plate Snippet (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. B 412***"
                  value={licensePlateSnippet}
                  onChange={(e) => setLicensePlateSnippet(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
                />
              </div>
            </div>

            {/* Preferences Toggles */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAc(!ac)}
                className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                  ac
                    ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <Wind className="w-4 h-4 text-sky-600" />
                <span>AC On</span>
              </button>

              <button
                type="button"
                onClick={() => setMusic(!music)}
                className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                  music
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <Music className="w-4 h-4 text-emerald-600" />
                <span>Music OK</span>
              </button>

              <button
                type="button"
                onClick={() => setQuietRide(!quietRide)}
                className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                  quietRide
                    ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <VolumeX className="w-4 h-4 text-purple-600" />
                <span>Quiet Ride</span>
              </button>

              <button
                type="button"
                onClick={() => setFemaleOnly(!femaleOnly)}
                className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                  femaleOnly
                    ? 'bg-pink-50 border-pink-300 text-pink-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span>🌸</span>
                <span>Female Only</span>
              </button>
            </div>

            {/* Luggage Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Luggage Allowance
              </label>
              <select
                value={luggageAllowance}
                onChange={(e) =>
                  setLuggageAllowance(e.target.value as 'backpack_only' | 'small_bag' | 'large_luggage')
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
              >
                <option value="backpack_only">Backpack only (Standard for campus commutes)</option>
                <option value="small_bag">Small gym bag or drafting tube allowed</option>
                <option value="large_luggage">Large suitcase / weekend luggage allowed</option>
              </select>
            </div>

            {/* Additional Driver Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Driver's Note for Classmates (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Leaving promptly at 8:00 AM from St. Elie. Drop-off at upper gate next to Library."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004D30]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-[#004D30] hover:bg-[#003822] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Publish Ride Offer</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </form>

        {/* Live Preview Column */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Ride Preview
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                As Students See It
              </span>
            </div>

            {/* Preview Card Mock */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#004D30] text-amber-300 font-bold flex items-center justify-center text-xs">
                  {currentStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {currentStudent.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentStudent.major} • LAU {currentStudent.campus}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">From: </span>
                  <span className="font-semibold text-slate-800">
                    {originArea || 'Your Departure Area'}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">To: </span>
                  <span className="font-semibold text-emerald-800">
                    LAU {destinationCampus} Campus
                  </span>
                </div>
                <div className="text-xs flex items-center space-x-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatTime12h(departureTime)} • {date}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  {totalSeats} seats open
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  Free Ride
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200/60 text-xs text-emerald-900 space-y-1">
              <div className="flex items-center space-x-1 font-semibold text-[#004D30]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Driver Guidelines</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Confirm your pickup points clearly. Please adhere to your posted departure time so peers don't miss class!
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
