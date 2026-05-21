import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useDatabase } from "./DatabaseContext";

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const stored = sessionStorage.getItem("limeeaux_user");
    if (!stored) return { user: null, role: null };
    const parsed = JSON.parse(stored);
    return { user: parsed.user ?? null, role: parsed.role ?? null };
  } catch {
    return { user: null, role: null };
  }
}

export function AuthProvider({ children }) {
  const stored = readStoredSession();
  const [user, setUser] = useState(stored.user);
  const [role, setRole] = useState(stored.role);
  const [loading] = useState(false);
  const { users, registerUser } = useDatabase();

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    sessionStorage.removeItem("limeeaux_user");
  }, []);

  useEffect(() => {
    if (!user || users.length === 0) return;
    const dbUser = users.find((u) => u.uid === user.uid);
    if (dbUser?.status === "suspended") {
      const timer = setTimeout(() => {
        logout();
        alert("Session Terminated: Your account has been suspended by the administrator.");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [users, user, logout]);

  const loginWithGoogle = async (selectedRole = "rider") => {
    let mockUser = {
      uid: `mock-uid-google-rider-${Math.floor(Math.random() * 1000)}`,
      displayName: "Guest Rider",
      email: "guest@limeeaux.app",
      photoURL: null,
      provider: "google",
    };

    if (selectedRole === "admin") {
      mockUser = {
        uid: "mock-uid-google",
        displayName: "Limeeaux Admin",
        email: "admin@limeeaux.app",
        photoURL: null,
        provider: "google",
      };
    } else if (selectedRole === "driver") {
      mockUser = {
        uid: "driver-marcus",
        displayName: "Marcus Williams",
        email: "marcus@driver.io",
        photoURL: null,
        provider: "google",
      };
    } else if (selectedRole === "rider") {
      mockUser = {
        uid: "rider-samantha",
        displayName: "Samantha Liu",
        email: "sam.liu@mail.com",
        photoURL: null,
        provider: "google",
      };
    }

    const dbProfile = registerUser({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: selectedRole,
    });

    if (dbProfile.status === "suspended") {
      throw new Error("This account is suspended and cannot log in.");
    }

    setUser(mockUser);
    setRole(selectedRole);
    sessionStorage.setItem("limeeaux_user", JSON.stringify({ user: mockUser, role: selectedRole }));
    return mockUser;
  };

  const loginWithPhone = async (phone, otp, selectedRole = "rider") => {
    if (otp !== "000000" && otp.length !== 6) throw new Error("Invalid OTP");

    const uid = `mock-uid-phone-${phone}`;
    const existingUser = users.find((u) => u.uid === uid);
    if (existingUser?.status === "suspended") {
      throw new Error("This account is suspended and cannot log in.");
    }

    const mockUser = {
      uid,
      displayName:
        selectedRole === "driver" ? `Driver (${phone.slice(-4)})` : `Rider (${phone.slice(-4)})`,
      email: `${phone}@phone.limeeaux.app`,
      photoURL: null,
      provider: "phone",
      phoneNumber: phone,
    };

    registerUser({
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      role: selectedRole,
    });

    setUser(mockUser);
    setRole(selectedRole);
    sessionStorage.setItem("limeeaux_user", JSON.stringify({ user: mockUser, role: selectedRole }));
    return mockUser;
  };

  const updateRole = (newRole) => {
    setRole(newRole);
    if (user) {
      sessionStorage.setItem("limeeaux_user", JSON.stringify({ user, role: newRole }));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, loginWithGoogle, loginWithPhone, logout, updateRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
