import React from 'react'
import { SimpleSlider } from '../../../../Components/SimpleSlider/SimpleSlider'

const SlideItem = (props) => {
    const { content, classParent, classChild } = props
    return (
      <div className={classParent}>
        {classParent === 'banner-slider' ? (
          <SimpleSlider >
            {content.map((img, idx) => (
              <div className={classChild} key={idx}>
                <img src={img} alt={classChild} />
              </div>
            ))}
          </SimpleSlider>
        ) : (
          content.map((img, idx) => (
            <div className={classChild} key={idx}>
              <img src={img} alt={classChild} />
            </div>
          ))
        )}
      </div>
    )
}

export default SlideItem