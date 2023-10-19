import React, { useEffect, useState } from 'react'
import BannerItem from '../../../Components/BannerItem/BannerItem'
import './Cart.scss'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { useNavigate } from 'react-router-dom'
import { convertVnd } from '../../../Services/Utils/ConvertVnd'
import { cartActions } from '../cartSlice'
import { useDispatch } from 'react-redux'

export default function Cart() {
  const order = JSON.parse(localStorage.getItem('order'))

  const [totalPrice, setTotalPrice] = useState(0)
  const [courseList, setCourseList] = useState([])
  const [isStartSumPrice, setIsStartSumPrice] = useState(true)

  const { productName } = cartActions
  const dispatch = useDispatch()

  const sumPrice = (courseList) => {
    let result = 0
    courseList?.map((item) => (result += item.quantily * item.sale_price))
    setTotalPrice(result)
  }

  if (isStartSumPrice && courseList.length > 0) {
    sumPrice(courseList)
    setIsStartSumPrice(false)
  }

  useEffect(() => {
    if (order) {
      setCourseList(order)
    }
  }, [])

  const handleRemoveCourse = (id) => {
    const newOrder = order.filter((item) => item.id !== id)

    if (newOrder.length < 1) {
      localStorage.removeItem('order')
      setCourseList([])
      setTotalPrice(0)
    } else {
      localStorage.setItem('order', JSON.stringify(newOrder))
      setCourseList(newOrder)
      sumPrice(newOrder)
    }

    dispatch(productName(newOrder))
  }

  const handleChangeValue = (id, quantily) => {
    const newOrder = order.map((item) =>
      item.id === id ? { ...item, quantily: quantily || 0 } : item
    )
    localStorage.setItem('order', JSON.stringify(newOrder))
    setCourseList(newOrder)
    sumPrice(newOrder)
  }

  // handle button add courses
  const navigate = useNavigate()
  const handleClickAddCourses = () => {
    navigate('/dat-hang')
  }

  // handle remove all course
  const handleRemoveAllCourse = () => {
    Swal.fire({
      title: 'Bạn chắc chưa?',
      text: 'Bạn sẽ mất thời gian chọn lại...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('order')
        setCourseList([])
        setTotalPrice(0)

        dispatch(productName('remove all course in cart'))
      }
    })
  }

  return (
    <>
      <BannerItem title="Giỏ hàng" home="Home" subTitle="" />
      <div className="container">
        <div className="row">
          {courseList.length > 0 ? (
            <div className="col-12 cart">
              <div className="cart-item-nav mb-4">
                <button
                  type="button"
                  onClick={handleClickAddCourses}
                  className="btn btn-primary add-courses"
                >
                  Quay lại đặt hàng
                </button>
                <button
                  type="button"
                  onClick={handleRemoveAllCourse}
                  className="btn btn-primary"
                >
                  Xóa tất cả khóa học
                </button>
              </div>

              <form action="">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Khóa học</th>
                      <th>Tên khóa học</th>
                      <th>Giá</th>
                      <th>Số lượng </th>
                      <th>Tạm tính</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseList?.map(
                      ({ id, name, thumbnail, sale_price, quantily }) => (
                        <tr key={id}>
                          <td width="15%">
                            <img src={thumbnail} alt={name} />
                          </td>
                          <td>{name}</td>
                          <td>{convertVnd.format(sale_price)}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={quantily}
                              placeholder="1"
                              onChange={(e) => {
                                const quantily = Number.parseInt(e.target.value)
                                handleChangeValue(id, quantily)
                              }}
                            />
                          </td>
                          <td>{convertVnd.format(sale_price * quantily)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleRemoveCourse(id)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </form>

              <div className="cart-item-totalprice">
                <p>Total price:</p>
                <p>{convertVnd.format(totalPrice)}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-empty">
                <i class="fa-solid fa-circle-exclamation"></i> Chưa có sản phẩm
                nào trong giỏ hàng.
              </div>

              <div className="cart-back">
                <Link to="/">
                  <span>
                    <i className="fa-solid fa-arrow-left" />
                  </span>
                  Về trang chủ
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
