import React, { useEffect, useState } from 'react'
import './Home.scss'

import LoadingScreen from 'react-loading-screen'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { httpClient } from '../../Services/httpClient/httpClient'
import { Url } from '../../Services/Utils/Url'

import CategoryItem from './Components/CategoryItem/CategoryItem'
import CourseCategoryItem from './Components/CourseCategoryItem/CourseCategoryItem'
import SlideItem from './Components/SlideItem/SlideItem'

const client = httpClient()
const url = new Url()

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [isDataCourseHome, setIsDataCourseHome] = useState(false)
  const [isDataBannerHome, setIsDataBannerHome] = useState(false)

  // * courses banner
  const [coursesBanner, setCoursesBanner] = useState([])
  const getBannerHome = async () => {
    const { res, data } = await client.get(url.getBannerHome())
    if (res.ok) {
      setCoursesBanner(data)
      setIsDataBannerHome(true)
    }
  }

  // * courses home
  const [coursesHome, setCoursesHome] = useState([])
  const getCoursesHome = async () => {
    const { res, data } = await client.get(url.getCoursesHome())
    if (res.ok) {
      setCoursesHome(data)
      setIsDataCourseHome(true)
    }
  }

  // * rest home
  const [restHome, setRestHome] = useState([])
  const [isDataRestHome, setIsDataRestHome] = useState(false)
  const getDataRestHome = async () => {
    const response = await client.get('/restHome')
    const { res, data } = response

    if (res.ok) {
      setRestHome(data)
      setIsDataRestHome(true)
    }
  }

  // * slide home
  const [slideHome, setSlideHome] = useState([])
  const [isDataSlideHome, setIsDataSlideHome] = useState(false)
  const getDataSlideHome = async () => {
    const response = await client.get('/slideHome')
    const { res, data } = response

    if (res.ok) {
      setSlideHome(data)
      setIsDataSlideHome(true)
    }
  }

  useEffect(() => {
    getCoursesHome()
    getDataRestHome()
    getBannerHome()
    getDataSlideHome()
  }, [])

  const [stop, setStop] = useState(false)
  if (
    isDataBannerHome &&
    isDataCourseHome &&
    isDataRestHome &&
    isDataSlideHome &&
    !stop
  ) {
    setStop(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  return (
    <LoadingScreen
      loading={loading}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc="/images/logo.png"
      text="Content Loading..."
    >
      <section className="banner">
        <div className="container padding">
          <div className="row">
            {slideHome?.map(({ id, name, listImage }) => {
              switch (name) {
                case 'banner-left':
                  return (
                    <div
                      className="d-none d-md-block col-md-4 col-lg-3"
                      key={id}
                    >
                      <div className={name}>
                        {coursesBanner?.map(({ name, id, list_course }) => (
                          <CategoryItem
                            key={id}
                            title={name}
                            courseList={list_course}
                          />
                        ))}
                      </div>
                    </div>
                  )

                case 'banner-slider':
                  return (
                    <div className="col-12 col-md-8 col-lg-6" key={id}>
                      <SlideItem
                        content={listImage}
                        classParent="banner-slider"
                        classChild="banner-slider-inner"
                      />
                    </div>
                  )

                case 'banner-right':
                  return (
                    <div className="d-none d-lg-block col-lg-3" key={id}>
                      <SlideItem
                        content={listImage}
                        classParent="banner-right"
                        classChild="banner-right__img"
                      />
                    </div>
                  )

                default:
                  return (
                    <SlideItem
                      content={listImage}
                      classParent="banner-full"
                      classChild="banner-full__img"
                      key={id}
                    />
                  )
              }
            })}
          </div>
        </div>
      </section>
      {coursesHome.map(({ id, name, list_course, class_name }) => (
        <CourseCategoryItem
          key={id}
          classSection={class_name}
          title={name}
          courseList={list_course}
        />
      ))}

      {restHome?.map((itemHome) => {
        const { id, name, title, listItem } = itemHome
        switch (name) {
          case 'question':
            return (
              <section className={name} key={id}>
                <div className="container">
                  <h3>{title}</h3>
                  <div className="row">
                    {listItem.map(({ id, thumbnail, content }) => {
                      return (
                        <div className="col-12 col-lg-6" key={id}>
                          <div className="group">
                            <div className="group-icon">
                              <Markdown
                                children={thumbnail}
                                rehypePlugins={[rehypeRaw]}
                              ></Markdown>
                            </div>
                            <div className="group-title">
                              <Markdown
                                rehypePlugins={[rehypeRaw]}
                                children={content}
                              ></Markdown>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )

          case 'partner':
            return (
              <section className={name} key={id}>
                <div className="container">
                  <h3>{title}</h3>
                  <div className="row">
                    {listItem.map((item, idx) => {
                      return (
                        <div className="col-6 col-lg-3" key={idx}>
                          <div className="partner-img">
                            <img src={item} alt={title} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )

          default:
            return (
              <section className={name} key={id}>
                <div className="container">
                  <div className="row">
                    {listItem.map((item, idx) => (
                      <div className="col-12 col-md-6 col-lg-4" key={idx}>
                        <div className="text">
                          <a href="#">{item}</a>
                        </div>
                      </div>
                    ))}

                    <h3 className="my-4">{title}</h3>

                    <Markdown rehypePlugins={[rehypeRaw]}>
                      {itemHome.iframe}
                    </Markdown>
                  </div>
                </div>
              </section>
            )
        }
      })}
    </LoadingScreen>
  )
}

export default Home
