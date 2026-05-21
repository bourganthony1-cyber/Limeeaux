import React, { createContext, useContext, useState, useEffect } from "react";

const DatabaseContext = createContext(null);

const DEFAULT_USERS = [
  { uid: "mock-uid-google", name: "Limeeaux Admin", email: "admin@limeeaux.app", role: "admin", status: "active", joined: "Jan 2026", trips: 0, rating: 5.0 },
  { uid: "driver-marcus", name: "Marcus Williams", email: "marcus@driver.io", role: "driver", status: "active", joined: "Feb 2026", trips: 2341, rating: 4.98, vehicle: "Toyota Camry", license: "ABC 1234" },
  { uid: "rider-samantha", name: "Samantha Liu", email: "sam.liu@mail.com", role: "rider", status: "active", joined: "Mar 2026", trips: 142, rating: 4.8 },
  { uid: "driver-priya", name: "Priya Kapoor", email: "priya.k@driver.net", role: "driver", status: "active", joined: "Feb 2026", trips: 1022, rating: 4.95, vehicle: "Tesla Model 3", license: "TSLA 777" },
  { uid: "rider-james", name: "James Carter", email: "jcarter@gmail.com", role: "rider", status: "suspended", joined: "Apr 2026", trips: 8, rating: 2.1 },
  { uid: "driver-aisha", name: "Aisha Moore", email: "aisha.m@driver.io", role: "driver", status: "active", joined: "Mar 2026", trips: 789, rating: 4.87, vehicle: "Honda Accord", license: "XYZ 9876" },
  { uid: "rider-tom", name: "Tom Harris", email: "tom.h@mail.com", role: "rider", status: "active", joined: "May 2026", trips: 24, rating: 4.6 }
];

const DEFAULT_RIDES = [
  { id: "RD-8840", riderId: "rider-samantha", riderName: "Samantha Liu", driverId: "driver-marcus", driverName: "Marcus W.", from: "Main & 5th", to: "City Park", fare: "$11.20", status: "completed", date: "May 20, 2026", time: "9:14 AM", rating: 5, type: "standard" },
  { id: "RD-8839", riderId: "driver-priya", riderName: "Priya K.", driverId: "driver-aisha", driverName: "Aisha M.", from: "Airport T1", to: "Grand Hotel", fare: "$22.80", status: "completed", date: "May 19, 2026", time: "6:45 PM", rating: 4, type: "comfort" },
  { id: "RD-8838", riderId: "rider-james", riderName: "James C.", driverId: "driver-luis", driverName: "Luis R.", from: "Downtown", to: "Suburbs", fare: "$13.60", status: "cancelled", date: "May 19, 2026", time: "2:30 PM", rating: null, type: "comfort" },
  { id: "RD-8837", riderId: "mock-uid-google", riderName: "Admin", driverId: "driver-carlos", driverName: "Carlos D.", from: "Home", to: "Gym Central", fare: "$5.40", status: "completed", date: "May 18, 2026", time: "8:00 AM", rating: 5, type: "green" },
  { id: "RD-8836", riderId: "rider-maria", riderName: "Maria S.", driverId: "driver-priya", driverName: "Priya K.", from: "Coffee Dist.", to: "Midtown", fare: "$9.90", status: "completed", date: "May 18, 2026", time: "10:45 PM", rating: 3, type: "standard" },
  { id: "RD-8835", riderId: "rider-tom", riderName: "Tom H.", driverId: "driver-sam", driverName: "Sam T.", from: "Skybar", to: "Home", fare: "$13.60", status: "completed", date: "May 17, 2026", time: "11:00 AM", rating: 4, type: "standard" }
];

export function DatabaseProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);

  // Create BroadcastChannel for real-time synchronization
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const bc = new BroadcastChannel("limeeaux_db_channel");
    setChannel(bc);

    bc.onmessage = (event) => {
      if (event.data?.type === "UPDATE_DB") {
        loadData();
      }
    };

    // Listen to native storage events (useful fallback and cross-tab check)
    const handleStorageChange = (e) => {
      if (e.key === "limeeaux_db_users" || e.key === "limeeaux_db_rides") {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Initial load
    loadData();

    return () => {
      bc.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const loadData = () => {
    let localUsers = localStorage.getItem("limeeaux_db_users");
    let localRides = localStorage.getItem("limeeaux_db_rides");

    if (!localUsers) {
      localStorage.setItem("limeeaux_db_users", JSON.stringify(DEFAULT_USERS));
      localUsers = JSON.stringify(DEFAULT_USERS);
    }
    if (!localRides) {
      localStorage.setItem("limeeaux_db_rides", JSON.stringify(DEFAULT_RIDES));
      localRides = JSON.stringify(DEFAULT_RIDES);
    }

    setUsers(JSON.parse(localUsers));
    setRides(JSON.parse(localRides));
  };

  const broadcastUpdate = () => {
    if (channel) {
      channel.postMessage({ type: "UPDATE_DB" });
    }
  };

  const saveUsers = (newUsers) => {
    localStorage.setItem("limeeaux_db_users", JSON.stringify(newUsers));
    setUsers(newUsers);
    broadcastUpdate();
  };

  const saveRides = (newRides) => {
    localStorage.setItem("limeeaux_db_rides", JSON.stringify(newRides));
    setRides(newRides);
    broadcastUpdate();
  };

  // ── Database Methods ──

  const registerUser = (userProfile) => {
    const exists = users.find((u) => u.uid === userProfile.uid);
    if (exists) return exists;

    const newUser = {
      uid: userProfile.uid,
      name: userProfile.displayName || userProfile.name || "User",
      email: userProfile.email || "no-email@limeeaux.app",
      role: userProfile.role || "rider",
      status: "active",
      joined: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" }),
      trips: 0,
      rating: 5.0,
      vehicle: userProfile.role === "driver" ? "Tesla Model Y" : undefined,
      license: userProfile.role === "driver" ? "LMX 0001" : undefined
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    return newUser;
  };

  const suspendUser = (uid) => {
    const updated = users.map((u) => (u.uid === uid ? { ...u, status: "suspended" } : u));
    saveUsers(updated);

    // Cancel all active rides associated with this suspended user
    const updatedRides = rides.map((r) => {
      if ((r.riderId === uid || r.driverId === uid) && r.status !== "completed" && r.status !== "cancelled") {
        return { ...r, status: "cancelled", cancelReason: "User account suspended by administrator" };
      }
      return r;
    });
    saveRides(updatedRides);
  };

  const activateUser = (uid) => {
    const updated = users.map((u) => (u.uid === uid ? { ...u, status: "active" } : u));
    saveUsers(updated);
  };

  const requestRide = (riderId, riderName, from, to, type, fareStr) => {
    const newRide = {
      id: "RD-" + Math.floor(1000 + Math.random() * 9000),
      riderId,
      riderName,
      driverId: null,
      driverName: null,
      from,
      to,
      fare: fareStr,
      status: "requested",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      rating: null,
      type,
      eta: 5
    };

    const updated = [newRide, ...rides];
    saveRides(updated);
    return newRide;
  };

  const acceptRide = (rideId, driverId, driverName) => {
    const updated = rides.map((r) => {
      if (r.id === rideId) {
        return {
          ...r,
          status: "accepted",
          driverId,
          driverName,
          eta: 4
        };
      }
      return r;
    });
    saveRides(updated);
  };

  const updateRideStatus = (rideId, status) => {
    const updated = rides.map((r) => {
      if (r.id === rideId) {
        let etaVal = r.eta;
        if (status === "enroute") etaVal = 3;
        if (status === "arriving") etaVal = 1;
        if (status === "arrived") etaVal = 0;
        if (status === "completed") etaVal = 0;

        return { ...r, status, eta: etaVal };
      }
      return r;
    });
    saveRides(updated);

    // If ride is completed, increment trips for both rider and driver in the users list
    if (status === "completed") {
      const targetRide = rides.find((r) => r.id === rideId);
      if (targetRide) {
        const uidsToIncrement = [targetRide.riderId, targetRide.driverId].filter(Boolean);
        const updatedUsers = users.map((u) => {
          if (uidsToIncrement.includes(u.uid)) {
            return { ...u, trips: (u.trips || 0) + 1 };
          }
          return u;
        });
        saveUsers(updatedUsers);
      }
    }
  };

  const submitRating = (rideId, ratingVal) => {
    const targetRide = rides.find((r) => r.id === rideId);
    const updatedRides = rides.map((r) => {
      if (r.id === rideId) {
        return { ...r, rating: ratingVal };
      }
      return r;
    });
    saveRides(updatedRides);

    // Update driver's average rating in users table
    if (targetRide && targetRide.driverId) {
      const driverId = targetRide.driverId;
      const driverRides = updatedRides.filter((r) => r.driverId === driverId && r.rating !== null);
      if (driverRides.length > 0) {
        const sum = driverRides.reduce((acc, r) => acc + r.rating, 0);
        const avg = parseFloat((sum / driverRides.length).toFixed(2));

        const updatedUsers = users.map((u) => {
          if (u.uid === driverId) {
            return { ...u, rating: avg };
          }
          return u;
        });
        saveUsers(updatedUsers);
      }
    }
  };

  const cancelRide = (rideId, cancelledBy = "system") => {
    const updated = rides.map((r) => {
      if (r.id === rideId) {
        return { ...r, status: "cancelled", cancelReason: `Ride cancelled by ${cancelledBy}` };
      }
      return r;
    });
    saveRides(updated);
  };

  return (
    <DatabaseContext.Provider
      value={{
        users,
        rides,
        registerUser,
        suspendUser,
        activateUser,
        requestRide,
        acceptRide,
        updateRideStatus,
        submitRating,
        cancelRide
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
