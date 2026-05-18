import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../Untils/axiosInstance";
import "./Payment.css";


let Payment = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { orderData, bookingData } = location.state;

  console.log(bookingData)
  console.log(orderData)


  useEffect(() => {

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      console.log("Razorpay Loaded");
      console.log(window.Razorpay);
    };

    script.onerror = () => {
      console.log("Razorpay Failed");
    };

  }, []);
  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {

      key: "rzp_test_SC9152Au7RX5Z7",

      amount: orderData.amount,

      currency: "INR",

      name: "Mohit's",

      description: "Flight Booking",

      order_id: orderData.id,

      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: true,
      },

      config: {
        display: {
          language: "en",

          preferences: {
            show_default_blocks: true,
          },

          blocks: {
            upi: {
              name: "Pay using UPI",
              instruments: [
                {
                  method: "upi",
                  flows: ["collect", "intent"], // 👈 important
                },
              ],
            },
          },

          sequence: ["block.upi"],
        },
      },


      handler: async function (response) {

        console.log(response);

        try {

          // payment status verify

          const verifyResponse = await axios.post(
            "https://makemytrip-back-end.onrender.com/payment_status/",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }
          );

          console.log(verifyResponse.data);

          // agar payment success

          if (verifyResponse.data.status === true) {

            // booking save

            const bookingResponse = await axios.post(
              "https://makemytrip-back-end.onrender.com/api/bookings/",
              {
                ...bookingData,
                payment_id: response.razorpay_payment_id
              }
            );

            console.log(bookingResponse.data);

            alert("Booking Success");

            navigate("/mybooking");

          } else {

            alert("Payment Verification Failed");

          }

        } catch (error) {

          console.log(error);

        }
      },

      prefill: {
        name: "Mohit"
      },
         readonly: {
        contact: false,
        email: false,
      },

      theme: {
        color: "#3399cc"
      }
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  };
  return (
    <>
      <div className="payment-container">

        <div className="payment-card">

          <h2>Payment Details</h2>

          <div className="payment-info">

            <p>
              <span>Booking:</span>
              Flight Booking
            </p>

            <p>
              <span>Pessanger:</span>
              {bookingData.total_people}
            </p>

            <p>
              <span>Amount:</span>
              ₹{orderData.amount / 100}
            </p>


            <p>
              <span>Order ID:</span>
              {orderData.order_id}
            </p>

          </div>

          <button onClick={handlePayment}>
            Pay ₹{orderData.amount / 100}
          </button>

        </div>

      </div>
    </>


  );
}

export default Payment;