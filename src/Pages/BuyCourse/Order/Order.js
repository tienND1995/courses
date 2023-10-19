import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Order.scss'

import LoadingScreen from 'react-loading-screen'
import Swal from 'sweetalert2'
import { convertVnd } from '../../../Services/Utils/ConvertVnd'

import dateFormat, { masks } from 'dateformat'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import BannerItem from '../../../Components/BannerItem/BannerItem'
import config from '../../../Configs/Config.json'
import { httpClient } from '../../../Services/httpClient/httpClient'
import { Auth } from '../../../Services/Utils/Auth'
import { Url } from '../../../Services/Utils/Url'

import { useDispatch } from 'react-redux'
import { validateFormOrder } from '../../../Services/Utils/validateForm'
import { cartActions } from '../cartSlice'

const { API_SERVER_AUTH, API_SERVER_ORDER } = config
const now = new Date()
const url = new Url()
const auth = new Auth()

const client = httpClient()
const clientAuth = httpClient(API_SERVER_AUTH)
const clientOrder = httpClient(API_SERVER_ORDER)

export default function Order() {
  const [loading, setLoading] = useState(true)
  const [isDataUser, setIsDataUser] = useState(false)
  const [isDataCourses, setIsDataCourses] = useState(false)
  const [isAllData, setIsAllData] = useState(false)
  const { productName } = cartActions
  const dispatch = useDispatch()

  const order = JSON.parse(localStorage.getItem('order'))
  const courseIdLocal = localStorage.getItem('courseId')

  const [categoryId, setCategoryId] = useState(null)
  const navigate = useNavigate()
  const socialFaceBook = localStorage.getItem('nameAccount')

  const getCategoryId = async (id) => {
    const { res, data } = await client.get(url.getCourseId(id))

    const categoryIdLocal = JSON.parse(localStorage.getItem('categoryId'))
    if (
      order === null ||
      order.length === 0 ||
      order[0].categoryId !== categoryIdLocal
    )
      localStorage.setItem('order', JSON.stringify([{ ...data, quantily: 1 }]))
    dispatch(productName(data))

    if (res.ok) {
      setCategoryId(data.categoryId)
      localStorage.setItem('categoryId', JSON.stringify(data.categoryId))
    }
  }

  const [courseList, setCourseList] = useState([])
  const getCoursesCategoryId = async (id) => {
    const { res, data } = await client.get(url.getCategory(id))
    if (res.ok) {
      setCourseList([...data])
      setIsDataCourses(true)
    }
  }

  const [isCategoryId, setIsCategoryId] = useState(true)
  if (categoryId && isCategoryId) {
    getCoursesCategoryId(categoryId)
    setIsCategoryId(false)
  }

  useEffect(() => {
    sumPrice()
  }, [order])

  useEffect(() => {
    courseIdLocal && getCategoryId(courseIdLocal)
    email ? getProfile({ email }) : setIsDataUser(true)
    socialFaceBook && setForm({ ...form, name: socialFaceBook })
  }, [])

  // * get data user to form
  const email = localStorage.getItem('userEmail')
  const [form, setForm] = useState({
    name: '',
    number: '',
    email: '',
    note: '',
  })

  const [errors, setErrors] = useState({})

  const getProfile = async (emailObj) => {
    const { res, data } = await clientAuth.post(auth.getProfile(), emailObj)
    if (res.ok) {
      setForm({
        ...form,
        name: data.data.name,
        email: data.data.email,
        number: data.data.number,
      })
      setIsDataUser(true)
    }
  }

  // set Loading
  if (isDataCourses && isDataUser && !isAllData) {
    setLoading(false)
    setIsAllData(true)
  }

  // * handle form
  const handleChangeValue = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    let errorsFake = {}

    try {
      await validateFormOrder.validate(form, { abortEarly: false })
      const userId = localStorage.getItem('userId')

      const dataOrder = {
        userId,
        note: form.note,
        email: form.email,
        number: form.number,
        status: false,
        codeOrder: randomStringCharactor(5),
        date: dateFormat(now, 'formatDate'),
        courses: order,
      }

      Swal.fire({
        title: 'Bạn có chắc chắn?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
      }).then((result) => {
        if (result.isConfirmed) {
          addOrder(dataOrder)
        }
      })
    } catch (error) {
      for (const validationError of error.inner) {
        let nameError = validationError.path
        const messageError = validationError.message

        if (Object.keys(errorsFake).indexOf(nameError) === -1) {
          errorsFake[nameError] = messageError
        }
      }
    }
    setErrors({ ...errorsFake })
    masks.formatDate = masks.paddedShortDate
  }

  const addOrder = async (dataOrder) => {
    const { res, data } = await clientOrder.post(url.getOrders(), dataOrder)

    if (res.ok) {
      toast.success('Thêm đơn hàng thành công!')
      localStorage.removeItem('order')
      dispatch(productName(data))
      setTimeout(() => {
        navigate('/tai-khoan/don-hang')
      }, 500)
    }
  }

  // handle add course
  const [courseAdd, setCourseAdd] = useState({})
  const handleAddCart = (course) => {
    localStorage.setItem(
      'order',
      JSON.stringify([...order, { ...course, quantily: 1 }])
    )
    setCourseAdd(course)
    dispatch(productName(course))
  }

  // handle remove course
  const [courseRemove, setCourseRemove] = useState({})
  const handleRemoveCourse = (course) => {
    const newOrder = order.filter((item) => item.id !== course.id)
    localStorage.setItem('order', JSON.stringify(newOrder))

    setCourseRemove(course)
    dispatch(productName(course))
  }

  // sum price
  const [totalPrice, setTotalPrice] = useState(0)
  const sumPrice = () => {
    let result = 0

    order?.map((item) => (result += item.quantily * item.sale_price))
    setTotalPrice(result)
  }

  

  // random string/charactor
  function randomStringCharactor(length) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result.toUpperCase()
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
      <BannerItem title="Đặt hàng" home="Home" subTitle="" />

      <div className="container">
        <form action="" onSubmit={handleSubmitForm}>
          <div className="row order">
            <div className="col-6 order-user">
              <div className="mb-3">
                <label htmlFor="">Tên</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Tên..."
                  value={form.name}
                  name="name"
                  onChange={handleChangeValue}
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="">Số điện thoại</label>
                <input
                  type="number"
                  className={`form-control ${
                    errors.number ? 'is-invalid' : ''
                  }`}
                  placeholder="Số điện thoại..."
                  value={form.number}
                  name="number"
                  onChange={handleChangeValue}
                />
                <div className="invalid-feedback">{errors.number}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Email..."
                  value={form.email}
                  onChange={handleChangeValue}
                  name="email"
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <h4>Thông tin bổ sung</h4>
                <label htmlFor="">Ghi chú đơn hàng (tùy chọn)</label>
                <textarea
                  id="note"
                  name="note"
                  rows="3"
                  cols="50"
                  placeholder="Ghi chú đơn hàng"
                  value={form.note}
                  onChange={handleChangeValue}
                ></textarea>
              </div>
            </div>

            <div className="col-6 order-course">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Tạm tính</th>
                  </tr>
                </thead>

                <tbody>
                  {order?.map((item) => (
                    <tr key={item.id}>
                      <td className="d-flex justify-content-between">
                        {item.name}{' '}
                        <i
                          onClick={() => {
                            handleRemoveCourse(item)
                          }}
                          className="icon-remove fa-solid fa-trash"
                        ></i>
                      </td>
                      <td>{convertVnd.format(item.sale_price)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Tạm tính</td>
                    <td>{convertVnd.format(totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Đặt hàng
                </button>
              </div>
            </div>

            <div className="col-12">
              <h3 className="py-4">Khóa học thường được mua kèm</h3>
              <div className="row order-list-course">
                {courseList.length > 0 &&
                  courseList.map((course) => {
                    if (order?.every((item) => course.id !== item.id)) {
                      return (
                        <div className="col-4" key={course.id}>
                          <div className="order-item">
                            <div className="order-image">
                              <img
                                src={course.thumbnail}
                                alt={course.teacher_detail.name}
                              />
                            </div>
                            <div className="order-info">
                              <h3>{course.name}</h3>
                              <p className="order-price">
                                {course.sale_price} đ
                              </p>
                            </div>
                            <div className="d-grid">
                              <button
                                className="btn btn-primary text-white"
                                type="button"
                                onClick={() => handleAddCart(course)}
                              >
                                Add to cart
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })}
              </div>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </LoadingScreen>
  )
}
