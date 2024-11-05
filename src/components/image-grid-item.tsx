import { useState, useEffect } from 'react'

import { ImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

interface ImageGridItemProps {
  image: ImageGen
  index: number
  level: number
  isSingle: boolean
  hoverState: { hover: boolean; index: number }

  onImageClick: (action: Action, index: number) => void
  setHoverState: (hoverState: ImageHoverState) => void
}

const ImageGridItem = ({
  image,
  index,
  level,
  isSingle,
  hoverState,
  onImageClick,
  setHoverState,
}: ImageGridItemProps) => {
  const [position, setPosition] = useState({
    x: (isSingle ? 20 : 10) * level,
    y: (isSingle ? 30 : -280) * level,
  })
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(() => setTop((prev) => prev + position.y), [position.y])

  useEffect(() => setLeft((prev) => prev + position.x), [position.x])

  return (
    <div
      className={`relative w-[180px] h-[180px] ${isSingle ? '' : '[&:nth-child(5n+1)]:col-start-2 [&:nth-child(5n+1)]:col-span-2 [&:nth-child(5n+2)]:col-start-1 [&:nth-child(5n+3)]:col-start-2 [&:nth-child(5n+4)]:col-start-3 [&:nth-child(5n)]:col-start-2 [&:nth-child(5n)]:col-span-1'} ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {image.src !== '' && (
        <Img
          {...image}
          index={index}
          onClick={(action: Action) => onImageClick(action, index)}
          setHoverState={setHoverState}
          handleStopPosition={setPosition}
        />
      )}
    </div>
  )
}

export default ImageGridItem
