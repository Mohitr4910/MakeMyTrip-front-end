import React, { useEffect, useState } from "react";
import axios from "../Untils/axiosInstance";

import "./AllFlights.css";

let AllFlights = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      let res = await axios.get(
        "http://127.0.0.1:8000/api/flights/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      setFlights(res.data);
    } catch (err) {
      console.log("error", err.response?.data);
    }
  };

  // DELETE FLIGHT FUNCTION
  const handleDelete = async (id) => {
    let confirmDelete = window.confirm(
      "Are you sure you want to delete this flight?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/flights/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      // remove deleted flight instantly from UI
      setFlights((prevFlights) =>
        prevFlights.filter((flight) => flight.id !== id)
      );

    } catch (err) {
      console.log("Delete Error", err.response?.data);
      alert("Failed To Delete Flight");
    }
  };

  return (
    <div className="allflights-page">
      <div className="flights-header">
        <h1>✈ All Flights</h1>
        <p>Manage and view all available flights</p>
      </div>

      <div className="flights-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Airline</th>
              <th>From</th>
              <th>To</th>
              <th>Departure</th>
              <th>Date</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {flights.length > 0 ? (
              flights.map((flight, index) => (
                <tr key={flight.id}>
                  <td>{index + 1}</td>
                  <td>{flight.source}</td>
                  <td>{flight.from_location}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.time}</td>
                  <td>{flight.date}</td>
                  <td>₹ {flight.price}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(flight.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No Flights Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllFlights;