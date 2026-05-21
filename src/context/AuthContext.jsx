import React, { createContext, useContext, useEffect, useState } from "react";
import { useDatabase } from "./DatabaseContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [role, setRole]       = useState(null); // "rider" | "driver" | "admin"
  const [loading, setLoading] = useState(true);
  const { users, registerUser } = useDatabase();

  useEffect(() => {
    // Check sessionStorage for persisted mock session (per-tab isolation)
    const stored = sessionStorage.getItem("rideflow_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setRole(parsed.role);
    }
    setLoading(false);
  }, []);

  // Enforce suspension in real-time across tabs
  useEffect(() => {
    if (user && users.length > 0) {
      const dbUser = users.find((u) => u.uid === user.uid);
      if (dbUser && dbUser.status === "suspended") {
        logout();
        // Delay alert slightly to avoid React rendering loop errors
        setTimeout(() => {
          alert("Session Terminated: Your account has been suspended by the administrator.");
        }, 100);
      }
    }
  }, [users, user]);

  const loginWithGoogle = async (selectedRole = "rider") => {
    // Standard mock credentials mapping to default DB users for instant dashboard demo
    let mockUser = {
      uid: "mock-uid-google-rider-" + Math.floor(Math.random() * 1000),
      displayName: "Guest Rider",
      email: "guest@rideflow.app",
      photoURL: null,
      provider: "google",
    };

    if (selectedRole === "admin") {
      mockUser = {
        uid: "mock-uid-google", // Anthony Bourg (admin)
        displayName: "Anthony Bourg",
        email: "anthony@rideflow.app",
        photoURL: null,
        provider: "google",
      };
    } else if (selectedRole === "driver") {
      mockUser = {
        uid: "driver-marcus", // Marcus Williams
        displayName: "Marcus Williams",
        email: "marcus@driver.io",
        photoURL: null,
        provider: "google",
      };
    } else if (selectedRole === "rider") {
      mockUser = {
        uid: "rider-samantha", // Samantha Liu
        displayName: "Samantha Liu",
        email: "sam.liu@mail.com",
        photoURL: null,
        provider: "google",
      };
    }

    // Register user in our simulated DB
    const dbProfile = registerUser({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: selectedRole
    });

    if (dbProfile.status === "suspended") {
      throw new Error("This account is suspended and cannot log in.");
    }

    setUser(mockUser);
    setRole(selectedRole);
    sessionStorage.setItem("rideflow_user", JSON.stringify({ user: mockUser, role: selectedRole }));
    return mockUser;
  };

  const loginWithPhone = async (phone, otp, selectedRole = "rider") => {
    if (otp !== "000000" && otp.length !== 6) throw new Error("Invalid OTP");

    const uid = `mock-uid-phone-${phone}`;
    
    // Check if user is suspended in DB first
    const existingUser = users.find(u => u.uid === uid);
    if (existingUser && existingUser.status === "suspended") {
      throw new Error("This account is suspended and cannot log in.");
    }

    const mockUser = {
      uid,
      displayName: selectedRole === "driver" ? `Driver (${phone.slice(-4)})` : `Rider (${phone.slice(-4)})`,
      email: `${phone}@phone.rideflow.app`,
      photoURL: null,
      provider: "phone",
      phoneNumber: phone,
    };

    // Register user in our simulated DB
    registerUser({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: selectedRole
    });

    setUser(mockUser);
    setRole(selectedRole);
    sessionStorage.setItem("rideflow_user", JSON.stringify({ user: mockUser, role: selectedRole }));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem("rideflow_user");
  };

  const updateRole = (newRole) => {
    setRole(newRole);
    if (user) {
      sessionStorage.setItem("rideflow_user", JSON.stringify({ user, role: newRole }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, loginWithPhone, logout, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
