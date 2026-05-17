import React, { useEffect, useState } from "react";
import "./FlightForm.css";
import axios from "../Untils/axiosInstance";

import {
  useNavigate,
  useParams
} from "react-router-dom";

function FlightForm() {

  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = !!id;

  const [flightData, setFlightData] = useState({
    name: "",
    source: "",
    from_location: "",
    destination: "",
    date: "",
    departuretime: "",
    arrivaltime: "",
    price: ""
  });

  const data = JSON.parse(localStorage.getItem("user"));

  const user = data?.user;

  let loggedin = user?.email;

  // ================= FETCH SINGLE FLIGHT =================

  useEffect(() => {

    if (isEdit) {

      axios.get(
        `http://127.0.0.1:8000/api/flights/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      )
      .then((res) => {

        setFlightData(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

    }

  }, [id]);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setFlightData({
      ...flightData,
      [e.target.name]: e.target.value,
    });

  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // UPDATE
      if (isEdit) {

        await axios.put(
          `http://127.0.0.1:8000/api/flights/${id}/`,
          {
            ...flightData,
            company_email: loggedin
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        alert("Flight Updated Successfully");

      }

      // CREATE
      else {

        await axios.post(
          "http://127.0.0.1:8000/api/flights/",
          {
            ...flightData,
            company_email: loggedin
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "accessToken"
              )}`,
            },
          }
        );

        alert("Flight Added Successfully");

      }

      navigate("/airline-dashboard");

    } catch (err) {

      console.log(err);

      alert(
        isEdit
          ? "Flight Update Failed"
          : "Flight Add Failed"
      );

    }

  };

  return (

    <div className="flight-form-container">

      <form
        className="flight-form"
        onSubmit={handleSubmit}
      >

        <h1>
          {isEdit ? "Update Flight" : "Add Flight"}
        </h1>

        <div className="input-group">

          <label>Flight Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter flight name"
            value={flightData.name}
            onChange={handleChange}
            required
          />

        </div>

        <div className="input-group">

          <label>Source</label>

          <input
            type="text"
            name="source"
            placeholder="Enter source"
            value={flightData.source}
            onChange={handleChange}
            required
          />

        </div>

        <div className="input-group">

          <label>From Location</label>

          <input
            type="text"
            name="from_location"
            placeholder="From location"
            value={flightData.from_location}
            onChange={handleChange}
            required
          />

        </div>

        <div className="input-group">

          <label>Destination</label>

          <input
            type="text"
            name="destination"
            placeholder="Enter destination"
            value={flightData.destination}
            onChange={handleChange}
            required
          />

        </div>

        <div className="input-group">

          <label>Price</label>

          <input
            type="number"
            name="price"
            value={flightData.price}
            onChange={handleChange}
            required
            placeholder="Enter price"
          />

        </div>

        <div className="row">

          <div className="input-group">

            <label>Date</label>

            <input
              type="date"
              name="date"
              value={flightData.date}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">

            <label>Departure Time</label>

            <input
              type="time"
              name="departuretime"
              value={flightData.departuretime}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">

            <label>Arrival Time</label>

            <input
              type="time"
              name="arrivaltime"
              value={flightData.arrivaltime}
              onChange={handleChange}
              required
            />

          </div>

        </div>

        <button
          type="submit"
          className="submit-btn"
        >

          {isEdit ? "Update Flight" : "Add Flight"}

        </button>

      </form>

    </div>

  );

}

export default FlightForm;