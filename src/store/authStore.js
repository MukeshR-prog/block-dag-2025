import { create } from "zustand";
import { persist } from "zustand/middleware";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      logout: () => set({ user: null, loading: false }),
      initializeAuth: () => {
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            set({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              },
              loading: false,
            });
          } else {
            set({ user: null, loading: false });
          }
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
