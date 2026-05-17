// MyBooking.jsx

import React, { useEffect, useState } from "react";
import axios from "../Untils/axiosInstance";
import "./MyBooking.css";

function MyBooking() {

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openId, setOpenId] = useState(null);

  // GET BOOKINGS

  const getBookings = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/bookings/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log(response.data);

      setBookings(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    getBookings();

  }, []);

  // DELETE BOOKING

  const cancelBooking = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to cancel booking?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://127.0.0.1:8000/api/bookings/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Booking Cancelled");

      setBookings(
        bookings.filter(
          (booking) => booking.id !== id
        )
      );

    } catch (error) {

      console.log(error);

      alert("Cannot Cancel Booking");
    }
  };

  if (loading) {

    return (
      <h1 className="loading">
        Loading...
      </h1>
    );
  }

  return (

    <div className="mybooking-container">

      <h1 className="main-heading">
        My Bookings
      </h1>

      {bookings.length === 0 ? (

        <div className="empty-box">

          <h2>No Bookings Found</h2>

        </div>

      ) : (

        bookings.map((booking) => (

          <div
            className={`booking-card ${
              openId === booking.id
                ? "active"
                : ""
            }`}
            key={booking.id}
          >

            {/* HEADER */}

            <div
              className="ticket-header"
              onClick={() =>
                setOpenId(
                  openId === booking.id
                    ? null
                    : booking.id
                )
              }
            >

              <div className="left-ticket">

                <h2>
                  {
                    booking.flight_details?.name
                  }
                </h2>
                <h4>
                  {
                    booking?.booking_date_ist
                  }
                </h4>

        
                <div className="short-details">

                  <span>
                    {
                      booking.flight_details
                        ?.from_location
                    }
                  </span>

                  <span>→</span>

                  <span>
                    {
                      booking.flight_details
                        ?.destination
                    }
                  </span>

                </div>

              </div>

              <div className="price-box">

                ₹{booking.total_price}

              </div>

            </div>


            <div className="ticket-details">

              {/* FLIGHT DETAILS */}

              <div className="flight-details">

                <div>

                  <h3>From</h3>

                  <p>
                    {
                      booking.flight_details
                        ?.from_location
                    }
                  </p>

                </div>

                <div>

                  <h3>To</h3>

                  <p>
                    {
                      booking.flight_details
                        ?.destination
                    }
                  </p>

                </div>

                <div>

                  <h3>Departure</h3>

                  <p>
                    {
                      booking.flight_details
                        ?.departuretime
                    }
                  </p>

                </div>

                <div>

                  <h3>Arrival</h3>

                  <p>
                    {
                      booking.flight_details
                        ?.arrivaltime
                    }
                  </p>

                </div>

              </div>

              {/* BOOKING INFO */}

              <div className="booking-info">

                <p>

                  <strong>Mobile:</strong>
                  {" "}
                  {booking.mobile_number}

                </p>

                <p>

                  <strong>Total People:</strong>
                  {" "}
                  {booking.total_people}

                </p>

              </div>

              {/* PASSENGERS */}

              <div className="passenger-section">

                <h2>
                  Passengers
                </h2>

                <div className="passenger-grid">

                  {booking.passengers?.map(
                    (passenger, index) => (

                      <div
                        className="passenger-card"
                        key={index}
                      >

                        <h3>
                          {passenger.name}
                        </h3>

                        <p>

                          <strong>Age:</strong>
                          {" "}
                          {passenger.age}

                        </p>

                        <p>

                          <strong>Gender:</strong>
                          {" "}
                          {passenger.gender}

                        </p>

                        <p>

                          <strong>Seat:</strong>
                          {" "}
                          {
                            passenger.seat_type
                          }

                        </p>

                        <p>

                          <strong>Price:</strong>
                          {" "}
                          ₹
                          {
                            passenger.seat_price
                          }

                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="btn-section">

                <button className="download-btn">

                  Download Ticket

                </button>

                <button
                  className="cancel-btn"
                  onClick={() =>
                    cancelBooking(booking.id)
                  }
                >

                  Cancel Booking

                </button>

              </div>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default MyBooking;