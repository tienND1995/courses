import React from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { cartSelector } from '../../../../Pages/BuyCourse/cartSlice'
import { Url } from '../../../../Services/Utils/Url'
import './Navigate.scss'

function Navigate() {
  const cartState = useSelector(cartSelector)
  const order = JSON.parse(localStorage.getItem('order'))

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-md container-fluid">
        <div id="wrap-overlay"></div>
        <Link className="navbar-brand" to="/">
          <img src="/images/logo.png" alt="" />
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="fa-solid fa-bars sidebar-open"></i>
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item d-lg-none">
              <a className="nav-close nav-link">
                <i className="fa-solid fa-xmark sidebar-close"></i>
              </a>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/">
                <i className="fas fa-home" />
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={new Url().getCourses()}>
                <i className="fas fa-tv" />
                Khóa học
              </NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-route" />
                Lộ trình
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-globe-europe" />
                Kiến thức
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-star" />
                Tuyển dụng
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-broadcast-tower" />
                CTV
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-user" />
                DSCons
              </a>
            </li>
          </ul>
        </div>
        <p className="navbar-cart">
          <NavLink to="/gio-hang">
            <i className="fas fa-shopping-cart" />{' '}
            <span>{order ? order.length : 0}</span>
          </NavLink>
        </p>
      </div>
    </nav>
  )
}

export default Navigate
