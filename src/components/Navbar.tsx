import React, { useState } from 'react';
import {
  Car,
  Search,
  PlusCircle,
  CalendarCheck,
  User,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Compass
} from 'lucide-react';
import type { Campus, Student } from '../types/carpool.ts';

interface NavbarProps {
  currentTab: 'home' | 'find' | 'offer' | 'my-rides';
  onSelectTab: (tab: 'home' | 'find' | 'offer' | 'my-rides') => void;
  currentStudent: Student;
  allStudents: Student[];
  onSwitchStudent: (student: Student) => void;
  onOpenProfile: () => void;
  myRidesCount: number;
  isFirebaseLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentStudent,
  allStudents,
  onSwitchStudent,
  onOpenProfile,
  myRidesCount,
  isFirebaseLive,
}) => {
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#004D30] text-white shadow-md border-b border-[#003822]">
      {/* Top Academic Utility Strip */}
      <div className="bg-[#003822] text-xs text-emerald-100 py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Lebanese American University • Student Commuter Network
            </span>
            {isFirebaseLive && (
              <span className="hidden md:inline-flex items-center space-x-1 bg-amber-400/20 text-amber-200 text-[10px] font-semibold px-2 py-0.2 rounded border border-amber-300/30">
                <span>🔥 Firestore Active</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 text-emerald-200">
            <span className="hidden sm:inline bg-emerald-900/60 px-2 py-0.5 rounded text-[11px] border border-emerald-700/50">
              Prototypes for Beirut & Byblos Campuses
            </span>
            <span className="text-[11px] opacity-80">Fall 2026</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              onSelectTab('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* LAU Academic Crest Badge */}
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner group-hover:bg-white/20 transition-all">
              <span className="font-serif font-black text-xl tracking-tighter text-amber-300">
                LAU
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  Student Carpool
                </span>
                <span className="hidden md:inline-block bg-amber-400/20 text-amber-200 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-amber-300/30">
                  Campus Share
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 tracking-wide font-sans">
                Beirut & Byblos Commute Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('find')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'find'
                  ? 'bg-white/20 text-white font-semibold shadow-sm'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Find a Ride</span>
            </button>
            <button
              onClick={() => onSelectTab('offer')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'offer'
                  ? 'bg-amber-400 text-[#003822] font-semibold shadow-sm'
                  : 'bg-emerald-700/60 text-white hover:bg-emerald-700 hover:text-white border border-emerald-600/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Offer a Ride</span>
            </button>
            <button
              onClick={() => onSelectTab('my-rides')}
              className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === 'my-rides'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-emerald-300" />
              <span>My Rides</span>
              {myRidesCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {myRidesCount}
                </span>
              )}
            </button>
          </nav>

          {/* User Profile & Demo Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Student Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                className="flex items-center space-x-2 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-600/50 rounded-lg py-1.5 px-2.5 sm:px-3 text-left transition-all"
                title="Switch active LAU student profile to test driver or passenger views"
                aria-label="Active student profile"
              >
                <div className="w-7 h-7 rounded-full bg-amber-400 text-[#004D30] font-bold flex items-center justify-center text-xs shadow">
                  {currentStudent.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentStudent.name}
                  </div>
                  <div className="text-[10px] text-emerald-200">
                    LAU {currentStudent.campus}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {/* Dropdown Menu */}
              {isStudentDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setIsStudentDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Active Student (Prototype Profile)
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Switch personas to test rides as driver or passenger:
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {allStudents.map((stu) => (
                      <button
                        key={stu.id}
                        onClick={() => onSwitchStudent(stu)}
                        className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${
                          stu.id === currentStudent.id ? 'bg-emerald-50/80 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              stu.id === currentStudent.id
                                ? 'bg-[#004D30] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-800">
                              {stu.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {stu.campus} Campus • {stu.major}
                            </div>
                          </div>
                        </div>
                        {stu.id === currentStudent.id && (
                          <span className="text-[11px] text-[#004D30] font-bold">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 px-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={onOpenProfile}
                      className="text-xs text-[#004D30] font-semibold hover:underline flex items-center space-x-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Edit Student Info</span>
                    </button>
                    <span className="text-[10px] text-slate-400">LAU ID Verified</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#003822] border-t border-emerald-800 px-4 pt-3 pb-4 space-y-2">
          <button
            onClick={() => {
              onSelectTab('home');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm ${
              currentTab === 'home' ? 'bg-white/20 text-white font-semibold' : 'text-emerald-100'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-300" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('find');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm ${
              currentTab === 'find' ? 'bg-white/20 text-white font-semibold' : 'text-emerald-100'
            }`}
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>Find a Ride</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('offer');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm ${
              currentTab === 'offer' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-emerald-100'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Offer a Ride</span>
          </button>
          <button
            onClick={() => {
              onSelectTab('my-rides');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
              currentTab === 'my-rides' ? 'bg-white/20 text-white font-semibold' : 'text-emerald-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-emerald-300" />
              <span>My Rides</span>
            </div>
            {myRidesCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-xs font-bold rounded-full px-2 py-0.5">
                {myRidesCount}
              </span>
            )}
          </button>
          <div className="pt-2 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
            <span>Signed in as: <strong>{currentStudent.name}</strong></span>
            <button
              onClick={() => {
                onOpenProfile();
                setIsMobileMenuOpen(false);
              }}
              className="text-amber-300 underline font-semibold"
            >
              Profile
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
