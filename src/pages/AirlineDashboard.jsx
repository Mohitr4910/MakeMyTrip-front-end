import React, { useEffect, useState } from "react";
import "./AirlineDashboard.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../Untils/axiosInstance";

function AirlineDashboard() {

  const [flights, setFlights] = useState([]);

  const data = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  // User Data
  const user = data?.user;
  const company = user?.airline;

  // Logged In Email
  const loggedin = user?.email;

  console.log("Logged-in Email:", loggedin);

  // ================= FETCH FLIGHTS =================
  useEffect(() => {

    const fetchFlights = async () => {

      try {

        const res = await axios.get(
          "http://127.0.0.1:8000/api/flights/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        // Only Company Flights
        const companyFlights = res.data.filter(
          (flight) => flight.company_email === loggedin
        );

        console.log("Company Flights:", companyFlights);

        setFlights(companyFlights);

      } catch (err) {

        console.log("Error:", err.response?.data);

      }

    };

    fetchFlights();

  }, [loggedin]);

  // ================= DELETE FLIGHT =================
  const handleDelete = async (id) => {

    const choice = confirm(
      "Are you sure you want to delete this flight?"
    );

    if (!choice) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/api/flights/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Remove deleted flight from UI
      setFlights(flights.filter((flight) => flight.id !== id));

    } catch (err) {

      console.log("Delete Error:", err.response?.data);

      alert("Delete failed");

    }

  };

  // ================= LOGOUT =================
  const handleLogout = () => {

    const choice = confirm(
      "Are you sure you want to logout?"
    );

    if (!choice) return;

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    navigate("/");

  };

  return (

    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <div className="navbar">

        <h1>✈ Airline Dashboard</h1>

        <div className="profile">

          <h3>{user?.name}</h3>

          <p>{company?.country}</p>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* ================= COMPANY CARD ================= */}

      <div className="company-card">

        <div>

          <h2>{user?.name}</h2>

          <p>Premium Airline Management System</p>

        </div>

        <Link to="/FlightForm" className="add-btn">
          + Add Flight
        </Link>

      </div>

      {/* ================= STATS ================= */}

      <div className="stats-container">

        <div className="stat-card">

          <h3>Total Flights</h3>

          <h1>{flights.length}</h1>

        </div>

        <div className="stat-card">

          <h3>Active Flights</h3>

          <h1>{flights.length}</h1>

        </div>

        <div className="stat-card">

          <h3>Cancelled</h3>

          <h1>0</h1>

        </div>

        <div className="stat-card">

          <h3>Revenue</h3>

          <h1>$25K</h1>

        </div>

      </div>

      {/* ================= FLIGHTS TABLE ================= */}

      <div className="flight-section">

        <div className="section-header">

          <h2>Flights</h2>

          <button className="view-btn">
            View All
          </button>

        </div>

        <table>

          <thead>

            <tr>

              <th>Name</th>
              <th>Source</th>
              <th>From</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Price</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {flights.length > 0 ? (

              flights.map((flight) => (

                <tr key={flight.id} className="mytd">

                  <td>{flight.name}</td>

                  <td>{flight.source}</td>

                  <td>{flight.from_location}</td>

                  <td>{flight.destination}</td>

                  <td>{flight.date}</td>

                  <td>{flight.price}</td>

                  <td>{flight.departuretime}</td>

                  <td>{flight.arrivaltime}</td>

                  <td>

                    {/* UPDATE BUTTON */}

                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/FlightForm/${flight.id}`)
                      }
                    >
                      Update
                    </button>

                    {/* DELETE BUTTON */}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(flight.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="7">
                  No Flights Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default AirlineDashboard;