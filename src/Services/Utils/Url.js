import { toSlug } from './String'
export class Url {
  // * page home
  getHome = () => `/home`
  getBannerHome = () => `/banner_home`
  getCourses = () => `/courses`
  getCoursesHome = () => '/courses_home'
  getCategory = (id) => `/courses?categoryId=${id}`

  getUserId = (id) => `/users/${id}`

  // * page course
  getCourseId = (id) => `/courses/${id}`
  courseDetail = (id, title) => {
    const pathTitle = toSlug(title)
    return `/courses/${pathTitle}/${id}`
  }
  getSearch = (keyword) => `tim-kiem?keyword=${keyword}`

  // * page lession
  lessionDetail = (id, title) => {
    const pathTitle = toSlug(title)
    return `/lession/${pathTitle}/${id}`
  }
  getLessionId = (id) => `/lession_detail/${id}`

  // * page order
  getOrders = () => `/orders`
  orderDetail = (code) => `/tai-khoan/don-hang/${code}`
  getOrderUser = (id) => `/orders?userId=${id}`
}
