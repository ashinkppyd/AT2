import React from "react";
import { Link } from "react-router-dom";


const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", backgroundColor: "#f9f9f9" },
  card: { textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "400px" },
  icon: { fontSize: "60px", margin: "0 0 20px 0" },
  heading: { color: "#28a745", marginBottom: "10px" },
  text: { color: "#555", marginBottom: "30px", lineHeight: "1.5" },
  button: { backgroundColor: "#e53e3e", color: "white", padding: "10px 20px", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" }
};

function OrderSuccess() {
  console.log("hello")
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.icon}>✅</h1>
        <h2 style={styles.heading}>Payment Successful!</h2>
        <p style={styles.text}>
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        
        <Link to="/shop" style={styles.button}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}


export default OrderSuccess;