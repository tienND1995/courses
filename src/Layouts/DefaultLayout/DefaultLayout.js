import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Error404 from '../../Errors/Error404'
import { protectedRoutes } from '../../Routes/protectedRoutes'
import { publicRoutes } from '../../Routes/publicRoutes'
import Footer from './Footer/Footer'
import Header from './Header/Header'

const DefaultLayout = () => {
  const location = useLocation()
  const handleSideBar = () => {
    const wrapper = document.querySelector('#Wrapper')
    const sideBar = document.querySelector('#navbarNavDropdown')
    const wrapOverLay = document.querySelector('#wrap-overlay')
    wrapper.addEventListener('click', (e) => {
      if (
        e.target.classList.contains('sidebar-close') ||
        e.target.id.includes('wrap-overlay')
      ) {
        sideBar.classList.remove('show')
        wrapOverLay.classList.remove('show')
      }

      if (e.target.classList.contains('sidebar-open')) {
        sideBar.classList.add('show')
        wrapOverLay.classList.add('show')
      }
    })
  }

  useEffect(() => {
    handleSideBar()
    const sideBar = document.querySelector('#navbarNavDropdown')
    const wrapOverLay = document.querySelector('#wrap-overlay')
    sideBar.classList.remove('show')
    wrapOverLay.classList.remove('show')
  }, [location.pathname])

  return (
    <div id="Wrapper">
      <Header />
      <main>
        <Routes>
          {publicRoutes}
          {protectedRoutes}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default DefaultLayout
