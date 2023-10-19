import { Outlet, Route } from 'react-router-dom'
import AuthMiddleware from '../Middlewares/AuthMiddleware/AuthMiddleware'
import Account from '../Pages/Account/Accout'
import MyCourses from '../Pages/Account/MyCourses/MyCourses'
import MyOrder from '../Pages/Account/MyOrder/MyOrder'
import OrderDetail from '../Pages/Account/MyOrder/OrderDetail'
import Login from '../Pages/Auth/Login/Login'
import Register from '../Pages/Auth/Register/Register'
import Order from '../Pages/BuyCourse/Order/Order'

import OrderMiddleware from '../Middlewares/OrderMiddleware/OrderMiddleware'
export const protectedRoutes = (
  <>
    <Route path="/tai-khoan" element={<Outlet />}>
      <Route path="" element={<Account />} />
      <Route path="khoa-hoc-cua-toi" element={<MyCourses />} />
      <Route path="don-hang" element={<MyOrder />} />
      <Route path="don-hang/:id" element={<OrderDetail />} />
    </Route>

    <Route path="/dang-nhap" element={<AuthMiddleware />}>
      <Route path="" element={<Login />} />
    </Route>

    <Route path="/dang-ky" element={<AuthMiddleware />}>
      <Route path="" element={<Register />} />
    </Route>

    <Route path="/dat-hang" element={<OrderMiddleware/>}>
      <Route path="" element={<Order />} />
    </Route>
  </>
)
