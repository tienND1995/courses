import React, { createRef, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import './Lessions.scss'

import LoadingScreen from 'react-loading-screen'
import Swal from 'sweetalert2'

import { Auth } from '../../Services/Utils/Auth'
import { Url } from '../../Services/Utils/Url'

import config from '../../Configs/Config.json'
import { youtube_parser } from '../../Services/Utils/String'
import { handleClick } from '../../Services/Utils/handleLesstion'
import { httpClient } from '../../Services/httpClient/httpClient'

const { API_SERVER_ORDER, LINK_YOUTUBE } = config

const clientOrder = httpClient(API_SERVER_ORDER)
const client = httpClient()
const url = new Url()

const Lessions = () => {
  const [loading, setLoading] = useState(true)

  // * lession detail
  const { id } = useParams()
  const [lessionDetail, setLessionDetail] = useState({})
  const { name, courseId, view, document, video, durations } = lessionDetail
  const getLesstionDetail = async (id) => {
    const { res, data } = await client.get(url.getLessionId(id))

    if (res.ok) {
      setLessionDetail({ ...data })
    }
  }

  // * handle video
  const playerRef = useRef(null)
  // const [playTime, setPlayTime] = useState(0)
  // const [currentTime, setCurrentTime] = useState(0)

  // const handleProgress = (state) => {
  //   setPlayTime(state.playedSeconds)
  //   const timeCurrent = JSON.stringify(playTime)
  //   localStorage.setItem('currentTime', timeCurrent)
  //   if (Math.trunc(playTime) >= durations - 20) {
  //     localStorage.removeItem('currentTime')
  //   }
  // }

  // * get data courses user
  const courseIdLocal = localStorage.getItem('courseId')
  const userId = localStorage.getItem('userId')
  const [courseUser, setCourseUser] = useState([])

  const getOrder = async (id) => {
    const { res, data } = await clientOrder.get(url.getOrderUser(id))
    if (res.ok) {
      setCourseUser(data)
    }
  }

  useEffect(() => {
    if (userId) {
      getOrder(userId)
    }
  }, [])

  const checkBoughtCourse = () => {
    return courseUser?.find(({ courses }) => {
      return courses.find((course) => {
        return course.id === Number(courseIdLocal)
      })
    })
  }

  useEffect(() => {
    //setCurrentTime(JSON.parse(localStorage.getItem('currentTime')))
    getLesstionDetail(id)
  }, [id])

  // * course detail
  const [courseDetail, setCourseDetail] = useState({})
  const [isIdDetail, setIsIdDetail] = useState(true)

  const getCourseDetail = async (id) => {
    const { res, data } = await client.get(url.getCourseId(id))
    if (res.ok) {
      setCourseDetail({ ...data })
      setTimeout(() => {
        setLoading(false)
      }, 500)

      // start disable button prev and next
      const listId = []
      data.modules?.map(({ lessions }) => {
        return lessions.map((lession) => listId.push(lession.id))
      })

      listId.forEach((id, index) => {
        if (id === lessionDetail.id) {
          index === 0 && setEventBtnPrev(false)
          index === listId.length - 1 && setEventBtnNext(false)
        }
      })
    }
  }

  if (courseId && isIdDetail) {
    setIsIdDetail(false)
    getCourseDetail(courseId)
  }

  // * list lession
  const [eventBtnNext, setEventBtnNext] = useState(true)
  const [eventBtnPrev, setEventBtnPrev] = useState(true)
  const lessionList = []
  courseDetail.modules?.map(({ lessions }) => {
    return lessions.map((lession) => lessionList.push(lession))
  })

  const navigate = useNavigate()

  const handleBtnNext = () => {
    lessionList.forEach(({ id, name, trial }, index) => {
      if (id - 1 === lessionDetail.id) {
        trial || (new Auth().isLogin() && checkBoughtCourse())
          ? navigate(url.lessionDetail(id, name))
          : Swal.fire({
              title: 'Oops...',
              text: 'Vui lòng mua khóa học!',
            })

        if (index === lessionList.length - 1) {
          setEventBtnNext(false)
        }
      }

      if (index !== 0) {
        setEventBtnPrev(true)
      }
    })

    //localStorage.removeItem('currentTime')
  }

  const handleBtnPrev = () => {
    lessionList.forEach(({ id, name, trial }, index) => {
      if (id + 1 === lessionDetail.id) {
        trial || (new Auth().isLogin() && checkBoughtCourse())
          ? navigate(url.lessionDetail(id, name))
          : Swal.fire({
              title: 'Oops...',
              text: 'Vui lòng mua khóa học!',
            })

        if (index === 0) {
          setEventBtnPrev(false)
        }
      }

      if (index !== lessionList.length - 1) {
        setEventBtnNext(true)
      }
    })

    //localStorage.removeItem('currentTime')
  }

  // update view video
  const updateView = async (id, data) => {
    const response = await client.patch(url.getLessionId(id), data)
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
      <section className="video">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="video-detail">
                <ReactPlayer
                  url={video && `${LINK_YOUTUBE}/${youtube_parser(video)}`}
                  width="100%"
                  height="50vh"
                  ref={playerRef}
                  // onReady={() =>
                  //   playerRef.current?.seekTo(currentTime, 'seconds')
                  // }
                  onStart={() => {
                    const data = { ...lessionDetail }
                    data.view = view + 1
                    updateView(id, data)
                  }}
                  // onProgress={handleProgress}
                  controls
                />

                <div className="video-detail-bottom">
                  <h4>{name}</h4>
                  <p>
                    <i className="fa-solid fa-eye"></i>
                    {`${view} Views`}
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-between my-3">
                <p className={`prev ${!eventBtnPrev ? 'btn-disable' : ''}`}>
                  <button
                    onClick={handleBtnPrev}
                    type="button"
                    className="btn btn-primary"
                  >
                    Prev
                  </button>
                </p>
                <p className={`next ${!eventBtnNext ? 'btn-disable' : ''}`}>
                  <button
                    onClick={handleBtnNext}
                    type="button"
                    className="btn btn-primary"
                  >
                    Next
                  </button>
                </p>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <nav className="mt-3">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className="nav-link active"
                    id="nav-lesson-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-lesson"
                    type="button"
                    role="tab"
                    aria-controls="nav-lesson"
                    aria-selected="true"
                  >
                    Bài học
                  </button>
                  <button
                    className="nav-link"
                    id="nav-document-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-document"
                    type="button"
                    role="tab"
                    aria-controls="nav-document"
                    aria-selected="false"
                  >
                    Tài liệu
                  </button>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade show active group"
                  id="nav-lesson"
                  role="tabpanel"
                  aria-labelledby="nav-lesson-tab"
                >
                  <div className="accordion active title">
                    {courseDetail.modules?.map(({ lessions, id, name }) => {
                      const lessionRef = createRef(null)
                      let isActive = false
                      lessions.forEach(({ id }) => {
                        if (id === lessionDetail.id) {
                          isActive = true
                        }
                      })

                      return (
                        <div className="accordion-group" key={id}>
                          <div className="accordion-title">
                            <h4 className="">{name}</h4>
                            <i
                              className={`fa-solid ${
                                isActive ? 'fa-circle-minus' : 'fa-circle-plus'
                              }`}
                              onClick={(e) => {
                                handleClick(e, lessionRef)
                              }}
                            ></i>
                          </div>
                          <div
                            className={`accordion-detail ${
                              isActive ? 'active' : ''
                            }`}
                            ref={lessionRef}
                          >
                            <div className="card-accordion">
                              {lessions?.map(({ id, name, trial }) => {
                                return (
                                  <div key={id}>
                                    <NavLink
                                      to={
                                        (trial ||
                                          (new Auth().isLogin() &&
                                            checkBoughtCourse())) &&
                                        url.lessionDetail(id, name)
                                      }
                                      className={({ isActive, isPending }) =>
                                        isPending
                                          ? 'pending'
                                          : isActive &&
                                            (trial ||
                                              (new Auth().isLogin() &&
                                                checkBoughtCourse()))
                                          ? 'active'
                                          : ''
                                      }
                                      onClick={() =>
                                        !trial &&
                                        !checkBoughtCourse() &&
                                        Swal.fire({
                                          title: 'Oops...',
                                          text: 'Vui lòng mua khóa học!',
                                        })
                                      }
                                    >
                                      {name}
                                    </NavLink>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-document"
                  role="tabpanel"
                  aria-labelledby="nav-document-tab"
                >
                  {document}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LoadingScreen>
  )
}

export default Lessions
