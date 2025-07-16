import { createContext, useContext, useState, useEffect } from "react";
import { fetchAllCourses, getUsersDashboard } from "../services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [courses, setCourses] = useState(null)
  const navigate = useNavigate();

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
    navigate('/')
  };

  const fetchUserLeaderboard = async () => {
    try {
      const data = await getUsersDashboard();

      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const fetchAdminAllCourses = async () => {
    try {
      const data = await fetchAllCourses();
      if (data?.success) {
        setCourses(data.data);
      }
    } catch (err) {
      toast.err(err.message);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, leaderboard, courses, fetchAdminAllCourses,fetchUserLeaderboard }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
