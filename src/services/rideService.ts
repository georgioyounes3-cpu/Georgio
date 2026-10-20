import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import type { Ride } from '../types/carpool.ts';
import { INITIAL_RIDES } from '../data/mockData.ts';

const RIDES_COLLECTION = 'rides';

// Seed initial rides into Firestore if the database collection is empty
export async function seedInitialRidesIfEmpty(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, RIDES_COLLECTION));
    if (snapshot.empty) {
      console.log('Seeding initial LAU student carpool rides into Firestore...');
      for (const ride of INITIAL_RIDES) {
        await setDoc(doc(db, RIDES_COLLECTION, ride.id), ride);
      }
    }
  } catch (err) {
    console.warn('Initial seeding encountered an issue, will fallback to local data:', err);
  }
}

// Subscribe to real-time updates from Firestore
export function subscribeToRides(
  onRidesUpdated: (rides: Ride[]) => void,
  onFirebaseError?: (error: unknown) => void
): () => void {
  const ridesRef = collection(db, RIDES_COLLECTION);

  const unsubscribe = onSnapshot(
    ridesRef,
    (snapshot) => {
      if (snapshot.empty) {
        // If empty on first read, seed them
        seedInitialRidesIfEmpty();
        onRidesUpdated(INITIAL_RIDES);
        return;
      }

      const rides: Ride[] = [];
      snapshot.forEach((docSnap) => {
        rides.push(docSnap.data() as Ride);
      });

      // Sort chronological by date + departure time
      rides.sort((a, b) => `${a.date}T${a.departureTime}`.localeCompare(`${b.date}T${b.departureTime}`));
      onRidesUpdated(rides);
    },
    (error) => {
      console.error('Firestore onSnapshot listener error:', error);
      if (onFirebaseError) {
        onFirebaseError(error);
      }
      handleFirestoreError(error, OperationType.LIST, RIDES_COLLECTION);
    }
  );

  return unsubscribe;
}

// Add or update a ride in Firestore
export async function syncRideToFirestore(ride: Ride): Promise<void> {
  const rideDocPath = `${RIDES_COLLECTION}/${ride.id}`;
  try {
    await setDoc(doc(db, RIDES_COLLECTION, ride.id), ride);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, rideDocPath);
  }
}

// Update specific fields of a ride in Firestore
export async function updateRideInFirestore(rideId: string, updates: Partial<Ride>): Promise<void> {
  const rideDocPath = `${RIDES_COLLECTION}/${rideId}`;
  try {
    await updateDoc(doc(db, RIDES_COLLECTION, rideId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, rideDocPath);
  }
}
