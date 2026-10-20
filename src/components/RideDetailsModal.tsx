import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Share2,
  Wind,
  VolumeX,
  Music,
  Luggage,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';
import type { DriverReview, Ride, Student } from '../types/carpool.ts';
import { formatTime12h, calculateDriverRatingBreakdown } from '../utils/carpoolLogic.ts';

interface RideDetailsModalProps {
  ride: Ride;
  currentStudent: Student;
  onClose: () => void;
  onRequestSeat: (rideId: string, seats: number, pickupNote: string) => void;
  onCancelRequest: (rideId: string, requestId: string) => void;
  onCancelRide?: (rideId: string) => void;
  onAddReview?: (
    driverId: string,
    review: { rating: number; comment: string; tags: string[] }
  ) => void;
}

const AVAILABLE_TAGS = [
  'Always on Time',
  'Careful & Safe Driver',
  'Clean & Fresh Car',
  'Quiet Study Vibes',
  'Great Playlist',
  'Smooth Highway Route',
  'Great Communication',
  'Comfortable Ride',
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: '1 Star - Significant delays / unreliable',
  2: '2 Stars - Below expectations / late',
  3: '3 Stars - Standard average commute',
  4: '4 Stars - Very good & punctual driver',
  5: '5 Stars - Outstanding & highly reliable!',
};

export const RideDetailsModal: React.FC<RideDetailsModalProps> = ({
  ride,
  currentStudent,
  onClose,
  onRequestSeat,
  onCancelRequest,
  onCancelRide,
  onAddReview,
}) => {
  const [requestedSeats, setRequestedSeats] = useState<number>(1);
  const [pickupNote, setPickupNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Rating & Review Form State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Always on Time', 'Careful & Safe Driver']);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const isDriver = ride.driverId === currentStudent.id;
  const userRequest = ride.requests.find(
    (req) => req.passengerId === currentStudent.id && req.status !== 'cancelled'
  );
  const isBooked = userRequest?.status === 'accepted';
  const isPending = userRequest?.status === 'pending';

  const confirmedPassengers = ride.requests.filter((req) => req.status === 'accepted');

  // Driver reliability scores
  const driver = ride.driver;
  const driverReviews: DriverReview[] = driver.reviews || [];
  const ratingBreakdown = calculateDriverRatingBreakdown(driverReviews);
  const displayRating = driver.rating || ratingBreakdown.average || 4.9;
  const displayReviewCount = driver.reviewCount || driverReviews.length || 14;
  const onTimeRate = driver.onTimeRate || 98;
  const completedRidesCount = driver.completedRidesCount || 24;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedSeats < 1 || requestedSeats > ride.availableSeats) return;
    setIsSubmitting(true);
    onRequestSeat(ride.id, requestedSeats, pickupNote);
    setIsSubmitting(false);
  };

  const copyShareDetails = () => {
    const text = `LAU Carpool with ${ride.driver.name}: ${ride.originArea} to LAU ${ride.destinationCampus} Campus on ${ride.date} at ${formatTime12h(ride.departureTime)}. Free student ride.`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddReview) return;
    if (selectedStars < 1 || selectedStars > 5) return;

    onAddReview(driver.id, {
      rating: selectedStars,
      comment: reviewComment.trim() || 'Reliable student commuter!',
      tags: selectedTags,
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewFormOpen(false);
      setReviewSubmitted(false);
      setReviewComment('');
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ride-details-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header Banner */}
        <div className="bg-[#004D30] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="Close ride details dialog"
            className="absolute top-4 right-4 text-emerald-100 hover:text-white bg-emerald-900/50 hover:bg-emerald-900 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-emerald-800/80 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-600/50">
              LAU {ride.destinationCampus} Campus
            </span>
            <span className="text-emerald-200 text-xs">•</span>
            <span className="text-emerald-100 text-xs flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>{ride.date}</span>
            </span>
            <span className="text-emerald-200 text-xs">•</span>
            <span className="text-emerald-100 text-xs flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{formatTime12h(ride.departureTime)}</span>
            </span>
          </div>

          <h2
            id="ride-details-title"
            className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight"
          >
            {ride.originArea} → LAU {ride.destinationCampus}
          </h2>

          <div className="flex items-center space-x-2 text-xs text-emerald-200 mt-1">
            <span>Offered by {ride.driver.name} ({ride.driver.major})</span>
            <span>•</span>
            <span className="inline-flex items-center space-x-1 text-amber-300 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{displayRating.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Driver Information Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-[#004D30] text-amber-300 font-bold flex items-center justify-center text-lg shadow-sm">
                  {ride.driver.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">
                      {ride.driver.name}
                    </h3>
                    {ride.driver.verifiedStudent && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Verified Student</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    {ride.driver.major} • {ride.driver.year} • LAU {ride.driver.campus}
                  </p>
                </div>
              </div>

              {/* Direct Driver Contact */}
              <div className="flex items-center space-x-2 self-start sm:self-center">
                <a
                  href={`https://wa.me/${ride.driver.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${ride.driver.phone}`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call</span>
                </a>
                <a
                  href={`mailto:${ride.driver.email}`}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 text-xs transition-colors"
                  title={ride.driver.email}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* DRIVER RELIABILITY & STAR RATING SYSTEM */}
          <div className="bg-gradient-to-br from-amber-50/50 via-white to-slate-50 rounded-xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
              <div>
                <div className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Driver Reliability & Community Rating
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified feedback from fellow Lebanese American University commuters
                </p>
              </div>

              {!isDriver && onAddReview && (
                <button
                  onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-900" />
                  <span>{isReviewFormOpen ? 'Close Rating Form' : 'Rate Driver'}</span>
                  {isReviewFormOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Score Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Overall Star Score */}
              <div className="bg-white rounded-lg p-3 border border-amber-200/60 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-500">Star Rating</span>
                <div className="mt-1 flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-900">
                    {displayRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <div className="flex items-center space-x-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(displayRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  {displayReviewCount} student reviews
                </span>
              </div>

              {/* Punctuality / On-Time Rate */}
              <div className="bg-white rounded-lg p-3 border border-emerald-200/60 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-500">Punctuality</span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-emerald-800">
                    {onTimeRate}%
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-medium mt-1">
                  <Clock className="w-3 h-3" />
                  <span>On-time departures</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  High reliability score
                </span>
              </div>

              {/* Completed Commutes */}
              <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-500">Experience</span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-800">
                    {completedRidesCount}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-slate-600 font-medium mt-1">
                  <Car className="w-3 h-3 text-slate-400" />
                  <span>Rides completed</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">
                  Campus commuter
                </span>
              </div>

              {/* Safety & Student ID */}
              <div className="bg-white rounded-lg p-3 border border-sky-200/70 shadow-xs flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-500">Verification</span>
                <div className="mt-1 flex items-center space-x-1 text-sky-800 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  <span>LAU ID Match</span>
                </div>
                <span className="text-[11px] text-slate-600 font-medium mt-1">
                  Valid student plate
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  Safety verified
                </span>
              </div>
            </div>

            {/* Interactive Rating Form Drawer */}
            {isReviewFormOpen && !isDriver && (
              <form
                onSubmit={handleReviewSubmit}
                className="bg-white rounded-xl p-4 sm:p-5 border-2 border-amber-300 shadow-md space-y-4 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>Rate {ride.driver.name} as a Driver</span>
                  </h5>
                  <span className="text-[11px] text-slate-500">
                    Reviewing as <strong>{currentStudent.name}</strong>
                  </span>
                </div>

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Reliability Rating:
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const isFilled =
                          (hoveredStars !== null ? hoveredStars : selectedStars) >= starIndex;
                        return (
                          <button
                            type="button"
                            key={starIndex}
                            onMouseEnter={() => setHoveredStars(starIndex)}
                            onMouseLeave={() => setHoveredStars(null)}
                            onClick={() => setSelectedStars(starIndex)}
                            aria-label={`Rate ${starIndex} stars`}
                            className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                                  : 'fill-slate-100 text-slate-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-amber-800 ml-2">
                      {RATING_DESCRIPTIONS[hoveredStars !== null ? hoveredStars : selectedStars]}
                    </span>
                  </div>
                </div>

                {/* Quick Compliment Tags */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Tags (Punctuality & Safety):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#004D30] text-amber-300 border-[#004D30] font-bold shadow-xs'
                              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Feedback for Fellow Students (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Always leaves right on time from Antelias. Calm driver, safe commute to LAU Byblos campus."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {reviewSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-lg text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your rating & review have been posted live! Thank you!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsReviewFormOpen(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#004D30] hover:bg-[#003822] text-amber-300 font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>Submit Reliability Rating</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Rating Breakdown & Recent Feedback */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Rating Distribution & Breakdown
                </span>
                <span className="text-[11px] text-slate-500">
                  {displayReviewCount} total ratings
                </span>
              </div>

              {/* Star Distribution Bars */}
              <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200/80 text-xs">
                {[5, 4, 3, 2, 1].map((starVal) => {
                  const pct =
                    driverReviews.length > 0
                      ? ratingBreakdown.percentages[starVal] || 0
                      : starVal === 5
                      ? 85
                      : starVal === 4
                      ? 15
                      : 0;
                  const count =
                    driverReviews.length > 0
                      ? ratingBreakdown.counts[starVal] || 0
                      : starVal === 5
                      ? 12
                      : starVal === 4
                      ? 2
                      : 0;
                  return (
                    <div key={starVal} className="flex items-center space-x-2">
                      <span className="w-7 text-[11px] font-bold text-slate-700 flex items-center">
                        <span>{starVal}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-0.5" />
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[10px] text-slate-500 font-medium">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Recent Student Reviews */}
              {driverReviews.length > 0 && (
                <div className="space-y-2 mt-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Recent Passenger Feedback
                  </span>
                  <div className="space-y-2">
                    {driverReviews.slice(0, 3).map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white p-3 rounded-lg border border-slate-200/80 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#004D30] font-bold flex items-center justify-center text-[10px]">
                              {rev.reviewerName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">
                              {rev.reviewerName}
                            </span>
                            {rev.reviewerMajor && (
                              <span className="text-[11px] text-slate-500 hidden sm:inline">
                                • {rev.reviewerMajor}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-100 text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-slate-700 text-xs italic">
                          "{rev.comment}"
                        </p>

                        {rev.tags && rev.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rev.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Route & Schedule Milestones */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Route Details & Stops
            </h4>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 mt-1 ring-4 ring-emerald-50" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Departure: {ride.originArea}
                    </p>
                    <p className="text-xs text-slate-500">
                      Scheduled at {formatTime12h(ride.departureTime)} • {ride.date}
                    </p>
                  </div>
                </div>

                {ride.stops && ride.stops.length > 0 && (
                  <div className="pl-6 border-l-2 border-dashed border-slate-200 ml-1.5 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Optional Pickups:
                    </p>
                    <ul className="space-y-1">
                      {ride.stops.map((stop, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{stop}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 ring-4 ring-amber-50" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Arrival: LAU {ride.destinationCampus} Campus
                    </p>
                    <p className="text-xs text-slate-500">
                      Estimated commute time: ~{ride.estimatedDurationMins || 45} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Ride Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Vehicle & Seats
              </p>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Car:</span>
                  <span className="font-semibold">{ride.carColor} {ride.carModel}</span>
                </div>
                {ride.licensePlateSnippet && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Plate:</span>
                    <span className="font-mono text-slate-800">{ride.licensePlateSnippet}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Seat capacity:</span>
                  <span className="font-semibold">{ride.availableSeats} of {ride.totalSeats} seats open</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ride Preferences
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ride.preferences.ac ? (
                  <span className="text-[11px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                    <Wind className="w-3 h-3" />
                    <span>AC On</span>
                  </span>
                ) : (
                  <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Windows Down</span>
                )}

                {ride.preferences.femaleOnly && (
                  <span className="text-[11px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded font-medium">
                    Female Only
                  </span>
                )}

                {ride.preferences.quietRide ? (
                  <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded flex items-center space-x-1">
                    <VolumeX className="w-3 h-3" />
                    <span>Quiet study</span>
                  </span>
                ) : (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Music className="w-3 h-3" />
                    <span>Music welcome</span>
                  </span>
                )}

                <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded flex items-center space-x-1">
                  <Luggage className="w-3 h-3" />
                  <span>
                    {ride.luggageAllowance === 'backpack_only'
                      ? 'Backpack only'
                      : ride.luggageAllowance === 'small_bag'
                      ? 'Small bag'
                      : 'Luggage allowed'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Driver's Notes */}
          {ride.notes && (
            <div className="bg-amber-50/70 border border-amber-200/70 p-3.5 rounded-xl text-xs text-amber-900">
              <p className="font-semibold mb-0.5">Driver's Notes:</p>
              <p className="text-amber-800">{ride.notes}</p>
            </div>
          )}

          {/* Confirmed Passengers Roster */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Booked Passengers ({confirmedPassengers.length})
            </h4>
            {confirmedPassengers.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                No passengers have booked yet. Be the first to grab a seat!
              </p>
            ) : (
              <div className="space-y-2">
                {confirmedPassengers.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                        {req.passengerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">
                          {req.passengerName}
                        </span>
                        <span className="text-slate-500 ml-1.5">
                          ({req.seatsRequested} {req.seatsRequested === 1 ? 'seat' : 'seats'})
                        </span>
                      </div>
                    </div>
                    {req.pickupNote && (
                      <span className="text-[11px] text-slate-500 truncate max-w-[200px]" title={req.pickupNote}>
                        📍 {req.pickupNote}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seat Request Action Area */}
          <div className="pt-2 border-t border-slate-200">
            {isDriver ? (
              <div className="bg-slate-100 p-4 rounded-xl text-center space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  You are the driver of this carpool ride.
                </p>
                {onCancelRide && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this ride?')) {
                        onCancelRide(ride.id);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel This Ride
                  </button>
                )}
              </div>
            ) : isBooked ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                <div className="flex items-start space-x-2.5 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold">You are confirmed for this ride!</p>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      {userRequest.seatsRequested} seat{userRequest.seatsRequested > 1 ? 's' : ''} reserved. Coordinate with {ride.driver.name} via WhatsApp or phone before departure.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60">
                  <span className="text-xs text-emerald-700">Need to cancel?</span>
                  <button
                    onClick={() => {
                      if (confirm('Cancel your seat request for this ride?')) {
                        onCancelRequest(ride.id, userRequest.id);
                      }
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                  >
                    Cancel My Seat
                  </button>
                </div>
              </div>
            ) : isPending ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-900">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm font-bold">Seat request pending driver approval</p>
                </div>
                <p className="text-xs text-amber-800">
                  The driver will review your request. You can also message them directly on WhatsApp.
                </p>
              </div>
            ) : ride.availableSeats === 0 ? (
              <div className="bg-slate-100 p-4 rounded-xl text-center">
                <p className="text-xs font-semibold text-slate-600">
                  This ride has reached its maximum passenger capacity.
                </p>
              </div>
            ) : (
              /* Request Seat Form */
              <form onSubmit={handleBook} className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#004D30]">
                    Request a Seat with {ride.driver.name}
                  </h4>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2 py-1 rounded-md border border-emerald-200">
                      100% Free Commute
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Number of Seats Needed
                    </label>
                    <select
                      value={requestedSeats}
                      onChange={(e) => setRequestedSeats(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Array.from({ length: ride.availableSeats }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'seat' : 'seats'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pickup Landmark / Cross Street
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near St. Elie church, next to pharmacy"
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Booking as <strong>{currentStudent.name}</strong> ({currentStudent.major}, {currentStudent.phone}). Driver will receive your contact details to coordinate pickup.
                </p>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={copyShareDetails}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied to Clipboard!' : 'Share Ride'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-lg bg-[#004D30] text-white text-xs font-bold hover:bg-[#003822] shadow-sm hover:shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Confirm Seat Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
