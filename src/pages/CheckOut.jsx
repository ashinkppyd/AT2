import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import "./CheckOut.css";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/api";

function loadRazorpay() {
  return new Promise((resolve) => {
    try {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    } catch (err) {
      console.error("Razorpay load error:", err);
      resolve(false);
    }
  });
}

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const getQty = (item) => {
    const qty = item?.quantity ?? item?.qauntity ?? 1;
    return isNaN(qty) ? 1 : Number(qty);
  };

  const getPrice = (item) => {
    const price = item?.product?.price ?? 0;
    return isNaN(price) ? 0 : Number(price);
  };

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get("cart/");
      setCartItems(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error("Cart fetch error:", error);
      toast.error(
        error?.response?.data?.message || "Please login first"
      );
    }
  }, []);


  const fetchAddresses = useCallback(async () => {
    try {
      const res = await api.get("addresses/");
      const addrList = res?.data?.results || [];

      setAddresses(addrList);

      const defaultAddr = addrList.find((a) => a?.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
    } catch (error) {
      console.error("Address fetch error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to load addresses"
      );
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, [fetchCart, fetchAddresses]);

 
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + getPrice(item) * getQty(item);
  }, 0);

  const payments = async () => {
    if (loading) return;

    if (!selectedAddress) {
      toast.error("Please select delivery address");
      return;
    }

    if (!cartItems.length || totalPrice <= 0) {
      toast.error("Your cart is empty! Add items to pay.");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error(
          "Payment gateway blocked. Please disable AdBlock."
        );
        setLoading(false);
        return;
      }

      let orderResponse;
      try {
        orderResponse = await api.post("payments/create-order/", {
          address_id: selectedAddress,
        });
      } catch (err) {
        console.error("Create order error:", err);
        toast.error(
          err?.response?.data?.message ||
            "Server failed to create order"
        );
        setLoading(false);
        return;
      }

      const { order_id, key, amount } = orderResponse?.data || {};

      if (!order_id || !key || !amount) {
        toast.error("Invalid payment configuration");
        setLoading(false);
        return;
      }

      const options = {
        key,
        amount,
        currency: "INR",
        name: "HeyTux",
        description: "Order Payment",
        order_id,

        handler: async (response) => {
          try {
            await api.post("payments/verify-payment/", {
              ...response,
              address_id: selectedAddress,
            });

            toast.success("Payment successful 🎉");
            setCartItems([]);

            
            setTimeout(() => {
              navigate("/payment-success", { replace: true });
            }, 1500);

          } catch (err) {
            console.error("Verification Error:", err);
            toast.error(
              err?.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        toast.error(
          response?.error?.description || "Payment failed"
        );
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong during payment");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="address-section">
        <h3>Delivery Address</h3>

        {addresses.length === 0 ? (
          <>
           <p>No saved addresses. Please add one in profile.</p>
           <button className='pay-btn' onClick={() => nav('/profile')}>ADD</button>
          </>
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
                <strong>{addr?.full_name}</strong>
                <p>{addr?.address_line_1}</p>
                {addr?.address_line_2 && (
                  <p>{addr.address_line_2}</p>
                )}
                <p>
                  {addr?.city}, {addr?.state} -{" "}
                  {addr?.postal_code}
                </p>
                <p>📞 {addr?.phone}</p>
                {addr?.is_default && (
                  <span className="badge">Default</span>
                )}
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
                src={item?.product?.image}
                alt={item?.product?.name}
                className="summary-img"
              />
              <div className="summary-info">
                <p className="summary-name">
                  {item?.product?.name}
                </p>
                <p className="summary-qty">
                  Qty: {getQty(item)}
                </p>
              </div>
            </div>
            <span className="summary-price">
              ₹{getPrice(item) * getQty(item)}
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
          disabled={
            loading ||
            !selectedAddress ||
            cartItems.length === 0
          }
        >
          {loading ? "Processing..." : "Pay"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Checkout;