import React from 'react'
import './Footer.scss'

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="footer-group">
              <h3>Liên hệ</h3>
              <ul>
                <li>
                  <a href="#">
                    <i className="fa-solid fa-mobile" />
                    0989341634
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-solid fa-envelope" />
                    ngocnguyenchi1507@gmail.com
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa-solid fa-house" />
                    9c9, Trần Quốc Hoàn, Cầu Giấy, Hà Nội
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-4 mt-4 mt-lg-0">
            <div className="footer-group">
              <h3>hỗ trợ học viên</h3>
              <ul>
                <li>
                  <a href="#"> Hỗ trợ học viên</a>
                </li>
                <li>
                  <a href="#"> Câu hỏi thường gặp</a>
                </li>
                <li>
                  <a href="#"> Cảm nhận học viên</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-4 mt-4 mt-lg-0">
            <div className="footer-group">
              <h3>Chính sách điều khoản</h3>
              <ul>
                <li>
                  <a href="#"> Chương trình Affiliate</a>
                </li>
                <li>
                  <a href="#"> Điều khoản dịch vụ</a>
                </li>
                <li>
                  <a href="#"> Chính sách bảo mật</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p>
        Made with
        <span>
          <i className="fa-solid fa-heart" />
        </span>
        by Chí Ngọc
      </p>
    </footer>
  )
}

export default Footer
