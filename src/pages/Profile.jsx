import React, { useEffect, useState } from 'react'
import "./Profile.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Profile() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    axios.get(
      'http://127.0.0.1:8000/api/account/profile/',
      { withCredentials: true }
    )
    .then(res => {
      setUser(res.data)
      setOrders(res.data.orders || [])
    })
    .catch(() => {
      nav('/login')
    })
  }, [])

  function handleLogout() {
    axios.post(
      'http://127.0.0.1:8000/api/account/logout/',
      {},
      { withCredentials: true }
    ).then(() => {
      toast.success("Logged out")
      nav('/login')
    })
  }

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <div className='user'>
        <div>
          <h2>Personal details</h2>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
        <img src='/src/assets/profile.jpg' className='pfp'/>
      </div>
    </div>
  )
}

export default Profile
