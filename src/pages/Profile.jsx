import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AddressList from "../address/AddressList";
import profileImg from "../assets/profile.jpg";

import { AuthContext } from "../Autho/AuthContext";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const { setUser: updateSetUser } = useContext(AuthContext);

  useEffect(() => {
    
    api
      .get("account/profile/")
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));

    
    api
      .get("order/history/")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    api
      .post("account/logout/")
      .then(() => {
        updateSetUser(null);
      })
      .finally(() => navigate("/login"));
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      
      <div className="user">
        <div>
          <h2>Personal Details</h2>
          <p>
            <b>Name:</b> {user.username}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>

          <button className="btn-out" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <img src={profileImg} alt="profile" className="pfp" />
      </div>

      <section className="profile-card">
        <div className="section-header">
          <h2>My Addresses</h2>
        </div>

        <div className="address-wrapper">
          <AddressList />
        </div>
      </section>

      <section className="profile-card">
        <div className="section-header">
          <h2>Previous Orders</h2>
        </div>

        {orders.length === 0 ? (
          <p className="empty-text">No orders found</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <p>
                      <b>Order ID:</b> #{order.id}
                    </p>
                    <p className="order-date">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="order-total">₹{order.total}</p>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />

                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Qty: {item.quantity}</p>
                      </div>

                      <button
                        className="buy-again-btn"
                        onClick={() => navigate(`/details/${item.id}`)}
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
