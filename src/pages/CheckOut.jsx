import React, { useEffect, useState } from "react";
import "./CheckOut.css";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/api";
import StripePayment from "./StripePayment"; 
import axios from "axios";


function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);


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

        const defaultAddr = addrList.find(a => a.is_default);
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      })
      .catch(() => toast.error("Failed to load addresses"));
  }, []);

 
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qauntity,
    0
  );

 
  const placeOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    api
      .post("order/create/", {
        address_id: selectedAddress,
        payment: payment,
      })
      .then(() => {
        toast.success("Order placed successfully 🎉");
        setOrderPlaced(true);
      })
      .catch(() => toast.error("Checkout failed"));
  };

  if (orderPlaced) {
    return (
      <div className="checkout-conv">
        <h2>Order Placed Successfully 🎉</h2>
        <p>Your order will be delivered soon 📦</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

     
      <div className="address-section">
        <h3>Delivery Address</h3>

        {addresses.length === 0 ? (
          <p>No saved addresses. Please add one in profile.</p>
        ) : (
          addresses.map(addr => (
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

        {cartItems.map(item => (
          <div key={item.id} className="summary-item">
            <span>
              {item.product.name} × {item.qauntity}
            </span>
            <span>
              ₹{item.product.price * item.qauntity}
            </span>
          </div>
        ))}

        <hr />
        <h3>Total: ₹{totalPrice}</h3>
      </div>

    
      <div className="payment-section">
        <h3>Payment Method</h3>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="cod">Cash on Delivery</option>
          <option value="card">Card (Stripe)</option>
          <option value="upi">UPI</option>
        </select>

        {payment === "card" ? (
          <StripePayment
            amount={totalPrice}
            onSuccess={placeOrder}
          />
        ) : (
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Checkout;
