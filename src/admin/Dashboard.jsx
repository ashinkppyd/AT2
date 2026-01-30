import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import AdNavbar from './AdNavbar'
function Dashboard() {
  
  const [orders, setOrders] = useState([])
  const [user,setUser]=useState([])
  const [products,setproducs]=useState([])
  useEffect(() => {
    axios.get('http://localhost:3000/allOrders')
      .then((res) => setOrders(res.data.reverse()))
      .catch((err) => console.error("Error fetching orders:", err))
      axios.get(`http://localhost:3000/user`)
      .then((res)=>{setUser(res.data)})
      axios.get('http://localhost:3000/AllProducts')
      .then((res)=>setproducs(res.data))
  }, [])
  
let activeUser=user.filter((d)=>d.status==="active")

  return (
    <div className={styles.Dashboard}>
      <AdNavbar/>
      <div className={styles.subdash}>
      <h1>Dashboard</h1>
      <div className={styles.userInfo}>
      <div className={styles.div1}>total users <br /> {user.length}</div>
       <div className={styles.div2}>Active user<br />{activeUser.length}</div>
       <div className={styles.div3}>blockedUser<br />{user.length-activeUser.length}</div>
       <div className={styles.div4}>Total products<br />{products.length}</div>
      
       
      
      </div>
      <h3 className={styles.header}>All Orders</h3>

      <div className={styles.row}>
        {orders.length === 0 ? (
          <p>No orders available</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className={styles.order}>
              
    
              <div className={styles.orderdetails}>
                <p className="orderId">Order ID: {order.id}</p>
                <p>Name:{order.order.names}</p>
                <p>Total: ₹{order.order.total}</p>
                <p>Payment: {order.order.payment}</p>
                <p>Phone: {order.order.phoneNumber}</p>
                <p>Address: {order.order.address}</p>
                <p>Date: {order.order.date}</p>
              </div>

    
              <div className={styles.items}>
                {order.order.items.map((item) => (
                  <div key={item.id} className={styles.itemcard}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
        </div>
    </div>
  )
}

export default Dashboard
