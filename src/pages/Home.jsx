import React, { useEffect } from "react";
import "./Home.css";
import watch1 from '../assets/watch1.jpg'
import watch2 from '../assets/watch2.jpg'
import watch3 from '../assets/watch3.jpg'
import watch4 from '../assets/watch4.jpg'
import {useNavigate} from 'react-router-dom'
import Footer from "../components/Footer";
import { useState } from "react";
import axios from "axios";
import api from "../api/api";
export default function HomePage() {
  let nav=useNavigate()

      function handleLogout() {
    api.post(
      "account/logout/",
      {},
      { withCredentials: true }
    ).finally(() => {
      nav("/login")
    })
    console.log("working")
  }

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-text">
          <h1>Luxury Timepieces</h1>
          <p>
            Discover our exclusive collection of premium handcrafted watches
            designed for elegance and precision.
          </p>
          <button onClick={()=>{nav('/shop')}}>Shop Now</button>
        </div>
        <div className="hero-image">
          <img
            src={watch4}
          />
        </div>
      </section>

      <section className="products">
        <h2>Featured Watches</h2>
        <div className="product-grid">
          <div className="product-card" onClick={()=>{nav(`/details/${110}`)}}>
            <img
              src={watch2}
            />
            <h3>Aurelius Chrono</h3>
            <p>$7,500</p>
            <button>Explore</button>
          </div>
          <div className="product-card" onClick={()=>{nav(`/details/${109}`)}}>
            <img
              src={watch1}
            />
            <h3>Helios Tourbillon</h3>
            <p>$18,900</p>
            <button>Explore</button>
          </div>
          <div className="product-card" onClick={()=>{nav(`/details/${111}`)}}>
            <img
              src={watch3}
            />
            <h3>Mariner Classic</h3>
            <p>$2,150</p>
            <button>Explore</button>
          </div>
        </div>
      </section>
     <Footer></Footer>
    </div>
  );
}
