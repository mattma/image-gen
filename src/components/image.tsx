import { useRef } from 'react'
import Draggable from 'react-draggable'

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
}

const Img = ({ src, alt, isFavorite, index, onClick, setHoverState }: ImageProps) => {
  const nodeRef = useRef(null)

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

  const setFavorite = () => {
    // const favorites = JSON.parse(window.localStorage.getItem('favorites') ?? '[]')
    // let newFavorites = [...(favorites ?? [])]
    // if (isFavorite) {
    //   newFavorites = newFavorites.filter((favorite) => favorite.src !== src)
    // } else {
    //   newFavorites.push({ src, alt })
    // }
    // window.localStorage.setItem('favorites', JSON.stringify(newFavorites))
    // setIsFavorite(!isFavorite)
    onClick('FAVORITE')
  }

  return (
    <Draggable nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className="relative group w-[180px] h-[180px] hover:cursor-grab"
        onMouseEnter={() => handleMouseAction(true)}
        onMouseLeave={() => handleMouseAction(false)}
      >
        <div className="w-full h-full ring-4 ring-gray-300 group-hover:ring-violet-500">
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>

        <Heart isFavorite={isFavorite} setFavorite={setFavorite} />

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
