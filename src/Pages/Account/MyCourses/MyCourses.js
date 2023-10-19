import React, { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import './MyCourses.scss'

import LoadingScreen from 'react-loading-screen'
import BannerItem from '../../../Components/BannerItem/BannerItem'
import SideBar from '../SideBar/SideBar'
import Avatar from '../Avatar/Avatar'

import { httpClient } from '../../../Services/httpClient/httpClient'
import config from '../../../Configs/Config.json'
import { Url } from '../../../Services/Utils/Url'
import { Auth } from '../../../Services/Utils/Auth'
import { convertVnd } from '../../../Services/Utils/ConvertVnd'

const { API_SERVER_AUTH, API_SERVER_ORDER } = config
const auth = new Auth()
const url = new Url()
const clientAuth = httpClient(API_SERVER_AUTH)
const clientOrder = httpClient(API_SERVER_ORDER)

const MyCourses = () => {
  const [loading, setLoading] = useState(true)

  const userId = localStorage.getItem('userId')
  const email = localStorage.getItem('userEmail')
  const nameAccount = localStorage.getItem('nameAccount')
  const picture = localStorage.getItem('picture')

  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
  })

  const getProfile = async (emailObj) => {
    const { res, data } = await clientAuth.post(auth.getProfile(), emailObj)
    if (res.ok) {
      setUserInfo(data.data)
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
    userId ? getOrder(userId) : setLoading(false)
  }, [])

  let index = 0

  return (
    <LoadingScreen
      loading={loading}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc="/images/logo.png"
      text="Content Loading..."
    >
      <BannerItem title="Khóa học của bạn" home="Home" subTitle="" />
      <div className="container my-courses">
        <div className="row">
          <div className="col-12 my-3">
            <Avatar
              name={userInfo.name || nameAccount}
              surname={userInfo.surname}
              picture={picture ? picture : null}
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
                    <th>STT</th>
                    <th>Tên khóa học</th>
                    <th>Giá</th>
                    <th>Nội dung</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((item) => {
                    return item.courses.map(({ id, name, sale_price }) => {
                      index++
                      return (
                        <tr key={id}>
                          <td>{index}</td>
                          <td>{name}</td>
                          <td>{convertVnd.format(sale_price)}</td>
                          <td>
                            <Link to={url.courseDetail(id, name)}>Vào học</Link>
                          </td>
                        </tr>
                      )
                    })
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty">
                <i class="fa-regular fa-circle-down"></i> Bạn chưa có khóa học
                nào
              </p>
            )}
          </div>
        </div>
      </div>
    </LoadingScreen>
  )
}

export default MyCourses
