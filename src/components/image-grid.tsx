import { useState } from 'react'

import type { ImageGen } from '~/stores/app'

import Img, { type Action, type ImageDragging } from '~/components/image'

interface ImageGridProps {
  grids: ImageGen[]
}

const ImageGrid = ({ grids }: ImageGridProps) => {
  const [hoverState, setHoverState] = useState<ImageDragging>({ hover: false, index: -1 })

  const onImageClick = (action: Action, index: number) => {
    console.log(action, index)
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {grids.map((image, index) => (
        <div
          key={index}
          className={`relative first:col-start-2 first:col-span-2 [&:nth-child(2)]:col-start-1 [&:nth-child(3)]:col-start-2 [&:nth-child(4)]:col-start-3 last:col-start-2 last:col-span-1 ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
        >
          <Img
            src={image.src}
            alt={image.alt}
            index={index}
            onClick={(action: Action) => onImageClick(action, index)}
            setHoverState={setHoverState}
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
