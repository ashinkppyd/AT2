import React, { useEffect, useState } from "react";
import "./CheckOut.css";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/api";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    api
      .get("cart/")
      .then((res) => setCartItems(res.data))
      .catch(() => toast.error("Please login first"));
  }, []);

  useEffect(() => {
    api
      .get("addresses/")
      .then((res) => {
        const addrList = res.data.results || [];
        setAddresses(addrList);

        const defaultAddr = addrList.find((a) => a.is_default);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      })
      .catch(() => toast.error("Failed to load addresses"));
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qauntity,
    0
  );

  async function payments() {
    // FIX 1: Prevent Razorpay from crashing if the cart is empty
    if (cartItems.length === 0 || totalPrice === 0) {
      toast.error("Your cart is empty! Add items to pay.");
      return;
    }

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Payment gateway blocked. Please disable your Adblocker.");
        return;
      }

      // FIX 2: Send the selected address to the backend so the order is linked to it
      const res = await api.post("payments/create-order/", {
        address_id: selectedAddress,
      });
      
      const { order_id, key, amount } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "PartPoint",
        description: "Order Payment",
        order_id,
        handler: async function (response) {
          try {
            await api.post("payments/verify-payment/", {
              ...response,
              address_id: selectedAddress, // Pass address here too just in case
            });
            toast.success("Payment successful 🎉");
          } catch (err) {
            console.error("Verification Error:", err);
            toast.error("Payment verification failed. Contact support.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      
      // FIX 3: Catch if the user closes the Razorpay window or their card fails
      rzp.on('payment.failed', function (response){
        toast.error(response.error.description || "Payment failed");
      });

      rzp.open();
    } catch (error) {
      console.error("Order Creation Error:", error);
      
      // FIX 4: Show the ACTUAL backend error message instead of hiding it!
      const backendError = error.response?.data?.message || error.response?.data?.error || "Server failed to create order";
      toast.error(backendError);
    }
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="address-section">
        <h3>Delivery Address</h3>

        {addresses.length === 0 ? (
          <p>No saved addresses. Please add one in profile.</p>
        ) : (
          addresses.map((addr) => (
            <label key={addr.id} className="address-box">
              <input
                type="radio"
                name="address"
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
              />
              <div>
                <strong>{addr.full_name}</strong>
                <p>{addr.address_line_1}</p>
                {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                <p>
                  {addr.city}, {addr.state} - {addr.postal_code}
                </p>
                <p>📞 {addr.phone}</p>
                {addr.is_default && <span className="badge">Default</span>}
              </div>
            </label>
          ))
        )}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>

        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <div className="summary-left">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="summary-img"
              />

              <div className="summary-info">
                <p className="summary-name">{item.product.name}</p>
                <p className="summary-qty">Qty: {item.qauntity}</p>
              </div>
            </div>

            <span className="summary-price">
              ₹{item.product.price * item.qauntity}
            </span>
          </div>
        ))}

        <hr />

        <div className="summary-total">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>

        <button
          className="pay-btn"
          onClick={payments}
          disabled={!selectedAddress || cartItems.length === 0}
        >
          Pay 
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Checkout;