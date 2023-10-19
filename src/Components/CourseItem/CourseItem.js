import React from 'react'
import './CourseItem.scss'

import { Link } from 'react-router-dom'
import { Url } from '../../Services/Utils/Url'
import { convertVnd } from '../../Services/Utils/ConvertVnd'

const url = new Url()

const CourseItem = (props) => {
  const {
    id,
    thumbnail,
    teacher_detail,
    name,
    sale_price,
    price,
    watch,
    section,
    lessions_count,
    durations,
    isListCourse,
  } = props



  return (
    <div className="col-12 col-lg-6">
      <div className="d-md-flex course">
        <div className="banner-course">
          {isListCourse ? (
            <img src={`/${thumbnail}`} alt={teacher_detail.name} />
          ) : (
            <img src={thumbnail} alt={teacher_detail.name} />
          )}
        </div>
        <div className="descreption-course">
          <div className="descreption-top">
            <p>
              <i className="fa-solid fa-clock" />
              {durations}
            </p>
            <p>
              <i className="fa-solid fa-video" />
              {`${section} phần/${lessions_count} bài`}
            </p>
            <p>
              <i className="fa-solid fa-eye" />
              {watch}
            </p>
          </div>

          <h5 className="descreption-title">
            <Link to={url.courseDetail(id, name)}>{name}</Link>
          </h5>
          <div className="descreption-teacher">
            <img src={teacher_detail.image} alt={teacher_detail.name} />
            <span>{teacher_detail.name}</span>
          </div>
          <p className="descreption-price">
            <span className="sale">{convertVnd.format(price)}</span>
            <span>{convertVnd.format(sale_price)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CourseItem
