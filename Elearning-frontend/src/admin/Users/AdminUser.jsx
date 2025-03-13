import React, { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../index";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import { FaSearch, FaUserEdit, FaTrash, FaUserShield, FaChalkboardTeacher, FaUser, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setUsers(data.users);
      
      const initialRoles = data.users.reduce((acc, user) => {
        acc[user._id] = user.role || "user";
        return acc;
      }, {});
      setSelectedRoles(initialRoles);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user && user.mainrole !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRoleChange = (id, role) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [id]: role,
    }));
  };

  const updateRole = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/api/user/${id}`,
        { role: selectedRoles[id] },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role.");
    }
  };

  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/api/user/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      setConfirmDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="role-icon admin-icon" />;
      case 'teacher':
        return <FaChalkboardTeacher className="role-icon teacher-icon" />;
      default:
        return <FaUser className="role-icon user-icon" />;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon" />;
    return sortDirection === "asc" ? <FaSortUp className="sort-icon active" /> : <FaSortDown className="sort-icon active" />;
  };

  // Filter and sort users
  const filteredUsers = users.filter(user => 
    (user?.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user?.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;
    
    const valueA = a[sortField].toLowerCase();
    const valueB = b[sortField].toLowerCase();
    
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <Layout>
      <div className="users-container">
        <div className="users-header">
          <h1>User Management</h1>
          <div className="users-meta">
            <div className="total-users">
              <span>Total Users: </span>
              <strong>{users.length}</strong>
            </div>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>
                      Name {getSortIcon("name")}
                    </th>
                    <th onClick={() => handleSort("email")}>
                      Email {getSortIcon("email")}
                    </th>
                    <th onClick={() => handleSort("role")}>
                      Role {getSortIcon("role")}
                    </th>
                    <th>Change Role</th>
                    <th>Access Request</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user?._id}>
                        <td className="user-name">{user?.name || "No Name"}</td>
                        <td>{user?.email || "No Email"}</td>
                        <td>
                          <span className={`role-badge ${user?.role || 'user'}-badge`}>
                            {getRoleIcon(user?.role)}
                            {user?.role === "user"
                              ? "User"
                              : user?.role === "admin"
                              ? "Admin"
                              : user?.role === "teacher"
                              ? "Teacher"
                              : "Unknown"}
                          </span>
                        </td>
                        <td>
                          <div className="role-update">
                            <select
                              value={selectedRoles[user?._id] || user?.role || "user"}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="role-select"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="teacher">Teacher</option>
                            </select>
                            <button
                              onClick={() => updateRole(user?._id)}
                              className="update-btn"
                              disabled={selectedRoles[user?._id] === user?.role}
                            >
                              <FaUserEdit /> Update
                            </button>
                          </div>
                        </td>
                        <td className="request-cell">
                          {user?.designation ? (
                            <span className="access-request">{user?.designation}</span>
                          ) : (
                            <span className="no-request">None</span>
                          )}
                        </td>
                        <td>
                          {user?.role !== "admin" && (
                            <button
                              onClick={() => setConfirmDelete(user?._id)}
                              className="delete-btn"
                            >
                              <FaTrash /> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-users">
                        {searchTerm ? "No users match your search." : "No users found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  Previous
                </button>
                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="modal-backdrop">
            <div className="confirm-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-btn" 
                  onClick={() => deleteUser(confirmDelete)}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;
