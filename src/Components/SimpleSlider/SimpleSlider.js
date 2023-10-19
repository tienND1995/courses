import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const SimpleSlider = (props) => {
  const settings = {
    dots: true,
    fade: true,
    autopaly: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Slider {...settings} >
      {props.children}
    </Slider>
  )
}