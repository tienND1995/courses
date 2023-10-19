import React from 'react'
import BannerItem from '../../Components/BannerItem/BannerItem'
import './Account.scss'
import Avatar from './Avatar/Avatar'
import SideBar from './SideBar/SideBar'

import LoadingScreen from 'react-loading-screen'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useEffect, useState } from 'react'

import config from '../../Configs/Config.json'
import { httpClient } from '../../Services/httpClient/httpClient'
import { Auth } from '../../Services/Utils/Auth'

import { validateFormUpdateAccount } from '../../Services/Utils/validateForm'

const auth = new Auth()
const { API_SERVER_AUTH } = config
const clientAuth = httpClient(API_SERVER_AUTH)

const Account = () => {
  const [loading, setLoading] = useState(true)

  const userEmail = localStorage.getItem('userEmail')
  const socialFaceBook = localStorage.getItem('nameAccount')
  const picture = localStorage.getItem('picture')

  const [form, setForm] = useState({
    name: '',
    surname: '',
    number: '',
    email: '',
  })

  const [user, setUser] = useState({})
  const [errors, setErrors] = useState({})
  const { name, surname, number, email } = form

  const getProfile = async (emailObj) => {
    const { res, data } = await clientAuth.post(auth.getProfile(), emailObj)
    if (res.ok) {
      setUser(data.data)
      setLoading(false)
      setForm({ ...form, ...data.data })
    }
  }

  useEffect(() => {
    socialFaceBook && setUser({...user, name: socialFaceBook})
    userEmail ? getProfile({ email: userEmail }) : setLoading(false)
  }, [])

  const handleChangeValue = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    let errorsFake = {}

    try {
      await validateFormUpdateAccount.validate(form, { abortEarly: false })
      toast.success('Cập nhật thành công !')
    } catch (error) {
      for (const validationError of error.inner) {
        let nameError = validationError.path
        const messageError = validationError.message

        if (Object.keys(errorsFake).indexOf(nameError) === -1) {
          errorsFake[nameError] = messageError
        }
      }
    }
    setErrors({ ...errorsFake })
  }

  return (
    <LoadingScreen
      loading={loading}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc="/images/logo.png"
      text="Content Loading..."
    >
      <BannerItem title="Tài khoản" home="Home" subTitle="" />
      <div className="container">
        <div className="row">
          <div className="col-12  my-3">
            <Avatar
              name={user.name}
              surname={user.surname ? user.surname : ''}
              picture={picture ? picture : null}
            />
          </div>
          <div className="col-xl-3 col-lg-4 col-12 mb-4">
            <SideBar />
          </div>
          <div className="col-xl-9 col-lg-8 col-12">
            <form action="" className="mb-5" onSubmit={handleSubmitForm}>
              <div className="mb-3 form-name">
                <div className="w-50">
                  <label htmlFor="">
                    Tên <span className="star">&#42;</span>
                  </label>
                  <input
                    name="name"
                    onChange={handleChangeValue}
                    type="text"
                    className={`form-control ${
                      errors.name ? 'is-invalid' : ''
                    }`}
                    value={name}
                  />
                  <div className="invalid-feedback">{errors.name}</div>
                </div>

                <div className="w-50">
                  <label htmlFor="">
                    Họ <span className="star">&#42;</span>
                  </label>
                  <input
                    name="surname"
                    onChange={handleChangeValue}
                    type="text"
                    className={`form-control ${
                      errors.surname ? 'is-invalid' : ''
                    }`}
                    value={surname}
                  />
                  <div className="invalid-feedback">{errors.surname}</div>
                </div>
              </div>

              <div className="mb-3 form-showname">
                <label htmlFor="">
                  Tên hiện thị <span className="star">&#42;</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder={`${surname} ${name}`}
                  disabled
                />

                <p>
                  <em>
                    Tên này sẽ hiển thị trong trang Tài khoản và phần Đánh giá
                    sản phẩm
                  </em>
                </p>
              </div>

              <div className="mb-3">
                <label htmlFor="">
                  Địa chỉ email <span className="star">&#42;</span>
                </label>
                <input
                  name="email"
                  onChange={handleChangeValue}
                  type="text"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={email}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="">
                  Số điện thoại <span className="star">&#42;</span>
                </label>
                <input
                  name="number"
                  onChange={handleChangeValue}
                  type="number"
                  className={`form-control ${
                    errors.number ? 'is-invalid' : ''
                  }`}
                  value={number}
                />

                <div className="invalid-feedback">{errors.number}</div>
              </div>

              <button type="submit" className="btn btn-primary btn-save">
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </LoadingScreen>
  )
}

export default Account
