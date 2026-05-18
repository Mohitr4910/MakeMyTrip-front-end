import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Results.css";

let Results = () => {
  let location = useLocation();

  let flights = location.state?.flights || [];
  let initialDate = location.state?.selectdate || "";

  const [loading, setLoading] = useState(true); // ⭐ ADDED

  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";

    let parts = dateStr.split("-");

    if (parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  let [selectedDate, setSelectedDate] = useState(
    formatToDDMMYYYY(initialDate)
  );

  

  let [baseDate, setBaseDate] = useState(
    formatToDDMMYYYY(initialDate)
  );

  let [filteredFlights, setFilteredFlights] = useState([]);

  // ⭐ LOADING CONTROL
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // small delay for smooth UI

    return () => clearTimeout(timer);
  }, [flights, selectedDate]);

  let getNextDates = (startDate) => {
    if (!startDate) return [];

    let parts = startDate.split("-");
    let base = new Date(parts.reverse().join("-"));

    if (isNaN(base)) return [];

    let dates = [];

    for (let i = 0; i < 5; i++) {
      let next = new Date(base);
      next.setDate(base.getDate() + i);

      let d = String(next.getDate()).padStart(2, "0");
      let m = String(next.getMonth() + 1).padStart(2, "0");
      let y = next.getFullYear();

      dates.push(`${d}-${m}-${y}`);
    }

    return dates;
  };

  let dates = getNextDates(baseDate);

  // FILTER
  useEffect(() => {
    if (!selectedDate) return;

    let result = flights.filter((flight) => {
      let fDate = formatToDDMMYYYY(flight.date);
      return fDate === selectedDate;
    });

    setFilteredFlights(result);
  }, [selectedDate, flights]);

  // FIRST LOAD FIX
  useEffect(() => {
    if (!selectedDate && flights.length > 0) {
      setSelectedDate(formatToDDMMYYYY(flights[0].date));
    }
  }, [flights]);

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="loading">
        Searching Flights...
      </div>
    );
  }

  return (
    <div className="container">

      <h1>
        {flights[0]?.from} to {flights[0]?.to} Flights
      </h1>

      <p className="subtitle">
        {flights.length} Flights found
      </p>

      {/* DATE TABS */}
      <div className="date-tabs">
        {dates.map((date, i) => (
          <div
            key={i}
            className={`tab ${selectedDate === date ? "active" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            <p>{date}</p>
            <span>• Available</span>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="filters">
        <h3>Quick Filters</h3>
      </div>

      {/* OFFERS */}
      <div className="offer">
        <p>Get instant booking confirmation</p>
        <span>Free cancellation available</span>
      </div>

      {/* FLIGHTS */}
      {filteredFlights.length > 0 ? (
        filteredFlights.map((flight, index) => (
          <Link
            to="/book"
            state={{ flight }}
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="train-card">

              <div className="train-header">
                <h3>{flight.name}</h3>
                <span className="rating">⭐ 4.0</span>
              </div>

              <div className="train-time">
                <strong>{flight.departuretime}</strong>
                <span> → </span>
                <strong>{flight.arrivaltime}</strong>
              </div>

              <div className="seats">
                <div className="seat-box">
                  <p>SL</p>
                  <span>₹{flight.price}</span>
                  <small>Available</small>
                </div>
              </div>

            </div>
          </Link>
        ))
      ) : (
        <p className="no-results">No flights found.</p>
      )}

    </div>
  );
};

export default Results;