import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./admincourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../index";
import { FaPlus, FaUpload, FaTimes } from "react-icons/fa";

const categories = [
  "Web Development",
  "Mobile Development",
  "Game Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "DevOps",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Digital Marketing"
];

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { courses, fetchCourses } = CourseData();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (courses) {
      setFilteredCourses(courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [courses, searchTerm]);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      await fetchCourses();
      resetForm();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response.data.message || "Failed to add course");
    } finally {
      setBtnLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPrice("");
    setCreatedBy("");
    setDuration("");
    setImage("");
    setImagePrev("");
  };

  return (
    <div className="admin-courses">
      <Layout role="Admin">
      <div className="admin-courses-container">
        <div className="admin-courses-header">
          <h1>Course Management</h1>
          <div className="admin-courses-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="add-course-btn"
              onClick={() => setShowModal(true)}
            >
              <FaPlus /> Add New Course
            </button>
          </div>
        </div>

        <div className="admin-courses-grid">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <div className="no-courses">
              <p>No courses found</p>
              <button 
                className="add-course-btn small" 
                onClick={() => setShowModal(true)}
              >
                <FaPlus /> Add your first course
              </button>
            </div>
          )}
        </div>

        {/* Course Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Course</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={submitHandler} className="course-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Course Title</label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter course title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option value={cat} key={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="price">Price (₹)</label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Duration (hours)</label>
                    <input
                      type="number"
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Enter duration"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="createdBy">Instructor Name</label>
                    <input
                      type="text"
                      id="createdBy"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Course Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed course description"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-group file-upload">
                  <label htmlFor="file">
                    <div className="upload-area">
                      <FaUpload />
                      <span>Upload Course Image</span>
                    </div>
                  </label>
                  <input 
                    type="file" 
                    id="file" 
                    onChange={changeImageHandler}
                    accept="image/*"
                    required 
                  />
                </div>
                
                {imagePrev && (
                  <div className="image-preview">
                    <img src={imagePrev} alt="Course Preview" />
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={btnLoading}
                >
                  {btnLoading ? "Creating Course..." : "Create Course"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
    </div>
  );
};

export default AdminCourses;
