export class Auth {
  constructor() {
    this.login = '/dang-nhap'
    this.register = '/dang-ky'
    
  }

  isLogin = () => {
    return localStorage.getItem('accessToken') ? true : false
  }

  logout = () => {
    return localStorage.clear()
  }

  user = () => {
    return localStorage.getItem('user')
  }

  getProfile = () => '/profile'
  getCourseOrder = (id) => `/orders?userId=${id}`
}
