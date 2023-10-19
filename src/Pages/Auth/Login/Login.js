import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Login.scss'

import { FacebookLoginButton } from 'react-social-login-buttons'
import { LoginSocialFacebook } from 'reactjs-social-login'

import { validateFormLogin } from '../../../Services/Utils/validateForm'

import config from '../../../Configs/Config.json'
import { httpClient } from '../../../Services/httpClient/httpClient'
import { Auth } from '../../../Services/Utils/Auth'
import { authActions, authSelector } from '../authSlice'

const { API_SERVER_AUTH } = config
const client = httpClient(API_SERVER_AUTH)

const Login = () => {
  const authSelectorState = useSelector(authSelector)

  const { login, getUser } = authActions
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChangeValue = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()

    let errorsFake = {}

    try {
      await validateFormLogin.validate(form, { abortEarly: false })
      setLoading(true)
      postLogin(form)
      
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

  const postLogin = async (user) => {
    const { res, data } = await client.post('/login', user)
    if (res.ok) {
      const accessToken = data.data.accesstoken

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('userEmail', data.data.email)
      localStorage.setItem('userId', data.data.id)
      dispatch(login(true))
      dispatch(getUser(data.data))

      toast.success('Đăng nhập thành công!')
      setTimeout(() => {
        navigate('/')
      }, 999)
    } else {
      toast.error('Thông tin đăng nhập không hợp lệ!')
    }
  }

  const handleLoginSocial = (data) => {
    if (data) {
      const accessToken = data.accessToken
      const nameAccount = data.short_name
      const picture = data.picture.data.url
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('nameAccount', nameAccount)
      localStorage.setItem('picture', picture)
      localStorage.setItem('userId', data.userID)
      dispatch(login(true))

      setTimeout(() => {
        navigate('/')
      })
    }
  }

  useEffect(() => {
    if (Object.keys(authSelectorState.user).length) {
      const dataForm = { ...authSelectorState.user }
      setForm(dataForm)
    }
  }, [])

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
      <div className="sign-in">
        <h3>Đăng nhập</h3>
        <form action="" onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Email"
            onChange={handleChangeValue}
            name="email"
            value={form.email}
            className={errors.email ? 'is-invalid' : ''}
          />
          <div className="invalid-feedback">{errors.email}</div>

          <input
            type="password"
            placeholder="Mật khẩu"
            onChange={handleChangeValue}
            name="password"
            value={form.password}
            className={errors.password ? 'is-invalid' : ''}
          />
          <div className="invalid-feedback">{errors.password}</div>

          <div className="checker">
            <input type="checkbox" />
            <span>Tự động đăng nhập</span>
          </div>
          <p className="forgot-password">Quên mật khẩu đăng nhập</p>
          {!loading ? (
            <button className="btn-login mb-3" type="submit">
              Đăng nhập
            </button>
          ) : (
            <button className="btn-login-loading mb-3" type="submit" disabled>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          )}

         
        </form>
        <LoginSocialFacebook
          appId={'742147440729507' || ''}
          onResolve={({ provider, data }) => {
            handleLoginSocial(data)
          }}
          onReject={(error) => {
            console.log(error)
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
        <p className="sign-up">
          Bạn chưa có tài khoản?
          <Link to={new Auth().register}>Đăng kí ngay</Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  )
}

export default Login
