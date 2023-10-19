import React, { useState, useEffect } from 'react'
import './MyOrder.scss'
import { Link } from 'react-router-dom'
import LoadingScreen from 'react-loading-screen'

import BannerItem from '../../../Components/BannerItem/BannerItem'
import Avatar from '../Avatar/Avatar'
import SideBar from '../SideBar/SideBar'

import config from '../../../Configs/Config.json'
import { httpClient } from '../../../Services/httpClient/httpClient'
import { Url } from '../../../Services/Utils/Url'
import { Auth } from '../../../Services/Utils/Auth'
import { convertVnd } from '../../../Services/Utils/ConvertVnd'

const { API_SERVER_AUTH, API_SERVER_ORDER } = config

const auth = new Auth()
const url = new Url()
const clientAuth = httpClient(API_SERVER_AUTH)
const clientOrder = httpClient(API_SERVER_ORDER)

export default function MyOrder() {
  const [loading, setLoading] = useState(true)

  const userId = localStorage.getItem('userId')
  const email = localStorage.getItem('userEmail')

  const nameAccount = localStorage.getItem('nameAccount')
  const picture = localStorage.getItem('picture')
  const [user, setUser] = useState({ name: '', surname: '' })

  const getProfile = async (emailObj) => {
    const { res, data } = await clientAuth.post(auth.getProfile(), emailObj)
    if (res.ok) {
      setUser(data.data)
    }
  }

  const [orders, setOrders] = useState({})
  const getOrder = async (id) => {
    const { res, data } = await clientOrder.get(url.getOrderUser(id))
    if (res.ok) {
      setOrders(data)
      setLoading(false)
    }
  }

  useEffect(() => {
    email && getProfile({ email })
    userId && getOrder(userId)
  }, [])

  return (
    <LoadingScreen
      loading={loading}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc="/images/logo.png"
      text="Content Loading..."
    >
      <BannerItem title="Đơn hàng" home="Home" />
      <div className="container my-order">
        <div className="row">
          <div className="col-12 my-3">
            <Avatar
              picture={picture ? picture : null}
              name={user.name || nameAccount}
              surname={user.surname}
            />
          </div>
          <div className="col-xl-3 col-lg-4 col-12 mb-4">
            <SideBar />
          </div>
          <div className="col-xl-9 col-lg-8 col-12">
            {orders.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Đơn hàng</th>
                    <th>Ngày</th>
                    <th>Tình trạng</th>
                    <th>Tổng</th>
                    <th>Các thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    let sum = 0
                    return (
                      <tr key={order.id}>
                        <td>#{order.codeOrder}</td>
                        <td>{order.date}</td>
                        <td>{order.status ? 'Đã bán' : 'Tạm giữ'}</td>
                        <td>
                          {order.courses?.forEach((item) => {
                            sum += item.sale_price * item.quantily
                          })}
                          {convertVnd.format(sum)}
                        </td>
                        <td>
                          <Link
                            to={url.orderDetail(order.codeOrder)}
                            state={{ order }}
                          >
                            Xem
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className='empty'> <i class="fa-regular fa-circle-down"></i> Bạn chưa có đơn hàng nào</p>
            )}
          </div>
        </div>
      </div>
    </LoadingScreen>
  )
}
