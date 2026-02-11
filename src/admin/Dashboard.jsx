import React, { useEffect, useState } from "react"
import styles from "./Dashboard.module.css"
import api from "../api/api" 
import {  useNavigate } from "react-router-dom"

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    total_users: 0,
    active_users: 0,
    blocked_users: 0,
    all_orders: 0,
    all_products: 0,
  })
  const nav=useNavigate()

  useEffect(() => {
    api.get("dashboard/")
      .then((res) => setDashboard(res.data))
      .catch((err) => console.error("Dashboard error:", err))
  }, [])

  return (
    <div className={styles.subdash}>
      <h1>Dashboard</h1>

      <div className={styles.userInfo}>
        <div className={styles.div1}>Total Users <br /> {dashboard.total_users}</div>
        <div className={styles.div2}>Active Users <br /> {dashboard.active_users}</div>
        <div className={styles.div3}>Blocked Users <br /> {dashboard.blocked_users}</div>
        <div className={styles.div4}>All Orders <br /> {dashboard.all_orders}</div>
        <div className={styles.div5}>All Products <br /> {dashboard.all_products}</div>
      </div>
      <button onClick={()=>nav('/order') }>Order List</button>
    </div>
  )
}

export default Dashboard
