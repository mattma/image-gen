import { useState, useEffect } from 'react'

import type { ImageGen, ActiveImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

interface ImageGridItemProps {
  image: ImageGen
  index: number
  level: number
  isSingle: boolean
  hoverState: { hover: boolean; index: number }
  activeImageId?: string
  groupId?: string
  onImageClick: (action: Action, index: number) => void
  setHoverState: (hoverState: ImageHoverState) => void
  setActiveImage: (image: ActiveImageGen | null) => void
}

const ImageGridItem = ({
  image,
  index,
  level,
  isSingle,
  hoverState,
  activeImageId,
  groupId,
  onImageClick,
  setHoverState,
  setActiveImage,
}: ImageGridItemProps) => {
  const x = 30 * level
  const y = (isSingle ? -60 : -270) * level
  const [position, setPosition] = useState({ x, y })
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  useEffect(() => setTop(() => position.y * 2), [position.y])

  useEffect(() => setLeft(() => position.x * 2), [position.x])

  return (
    <div
      className={`relative w-[180px] h-[180px] ${isSingle ? '' : '[&:nth-child(5n+1)]:col-start-2 [&:nth-child(5n+1)]:col-span-2 [&:nth-child(5n+2)]:col-start-1 [&:nth-child(5n+3)]:col-start-2 [&:nth-child(5n+4)]:col-start-3 [&:nth-child(5n)]:col-start-2 [&:nth-child(5n)]:col-span-1'} ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      onDoubleClick={() =>
        setActiveImage(activeImageId === image.id ? null : { ...image, groupId })
      }
    >
      {image.src !== '' && (
        <Img
          {...image}
          index={index}
          activeImageId={activeImageId}
          onClick={(action: Action) => onImageClick(action, index)}
          setHoverState={setHoverState}
          handleStopPosition={setPosition}
        />
      )}
    </div>
  )
}

export default ImageGridItem
