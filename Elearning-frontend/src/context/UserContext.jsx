import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { server } from "../index.js";
import toast, { Toaster } from "react-hot-toast";

const userContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [errorTeachers, setErrorTeachers] = useState(null);
  const [teacherDashboardData, setTeacherDashboardData] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [isOffline, setIsOffline] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine ? 'online' : 'offline');

  const controllerRef = useRef(null);
  const hasFetchedUser = useRef(false);
  
  // Retry tracking for teachers
  const teachersRetryCount = useRef(0);
  const teachersLastRetry = useRef(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  // Network status monitoring  
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      setNetworkStatus('offline');
      setIsOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper function to check if error is network-related
  const isNetworkError = (error) => {
    return error.code === 'ERR_NETWORK' || 
           error.code === 'ERR_CONNECTION_REFUSED' || 
           error.message === 'Network Error' ||
           !navigator.onLine;
  };

  // ---- LOGIN ----
  const loginUser = async (email, password, navigate, fetchMyCourse) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email, password });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setIsOffline(false);
      hasFetchedUser.current = false; // Allow fresh fetch after login
      navigate("/");
      fetchMyCourse();
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOffline(true);
        // Stay silent, keep loading state active
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  // ---- REGISTER ----
  const registerUser = async (name, email, password, navigate) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, { name, email, password });
      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setIsOffline(false);
      navigate("/verify");
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOffline(true);
        // Stay silent, keep loading state
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  // ---- VERIFY OTP ----
  const verifyOtp = async (otp, navigate) => {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, { otp, activationToken });
      toast.success(data.message);
      localStorage.clear();
      setIsOffline(false);
      navigate("/login");
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOffline(true);
        // Stay silent, keep loading state
      } else {
        toast.error(error.response?.data?.message || "OTP verification failed");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  // ---- FETCH USER ----
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || hasFetchedUser.current) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    hasFetchedUser.current = true;

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token },
        timeout: 10000, // 10 second timeout
      });
      setUser(data.user);
      setIsAuth(true);
      setIsOffline(false);
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOffline(true);
        // Check if we have cached user data
        const cachedUser = localStorage.getItem("cachedUser");
        if (cachedUser) {
          try {
            const userData = JSON.parse(cachedUser);
            setUser(userData);
            setIsAuth(true);
          } catch (e) {
            setIsAuth(false);
          }
        } else {
          setIsAuth(false);
        }
      } else {
        setIsOffline(false);
        setIsAuth(false);
        // Clear invalid token
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("cachedUser");
        }
      }
      hasFetchedUser.current = false; // Allow retry
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- FETCH TEACHERS ----
  const fetchTeachers = useCallback(async (retryCount = 0) => {
    if (loadingTeachers) return;

    setLoadingTeachers(true);
    setErrorTeachers(null);

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${server}/api/user/teachers`, {
        headers: { token },
        signal: controller.signal,
        timeout: 10000,
      });

      if (Array.isArray(response?.data?.teachers)) {
        setTeachers(response.data.teachers);
        setIsOffline(false);
        // Cache teachers data
        localStorage.setItem("cachedTeachers", JSON.stringify(response.data.teachers));
      } else {
        setTeachers([]);
      }
    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError") return;
      
      if (isNetworkError(error)) {
        setIsOffline(true);
        // Use cached teachers if available
        const cachedTeachers = localStorage.getItem("cachedTeachers");
        if (cachedTeachers) {
          try {
            const teachersData = JSON.parse(cachedTeachers);
            setTeachers(teachersData);
          } catch (e) {
            setTeachers([]);
          }
        } else {
          setTeachers([]);
        }
        // Don't set error message, keep loading state
      } else {
        // Non-network errors - no automatic retry
        setTeachers([]);
      }
    } finally {
      setLoadingTeachers(false);
    }
  }, [loadingTeachers]);

  // ---- FETCH TEACHER DASHBOARD ----
  const fetchTeacherDashboard = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get(`${server}/api/teacher/${user._id}/dashboard`, {
        headers: { token: localStorage.getItem("token") },
        timeout: 10000,
      });
      setTeacherDashboardData(data.data);
      setIsOffline(false);
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOffline(true);
        // Stay silent, keep existing data
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      }
    }
  }, [user]);

  // ---- FETCH TEACHER COURSES ----
  const fetchTeacherCourses = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/teacher/${user._id}/courses`, {
        headers: { token: localStorage.getItem("token") },
        timeout: 10000,
      });
      setTeacherCourses(data.data || []);
      setIsOffline(false);
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
      if (isNetworkError(error)) {
        setIsOffline(true);
        setTeacherCourses([]); // Show empty state when offline
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ---- LOGOUT ----
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cachedUser");
    localStorage.removeItem("cachedTeachers");
    setUser(null);
    setIsAuth(false);
    setIsOffline(false);
    hasFetchedUser.current = false;
    toast.success("Logged out successfully");
  };

  // Cache user data when user changes
  useEffect(() => {
    if (user && isAuth) {
      localStorage.setItem("cachedUser", JSON.stringify(user));
    }
  }, [user, isAuth]);

  // ---- INITIAL LOAD ----
  useEffect(() => {
    fetchUser();
    fetchTeachers();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - run only once on mount

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loginUser,
        logoutUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        teachers,
        fetchTeachers,
        fetchTeacherDashboard,
        teacherDashboardData,
        teacherCourses,
        fetchTeacherCourses,
        loadingTeachers,
        errorTeachers,
        isOffline, // Expose offline status
        networkStatus, // Expose network status
      }}
    >
      {children}
      <Toaster />
    </userContext.Provider>
  );
};

export const UserData = () => useContext(userContext);
