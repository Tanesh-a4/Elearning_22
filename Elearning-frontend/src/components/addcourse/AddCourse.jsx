import React, { useState } from "react";
import axios from "axios";
import { server } from "../../index";
import { UserData } from "../../context/UserContext";
import Layout from "../../admin/Utils/Layout";
import "./AddCourse.css";
import { FaCloudUploadAlt, FaSpinner, FaCheck } from "react-icons/fa";

const AddCourse = () => {
  const { user } = UserData();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Predefined categories
  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Digital Marketing"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("category", category);
    formData.append("createdBy", user.name);
    formData.append("file", image);

    try {
      const response = await axios.post(`${server}/api/course/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setPrice("");
        setDuration("");
        setCategory("");
        setImage(null);
        setImagePreview("");

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding course", error);
      alert("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="add-course-container">
        <div className="add-course-form">
          <div className="form-header">
            <h2>Add a New Course</h2>
            <p>Fill in the details below to create a new course</p>
          </div>
          
          {success && (
            <div className="success-message">
              <FaCheck /> Course added successfully!
            </div>
          )}
          
          <form onSubmit={handleAddCourse} encType="multipart/form-data">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Course Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Advanced React Development"
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
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Course Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Provide a detailed description of your course..."
                rows={5}
              />
            </div>

            <div className="form-group image-input-group">
              <label htmlFor="file">Upload Course Image</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Course Preview" />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  placeholder="e.g. 1999"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (hours)</label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  min="1"
                  placeholder="e.g. 30"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <>
                  <FaSpinner className="spinner" /> Adding Course...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt /> Add Course
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddCourse;
