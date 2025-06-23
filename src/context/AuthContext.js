import { createContext, useContext, useState, useEffect } from "react";
import { fetchAllCourses, getUsersDashboard } from "../services";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUserLeaderboard();
      fetchAdminAllCourses();
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const fetchUserLeaderboard = async () => {
    try {
      const data = await getUsersDashboard();
      console.log("DAta ", data)
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const fetchAdminAllCourses = async () => {
    try {
      const data = await fetchAllCourses();
      if (data?.success) {
        setCourses(data);
      }
    } catch (err) {
      toast.err(err.message);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, leaderboard, courses, fetchAdminAllCourses }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
