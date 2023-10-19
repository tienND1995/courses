import React, { useEffect, useState } from 'react'

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Url } from '../../../../Services/Utils/Url'
import './SearchForm.scss'

const url = new Url()

export default function SearchForm() {
  const [form, setForm] = useState({ keyword: '' })
  const { keyword } = form
  const navigate = useNavigate()

  const location = useLocation()
  const [search] = useSearchParams()

  useEffect(() => {
    setForm({ keyword: search.get('keyword') })
    if (location.pathname !== '/tim-kiem') {
      setForm({ keyword: '' })
    }
  }, [location.pathname])

  const handleSubmit = (e) => {
    e.preventDefault()

    navigate(url.getSearch(keyword))
  }

  const handleChange = (e) => {
    setForm({ ...form, keyword: e.target.value })
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        type="text"
        placeholder="Bạn tìm gì"
        value={keyword}
        className='search-form'
      />
      <button type="submit" className="btn btn-primary">
        Tìm
      </button>
    </form>
  )
}
