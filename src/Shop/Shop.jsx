import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Footer from "../components/Footer";
import './shop.css'
function Shop() {
  const [product, setProduct] = useState([]);
  const [brand, setbrand] = useState("all");
  const [filtered, setFiletered] = useState([]);
  const [category, setcategory] = useState("all");
  const [price, setprice] = useState("all");
  const [search, setSearch] = useState('');

  let nav = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/AllProducts")
      .then((res) => {
        setProduct(res.data);
        setFiletered(res.data);
      })
      .catch(() => alert("Something went wrong"));
  }, []);

  let user = localStorage.getItem('user');
  let conv = user ? JSON.parse(user) : null;
  let userId = conv ? conv.id : null;

  function addToCart(id) {
    if (!conv || !userId ) {
      toast.error("Please login to add items!");
      nav("/login");
      return;
    }

    let updatedCart = [...(conv.cart || []), id];
    axios.patch(`http://localhost:3000/user/${userId}`, { cart: updatedCart })
      .then(() => {
    
        toast.success("item added!");
      });

    conv.cart = updatedCart;
    localStorage.setItem("user", JSON.stringify(conv));
  }

  useEffect(() => {
    let result = [...product];
    if (brand !== "all") {
      result = result.filter((p) => p.name === brand);
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (price !== "all") {
      if (price === "lowToHigh") {
        result = [...result].sort((x, y) => x.price - y.price); 
      } else {
        result = [...result].sort((x, y) => y.price - x.price);
      }
    }

    if (search.trim() !== "") {
      result = result.filter((items) =>
        items.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiletered(result);
  }, [brand, category, price, search, product]);

  return (
    <>
      <div className="contai ">
        <nav className="nav">
          <select onChange={(e) => setbrand(e.target.value)}>
            <option value="all">All</option>
            <option value="Rolex">Rolex</option>
            <option value="CASIO">CASIO</option>
            <option value="FOSSIL">FOSSIL</option>
            <option value="Noise">Noise</option>
            <option value="samsung">samsung</option>
          </select>

          <select onChange={(e) => setcategory(e.target.value)}>
            <option value="all">All</option>
            <option value="AUTOMATIC">AUTOMATIC</option>
            <option value="DIGITAL">DIGITAL</option>
            <option value="SMART WATCH">SMART WATCH</option>
          </select>

          <select onChange={(e) => setprice(e.target.value)}>
            <option value="all">Choose</option>
            <option value="lowToHigh">Low to High</option>
            <option value="HighToLow">High to low</option>
          </select>

          <div>
            <input
              type="text"
              placeholder="Search..."
              style={{ borderRadius: "10px" }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </nav>
        <br></br>

        <div className="row">
          {filtered.map((p, index) => (
            <div key={index} className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm img-hover">
                <img
                  src={p.image}
                  className="card-img-top"
                  alt={p.name}
                  style={{ objectFit: "contain", height: "250px" }}
                  onClick={() => { nav(`/details/${p.id}`) }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-muted">{p.category}</p>
                  <h4 className="text-primary mb-3">₹{p.price}</h4>
                  <button
                    className="btn btn-dark mt-auto"
                    onClick={() => { addToCart(p.id) }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ToastContainer autoClose={1000} />
      </div>
      <Footer />
    </>
  );
}

export default Shop;
