import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllFlights.css";

let User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ⭐ ADDED

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true); // ⭐ START LOADING

      let res = await axios.get(
        "https://makemytrip-back-end.onrender.com/api/users/"
      );

      setUsers(res.data);
    } catch (err) {
      console.log("error", err.response?.data);
    } finally {
      setLoading(false); // ⭐ STOP LOADING
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete user?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true); // ⭐ optional UX improvement

      await axios.delete(
        `https://makemytrip-back-end.onrender.com/api/users/${id}/`
      );

      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );

    } catch (error) {
      console.log(error);
      alert("Cannot Delete User ❌");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="loading">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="allflights-page">

      <div className="flights-header">
        <h1>✈ All Users</h1>
        <p>Manage and view all available users</p>
      </div>

      <div className="flights-container">

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Last Login</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.contact}</td>
                  <td>{user.last_login_ist}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No Users Available
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default User;