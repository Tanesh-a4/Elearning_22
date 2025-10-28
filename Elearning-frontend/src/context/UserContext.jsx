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

  const controllerRef = useRef(null);

  // ---- LOGIN ----
  const loginUser = async (email, password, navigate, fetchMyCourse) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email, password });
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      navigate("/");
      fetchMyCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // ---- FETCH USER ----
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token: localStorage.getItem("token") },
      });
      setUser(data.user);
      setIsAuth(true);
    } catch {
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---- FETCH TEACHERS ----
  const fetchTeachers = useCallback(async (retryCount = 0) => {
    if (loadingTeachers) return;

    setLoadingTeachers(true);
    setErrorTeachers(null);

    // cancel previous request if any
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${server}/api/user/teachers`, {
        headers: { token },
        signal: controller.signal,
        timeout: 7000, // safety timeout
      });

      if (Array.isArray(response?.data?.teachers)) {
        setTeachers(response.data.teachers);
      } else {
        console.warn("Unexpected response structure", response.data);
        setTeachers([]);
      }
    } catch (error) {
      if (axios.isCancel(error) || error.name === "CanceledError") return;
      console.warn("Teacher fetch failed:", error.message);

      if (retryCount < 3) {
        const delay = 1000 * Math.pow(2, retryCount);
        console.log(`Retrying fetchTeachers in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
        return fetchTeachers(retryCount + 1);
      }

      setErrorTeachers("Unable to fetch teachers right now.");
      // Gracefully handle with toast *once*
      if (!retryCount) toast("Server unavailable. Showing loading state...");
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
      });
      setTeacherDashboardData(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  }, [user]);

  // ---- FETCH TEACHER COURSES ----
  const fetchTeacherCourses = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/teacher/${user._id}/courses`, {
        headers: { token: localStorage.getItem("token") },
      });
      setTeacherCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ---- INITIAL LOAD ----
  useEffect(() => {
    fetchUser();
    fetchTeachers();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchUser, fetchTeachers]);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        loginUser,
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
      }}
    >
      {children}
      <Toaster />
    </userContext.Provider>
  );
};

export const UserData = () => useContext(userContext);
