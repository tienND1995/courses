import React from 'react'
import { NavLink } from 'react-router-dom'
import './SideBar.scss'

export default function SideBar() {
  return (
    <ul className="pagination flex-column">
      <li className="page-item">
        <NavLink className="page-link" to="/tai-khoan" end>
          Tài khoản
        </NavLink>
      </li>

      <li className="page-item">
        <NavLink className="page-link" to="/tai-khoan/khoa-hoc-cua-toi">
          Khóa học của bạn
        </NavLink>
      </li>

      <li className="page-item">
        <NavLink className="page-link" to="/tai-khoan/don-hang">
          Đơn hàng
        </NavLink>
      </li>
    </ul>
  )
}
