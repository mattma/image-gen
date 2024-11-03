import { useRef, useState } from 'react'
import Draggable from 'react-draggable'

export type Action = 'ADD' | 'REMOVE' | 'GENERATE'

type ImageProps = {
  src: string
  alt: string

  onClick: (action: Action) => void
}

const Img = ({ src, alt, onClick }: ImageProps) => {
  const nodeRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)

  const actions = [
    {
      icon: '+',
      onClick: () => onClick('ADD'),
      className: 'leading-5',
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

  return (
    <Draggable
      nodeRef={nodeRef}
      onDrag={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
    >
      <div ref={nodeRef} className="group w-[180px] h-[180px] hover:cursor-grab">
        <div
          className={`relative w-full h-full ring-4 bg-red-100 ${isDragging ? 'ring-violet-300' : 'ring-gray-300'}`}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover" />

          <p className="w-[186px] px-2 py-1 absolute top-[186px] left-0 text-white font-medium text-center bg-neutral-600 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {alt}
          </p>
        </div>

        <div className="absolute bottom-2 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          {actions.map((action) => (
            <div
              key={action.icon}
              onClick={action.onClick}
              className={`w-6 h-6 bg-black/50 rounded-full text-white font-bold text-center cursor-pointer hover:bg-black/75 ${
                action.className ? action.className : ''
              }`}
            >
              {action.icon}
            </div>
          ))}
        </div>

        <div className="absolute top-0 left-0 w-[180px] h-[180px] z-10" />
      </div>
    </Draggable>
  )
}

export default Img
