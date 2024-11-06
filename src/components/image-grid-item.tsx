import { useState, useEffect, type MouseEvent } from 'react'

import type { ImageGen, ActiveImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

interface ImageGridItemProps {
  image: ImageGen
  index: number
  isSingle: boolean
  hoverState: { hover: boolean; index: number }
  activeImageId?: string
  groupId?: string
  onImageClick: (e: MouseEvent, action: Action, index: number) => void
  setHoverState: (hoverState: ImageHoverState) => void
  setActiveImage: (image: ActiveImageGen | null) => void
}

const ImageGridItem = ({
  image,
  index,
  isSingle,
  hoverState,
  activeImageId,
  groupId,
  onImageClick,
  setHoverState,
  setActiveImage,
}: ImageGridItemProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(() => setTop((prev) => position.y + prev), [position.y])

  useEffect(() => setLeft((prev) => position.x + prev), [position.x])

  return (
    <div
      className={`relative w-[180px] h-[180px] ${isSingle ? '' : '[&:nth-child(5n+1)]:col-start-2 [&:nth-child(5n+1)]:col-span-2 [&:nth-child(5n+2)]:col-start-1 [&:nth-child(5n+3)]:col-start-2 [&:nth-child(5n+4)]:col-start-3 [&:nth-child(5n)]:col-start-2 [&:nth-child(5n)]:col-span-1'} ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      onDoubleClick={() => {
        // if the image is still loading, don't activate it
        if (image.src.endsWith('/loading.webp')) {
          return
        }

        setActiveImage(activeImageId === image.id ? null : { ...image, groupId })
      }}
    >
      {image.src !== '' && (
        <Img
          {...image}
          index={index}
          activeImageId={activeImageId}
          onClick={(e: MouseEvent, action: Action) => onImageClick(e, action, index)}
          setHoverState={setHoverState}
          handleStopPosition={setPosition}
        />
      )}
    </div>
  )
}

export default ImageGridItem
