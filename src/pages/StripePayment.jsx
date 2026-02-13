// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import { toast } from "react-toastify";
// import { useState } from "react";
// import api from "../api/api";

// function StripePayment({ amount, onSuccess }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handlePayment = async () => {
//     if (!stripe || !elements) {
//       toast.error("Stripe is not loaded yet");
//       return;
//     }

//     setLoading(true);

//     try {
      
//       const res = await api.post("payments/create-payment-intent/", {
//         amount: Math.round(amount * 100), // ₹ → paise
//       });

//       const clientSecret = res.data.client_secret;

     
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//         },
//       });

//       if (result.error) {
//         toast.error(result.error.message);
//       } else if (result.paymentIntent.status === "succeeded") {
//         toast.success("Payment successful 💳");
//         onSuccess(); 
//       }
//     } catch (error) {
//       toast.error("Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="stripe-box">
//       <CardElement
//         options={{
//           style: {
//             base: {
//               fontSize: "16px",
//               color: "#32325d",
//               "::placeholder": { color: "#a0aec0" },
//             },
//           },
//         }}
//       />

//       <button
//         className="place-order-btn"
//         style={{ marginTop: "15px" }}
//         onClick={handlePayment}
//         disabled={loading}
//       >
//         {loading ? "Processing..." : `Pay ₹${amount}`}
//       </button>
//     </div>
//   );
// }

// export default StripePayment;
