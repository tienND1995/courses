import React, { useEffect, useState } from 'react'
import './Avatar.scss'

export default function Avatar(props) {
  const { name, surname, picture } = props
  const [image, setImage] = useState(null)

  const handleChangeValue = (e) => {
    const file = e.target.files[0]
    const urlImage = URL.createObjectURL(file)

    if (!file) {
      return
    }

    if (!file.name.toLowerCase().endsWith('.jpg')) {
      console.log('lỗi')
      return
    }

    if ((file.size / 1024 / 1024).toFixed(3) > 5) {
      console.log('Dung lượng tối đa 5mb')
      return
    }
    setImage(urlImage)
  }

  useEffect(() => {
    picture && setImage(picture)
  }, [])

  return (
    <div className="avatar col-xl-3 ">
      <div className="avatar-image">
        <img
          src={
            image
              ? image
              : 'https://online.dscons.vn/wp-content/themes/beacademy/images/avatar.png'
          }
          alt="avatar"
        />
      </div>

      <p className="avatar-name">
        Xin chào
        <span>{` ${surname} ${name}`}</span>!
      </p>

      <div className="avatar-upload">
        <label htmlFor="upload">
          <i class="fa-regular fa-circle-down"></i> <span>Đổi ảnh đại diện</span>
        </label>
        <input
          onChange={handleChangeValue}
          hidden
          type="file"
          name=""
          id="upload"
        />
      </div>
    </div>
  )
}
