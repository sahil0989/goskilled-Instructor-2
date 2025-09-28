import { createContext, useContext, useState, useEffect } from "react";
import { fetchAllCourses, getUsersDashboard } from "../services";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [courses, setCourses] = useState(null)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUserLeaderboard();
      fetchAdminAllCourses();
      fetchDashboardAnalysis()
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

  const fetchDashboardAnalysis = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/analytics`);
      console.log(res.data);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <AuthContext.Provider value={{ user, login, logout, leaderboard, courses, fetchAdminAllCourses, fetchUserLeaderboard, data, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
