import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { server } from "../index";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState([]);
    const [mycourse, setMyCourse] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [isOffline, setIsOffline] = useState(false);

    // Request cancellation refs
    const coursesControllerRef = useRef(null);
    const courseControllerRef = useRef(null);
    const userControllerRef = useRef(null);
    const myCoursesControllerRef = useRef(null);
    const userCoursesControllerRef = useRef(null);

    // Request deduplication flags
    const fetchingCourses = useRef(false);
    const fetchingUser = useRef(false);
    
    // Retry tracking
    const coursesRetryCount = useRef(0);
    const coursesLastRetry = useRef(0);
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds

    // Helper function to check if error is network-related
    const isNetworkError = (error) => {
        return error.code === 'ERR_NETWORK' || 
               error.code === 'ERR_CONNECTION_REFUSED' || 
               error.message === 'Network Error' ||
               !navigator.onLine;
    };

    async function fetchCourses() {
        if (fetchingCourses.current) return; // Prevent duplicate requests
        
        // Check retry limit
        const now = Date.now();
        if (coursesRetryCount.current >= MAX_RETRIES) {
            const timeSinceLastRetry = now - coursesLastRetry.current;
            if (timeSinceLastRetry < RETRY_DELAY) {
                return; // Don't retry yet
            }
            // Reset retry count after delay
            coursesRetryCount.current = 0;
        }
        
        fetchingCourses.current = true;
        
        // Cancel previous request if exists
        if (coursesControllerRef.current) coursesControllerRef.current.abort();
        const controller = new AbortController();
        coursesControllerRef.current = controller;

        try {
            const { data } = await axios.get(`${server}/api/course/all`, {
                timeout: 10000,
                signal: controller.signal
            });
            setCourses(data.courses);
            setIsOffline(false);
            // Reset retry count on success
            coursesRetryCount.current = 0;
            // Cache courses data
            localStorage.setItem("cachedCourses", JSON.stringify(data.courses));
        } catch (error) {
            if (axios.isCancel(error) || error.name === "CanceledError") return;
            
            if (isNetworkError(error)) {
                setIsOffline(true);
                coursesRetryCount.current++;
                coursesLastRetry.current = now;
                
                // Use cached courses if available
                const cachedCourses = localStorage.getItem("cachedCourses");
                if (cachedCourses) {
                    try {
                        const coursesData = JSON.parse(cachedCourses);
                        setCourses(coursesData);
                    } catch (e) {
                        setCourses([]);
                    }
                } else {
                    setCourses([]);
                }
            } else {
                setCourses([]);
            }
        } finally {
            fetchingCourses.current = false;
        }
    }

    async function fetchCourse(id) {
        // Cancel previous request if exists
        if (courseControllerRef.current) courseControllerRef.current.abort();
        const controller = new AbortController();
        courseControllerRef.current = controller;

        try {
            const { data } = await axios.get(`${server}/api/course/${id}`, {
                timeout: 10000,
                signal: controller.signal
            });
            setCourse(data.course);
            setIsOffline(false);
        } catch (error) {
            if (axios.isCancel(error) || error.name === "CanceledError") return;
            
            if (isNetworkError(error)) {
                setIsOffline(true);
                setCourse([]);
            } else {
                setCourse([]);
            }
        }
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
                timeout: 10000
            });
            setUser(data.user);
            setLoading(false);
            setIsOffline(false);
        } catch (error) {
            if (isNetworkError(error)) {
                setIsOffline(true);
                // Check for cached user data
                const cachedUser = localStorage.getItem("cachedUser");
                if (cachedUser) {
                    try {
                        const userData = JSON.parse(cachedUser);
                        setUser(userData);
                    } catch (e) {
                        setUser([]);
                    }
                } else {
                    setUser([]);
                }
                // Don't set loading to false when offline - keep loading state
                return;
            } else {
                setUser([]);
            }
            setLoading(false);
        }
    }

    const fetchMyCourse = async () => {
        if (!user || !user._id) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${server}/api/teacher/${user._id}/courses`, {
                headers: { token: localStorage.getItem("token") },
                timeout: 10000
            });
            setMyCourse(data.data);
            setIsOffline(false);
        } catch (error) {
            if (isNetworkError(error)) {
                setIsOffline(true);
                // Keep loading state, don't show empty
                return;
            } else {
                setMyCourse([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCourses = useCallback(async () => {
        if (!user || !user._id) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${server}/api/user/${user._id}/courses`, {
                headers: { token: localStorage.getItem("token") },
                timeout: 10000
            });
            setUserCourses(data.courses || []);
            setIsOffline(false);
        } catch (error) {
            if (isNetworkError(error)) {
                setIsOffline(true);
                // Keep loading state, don't show empty
                return;
            } else {
                setUserCourses([]);
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUser();
        fetchCourses();
        
        // Cleanup function to cancel all requests on unmount
        return () => {
            if (coursesControllerRef.current) coursesControllerRef.current.abort();
            if (courseControllerRef.current) courseControllerRef.current.abort();
            if (userControllerRef.current) userControllerRef.current.abort();
            if (myCoursesControllerRef.current) myCoursesControllerRef.current.abort();
            if (userCoursesControllerRef.current) userCoursesControllerRef.current.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency - run only once on mount

    useEffect(() => {
        if (user && user._id) {
            fetchUserCourses();
        }
    }, [user, fetchUserCourses]);

    return (
        <CourseContext.Provider value={{
            courses,
            fetchCourses,
            fetchCourse,
            course,
            mycourse,
            fetchMyCourse,
            userCourses,
            fetchUserCourses,
            isOffline,
            loading
        }}>
            {children}
        </CourseContext.Provider>
    );
};

export const CourseData = () => useContext(CourseContext);
