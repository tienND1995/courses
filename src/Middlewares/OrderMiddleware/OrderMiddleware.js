import { Navigate, Outlet } from 'react-router-dom'
import { Auth } from '../../Services/Utils/Auth'

const OrderMiddleware = () => {
  const isLogin = new Auth().isLogin()
  const courseId = localStorage.getItem('courseId')

  return isLogin && courseId ? <Outlet /> : <Navigate to="/dang-nhap" />
}

export default OrderMiddleware
