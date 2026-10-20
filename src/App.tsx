import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { FindRideView } from './components/FindRideView.tsx';
import { OfferRideView } from './components/OfferRideView.tsx';
import { MyRidesView } from './components/MyRidesView.tsx';
import { RideDetailsModal } from './components/RideDetailsModal.tsx';
import { StudentProfileModal } from './components/StudentProfileModal.tsx';
import { Footer } from './components/Footer.tsx';
import { INITIAL_RIDES, SAMPLE_STUDENTS } from './data/mockData.ts';
import type { Campus, Ride, Student } from './types/carpool.ts';
import {
  requestSeat,
  cancelRequest,
  updateRequestStatus,
  createRide,
  cancelRide,
  addDriverReview,
} from './utils/carpoolLogic.ts';
import { testFirestoreConnection } from './firebase.ts';
import { subscribeToRides, syncRideToFirestore } from './services/rideService.ts';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const STORAGE_KEY_RIDES = 'lau_carpool_rides_v2';
const STORAGE_KEY_STUDENT = 'lau_carpool_student_v2';

export default function App() {
  // Initialize state with LocalStorage fallback
  const [rides, setRides] = useState<Ride[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RIDES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved rides', e);
    }
    return INITIAL_RIDES;
  });

  const [currentStudent, setCurrentStudent] = useState<Student>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved student', e);
    }
    return SAMPLE_STUDENTS[0]; // Maya Haddad
  });

  const [allStudents, setAllStudents] = useState<Student[]>(SAMPLE_STUDENTS);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(false);

  // Tab navigation
  const [currentTab, setCurrentTab] = useState<'home' | 'find' | 'offer' | 'my-rides'>('home');
  const [initialFindCampus, setInitialFindCampus] = useState<Campus | undefined>(undefined);

  // Modals
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RIDES, JSON.stringify(rides));
    } catch (e) {
      console.error('Failed to save rides', e);
    }
  }, [rides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(currentStudent));
    } catch (e) {
      console.error('Failed to save student', e);
    }
  }, [currentStudent]);

  // Connect to Firestore and sync real-time rides
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirebaseLive(connected);
    });

    const unsubscribe = subscribeToRides(
      (firestoreRides) => {
        if (firestoreRides && firestoreRides.length > 0) {
          setRides(firestoreRides);
          setIsFirebaseLive(true);
        }
      },
      (err) => {
        console.warn('Realtime Firestore sync using fallback:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle URL query parameters (e.g. ?autostart=1 or ?tab=find)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'find' || tabParam === 'offer' || tabParam === 'my-rides') {
      setCurrentTab(tabParam);
    } else if (params.get('autostart') === '1') {
      setCurrentTab('find');
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Selected ride object
  const selectedRide = selectedRideId
    ? rides.find((r) => r.id === selectedRideId) || null
    : null;

  // Total count for current student's active rides (driving + booked)
  const myRidesCount = rides.filter((r) => {
    const isDriver = r.driverId === currentStudent.id && r.status !== 'cancelled';
    const isPassenger = r.requests.some(
      (req) => req.passengerId === currentStudent.id && req.status !== 'cancelled'
    );
    return isDriver || isPassenger;
  }).length;

  // Handlers
  const handleSelectRide = (ride: Ride) => {
    setSelectedRideId(ride.id);
  };

  const handleRequestSeat = (rideId: string, seats: number, pickupNote: string) => {
    const res = requestSeat(rides, rideId, currentStudent, seats, pickupNote, true);
    if (res.success) {
      setRides(res.updatedRides);
      const updated = res.updatedRides.find((r) => r.id === rideId);
      if (updated) {
        syncRideToFirestore(updated).catch((err) => console.warn('Firestore sync:', err));
      }
      showToast(
        `Seat confirmed! You have reserved ${seats} seat${seats > 1 ? 's' : ''}. View in My Rides.`,
        'success'
      );
    } else {
      showToast(res.error || 'Failed to request seat', 'error');
    }
  };

  const handleCancelRequest = (rideId: string, requestId: string) => {
    const res = cancelRequest(rides, rideId, requestId);
    if (res.success) {
      setRides(res.updatedRides);
      const updated = res.updatedRides.find((r) => r.id === rideId);
      if (updated) {
        syncRideToFirestore(updated).catch((err) => console.warn('Firestore sync:', err));
      }
      showToast('Seat reservation has been cancelled.', 'success');
    } else {
      showToast(res.error || 'Failed to cancel reservation', 'error');
    }
  };

  const handleUpdateRequestStatus = (
    rideId: string,
    requestId: string,
    status: 'accepted' | 'declined'
  ) => {
    const res = updateRequestStatus(rides, rideId, requestId, status);
    if (res.success) {
      setRides(res.updatedRides);
      const updated = res.updatedRides.find((r) => r.id === rideId);
      if (updated) {
        syncRideToFirestore(updated).catch((err) => console.warn('Firestore sync:', err));
      }
      showToast(
        `Passenger request ${status === 'accepted' ? 'accepted' : 'declined'}.`,
        'success'
      );
    } else {
      showToast(res.error || 'Failed to update request', 'error');
    }
  };

  const handleSubmitRide = (rideData: {
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
  }) => {
    const res = createRide(rides, {
      ...rideData,
      driver: currentStudent,
    });

    if (res.success && res.ride) {
      setRides(res.updatedRides);
      syncRideToFirestore(res.ride).catch((err) => console.warn('Firestore sync:', err));
      showToast('Your carpool ride has been published to campus!', 'success');
      setCurrentTab('my-rides');
    } else {
      showToast(res.error || 'Failed to create ride', 'error');
    }
  };

  const handleCancelRide = (rideId: string) => {
    const res = cancelRide(rides, rideId, currentStudent.id);
    if (res.success) {
      setRides(res.updatedRides);
      const updated = res.updatedRides.find((r) => r.id === rideId);
      if (updated) {
        syncRideToFirestore(updated).catch((err) => console.warn('Firestore sync:', err));
      }
      showToast('Ride offer has been cancelled.', 'success');
    } else {
      showToast(res.error || 'Failed to cancel ride', 'error');
    }
  };

  const handleAddDriverReview = (
    driverId: string,
    reviewInput: { rating: number; comment: string; tags: string[] }
  ) => {
    const res = addDriverReview(allStudents, rides, driverId, {
      reviewerId: currentStudent.id,
      reviewerName: currentStudent.name,
      reviewerMajor: currentStudent.major,
      rating: reviewInput.rating,
      comment: reviewInput.comment,
      tags: reviewInput.tags,
    });

    if (res.success) {
      setAllStudents(res.updatedStudents);
      setRides(res.updatedRides);
      if (currentStudent.id === driverId) {
        const updatedSelf = res.updatedStudents.find((s) => s.id === driverId);
        if (updatedSelf) setCurrentStudent(updatedSelf);
      }
      const driverRides = res.updatedRides.filter((r) => r.driverId === driverId);
      driverRides.forEach((r) => {
        syncRideToFirestore(r).catch((err) => console.warn('Firestore sync review:', err));
      });
      showToast('Driver reliability rating published successfully!', 'success');
    } else {
      showToast(res.error || 'Failed to submit review', 'error');
    }
  };

  const handleResetData = () => {
    setRides(INITIAL_RIDES);
    setCurrentStudent(SAMPLE_STUDENTS[0]);
    localStorage.removeItem(STORAGE_KEY_RIDES);
    localStorage.removeItem(STORAGE_KEY_STUDENT);
    showToast('Prototype data reset to initial LAU demo dataset.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Notification Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200 max-w-md"
        >
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border text-xs sm:text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-amber-300 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white p-1"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'find') setInitialFindCampus(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentStudent={currentStudent}
        allStudents={allStudents}
        onSwitchStudent={(stu) => {
          setCurrentStudent(stu);
          showToast(`Switched active student to ${stu.name} (${stu.campus} Campus)`);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        myRidesCount={myRidesCount}
        isFirebaseLive={isFirebaseLive}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onFindRide={(campus) => {
              setInitialFindCampus(campus);
              setCurrentTab('find');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOfferRide={() => {
              setCurrentTab('offer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectRide={handleSelectRide}
            upcomingRides={rides.filter((r) => r.status === 'active')}
            currentStudent={currentStudent}
            totalActiveRides={rides.filter((r) => r.status === 'active').length}
          />
        )}

        {currentTab === 'find' && (
          <FindRideView
            rides={rides}
            currentStudent={currentStudent}
            onSelectRide={handleSelectRide}
            onOfferRide={() => {
              setCurrentTab('offer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialCampus={initialFindCampus}
          />
        )}

        {currentTab === 'offer' && (
          <OfferRideView
            currentStudent={currentStudent}
            onSubmitRide={handleSubmitRide}
            onCancel={() => setCurrentTab('find')}
          />
        )}

        {currentTab === 'my-rides' && (
          <MyRidesView
            rides={rides}
            currentStudent={currentStudent}
            onSelectRide={handleSelectRide}
            onFindRide={() => setCurrentTab('find')}
            onOfferRide={() => setCurrentTab('offer')}
            onCancelRequest={handleCancelRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onCancelRide={handleCancelRide}
          />
        )}
      </main>

      {/* Ride Details Modal */}
      {selectedRide && (
        <RideDetailsModal
          ride={selectedRide}
          currentStudent={currentStudent}
          onClose={() => setSelectedRideId(null)}
          onRequestSeat={(rideId, seats, note) => {
            handleRequestSeat(rideId, seats, note);
            setSelectedRideId(null);
          }}
          onCancelRequest={(rideId, reqId) => {
            handleCancelRequest(rideId, reqId);
            setSelectedRideId(null);
          }}
          onCancelRide={(rideId) => {
            handleCancelRide(rideId);
            setSelectedRideId(null);
          }}
          onAddReview={handleAddDriverReview}
        />
      )}

      {/* Student Profile Modal */}
      {isProfileModalOpen && (
        <StudentProfileModal
          student={currentStudent}
          allStudents={allStudents}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdateStudent={(updated) => {
            setCurrentStudent(updated);
            setAllStudents((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            );
            showToast('Student profile updated successfully!');
          }}
          onSwitchStudent={(stu) => {
            setCurrentStudent(stu);
          }}
          onResetData={handleResetData}
        />
      )}

      {/* Academic Footer */}
      <Footer />
    </div>
  );
}
