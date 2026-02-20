import React, { useState } from "react"
import "./LoginRegister.css"
import { useContext } from "react"
import { AuthContext } from "./AuthContext"

import { FaUser } from "@react-icons/all-files/fa/FaUser"
import { FaLock } from "@react-icons/all-files/fa/FaLock"
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import api from "../api/api" 

const LoginRegister = () => {
  const [state, setState] = useState("")
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState({})

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const { setUser:setUserContext } = useContext(AuthContext)

  const nav = useNavigate()

  
  const handleRegister = async (e) => {
    e.preventDefault()
    setError({})

    try {
      const res = await api.post(
        "account/register/",
        {
          username: user.userName,
          email: user.email,
          password: user.password,
        }
      )

      toast.success(res.data.message)
      setUser({ userName: "", email: "", password: "" })
      setState("")

    } catch (err) {
      if (err.response?.status === 400) {
        const backendErrors = err.response.data

        setError({
          userName: backendErrors.username?.[0],
          email: backendErrors.email?.[0],
          password: backendErrors.password?.[0],
        })
      } else {
        toast.error("Server error. Please try again.")
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      
      const res = await api.post(
        "account/login/",
        {
          username: userName,
          password: password,
        },
        { withCredentials: true }
      )

      const {data:meRes} = await api.get("account/me/", {
        withCredentials: true,
      });

      setUserContext(meRes);

      toast.success("Login Successfully")

      
      if (meRes.role === 'admin') {
          nav("/dashboard");
        } else {
          nav("/")
        }

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials")
    }
  }

  return (
    <div className="body">
      <div className={`wrapper ${state}`}>

       
        <div className="form-box login">
          <form onSubmit={handleLogin} noValidate>
            <h1>Login</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon" />
            </div>

            <button className="btn-form" type="submit">
              Login
            </button>

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <a href="#" onClick={() => setState("active")}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>

       
        <div className="form-box register">
          <form onSubmit={handleRegister} noValidate>
            <h1>Register</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={user.userName}
                onChange={(e) =>
                  setUser({ ...user, userName: e.target.value })
                }
              />
              <FaUser className="icon" />
              <p className="error">{error?.userName}</p>
            </div>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
              />
              <FaEnvelope className="icon" />
              <p className="error">{error?.email}</p>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
              />
              <FaLock className="icon" />
              <p className="error">{error?.password}</p>
            </div>

            <button className="btn-form" type="submit">
              Register
            </button>

            <div className="register-link">
              <p>
                Already have an account?{" "}
                <a href="#" onClick={() => setState("")}>
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default LoginRegister