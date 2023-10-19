import { useEffect, useState } from 'react'
import CourseItem from '../../../Components/CourseItem/CourseItem'

import { httpClient } from '../../../Services/httpClient/httpClient'
import { Url } from '../../../Services/Url/Url'

const url = new Url()
const client = httpClient()

export default function CourseCategory(props) {
  const { id, title } = props

  const [category, setCategory] = useState([])

  useEffect(() => {
    getData(id)
  }, [id])

  const getData = async (id) => {
    const res = await client.get(url.getCategory(id))

    const category = res.data
    const response = res.res

    if (response) {
      setCategory(category)
    }
  }

  return (
    <section className="foundation-course">
      <div className="container padding">
        <h3>{title}</h3>
        <div className="row">
          <CourseItem content={category} />
        </div>
      </div>
    </section>
  )
}
