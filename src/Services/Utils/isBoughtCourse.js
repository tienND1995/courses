export const isBoughtCourse = (isLogin, isCourse) => {
  return isLogin && isCourse ? 'Vào học' : 'đặt mua khóa học'
}
