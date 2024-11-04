import { useRef, useState } from 'react'
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

  onClick: (action: Action) => void
  setHoverState?: (drag: ImageHoverState) => void
  handleStopPosition?: (position: { x: number; y: number }) => void
}

const Img = ({
  src,
  alt,
  isFavorite,
  index,
  onClick,
  setHoverState,
  handleStopPosition,
}: ImageProps) => {
  const nodeRef = useRef(null)

  // Track the position in state
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const actions = [
    {
      icon: '+',
      onClick: () => onClick('ADD'),
      className: 'leading-none pt-[2.5px]',
    },
    {
      icon: '-',
      onClick: () => onClick('REMOVE'),
    },
    {
      icon: '!',
      onClick: () => onClick('GENERATE'),
    },
  ]

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
    <Draggable nodeRef={nodeRef} position={position} onStop={handleStop}>
      <div
        ref={nodeRef}
        className="relative group w-[180px] h-[180px] hover:cursor-grab"
        onMouseEnter={() => handleMouseAction(true)}
        onMouseLeave={() => handleMouseAction(false)}
      >
        <div className="w-full h-full ring-4 ring-gray-300 group-hover:ring-violet-500">
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>

        <Heart isFavorite={isFavorite} setFavorite={() => onClick('FAVORITE')} />

        <div className="absolute bottom-2 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
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
