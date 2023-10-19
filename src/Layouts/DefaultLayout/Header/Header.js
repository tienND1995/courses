import React from 'react'
import ActionBar from './ActionBar/ActionBar'
import './Header.scss'
import Navigate from './Navigate/Navigate'

const Header = () => {
  return (
    <header className="header">
      <ActionBar />
      <Navigate />
    </header>
  )
}

export default Header
