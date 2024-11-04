import { useState } from 'react'

import type { ImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

import { removeImage } from '~/utils/image-action'

interface ImageGridProps {
  id: string
  grids: ImageGen[]

  removeTempImage: (id: string, grids: ImageGen[] | null) => void
}

const ImageGrid = ({ id, grids, removeTempImage }: ImageGridProps) => {
  const [hoverState, setHoverState] = useState<ImageHoverState>({ hover: false, index: -1 })

  const onImageClick = (action: Action, index: number) => {
    switch (action) {
      case 'ADD':
        console.log('add')
        break

      case 'REMOVE':
        const data = removeImage(index, grids)
        removeTempImage(id, data)
        break

      case 'GENERATE':
        console.log('generate')
        break
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {grids.map((image, index) => (
        <div
          key={index}
          className={`relative first:col-start-2 first:col-span-2 [&:nth-child(2)]:col-start-1 [&:nth-child(3)]:col-start-2 [&:nth-child(4)]:col-start-3 last:col-start-2 last:col-span-1 ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
        >
          {image.src !== '' && (
            <Img
              src={image.src}
              alt={image.alt}
              index={index}
              onClick={(action: Action) => onImageClick(action, index)}
              setHoverState={setHoverState}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
