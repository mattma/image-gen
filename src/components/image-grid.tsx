import { useState } from 'react'

import type { ImageGen } from '~/stores/app'

import Img, { type Action, type ImageHoverState } from '~/components/image'

import { addImage, removeImage, generateImage } from '~/utils/image-action'

interface ImageGridProps {
  id: string
  grids: ImageGen[]
  level: number

  addTempImage: (data: Record<string, ImageGen[]>) => void
  removeTempImage: (id: string, grids: ImageGen[] | null) => void
  setFavorites: (favorite: ImageGen) => void
}

const ImageGrid = ({
  id,
  grids,
  level,
  addTempImage,
  removeTempImage,
  setFavorites,
}: ImageGridProps) => {
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

      case 'FAVORITE':
        const favoriteData = [...grids]
        favoriteData[index].isFavorite = !favoriteData[index].isFavorite

        setFavorites(favoriteData[index])
        addTempImage({ [id]: favoriteData })
        break
    }
  }

  return (
    <>
      {grids.map((image, index) => (
        <div
          key={image.id}
          className={`relative [&:nth-child(5n+1)]:col-start-2 [&:nth-child(5n+1)]:col-span-2 [&:nth-child(5n+2)]:col-start-1 [&:nth-child(5n+3)]:col-start-2 [&:nth-child(5n+4)]:col-start-3 [&:nth-child(5n)]:col-start-2 [&:nth-child(5n)]:col-span-1 ${hoverState.hover && index === hoverState.index ? 'z-50' : 'z-0'}`}
          style={{
            top: `-${560 * level}px`,
            left: `${30 * level}px`,
          }}
        >
          {image.src !== '' && (
            <Img
              {...image}
              index={index}
              onClick={(action: Action) => onImageClick(action, index)}
              setHoverState={setHoverState}
            />
          )}
        </div>
      ))}
    </>
  )
}

export default ImageGrid
