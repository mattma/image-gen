import { useState, useEffect, useRef, type MouseEvent } from 'react'

import type { ImageGen, ActiveImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

import { getTopPosition, getLeftPosition } from '~/utils/util'

interface ImageGridItemProps {
  image: ImageGen
  index: number
  groupId?: string
  isSingle: boolean
  activeImageId?: string
  gridPosition: { x: number; y: number }
  hoverState: { hover: boolean; index: number }
  onImageClick: (e: MouseEvent, action: Action, index: number) => void
  setHoverState: (hoverState: ImageHoverState) => void
  setActiveImage: (image: ActiveImageGen | null) => void
}

const ImageGridItem = ({
  image,
  index,
  groupId,
  isSingle,
  activeImageId,
  gridPosition,
  hoverState,
  onImageClick,
  setHoverState,
  setActiveImage,
}: ImageGridItemProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)

  const imageHasMoved = useRef(false)

  useEffect(() => {
    setTop((prev) => {
      return imageHasMoved.current
        ? prev + position.y
        : isSingle
          ? gridPosition.y
          : getTopPosition(gridPosition.y, index)
    })
  }, [gridPosition.y, position.y, index, isSingle])

  useEffect(() => {
    setLeft((prev) => {
      return imageHasMoved.current
        ? prev + position.x
        : isSingle
          ? gridPosition.x
          : getLeftPosition(gridPosition.x, index)
    })
  }, [gridPosition.x, position.x, index, isSingle])

  const handleStopPosition = (position: { x: number; y: number }) => {
    setPosition(position)

    imageHasMoved.current = true
  }

  return (
    <div
      className={`absolute w-[180px] h-[180px] ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
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
          handleStopPosition={handleStopPosition}
        />
      )}
    </div>
  )
}

export default ImageGridItem
