import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { validateFormRegister } from '../../../Services/Utils/validateForm'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Register.scss'

import config from '../../../Configs/Config.json'
import { httpClient } from '../../../Services/httpClient/httpClient'
import { Auth } from '../../../Services/Utils/Auth'
import { handleTypePassword } from '../../../Services/Utils/handleTypePassword'
import { authActions } from '../authSlice'

const { API_SERVER_AUTH } = config
const client = httpClient(API_SERVER_AUTH)

const Register = () => {
  const { getUser } = authActions
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    surname: '',
    number: '',
    email: '',
    password: '',
    enterpassword: '',
  })

  const [typePassword, setTypePassword] = useState('password')
  const [typeEnterPassword, setTypeEnterPassword] = useState('password')

  const [errors, setErrors] = useState({})
  const { name, surname, number, email, password, enterpassword } = form

  const handleChangeValue = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    let errorsFake = {}

    try {
      await validateFormRegister.validate(form, { abortEarly: false })
      setLoading(true)
      postUser({ name, surname, number, email, password })
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

  const postUser = async (user) => {
    const { res, data } = await client.post('/register', user)

    if (res.ok) {
      dispatch(getUser({ email, password }))

      toast.success('Đăng ký tài khoản thành công!')
      setTimeout(() => {
        navigate('/dang-nhap')
      }, 999)
    } else {
      toast.error('Đăng ký tài khoản thất bại!')
    }
  }

  return (
    <div className="container">
      <div className="home-back">
        <Link to="/">
          <span>
            <i className="fa-solid fa-arrow-left" />
          </span>
          Về trang chủ
        </Link>
      </div>
      <div className="sign-up">
        <h3>Đăng kí</h3>
        <form action="" onSubmit={handleSubmitForm}>
          <div className="mb-3">
            <input
              className={errors.surname ? 'is-invalid' : ''}
              type="text"
              placeholder="Họ và tên đệm"
              name="surname"
              onChange={handleChangeValue}
              value={surname}
            />
            <div className="invalid-feedback">{errors.surname}</div>
          </div>
          <div className="mb-3">
            <input
              className={errors.name ? 'is-invalid' : ''}
              type="text"
              placeholder="Tên"
              name="name"
              onChange={handleChangeValue}
              value={name}
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>
          <div className="mb-3">
            <input
              className={errors.email ? 'is-invalid' : ''}
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChangeValue}
              value={email}
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>
          <div className="mb-3">
            <input
              className={errors.number ? 'is-invalid' : ''}
              type="number"
              placeholder="Số điện thoại"
              name="number"
              onChange={handleChangeValue}
              value={number}
            />
            <div className="invalid-feedback">{errors.number}</div>
          </div>
          <div className="mb-3">
            <div className={`password ${errors.password ? 'is-invalid' : ''}`}>
              <input
                type={typePassword}
                placeholder="Mật khẩu"
                name="password"
                onChange={handleChangeValue}
                value={password}
              />

              <i
                className={`fa-solid fa-eye${
                  typePassword === 'text' ? '-slash' : ''
                }`}
                onClick={() => {
                  handleTypePassword(typePassword, setTypePassword)
                }}
              ></i>
            </div>

            <div className="invalid-feedback">{errors.password}</div>
          </div>
          <div className="mb-3">
            <div
              className={`password ${errors.enterpassword ? 'is-invalid' : ''}`}
            >
              <input
                type={typeEnterPassword}
                placeholder="Lặp lại mật khẩu"
                name="enterpassword"
                onChange={handleChangeValue}
                value={enterpassword}
              />

              <i
                className={`fa-solid fa-eye${
                  typeEnterPassword === 'text' ? '-slash' : ''
                }`}
                onClick={() => {
                  handleTypePassword(typeEnterPassword, setTypeEnterPassword)
                }}
              ></i>
            </div>

            <div className="invalid-feedback">{errors.enterpassword}</div>
          </div>

          {!loading ? (
            <button className="btn-register" type="submit">
              <i className="fa-solid fa-user" />
              Đăng kí
            </button>
          ) : (
            <button className="btn-register-loading" type="submit" disabled>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          )}
        </form>
        <p className="sign-in">
          Bạn đã có tài khoản?
          <Link to={new Auth().login}>Đăng nhập ngay</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register
