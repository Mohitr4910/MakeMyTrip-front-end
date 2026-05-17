import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../Untils/axiosInstance";
import "./Book.css";

function BookingForm() {

  const location = useLocation();
  const navigate = useNavigate();

  const flight = location.state?.flight;

  // user data

  const data = JSON.parse(localStorage.getItem("user"));

  const email = data?.user?.email;
  const contact = data?.user?.contact;

  console.log(email, contact);

  // total people

  const [people, setPeople] = useState(1);

  // mobile number

  const [mobileNumber, setMobileNumber] = useState("");

  // passengers state

  const [passengers, setPassengers] = useState([
    {
      name: "",
      age: "",
      gender: "",
      seat_type: "",
      seat_price: 0,
    },
  ]);

  // seat prices

  const seatPrices = {
    SL: Number(flight?.price || 0),
    // "3E": 1525,
    // "3A": 2100,
  };

  // handle people

  const handlePeople = (e) => {

    const value = Number(e.target.value);

    if (value > 5) {
      alert("Maximum 5 people allowed");
      return;
    }

    setPeople(value);

    const updatedPassengers = [...passengers];

    // increase fields

    while (updatedPassengers.length < value) {

      updatedPassengers.push({
        name: "",
        age: "",
        gender: "",
        seat_type: "",
        seat_price: 0,
      });

    }

    // decrease fields

    updatedPassengers.length = value;

    setPassengers(updatedPassengers);
  };

  // handle passenger change

  const handlePassengerChange = (index, field, value) => {

    const updatedPassengers = [...passengers];

    updatedPassengers[index][field] = value;

    // auto set seat price

    if (field === "seat_type") {

      updatedPassengers[index]["seat_price"] =
        Number(seatPrices[value] || 0);

    }

    setPassengers(updatedPassengers);
  };

  // total price

  const totalPrice = passengers.reduce(
    (total, passenger) =>
      total + Number(passenger.seat_price || 0),
    0
  );

  // submit booking

  const handleSubmit = async (e) => {

    e.preventDefault();

    // validation

    if (totalPrice <= 0) {
      alert("Please select seat type");
      return;
    }

    const bookingData = {
      flight: flight?.id,
      mobile_number: mobileNumber,
      total_people: people,
      total_price: totalPrice,
      passengers: passengers,
    };

    console.log("Booking Data:", bookingData);

    try {

      const response = await axios.post(
        "https://makemytrip-back-end.onrender.com/create-order/",
        {
          amount: totalPrice,
          email: email,
          contact: contact,
        }
      );

      console.log("Order Response:", response.data);

      navigate("/payment", {
        state: {
          bookingData,
          orderData: response.data,
        },
      });

    } catch (error) {

      console.log(error);

      console.log(
        "Booking Error:",
        error.response?.data
      );

      alert("Booking Failed ❌");
    }
  };

  return (

    <div className="booking-container">

      {/* Flight Details */}

      <div className="flight-card">

        <h2>{flight?.name}</h2>

        <div className="flight-info">

          <p>
            <strong>From:</strong>{" "}
            {flight?.from_location}
          </p>

          <p>
            <strong>To:</strong>{" "}
            {flight?.destination}
          </p>

          <p>
            <strong>Departure:</strong>{" "}
            {flight?.departuretime}
          </p>

          <p>
            <strong>Arrival:</strong>{" "}
            {flight?.arrivaltime}
          </p>

        </div>

        {/* Seat Types */}

        <div className="seat-section">

          <div className="seat-box">

            <p>SL</p>

            <span>
              ₹{Number(flight?.price || 0)}
            </span>

          </div>

        </div>

      </div>

      {/* Booking Form */}

      <form
        className="booking-form"
        onSubmit={handleSubmit}
      >

        <h2>Passenger Details</h2>

        {/* Mobile Number */}

        <div className="form-group">

          <label>Mobile Number</label>

          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(e) =>
              setMobileNumber(e.target.value)
            }
            required
          />

        </div>

        {/* Total People */}

        <div className="form-group">

          <label>
            Total People (Max 5)
          </label>

          <input
            type="number"
            min="1"
            max="5"
            value={people}
            onChange={handlePeople}
            required
          />

        </div>

        {/* Passenger Fields */}

        {passengers.map((passenger, index) => (

          <div
            className="passenger-card"
            key={index}
          >

            <h3>
              Passenger {index + 1}
            </h3>

            {/* Name */}

            <input
              type="text"
              placeholder={`Passenger ${index + 1} Name`}
              value={passenger.name}
              onChange={(e) =>
                handlePassengerChange(
                  index,
                  "name",
                  e.target.value
                )
              }
              required
            />

            {/* Age */}

            <input
              type="number"
              placeholder="Age"
              value={passenger.age}
              onChange={(e) =>
                handlePassengerChange(
                  index,
                  "age",
                  e.target.value
                )
              }
              required
            />

            {/* Gender */}

            <select
              value={passenger.gender}
              onChange={(e) =>
                handlePassengerChange(
                  index,
                  "gender",
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

            {/* Seat Type */}

            <select
              value={passenger.seat_type}
              onChange={(e) =>
                handlePassengerChange(
                  index,
                  "seat_type",
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Seat Type
              </option>

              <option value="SL">
                SL - ₹{Number(flight?.price || 0)}
              </option>

            </select>

            {/* Seat Price */}

            <p className="seat-price">

              Price: ₹
              {Number(passenger.seat_price || 0)}

            </p>

          </div>

        ))}

        {/* Total Price */}

        <div className="total-price">

          <h2>
            Total Price: ₹{totalPrice}
          </h2>

        </div>

        {/* Submit */}

        <button
          type="submit"
          className="book-btn"
        >

          Confirm Booking

        </button>

      </form>

    </div>
  );
}

export default BookingForm;