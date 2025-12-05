/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Using modular v9 SDK for all Firebase services.
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  updateDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import type { UserProfile } from '../types';

// Configuration for your Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyBKxsXHVlr5bC9CKUfDuzHkXxrxCmxosz8",
  authDomain: "prothumbgenerator.firebaseapp.com",
  projectId: "prothumbgenerator",
  storageBucket: "prothumbgenerator.appspot.com", // Corrected storage bucket domain
  messagingSenderId: "713187207288",
  appId: "1:713187207288:web:a80019a89cb37ce474e58d"
};

// Initialize Firebase services.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const microsoftProvider = new OAuthProvider('microsoft.com');

// Define plan limits (matching new pricing structure)
export const PLAN_LIMITS: Record<UserProfile['plan'], number> = {
  Starter: 30,
  Pro: 100,
  Business: 300,
  Agency: 800,
};


setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase: Could not set local persistence.", error);
});


// --- AUTHENTICATION STATE & CORE PROFILE MANAGEMENT ---

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Retrieves a user's profile from the 'users' collection in Firestore.
 * @param uid The user's unique ID.
 * @returns A promise that resolves to the user's profile object or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  console.log(`No profile found in Firestore for user ${uid}, one may need to be created.`);
  return null;
};

// --- AUTHENTICATION ACTIONS ---

export const signInWithGoogle = async (): Promise<{ profile: UserProfile | null, isNewUser: boolean, error: string | null }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (!result.user) throw new Error("Authentication failed, user object not found.");

    const profile = await getUserProfile(result.user.uid);
    if (profile) {
      // Existing user
      return { profile, isNewUser: false, error: null };
    } else {
      // New user, needs to complete profile.
      return { profile: null, isNewUser: true, error: null };
    }
  } catch (error: any) {
    console.error("Google Sign-In Error:", error.code, error.message);
    if (error.code === 'unavailable') {
        return { profile: null, isNewUser: false, error: "Could not connect to the database. This might be due to a network issue or if the project's Firestore database is not configured. Please check your connection and try again." };
    }
    if (error.code === 'auth/account-exists-with-different-credential') {
      return { profile: null, isNewUser: false, error: "An account with this email already exists using a different sign-in method." };
    }
    if (error.code === 'auth/popup-closed-by-user') {
      return { profile: null, isNewUser: false, error: "Sign-in cancelled. Please try again when you're ready." };
    }
    const errorMessage = `Google login failed: ${error.message} (Code: ${error.code})`;
    return { profile: null, isNewUser: false, error: errorMessage };
  }
};

export const signInWithApple = async (): Promise<{ profile: UserProfile | null, isNewUser: boolean, error: string | null }> => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    if (!result.user) throw new Error("Authentication failed, user object not found.");
    const profile = await getUserProfile(result.user.uid);
    return { profile, isNewUser: !profile, error: null };
  } catch (error: any)
{
    console.error("Apple Sign-In Error:", error.code, error.message);
    if (error.code === 'unavailable') {
        return { profile: null, isNewUser: false, error: "Could not connect to the database. This might be due to a network issue or if the project's Firestore database is not configured. Please check your connection and try again." };
    }
    if (error.code === 'auth/account-exists-with-different-credential') {
      return { profile: null, isNewUser: false, error: "An account with this email already exists using a different sign-in method." };
    }
    if (error.code === 'auth/popup-closed-by-user') {
        return { profile: null, isNewUser: false, error: "Sign-in cancelled. Please try again when you're ready." };
    }
    const errorMessage = `Apple login failed: ${error.message} (Code: ${error.code})`;
    return { profile: null, isNewUser: false, error: errorMessage };
  }
};

export const signInWithMicrosoft = async (): Promise<{ profile: UserProfile | null, isNewUser: boolean, error: string | null }> => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    if (!result.user) throw new Error("Authentication failed, user object not found.");
    const profile = await getUserProfile(result.user.uid);
    return { profile, isNewUser: !profile, error: null };
  } catch (error: any)
{
    console.error("Microsoft Sign-In Error:", error.code, error.message);
    if (error.code === 'unavailable') {
        return { profile: null, isNewUser: false, error: "Could not connect to the database. This might be due to a network issue or if the project's Firestore database is not configured. Please check your connection and try again." };
    }
     if (error.code === 'auth/account-exists-with-different-credential') {
      return { profile: null, isNewUser: false, error: "An account with this email already exists using a different sign-in method." };
    }
     if (error.code === 'auth/popup-closed-by-user') {
        return { profile: null, isNewUser: false, error: "Sign-in cancelled. Please try again when you're ready." };
    }
    const errorMessage = `Microsoft login failed: ${error.message} (Code: ${error.code})`;
    return { profile: null, isNewUser: false, error: errorMessage };
  }
};


/**
 * Creates a user profile in Firestore for a new user, typically after Google Sign-In.
 * @param user The Firebase Auth user object.
 * @param fullName The full name provided by the user.
 * @param username The username chosen by the user.
 * @returns A promise that resolves to the new UserProfile object on success or an error message string on failure.
 */
export const createGoogleUserProfile = async (user: User, fullName: string, username: string): Promise<{profile: UserProfile | null, error: string | null}> => {
    try {
        const userDocRef = doc(db, 'users', user.uid);
        const { email, photoURL } = user;

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const newProfile: UserProfile = {
            uid: user.uid,
            fullName,
            username,
            email: email!,
            photoURL: photoURL || '',
            createdAt: serverTimestamp() as Timestamp,
            thumbnailCount: 0,
            plan: 'Starter',
            remainingGenerations: 0, // No generations until payment
            limitResetDate: Timestamp.fromDate(thirtyDaysFromNow),
            hasPaid: false, // User must pay first
        }

        await setDoc(userDocRef, newProfile);
        
        // Fetch the profile back to resolve server timestamp
        const profileSnap = await getDoc(userDocRef);
        const createdProfile = profileSnap.data() as UserProfile;

        return { profile: createdProfile, error: null };
    } catch (error: any) {
        console.error("Google Profile Creation Error:", error.message);
        return { profile: null, error: "Failed to create user profile. Please try again." };
    }
};

export const signInUserWithEmailAndPassword = async (email: string, pass: string): Promise<{ profile: UserProfile | null, error: string | null }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    if (!userCredential.user) {
      return { profile: null, error: "Login failed, please try again." };
    }
    const profile = await getUserProfile(userCredential.user.uid);
    if (!profile) {
      await signOut(auth); // Sign out to prevent broken state
      return { profile: null, error: "Your user profile is missing. Please sign up again or contact support." };
    }
    return { profile, error: null };
  } catch (error: any) {
    console.error("Email Sign-In Error:", error.code, error.message);
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return { profile: null, error: "Invalid email or password. Please try again." };
        case 'auth/invalid-email':
          return { profile: null, error: "Please enter a valid email address." };
        default:
          return { profile: null, error: "An error occurred during sign in. Please try again." };
    }
  }
};

/**
 * Signs up a new user with full details, creates their profile, and returns the completed profile.
 */
export const signUpWithDetails = async (
    email: string, pass: string, fullName: string, username: string, profileImageFile: File | null
): Promise<{ profile: UserProfile | null, error: string | null }> => {
    // 1. Create the auth user first
    let userCredential;
    try {
        userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
        console.error("Auth creation error:", error.code, error.message);
        if (error.code === 'auth/email-already-in-use') {
            return { profile: null, error: "An account with this email already exists." };
        }
        if (error.code === 'auth/weak-password') {
            return { profile: null, error: "Password should be at least 6 characters." };
        }
        return { profile: null, error: "An error occurred during sign up. Please try again." };
    }

    const user = userCredential.user;
    if (!user) return { profile: null, error: "Failed to create user account." };
    
    const userDocRef = doc(db, 'users', user.uid);

    // 2. Create user profile in Firestore
    try {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        await setDoc(userDocRef, {
            uid: user.uid,
            fullName,
            username,
            email,
            photoURL: '', // Will be updated after image upload
            createdAt: serverTimestamp(),
            thumbnailCount: 0,
            plan: 'Starter',
            remainingGenerations: 0, // No generations until payment
            limitResetDate: Timestamp.fromDate(thirtyDaysFromNow),
            hasPaid: false, // User must pay first
        });
    } catch (error: any) {
        // If Firestore fails, delete the auth user for cleanup
        console.error("Firestore profile creation failed:", error.message);
        await user.delete(); 
        return { profile: null, error: "Failed to create user profile. Please try again." };
    }
    
    // 3. Upload profile image (if provided) and update profile
    if (profileImageFile) {
        try {
            const storageRef = ref(storage, `profileImages/${user.uid}/${profileImageFile.name}`);
            const snapshot = await uploadBytes(storageRef, profileImageFile);
            const photoURL = await getDownloadURL(snapshot.ref);
            await updateDoc(doc(db, 'users', user.uid), { photoURL });
        } catch (storageError: any) {
            console.error("Profile image upload failed:", storageError);
        }
    }
    
    // 4. Fetch the newly created profile to get the final object with server timestamp
    try {
        const profileSnap = await getDoc(userDocRef);
        if (!profileSnap.exists()) {
             throw new Error("Could not retrieve newly created profile.");
        }
        const createdProfile = profileSnap.data() as UserProfile;
        return { profile: createdProfile, error: null }; // Success
    } catch(fetchError: any) {
        console.error("Failed to fetch new profile:", fetchError);
        return { profile: null, error: "Profile created, but failed to load session. Please try logging in." };
    }
};

/**
 * Updates a user's profile.
 */
export const updateUserProfile = async (
  uid: string, 
  currentUsername: string,
  newData: { fullName: string; username: string },
  newImageFile: File | null
): Promise<{ success: boolean; message: string; newProfileData?: Partial<UserProfile> }> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    let newPhotoURL: string | undefined = undefined;

    // 1. Upload new image if it exists
    if (newImageFile) {
      const storageRef = ref(storage, `profileImages/${uid}/${newImageFile.name}`);
      const snapshot = await uploadBytes(storageRef, newImageFile);
      newPhotoURL = await getDownloadURL(snapshot.ref);
    }

    const finalUpdateData: Partial<UserProfile> = {
      fullName: newData.fullName,
      username: newData.username,
    };
    if (newPhotoURL) {
      finalUpdateData.photoURL = newPhotoURL;
    }

    // 2. Perform the final update for all changed fields
    if (Object.keys(finalUpdateData).length > 0) {
        await updateDoc(userDocRef, finalUpdateData);
    }

    return { success: true, message: "Profile updated successfully!", newProfileData: finalUpdateData };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { success: false, message: "Failed to update profile. Please try again." };
  }
};


export const signOutUser = async (): Promise<string | null> => {
  try {
    await signOut(auth);
    return null;
  } catch (error: any) {
    console.error("Sign Out Error:", error.message);
    return error.message;
  }
};

/**
 * Atomically increments the user's total thumbnail count in Firestore.
 * @param uid The user's unique ID.
 */
export const incrementUserThumbnailCount = async (uid: string) => {
  if (!uid) return;
  const userDocRef = doc(db, 'users', uid);
  try {
    await updateDoc(userDocRef, {
      thumbnailCount: increment(1)
    });
  } catch (error) {
    console.error("Failed to increment thumbnail count:", error);
  }
};

/**
 * Atomically decrements the user's remaining generations for the month.
 * @param uid The user's unique ID.
 */
export const decrementUserGenerations = async (uid: string) => {
    if (!uid) return;
    const userDocRef = doc(db, 'users', uid);
    try {
        await updateDoc(userDocRef, {
            remainingGenerations: increment(-1)
        });
    } catch (error) {
        console.error("Failed to decrement remaining generations:", error);
        // This is a critical action, but we'll let the UI handle potential sync issues
        // on the next load rather than throwing an error and breaking the user flow.
    }
};

/**
 * Updates user's payment status and plan after successful payment.
 * @param uid The user's unique ID.
 * @param plan The plan they purchased.
 * @returns A promise that resolves to success status.
 */
export const updatePaymentStatus = async (uid: string, plan: UserProfile['plan']): Promise<{ success: boolean; error?: string }> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        await updateDoc(userDocRef, {
            hasPaid: true,
            plan: plan,
            remainingGenerations: PLAN_LIMITS[plan],
            limitResetDate: Timestamp.fromDate(thirtyDaysFromNow),
            paymentDate: serverTimestamp() as Timestamp,
        });
        
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update payment status:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Checks if the user's generation limit needs to be reset (if a month has passed)
 * and updates it in Firestore if necessary.
 * @param profile The user's current profile object.
 * @returns A promise that resolves to the (potentially updated) user profile.
 */
export const checkAndResetGenerationLimit = async (profile: UserProfile): Promise<UserProfile> => {
    // Only reset if user has paid
    if (!profile.hasPaid) {
        return profile;
    }
    
    const now = new Date();
    // Check if limitResetDate exists and is in the past
    if (profile.limitResetDate && profile.limitResetDate.toDate() < now) {
        console.log(`Resetting generation limit for user ${profile.uid}`);
        const newLimit = PLAN_LIMITS[profile.plan] || PLAN_LIMITS['Starter'];
        const newResetDate = new Date();
        newResetDate.setDate(newResetDate.getDate() + 30);

        const userDocRef = doc(db, 'users', profile.uid);
        try {
            await updateDoc(userDocRef, {
                remainingGenerations: newLimit,
                limitResetDate: Timestamp.fromDate(newResetDate)
            });
            // Return the updated profile to sync the client state immediately
            return { ...profile, remainingGenerations: newLimit, limitResetDate: Timestamp.fromDate(newResetDate) };
        } catch (error) {
            console.error("Failed to reset generation limit:", error);
            // If the update fails, return the old profile to avoid a broken state
            return profile;
        }
    }
    // No reset needed, return the profile as is
    return profile;
};
