import { Route } from 'react-router-dom'
import Error404 from '../Errors/Error404'
import Blog from '../Pages/Blog/Blog'
import Cart from '../Pages/BuyCourse/Cart/Cart'
import CourseDetail from '../Pages/Courses/CourseDetail/CourseDetail'
import ListsCourse from '../Pages/Courses/ListCourse/ListsCourse'
import Search from '../Pages/Courses/Search/Search'
import Home from '../Pages/Home/Home'
import Lessions from '../Pages/Lessions/Lessions'
export const publicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/blog" element={<Blog />} />

    <Route path="/courses">
      <Route path="" element={<ListsCourse />} />
      <Route path=":slug/:id" element={<CourseDetail />} />
    </Route>

    <Route path="/lession/:slug/:id" element={<Lessions />} />

    <Route path="/error404" element={<Error404 />} />
    <Route path="/gio-hang" element={<Cart />} />
    <Route path="/tim-kiem" element={<Search />} />
  </>
)
