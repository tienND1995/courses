import React, { useEffect, useState } from 'react'
import BannerItem from '../../../Components/BannerItem/BannerItem'
import CourseItem from '../../../Components/CourseItem/CourseItem'
import { httpClient } from '../../../Services/httpClient/httpClient'
import { Url } from '../../../Services/Utils/Url'
import config from '../../../Configs/Config.json'
import LoadMore from '../../../LoadMore/LoadMore'

import LoadingScreen from 'react-loading-screen'

const { COURSE_LIMIT } = config
const client = httpClient()
const url = new Url()

const ListsCourse = () => {
  const [courses, setCourses] = useState({
    courseList: [],
    isLoading: true,
  })
  const [paginate, setPaginate] = useState({
    pagination: {},
    isPaginate: false,
  })

  const [limitCourses, setLimitCourses] = useState(COURSE_LIMIT)

  const getCourses = async (
    sort = 'id',
    order = 'asc',
    limit = limitCourses,
    page = 1
  ) => {
    const params = {
      _sort: sort,
      _order: order,
      _limit: limit,
      _page: page,
    }

    
    setPaginate({ ...paginate, isPaginate: false })

    const { res, data } = await client.get(url.getCourses(), params)
    if (res.ok) {
      const totalPage = Number.parseInt(res.headers.get('x-total-count'))
      const maxPage = Math.ceil(totalPage / limit)

      const pagination = {
        maxPage,
        totalPage,
        page,
        limit,
      }

      setCourses({
        courseList: data,
        isLoading: false,
      })

      setPaginate({
        pagination,
        isPaginate: true,
      })
    }
  }

  useEffect(() => {
    getCourses('id', 'asc', limitCourses)
  }, [limitCourses])

  const handleLoadMore = () => {
    setLimitCourses(limitCourses + COURSE_LIMIT)
  }

  const loadMore = {
    onLoadMore: handleLoadMore,
    totalPage: paginate.pagination.totalPage,
    limit: limitCourses,
    isPaginate: paginate.isPaginate,
  }

  return (
    <LoadingScreen
      loading={courses.isLoading}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc="/images/logo.png"
      text="Content Loading..."
    >
      <BannerItem title="Khóa học" home="home" />
      <section className="all-course pb-4">
        <div className="container">
          <div className="row">
            {courses.courseList?.length > 0 ? (
              <>
                {courses.courseList.map((course) => (
                  <CourseItem {...course} isListCourse={true} key={course.id} />
                ))}

                <LoadMore {...loadMore} />
              </>
            ) : (
              <div className="text-center col-12">
                <h3>Không có bài viết</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </LoadingScreen>
  )
}

export default ListsCourse
