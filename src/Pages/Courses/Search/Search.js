import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BannerItem from '../../../Components/BannerItem/BannerItem'
import LoadingScreen from 'react-loading-screen'

import CourseItem from '../../../Components/CourseItem/CourseItem'
import config from '../../../Configs/Config.json'
import LoadMore from '../../../LoadMore/LoadMore'
import { Url } from '../../../Services/Utils/Url'
import { httpClient } from '../../../Services/httpClient/httpClient'

const client = httpClient()
const url = new Url()
const { COURSE_LIMIT } = config

export default function Search() {
  const [search] = useSearchParams()
  const keyword = search.get('keyword')

  const [courses, setCourses] = useState({
    courseList: [],
    isLoading: true,
  })

  const { courseList } = courses
  const [paginate, setPaginate] = useState({
    pagination: {},
    isPaginate: false,
  })

  const [limitCourses, setLimitCourses] = useState(COURSE_LIMIT)
  const [totalResult, setTotalResult] = useState(0)

  useEffect(() => {
    getSearch(keyword)
  }, [keyword])

  useEffect(() => {
    getSearch(keyword, 'id', 'asc', limitCourses)
  }, [limitCourses])

  const getSearch = async (
    keyword = null,
    sort = 'id',
    order = 'asc',
    limit = COURSE_LIMIT,
    page = 1
  ) => {
    const params = {
      _sort: sort,
      _order: order,
      q: keyword,
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

      setTotalResult(totalPage)

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
      
      
      <BannerItem title="Tìm kiếm" home="Home" />
      <section className="search-courses">
        <div className="container py-5">
          <h1>Từ khóa: "{keyword}"</h1>
          <p>Tìm được: "{totalResult}" kết quả</p>
          <hr />

          <div className="row">
            {courseList?.length > 0 ? (
              <>
                {courseList.map((course) => (
                  <CourseItem {...course} isListCourse={true} key={course.id} />
                ))}

                <LoadMore {...loadMore} />
              </>
            ) : (
              <div className="text-center">
                <h3>Không có bài viết</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </LoadingScreen>
  )
}
