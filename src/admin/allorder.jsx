import React, { useEffect, useState } from "react"
import api from "../api/api"
import './Order.module.css'


function OrderItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("dashboard/")
      .then((res) => {
        setItems(res.data.order),
        setLoading(false)
      })
      .catch((err) => {
        console.error("Order items error:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="order-container">
      <h2>Order Items</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
            <td>{item.username}</td>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderItems
