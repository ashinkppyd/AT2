import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import api from "../api/api";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get("cart/", { withCredentials: true });
      setCartItems(res.data.sort((a,b)=>a.id - b.id) || []);
    } catch (err) {
      toast.error("Please login to view your cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = async (apiCall) => {
    try {
      setUpdating(true);
      await apiCall();
      fetchCart();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const increaseQty = (productId) =>
    updateCart(() => api.post("cart/add/", { product: productId }));

  const decreaseQty = (productId, qty) => {
    if (qty <= 1) return;
    updateCart(() => api.post("cart/decrease/", { product: productId }));
  };

  const removeItem = (productId) =>
    updateCart(() =>
      api.delete(`cart/delete/?product=${productId}`)
    );

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (item?.product?.price || 0) * (item?.quantity || item?.qauntity || 0),
    0
  );

  if (loading) {
    return <div className="cart-loading">Loading your cart…</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛒</h2>
        <button className="btn primary" onClick={() => navigate("/shop")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <h2 className="cart-title">Your Cart</h2>

      <div className="cart-list">
        {cartItems.map((item) => {
          const qty = item.quantity || item.qauntity;
          return (
            <div key={item.id} className="cart-item">
              <img
                src={item?.product?.image}
                alt={item?.product?.name}
              />

              <div className="cart-details">
                <h3>{item?.product?.name}</h3>
                <p className="price">₹{item?.product?.price}</p>

                <div className="qty-control">
                  <button
                    disabled={updating}
                    onClick={() =>
                      decreaseQty(item.product.id, qty)
                    }
                  >
                    −
                  </button>

                  <span>{qty}</span>

                  <button
                    disabled={updating}
                    onClick={() => increaseQty(item.product.id)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  disabled={updating}
                  onClick={() => removeItem(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Total: ₹{totalPrice}</h3>
        <button
          className="btn checkout"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
