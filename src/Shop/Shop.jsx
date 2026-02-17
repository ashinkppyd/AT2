import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../components/Footer";
import "./shop.css";
import api from "../api/api";

function Shop() {
  const [product, setProduct] = useState([]);     
  const [filtered, setFiltered] = useState([]);   
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");
  const [search, setSearch] = useState("");

 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const nav = useNavigate();

  const fetchProducts = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `http://3.6.89.120/api/products/watches/?page=${pageNumber}`
      );

      const results = res.data.results || [];

      setProduct(results);
      setFiltered(results);

      setTotalPages(Math.ceil(res.data.count / 12));
    } catch (err) {
      toast.error("Failed to load products");
      setProduct([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);
  const addToCart = async (productId) => {
    try {
      const res = await api.post(
        "cart/add/",
        { product: productId },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Item added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error(err.response.data.message);
        setTimeout(() => nav("/login"), 1500);
      } else {
        toast.error("Failed to add item");
      }
    }
  };

  useEffect(() => {
    let result = [...product];

    if (brand !== "all") {
      result = result.filter((p) => p.name === brand);
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    if (price !== "all") {
      result.sort((a, b) =>
        price === "lowToHigh"
          ? Number(a.price) - Number(b.price)
          : Number(b.price) - Number(a.price)
      );
    }

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [brand, category, price, search, product]);

  return (
    <>
      <div className="contai">
        
        <nav className="nav">
          <select onChange={(e) => setBrand(e.target.value)}>
            <option value="all">All</option>
            <option value="Rolex">Rolex</option>
            <option value="CASIO">CASIO</option>
            <option value="FOSSIL">FOSSIL</option>
            <option value="Noise">Noise</option>
            <option value="Samsung">Samsung</option>
          </select>

          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="AUTOMATIC">AUTOMATIC</option>
            <option value="DIGITAL">DIGITAL</option>
            <option value="SMART WATCH">SMART WATCH</option>
          </select>

          <select onChange={(e) => setPrice(e.target.value)}>
            <option value="all">Choose</option>
            <option value="lowToHigh">Low to High</option>
            <option value="HighToLow">High to Low</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </nav>

        <div className="row mt-3">
          {filtered.length === 0 ? (
            <p>No products found</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="col-md-3 mb-3">
                <div className="card h-100 shadow-sm">
                  <img
                    src={p.image}
                    className="card-img-top"
                    alt={p.name}
                    style={{ objectFit: "contain", height: "250px" }}
                    onClick={() => nav(`/details/${p.id}`)}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5>{p.name}</h5>
                    <p className="text-muted">{p.category}</p>
                    <h4>₹{p.price}</h4>

                    <button
                      className="btn btn-dark mt-auto"
                      onClick={() => addToCart(p.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

       
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}

        <ToastContainer autoClose={1000} />
      </div>

      <Footer />
    </>
  );
}

export default Shop;
