import { useRef, useState, type MouseEvent } from 'react'
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable'

import type { ImageGen } from '~/stores/app'

import Heart from '~/components/heart'

export type Action = 'ADD' | 'REMOVE' | 'GENERATE' | 'FAVORITE'

export type ImageHoverState = {
  hover: boolean
  index: number
}

interface ImageProps extends ImageGen {
  index?: number
  activeImageId?: string

  onClick: (e: MouseEvent, action: Action) => void
  setHoverState?: (drag: ImageHoverState) => void
  handleStopPosition?: (position: { x: number; y: number }) => void
}

const Img = ({
  id,
  src,
  alt,
  isFavorite,
  index,
  activeImageId,
  onClick,
  setHoverState,
  handleStopPosition,
}: ImageProps) => {
  const nodeRef = useRef(null)

  // Track the position in state
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const [isDeleted, setIsDeleted] = useState(false)

  const actions = [
    {
      icon: '+',
      onClick: (e: MouseEvent) => onClick(e, 'ADD'),
      className: 'leading-none pt-[2.5px]',
    },
    {
      icon: '-',
      onClick: (e: MouseEvent) => {
        setIsDeleted(true)
        onClick(e, 'REMOVE')
      },
    },
    {
      icon: '!',
      onClick: (e: MouseEvent) => {
        setIsDeleted(true)
        onClick(e, 'GENERATE')
      },
    },
  ]

  // important. Detect mouse hover on the image. so we can manage the z-index of the image, so the image is on top of the other images when hovered
  const handleMouseAction = (hover: boolean) => {
    if (setHoverState && index !== undefined) {
      setHoverState({ hover, index })
    }
  }

  // Update position when dragging stops
  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    // if handleStopPosition is defined, parent will handle the position
    // otherwise, set the position in state to manage by the draggable component
    if (handleStopPosition) {
      handleStopPosition({ x: data.x, y: data.y })
    } else {
      setPosition({ x: data.x, y: data.y })
    }
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={handleStop}
      disabled={src.endsWith('/loading.webp')}
    >
      <div
        ref={nodeRef}
        className={`relative group w-[180px] h-[180px] hover:cursor-grab ${isDeleted ? 'hidden' : ''}`}
        onMouseEnter={() => handleMouseAction(true)}
        onMouseLeave={() => handleMouseAction(false)}
      >
        <div
          className={`w-full h-full ring-4 ${activeImageId === id ? 'ring-red-500' : 'ring-gray-300 group-hover:ring-violet-500'}`}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>

        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart
            isFavorite={isFavorite}
            setFavorite={(e: MouseEvent) => onClick(e, 'FAVORITE')}
            className={`${src.endsWith('/loading.webp') ? 'hidden' : ''}`}
          />
        </div>

        <div
          className={`absolute bottom-2 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 ${
            src.endsWith('/loading.webp') ? 'hidden' : ''
          }`}
        >
          {actions.map((action) => (
            <div
              key={action.icon}
              onClick={action.onClick}
              className={`w-6 h-6 bg-black/50 rounded-full text-white font-bold text-center hover:cursor-pointer hover:bg-black/75 ${
                action.className ? action.className : ''
              }`}
            >
              {action.icon}
            </div>
          ))}
        </div>

        <p className="w-[186px] px-2 py-1 absolute top-[186px] left-0 text-white font-medium text-center bg-neutral-600 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {alt}
        </p>

        <div className="absolute top-0 left-0 w-[180px] h-[180px] z-10" />
      </div>
    </Draggable>
  )
}

export default Img
