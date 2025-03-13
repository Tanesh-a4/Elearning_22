import { createContext, useContext, useEffect, useState } from "react"; 
import axios from 'axios'
import {server} from "../index.js"
import toast, {Toaster} from 'react-hot-toast'

const userContext = createContext();

export const UserContextProvider = ({children})=>{
    const [user, setUser] = useState([])
    const [isAuth, setIsAuth] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    const [teachers, setTeachers] = useState([]);
    const [teacherDashboardData, setTeacherDashboardData] = useState(null);
    const [teacherCourses, setTeacherCourses] = useState([]);

    async function loginUser(email, password, navigate, fetchMyCourse) {
        setBtnLoading(true)
        try{
            
            const {data} = await axios.post(`${server}/api/user/login`, {email, password})
            toast.success(data.message)
            localStorage.setItem("token", data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate("/")
            fetchMyCourse();

        }
        catch(error){
            setBtnLoading(false)
            setIsAuth(false)
            toast.error(error.response.data.message)
            
        }
        
    }

    async function registerUser(name, email, password, navigate) {
        setBtnLoading(true);
        try {
          const { data } = await axios.post(`${server}/api/user/register`, {
            name,
            email,
            password,
          });
    
          toast.success(data.message);
          localStorage.setItem("activationToken", data.activationToken);
          setBtnLoading(false);
          navigate("/verify");
        } catch (error) {
          setBtnLoading(false);
          toast.error(error.response.data.message);
        }
      }
    
      async function verifyOtp(otp, navigate) {
        setBtnLoading(true);
        const activationToken = localStorage.getItem("activationToken");
        try {
          const { data } = await axios.post(`${server}/api/user/verify`, {
            otp,
            activationToken,
          });
    
          toast.success(data.message);
          navigate("/login");
          localStorage.clear();
          setBtnLoading(false);
        } catch (error) {
          toast.error(error.response.data.message);
          setBtnLoading(false);
        }
      }

    async function fetchUser(){
        try{
            const {data} = await axios.get(`${server}/api/user/me`,{
                headers: {
                    token: localStorage.getItem("token"),
                }
            })
            setIsAuth(true)
            setUser(data.user)
            setLoading(false)

        }
        catch(error){
            console.log(error);
            setLoading(false)
            
        }
    }

    async function fetchTeachers() {
      try {
          const { data } = await axios.get(`${server}/api/user/teachers`, {
              headers: { token: localStorage.getItem("token") }
          });
          setTeachers(data.teachers); // Store fetched teachers
      } catch (error) {
          toast.error(error.response.data.message);
      }
  }

  async function fetchTeacherDashboard() {
    try {
      console.log(user)
        const { data } = await axios.get(`${server}/api/teacher/${user._id}/dashboard`, {
            headers: { token: localStorage.getItem("token") },
        });
        setTeacherDashboardData(data.data); // Store fetched dashboard data
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
}

const fetchTeacherCourses = async () => {
  setLoading(true);
  try {
      const { data } = await axios.get(`/api/teacher/${user._id}/courses`, {
          headers: { token: localStorage.getItem("token") }
      });
      setTeacherCourses(data.data); // Store courses data
  } catch (error) {
      console.error("Error fetching teacher courses:", error);
  } finally {
      setLoading(false);
  }
};


    useEffect(()=>{
        fetchUser();
        fetchTeachers()
    }, [])
    return <userContext.Provider value={{ user, setUser, isAuth, setIsAuth,loginUser, btnLoading, loading, registerUser, verifyOtp, teachers,fetchTeachers,fetchTeacherDashboard, teacherDashboardData,teacherCourses, fetchTeacherCourses}}>
        {children}
        <Toaster />
        </userContext.Provider>
}

export const UserData = ()=>useContext(userContext)