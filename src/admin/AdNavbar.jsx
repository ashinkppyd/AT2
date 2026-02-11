import React from "react"
import styles from "./AdNavbar.module.css"
import { useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../Autho/AuthContext"
import api from "../api/api"

function AdNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser:setUserContext } = useContext(AuthContext);

  function handleLogout() {
    api.post("account/logout/").then(()=>{
      setUserContext(null)
    }).finally(() => navigate("/login"));
  }

  return (
    <div className={styles.main}>
      <h2>ADMIN PANEL</h2>

      <div className={styles.sub}>
        <h5
          className={location.pathname === "/dashboard" ? styles.active : styles.items}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </h5>
        <hr />

        <h5
          className={location.pathname === "/usermanagement" ? styles.active : styles.items}
          onClick={() => navigate("/usermanagement")}
        >
          User Management
        </h5>
        <hr />

        <h5
          className={location.pathname === "/productmanagement" ? styles.active : styles.items}
          onClick={() => navigate("/productmanagement")}
        >
          Product Management
        </h5>
        <hr />
      </div>

      <button onClick={handleLogout}>LOGOUT</button>
    </div>
  )
}

export default AdNavbar
