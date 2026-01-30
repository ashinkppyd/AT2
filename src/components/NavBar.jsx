import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

function NavBar() {
  const nav = useNavigate()
  const location = useLocation()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    axios.get(
      'http://127.0.0.1:8000/api/account/profile/',
      { withCredentials: true }
    )
    .then((res) => {
      console.log("hello");
      setIsAuth(true)
        console.log(res.data)

    })
    .catch((error) => {
      console.log(error.message);
      setIsAuth(false)
    })
  }, [location.pathname]) // 🔥 re-check on route change

  function handleLogout() {
    axios.post(
      'http://127.0.0.1:8000/api/account/logout/',
      {},
      { withCredentials: true }
    ).then(() => {
      setIsAuth(false)
      nav('/login')
    })
  }

  return (
    <div className='con'>
      <ul className='left'>
        <li className='listItem logo'>AT2</li>
      </ul>

      <ul className='right'>
        <li className='listItem' onClick={() => nav('/')}>Home</li>
        <li className='listItem' onClick={() => nav('/shop')}>Shop</li>
        <li className='listItem' onClick={() => nav('/blog')}>Blog</li>
        <li className='listItem' onClick={() => nav('/cart')}>Cart</li>

        <li>
          {isAuth ? (
            <>
              <span className='listItem' onClick={() => nav('/profile')}>
                Profile
              </span>
              <span className='listItem' onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : (
            <button onClick={() => nav('/login')}>Login</button>
          )}
        </li>
      </ul>
    </div>
  )
}

export default NavBar
