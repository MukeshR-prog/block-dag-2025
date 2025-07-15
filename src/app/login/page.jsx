"use client";

import api from "../../lib/axios";
import {
  signInWithPopup,
  signOut,
  provider,
  auth,
} from "../../lib/firebase";
import useAuthStore from "../../store/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, setUser, logout: clearUser } = useAuthStore();
  const router = useRouter();


const checkAndCreateUser = async (firebaseUser) => {
  try {
    const res = await api.post("/users", {
      uid: firebaseUser.uid,
      username: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    });

    console.log("API response:", res.data);
  } catch (err) {
    console.error("API error:", err.response?.data || err.message);
  }
};

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await checkAndCreateUser(result.user);
      
      // Update the auth store with user data
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
      
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      clearUser();
      console.log("User logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Login Page</h1>
      {!user ? (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login with Google
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600">Welcome, {user.displayName}!</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
