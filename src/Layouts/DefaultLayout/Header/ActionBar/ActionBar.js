import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import './ActionBar.scss'

import { authSelector } from '../../../../Pages/Auth/authSlice'
import { Account } from '../../../../Services/Utils/Account'
import { Auth } from '../../../../Services/Utils/Auth'

import config from '../../../../Configs/Config.json'
import { cartActions } from '../../../../Pages/BuyCourse/cartSlice'
import { httpClient } from '../../../../Services/httpClient/httpClient'
import SearchForm from '../SearchForm/SearchForm'

const { API_SERVER_AUTH } = config
const clientAuth = httpClient(API_SERVER_AUTH)

const auth = new Auth()

export default function ActionBar() {
  const authSelectorState = useSelector(authSelector)
  const { productName } = cartActions

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const socialFaceBook = localStorage.getItem('nameAccount')
  const email = localStorage.getItem('userEmail')
  const [userName, setUserName] = useState('')

  const getProfile = async (emailObj) => {
    const { res, data } = await clientAuth.post(auth.getProfile(), emailObj)

    if (res.ok) {
      setUserName(data.data.name)
    }
  }

  useEffect(() => {
    email && getProfile({ email })
    socialFaceBook && setUserName(socialFaceBook)
  }, [authSelectorState])

  return (
    <div className="action-bar">
      <div className="container">
        <div className="row align-items-center">
          <div className="d-none d-md-flex col-md-4 col-lg-2 mb-3 mb-lg-0">
            <SearchForm />
          </div>
          <div className="d-none d-md-flex col-md-8 col-lg-6 mb-3 mb-lg-0">
            <div className="d-flex">
              <p className="slogan">
                <i className="fas fa-phone" />
                Tư vấn &amp; hỗ trợ:
                <a href="#">0989341634</a>
              </p>
              <p className="mail">
                <i className="far fa-envelope" />
                <a href="#">ngocnguyenchi1507@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            {auth.isLogin() ? (
              <div className="account">
                <div className="account-name account-bg">
                  <Link to={new Account().account}>
                    <i class="fa-regular fa-user"></i>Hi!
                    <span>{` ${userName} `} </span>
                    -Tài khoản
                  </Link>
                </div>

                <div className="account-logout account-bg">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      auth.logout()
                      dispatch(productName({}))
                      navigate('/')
                    }}
                  >
                   <i class="fa-solid fa-share-from-square"></i> Thoát
                  </a>
                </div>
                
              </div>
            ) : (
              <ul className="social">
                <li>
                  <Link to={auth.register}>
                    <i className="fas fa-user" /> Đăng ký
                  </Link>
                </li>
                <li>
                  <Link to={auth.login}>
                    <i className="fas fa-key" /> Đăng nhập
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
