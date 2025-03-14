import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState([]);
    const [mycourse, setMyCourse] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);

    async function fetchCourses() {
        try {
            const { data } = await axios.get(`${server}/api/course/all`);
            setCourses(data.courses);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchCourse(id) {
        try {
            const { data } = await axios.get(`${server}/api/course/${id}`);
            setCourse(data.course);
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            setIsAuth(true);
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const fetchMyCourse = async () => {
        if (!user || !user._id) {
            console.error("User ID is undefined, skipping course fetch.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${server}/api/teacher/${user._id}/courses`, {
                headers: { token: localStorage.getItem("token") }
            });
            setMyCourse(data.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserCourses = async () => {
        if (!user || !user._id) {
            console.error("User ID is undefined, skipping course fetch.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${server}/api/user/${user._id}/courses`, {
                headers: { token: localStorage.getItem("token") }
            });
            setUserCourses(data.courses); // Assuming API returns courses array
        } catch (error) {
            console.error("Error fetching user courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchCourses();
    }, []);

    useEffect(() => {
        if (user && user._id) {
            fetchUserCourses();
        }
    }, [user]);

    return (
        <CourseContext.Provider value={{
            courses, fetchCourses, fetchCourse, course,
            mycourse, fetchMyCourse, userCourses, fetchUserCourses
        }}>
            {children}
        </CourseContext.Provider>
    );
};

export const CourseData = () => useContext(CourseContext);
