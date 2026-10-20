import React from 'react';
import {
  Car,
  Search,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building2,
  Compass,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import type { Campus, Ride, Student } from '../types/carpool.ts';
import { RideCard } from './RideCard.tsx';

interface LandingPageProps {
  onFindRide: (campus?: Campus) => void;
  onOfferRide: () => void;
  onSelectRide: (ride: Ride) => void;
  upcomingRides: Ride[];
  currentStudent: Student;
  totalActiveRides: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onFindRide,
  onOfferRide,
  onSelectRide,
  upcomingRides,
  currentStudent,
  totalActiveRides,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004D30] to-[#003822] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#002B19]">
        {/* Subtle geometric pattern overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
        />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xs border border-white/20 rounded-full px-3.5 py-1 text-xs text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-medium tracking-wide">
              Official Student Community Prototype
            </span>
            <span className="text-white/40">|</span>
            <span className="text-amber-300 font-semibold">Beirut & Byblos Campuses</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Smart, Affordable Commuting for{' '}
            <span className="text-amber-300 underline decoration-amber-400/60 decoration-2 underline-offset-4">
              LAU Students
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-emerald-100 max-w-2xl mx-auto font-sans leading-relaxed">
            Connect with fellow Lebanese American University peers heading your way. Share rides, split gas expenses, bypass highway hassle, and arrive to class on time.
          </p>

          {/* Two Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onFindRide()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#003822] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 transform active:scale-98"
            >
              <Search className="w-5 h-5" />
              <span>Find a Ride</span>
            </button>
            <button
              onClick={onOfferRide}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/30 backdrop-blur-xs transition-all duration-200 flex items-center justify-center space-x-2 transform active:scale-98"
            >
              <PlusCircle className="w-5 h-5 text-amber-300" />
              <span>Offer a Ride</span>
            </button>
          </div>

          {/* Live Stats Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-300">{totalActiveRides}</div>
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
                Active Rides
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-white">2</div>
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
                LAU Campuses
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-amber-300">100%</div>
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
                Free Commutes
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
                Verified Peers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Quick Jump Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
              Select Your Destination Campus
            </h2>
            <p className="text-xs text-slate-500">
              Browse carpools arriving directly to your campus gates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Byblos Campus Card */}
          <div
            onClick={() => onFindRide('Byblos')}
            className="group cursor-pointer bg-gradient-to-br from-emerald-900 to-[#004D30] rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-200 border border-emerald-700/50 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide mb-2">
                  Hillside Campus
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold group-hover:text-amber-200 transition-colors">
                  LAU Byblos Campus
                </h3>
                <p className="text-xs text-emerald-100 mt-1 max-w-sm">
                  Blat, Jbeil • Direct rides from Tripoli, Batroun, Jounieh, Kaslik, Metn, and Beirut.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-700/60">
                <span className="text-xs font-semibold text-emerald-200">
                  Engineering, Architecture, Medicine, Arts & Sciences
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-amber-400 group-hover:text-slate-900 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Beirut Campus Card */}
          <div
            onClick={() => onFindRide('Beirut')}
            className="group cursor-pointer bg-gradient-to-br from-[#0c2a44] to-[#143d63] rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-200 border border-blue-900/50 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="inline-block bg-sky-300 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide mb-2">
                  Urban Campus
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold group-hover:text-sky-200 transition-colors">
                  LAU Beirut Campus
                </h3>
                <p className="text-xs text-blue-100 mt-1 max-w-sm">
                  Koreitem / Hamra • Convenient rides from Metn (Antelias, Dbayeh), Hazmieh, Mansourieh, Saida & South.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-blue-800/60">
                <span className="text-xs font-semibold text-blue-200">
                  Business (AKSOB), Arts & Sciences, Social Sciences
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-sky-300 group-hover:text-slate-900 flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Rides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
              Upcoming Student Rides
            </h2>
            <p className="text-xs text-slate-500">
              Recently posted rides open for seat requests
            </p>
          </div>
          <button
            onClick={() => onFindRide()}
            className="text-xs font-bold text-[#004D30] hover:underline flex items-center space-x-1"
          >
            <span>View All Available Rides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingRides.slice(0, 3).map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              currentStudent={currentStudent}
              onSelectRide={onSelectRide}
            />
          ))}
        </div>
      </section>

      {/* How it Works / Core Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Built for LAU Daily Student Life
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Say goodbye to expensive private taxis or slow public vans. Carpooling is simpler, safer, and connects you with classmates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#004D30] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Post or Search</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drivers enter their route and departure time. Passengers search by origin and campus destination.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Reserve a Seat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Request a place with a pickup landmark. Connect over WhatsApp or phone to finalize pickup times.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900">100% Free Peer Rides</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect and travel together with zero fare or fees. Pure student-to-student community support.
              </p>
            </div>
          </div>

          {/* Prototype Community Notice */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                Prototype safety rule: Always carry your LAU student ID when boarding.
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Lebanese American University • Student Commuter Network
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
