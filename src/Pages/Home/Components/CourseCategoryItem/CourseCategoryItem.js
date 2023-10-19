import React from 'react'
import CourseItem from '../../../../Components/CourseItem/CourseItem'

const CourseCategoryItem = (props) => {
    const { courseList, classSection, title } = props
    return (
        <section className={classSection}>
          <div className="container padding">
            <h3>{title}</h3>
            <div className="row">
              {courseList.map((item) => (
                <CourseItem {...item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )
}

export default CourseCategoryItem