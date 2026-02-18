import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";  <-- You don't need this anymore
import "./Details.css";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/api"; // This handles your secure URL automatically

function Details() {
  const { id } = useParams();

  const [currentId, setCurrentId] = useState(id);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    // CHANGE 1: Use api.get and remove the domain part
    api
      .get(`products/watches/${currentId}/`)
      .then((res) => setProduct(res.data))
      .catch(() => toast.error("Product not found"));

    // CHANGE 2: Use api.get for the related products list as well
    api
      .get("products/watches/")
      .then((res) => setAllProducts(res.data.results || []))
      .catch(() => toast.error("Failed to load products"));
  }, [currentId]);

  function handleCart(productId) {
    api
      .post("cart/add/", { product: productId })
      .then(() => {
        toast.success("Item added to cart");
      })
      .catch(() => {
        toast.error("Please login first");
      });
  }

  if (!product) return <p>Loading...</p>;

  const related = Array.isArray(allProducts)
    ? allProducts.filter(
        (p) => p.category === product.category && p.id !== product.id
      )
    : [];

  const rating = Math.max(1, Math.floor(Math.random() * 5) + 1);

  return (
    <>
      <div className="contain d-flex">
        <div className="image-container" style={{ width: "50%" }}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details" style={{ width: "50%" }}>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>

          <p>
            Rating: {"★".repeat(rating)} ({rating})
          </p>

          <p className="price">₹{product.price}</p>

          <button
            className="carts-rel"
            style={{ padding: "20px 50px" }}
            onClick={() => handleCart(product.id)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="related-product">
        {related.map((p) => (
          <div
            className="card-rel"
            key={p.id}
            onClick={() => setCurrentId(p.id)}
          >
            <img className="images-rel" src={p.image} alt={p.name} />
            <h2 className="names-rel">{p.name}</h2>
            <p className="categorys-rel">{p.category}</p>
            <p className="prize-rel">₹{p.price}</p>

            <button
              className="carts-rel"
              onClick={(e) => {
                e.stopPropagation();
                handleCart(p.id);
              }}
            >
              Cart
            </button>
          </div>
        ))}
      </div>

      <ToastContainer autoClose={1000} />
    </>
  );
}

export default Details;