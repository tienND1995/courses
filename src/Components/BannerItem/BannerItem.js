import React from 'react'
import './BannerItem.scss'

export default function BannerItem(props) {
  const { title, home, subTitle } = props

  return (
    <section className="sub-header">
      <div className="container">
        <div className="sub-title">
          <p>
            {home}
            <i className="fa-solid fa-angle-right"></i>
            {title}
          </p>
          <h2>{title}</h2>

          {subTitle && (
            <p className="descreption">
              {subTitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
