import React, { createRef, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BannerItem from '../../../Components/BannerItem/BannerItem'
import './CourseDetail.scss'

import LoadingScreen from 'react-loading-screen'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import Swal from 'sweetalert2'

import { convertVnd } from '../../../Services/Utils/ConvertVnd'

import config from '../../../Configs/Config.json'
import { Auth } from '../../../Services/Utils/Auth'
import { Url } from '../../../Services/Utils/Url'
import { httpClient } from '../../../Services/httpClient/httpClient'

import { handleClick } from '../../../Services/Utils/handleLesstion'
import { isBoughtCourse } from '../../../Services/Utils/isBoughtCourse'

const url = new Url()
const auth = new Auth()

const { API_SERVER_ORDER } = config
const client = httpClient()
const clientOrder = httpClient(API_SERVER_ORDER)

const CourseDetail = () => {
  const [loading, setLoading] = useState(true)

  const params = useParams()
  const [courseId, setCourseId] = useState({})

  const getDataId = async (id) => {
    const { res, data } = await client.get(url.getCourseId(id))
    if (res.ok) {
      setCourseId({ ...data })
      setLoading(false)
    }
  }

  const {
    subTitle,
    content,
    lessions_count,
    section,
    durations,
    modules,
    name,
    thumbnail,
    code,
    teacher_exp,
    supports_text,
    supports_url,
    supports_image,
    sale_price,
    price,
    teacher_detail,
  } = courseId

  // get link lession detail first
  const [linkLession, setLinkLession] = useState({ id: 0, title: '' })
  const [isModules, setIsModules] = useState(true)

  if (isModules && modules) {
    const lessionId = modules[0].lessions[0].id
    const lessionName = modules[0].lessions[0].name
    setLinkLession({ id: lessionId, title: lessionName })
    setIsModules(false)
  }

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
    getDataId(params.id)
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

  localStorage.setItem('courseId', params.id)

  return (
    <LoadingScreen
      loading={loading}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc="/images/logo.png"
      text="Content Loading..."
    >
      <BannerItem title={name} home="Trang chủ" subTitle={`${subTitle}`} />
      <section className="course-detal">
        <div className="container">
          <div className="row relative">
            <div className="col-12 col-lg-9">
              <div className="submenu">
                <ul>
                  <li>
                    <a href="#information">
                      <i className="fa-solid fa-file" /> Thông tin chung
                    </a>
                  </li>
                  <li>
                    <a href="#curriculum">
                      <i className="fa-solid fa-book" />
                      Giáo trình
                    </a>
                  </li>
                  <li>
                    <a href="#author">
                      <i className="fa-solid fa-user" />
                      Giảng viên
                    </a>
                  </li>
                  <li>
                    <a href="#evaluate">
                      <i className="fa-solid fa-comment" />
                      Đánh giá
                    </a>
                  </li>
                </ul>
              </div>
              <div className="course-descreption" id="information">
                <Markdown rehypePlugins={[rehypeRaw]}>{content}</Markdown>
              </div>
              <div className="accordion" id="curriculum">
                <div className="accordion-top">
                  <p>
                    <i className="fa-solid fa-book me-1" />
                    Gồm: {section} phần - {lessions_count} bài giảng
                  </p>
                  <p>
                    <i className="fa-solid fa-clock me-1" />
                    Thời lượng {durations}
                  </p>
                </div>

                {modules?.map(({ id, name, lessions }) => {
                  const lessionRef = createRef(null)

                  return (
                    <div className="accordion-group" key={id}>
                      <div className="accordion-title">
                        <i
                          className="fa-solid fa-circle-plus"
                          onClick={(e) => {
                            handleClick(e, lessionRef)
                          }}
                        ></i>
                        <h4 className="">{name}</h4>
                      </div>
                      <div className="accordion-detail" ref={lessionRef}>
                        <div className="card-accordion">
                          {lessions.map(({ id, durations, trial, name }) => {
                            const newTime = new Date(durations * 1000)
                              .toISOString()
                              .slice(11, 19)
                            return (
                              <div key={id}>
                                <i className="fa-brands fa-youtube" />
                                {trial && <p>học thử</p>}
                                <Link
                                  to={
                                    (trial ||
                                      (new Auth().isLogin() &&
                                        checkBoughtCourse())) &&
                                    url.lessionDetail(id, name)
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
                                </Link>
                                <span>{newTime}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="course-teacher" id="author">
                <div className="course-teacher__media">
                  <div className="course-teacher-left">
                    <img
                      src={teacher_detail?.image}
                      className="avatar"
                      width={96}
                      alt=""
                    />
                  </div>
                  <div className="course-teacher-body">
                    <p className="course-teacher-lead">Giảng viên</p>
                    <a href="#">
                      <h4 className="course-teacher-heading">
                        {teacher_detail?.name}
                      </h4>
                    </a>
                  </div>
                </div>

                <div className="course-teacher__info">
                  <Markdown rehypePlugins={[rehypeRaw]}>
                    {teacher_detail?.bio}
                  </Markdown>
                </div>
              </div>
              <div className="course-video">
                <h4>sản phẩm</h4>
                <p className="course-content-infor">
                  Phòng bơm Cấp nước sinh hoạt, phòng Heat Pump, phòng bơm Chữa
                  cháy thuộc dự án Mikazuki Spa &amp; Hotel Resort Đà Nẵng
                  DSCons thực hiện năm 2019.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-3">
              <div className="course-profile">
                <div className="img">
                  <img src={`/${thumbnail}`} alt={name} />
                </div>
                <div className="group-text">
                  <p className="price">
                    <i className="fa-solid fa-tag" />
                    <span className="sale">{convertVnd.format(price)}</span>
                    <span>{convertVnd.format(sale_price)}</span>
                  </p>
                  <p className="bookmark">
                    <i className="fa-solid fa-bookmark" />
                    Mã Khóa Học: {code}
                  </p>
                  <p className="chart">
                    <i className="fa-solid fa-chart-simple" />
                    Cấp độ: Thực chiến
                  </p>
                  <p className="techer">
                    <i className="fa-solid fa-user" />
                    Giảng viên: {teacher_exp}
                  </p>
                  <p className="clock">
                    <i className="fa-solid fa-clock" />
                    Thời lượng: {durations}
                  </p>

                  <p className="device">
                    <i className="fa-solid fa-mobile"></i> Học trên mọi thiết bị
                  </p>
                  <p className="lifebuoy">
                    <i className="fa-solid fa-link"></i> {supports_text}:
                    <a href={supports_url}>{supports_url}</a>
                  </p>
                  <div className="image-zalo">
                    <img src={supports_image} alt={supports_text} />
                  </div>
                  <div className="payment">
                    <Link
                      to={
                        auth.isLogin() && checkBoughtCourse()
                          ? url.lessionDetail(linkLession.id, linkLession.title)
                          : '/dat-hang'
                      }
                    >
                      {isBoughtCourse(auth.isLogin(), checkBoughtCourse())}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LoadingScreen>
  )
}

export default CourseDetail
