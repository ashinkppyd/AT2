import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useNavigate, useLocation, data } from 'react-router-dom'
import axios from 'axios'
import api from '../api/api'

function NavBar() {
  const nav = useNavigate()
  const location = useLocation()
  const [isAuth, setIsAuth] = useState(false)
useEffect(() => {
  api.get("account/profile/")
    .then((res) => {
      setIsAuth(res.data.authenticated === true);
    })
    .catch(() => {
      setIsAuth(false);
    });
}, [location.pathname]);


  return (
    <div className='con'>
      <ul className='left'>
        <li className='listItem logo' onClick={()=> nav('/')}>AT2</li>
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
            </>
          ) : (
            <button className='nav-btn' onClick={() => nav('/login')}>Login</button>
          )}
        </li>
      </ul>
    </div>
  )
}

export default NavBar
