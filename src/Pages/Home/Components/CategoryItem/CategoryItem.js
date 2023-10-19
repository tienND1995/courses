import React from 'react'
import { Link } from 'react-router-dom'
import { Url } from '../../../../Services/Utils/Url'

const url = new Url()

const CategoryItem = (props) => {
  const { title, courseList } = props

  return (
    <div className="course-group">
      <p>{title}</p>
      <ul>
        {courseList.map(({ name, id }, idx) =>
          idx < 4 ? (
            <li key={id} className={`${idx === 3 ? 'mb-3' : ''}`}>
              <Link to={url.courseDetail(id, name)}>{name}</Link>
            </li>
          ) : null
        )}
      </ul>
    </div>
  )
}

export default CategoryItem
