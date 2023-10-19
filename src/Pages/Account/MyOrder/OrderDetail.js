import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import BannerItem from '../../../Components/BannerItem/BannerItem'
import config from '../../../Configs/Config.json'
import { Auth } from '../../../Services/Utils/Auth'
import { httpClient } from '../../../Services/httpClient/httpClient'
import Avatar from '../Avatar/Avatar'
import SideBar from '../SideBar/SideBar'

import { convertVnd } from '../../../Services/Utils/ConvertVnd'

const { API_SERVER_AUTH } = config
const auth = new Auth()

const clientAuth = httpClient(API_SERVER_AUTH)

export default function OrderDetail() {
  const { state } = useLocation()
  const { order } = state

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

  useEffect(() => {
    if (email) {
      getProfile({ email })
    }
  }, [])

  let totalPrice = 0
  return (
    <>
      <BannerItem title="Order Detail" home="Home" />
      <div className="container">
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
            <p>
              Đơn hàng #<mark className="order-number">{order.codeOrder}</mark>{' '}
              đã được đặt lúc
              <mark className="order-date"> {order.date}</mark> và hiện tại là
              <mark className="order-status">
                {order.status ? 'Đã thanh toán' : 'Tạm giữ'}
              </mark>
              .
            </p>

            <table className="table table-bordered mb-3">
              <tbody>
                <tr>
                  <th>Mã đơn hàng</th>
                  <td> {order.codeOrder}</td>
                </tr>

                <tr>
                  <th>Ngày</th>
                  <td> {order.date}</td>
                </tr>

                <tr>
                  <th>Tình trạng đơn hàng</th>
                  <td>{order.status ? 'Đã thanh toán' : 'Tạm giữ'}</td>
                </tr>
              </tbody>
            </table>

            <table className="table table-bordered mb-3">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {order.courses.map((course) => {
                  totalPrice += course.sale_price * course.quantily
                  return (
                    <tr key={course.id}>
                      <td>
                        {course.name} <strong>x {course.quantily}</strong>
                      </td>
                      <td>{convertVnd.format(course.sale_price)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th>Tổng số phụ</th>
                  <td>{convertVnd.format(totalPrice)}</td>
                </tr>

                <tr>
                  <th>Phương thức thanh toán</th>
                  <td>Chuyển khoản ngân hàng</td>
                </tr>

                <tr>
                  <th>Tổng cộng</th>
                  <td>{convertVnd.format(totalPrice)}</td>
                </tr>
              </tfoot>
            </table>

            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Thông tin khách hàng</th>
                  <td>
                    <p>
                      <strong>Email: </strong>
                      {order.email}
                    </p>
                    <p>
                      <strong>Phone: </strong>
                      {order.number}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
