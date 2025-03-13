import React, { useEffect, useState } from "react";
import "./Lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../index";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { FaPlay, FaPlus, FaTrash, FaCheck, FaTimes, FaUpload, FaVideo } from "react-icons/fa";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setvideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lectLength, setLectLength] = useState("");
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      console.log("Fetched Lectures:", data);
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching lectures:", error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setvideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setvideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="lec-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="lec-progress-bar">
            <div className="lec-progress-info">
              <span className="lec-progress-text">Course Progress</span>
              <span className="lec-progress-stats">
                {completedLec}/{lectLength} Lectures Completed
              </span>
            </div>
            <div className="lec-progress-track">
              <div 
                className="lec-progress-fill"
                style={{ width: `${completed}%` }}
              >
                <span className="lec-progress-percentage">{completed}%</span>
              </div>
            </div>
          </div>

          <div className="lec-content">
            <div className="lec-sidebar">
              <div className="lec-sidebar-header">
                <h2 className="lec-sidebar-title">Course Content</h2>
                {user && (user.role === "admin" || user.role === "teacher") && (
                  <button 
                    className="lec-add-btn"
                    onClick={() => setShow(!show)}
                    aria-label="Add new lecture"
                  >
                    {show ? <FaTimes /> : <FaPlus />}
                  </button>
                )}
              </div>

              <div className="lec-lecture-list">
                {lectures && lectures.length > 0 ? (
                  lectures.map((item, index) => (
                    <div key={item._id} className="lec-lecture-item-wrapper">
                      <div
                        onClick={() => fetchLecture(item._id)}
                        className={`lec-lecture-item ${lecture._id === item._id ? "lec-active" : ""}`}
                      >
                        <div className="lec-lecture-info">
                          <div className="lec-lecture-number">{index + 1}</div>
                          <div className="lec-lecture-details">
                            <h3 className="lec-lecture-title">{item.title}</h3>
                            <div className="lec-lecture-meta">
                              <FaVideo className="lec-icon-video" />
                              <span>Video Lecture</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="lec-lecture-status">
                          {progress[0] && progress[0].completedLectures.includes(item._id) ? (
                            <div className="lec-completed-badge">
                              <FaCheck />
                            </div>
                          ) : (
                            <div className="lec-play-icon">
                              <FaPlay />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {user && (user.role === "admin" || user.role === "teacher") && (
                        <button 
                          className="lec-delete-btn" 
                          onClick={() => deleteHandler(item._id)}
                          aria-label="Delete lecture"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="lec-empty-state">
                    <p>No lectures available for this course yet.</p>
                    {user && (user.role === "admin" || user.role === "teacher") && (
                      <p>Click the + button to add your first lecture!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lec-main-content">
              {lecLoading ? (
                <div className="lec-loading-container">
                  <Loading />
                </div>
              ) : lecture.video ? (
                <div className="lec-video-container">
                  <div className="lec-video-player">
                    <video
                      src={`${server}/${lecture.video}`}
                      controls
                      controlsList="nodownload noremoteplayback"
                      disablePictureInPicture
                      disableRemotePlayback
                      autoPlay
                      onEnded={() => addProgress(lecture._id)}
                    ></video>
                  </div>
                  
                  <div className="lec-video-details">
                    <h1 className="lec-video-title">{lecture.title}</h1>
                    <p className="lec-video-description">{lecture.description}</p>
                  </div>
                </div>
              ) : (
                <div className="lec-empty-player">
                  <div className="lec-empty-player-content">
                    <FaPlay className="lec-empty-player-icon" />
                    <h2>Select a Lecture to Start Learning</h2>
                    <p>Choose a lecture from the sidebar to begin watching.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Lecture Modal */}
          {show && (
            <div className="lec-modal-overlay" onClick={() => setShow(false)}>
              <div className="lec-modal" onClick={(e) => e.stopPropagation()}>
                <div className="lec-modal-header">
                  <h2>Add New Lecture</h2>
                  <button className="lec-close-modal" onClick={() => setShow(false)}>
                    <FaTimes />
                  </button>
                </div>
                
                <form className="lec-form" onSubmit={submitHandler}>
                  <div className="lec-form-group">
                    <label htmlFor="title">Lecture Title</label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter lecture title"
                      required
                    />
                  </div>
                  
                  <div className="lec-form-group">
                    <label htmlFor="description">Lecture Description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter lecture description"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="lec-form-group">
                    <label htmlFor="video" className="lec-file-input-label">
                      <div className="lec-file-input-container">
                        <FaUpload className="lec-upload-icon" />
                        <span>Upload Video</span>
                      </div>
                      <input
                        type="file"
                        id="video"
                        accept="video/*"
                        onChange={changeVideoHandler}
                        required
                        className="lec-file-input"
                      />
                    </label>
                  </div>
                  
                  {videoPrev && (
                    <div className="lec-video-preview">
                      <h3>Preview</h3>
                      <video src={videoPrev} controls width="100%"></video>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="lec-submit-btn"
                    disabled={btnLoading}
                  >
                    {btnLoading ? "Uploading..." : "Add Lecture"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Lecture;