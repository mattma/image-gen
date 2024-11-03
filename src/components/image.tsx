import { useRef, useState } from 'react'
import Draggable from 'react-draggable'

export type Action = 'ADD' | 'REMOVE' | 'GENERATE'

export type ImageDragging = {
  dragging: boolean
  index: number
}

type ImageProps = {
  src: string
  alt: string
  index?: number

  onClick: (action: Action) => void
  setDragState?: (drag: ImageDragging) => void
}

const Img = ({ src, alt, index, onClick, setDragState }: ImageProps) => {
  const nodeRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)

  const [isFavorite, setIsFavorite] = useState(false)

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

  const handleDrag = (dragging: boolean, currentDragging: boolean, index?: number) => {
    // Prevent unnecessary re-renders. check if the dragging state has changed
    if (currentDragging === dragging) return

    setIsDragging(dragging)

    if (setDragState && index !== undefined) {
      setDragState({ dragging, index })
    }
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={() => handleDrag(true, isDragging, index)}
      onStop={() => handleDrag(false, isDragging, index)}
    >
      <div ref={nodeRef} className="relative group w-[180px] h-[180px] hover:cursor-grab">
        <div className={`w-full h-full ring-4 ${isDragging ? 'ring-violet-500' : 'ring-gray-300'}`}>
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>

        <div
          className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 hover:cursor-pointer transition-opacity duration-300"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            viewBox="0 0 122.88 107.39"
          >
            <path
              d="M60.83,17.18c8-8.35,13.62-15.57,26-17C110-2.46,131.27,21.26,119.57,44.61c-3.33,6.65-10.11,14.56-17.61,22.32-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.55C29.16,76.89,1,55.92,0,29.94-.63,11.74,13.73.08,30.25.29c14.76.2,21,7.54,30.58,16.89Z"
              className={`${isFavorite ? 'fill-red-500' : 'fill-white'}`}
            />
          </svg>
          <p className="sr-only">Heart for favorite</p>
        </div>

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
