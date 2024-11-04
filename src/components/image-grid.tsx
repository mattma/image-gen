import { useState } from 'react'

import type { ImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

import { addImage, removeImage, generateImage } from '~/utils/image-action'

interface ImageGridProps {
  id: string
  grids: ImageGen[]

  addTempImage: (data: Record<string, ImageGen[]>) => void
  removeTempImage: (id: string, grids: ImageGen[] | null) => void
}

const ImageGrid = ({ id, grids, addTempImage, removeTempImage }: ImageGridProps) => {
  const [hoverState, setHoverState] = useState<ImageHoverState>({ hover: false, index: -1 })

  const onImageClick = (action: Action, index: number) => {
    switch (action) {
      case 'ADD':
        const addData = addImage(grids[index])
        addTempImage(addData)
        break

      case 'REMOVE':
        const removeData = removeImage(index, grids)
        removeTempImage(id, removeData)
        break

      case 'GENERATE':
        const generateData = generateImage(id, index, grids)
        addTempImage(generateData)
        break
    }
  }

  return (
    <div className="w-[600px] grid grid-cols-3 gap-4">
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
