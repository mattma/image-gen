import { useState } from 'react'

import type { ImageGen } from '~/stores/app'

import type { Action, ImageHoverState } from '~/components/image'
import ImageGridItem from '~/components/image-grid-item'

import { addImage, removeImage, generateImage } from '~/utils/image-action'

interface ImageGridProps {
  id: string
  grids: ImageGen[]
  level: number
  // used to determine if the image grid contains a single image
  isSingle?: boolean

  addTempImage: (data: Record<string, ImageGen[]>) => void
  removeTempImage: (id: string, grids: ImageGen[] | null) => void
  setFavorites: (favorite: ImageGen) => void
}

const ImageGrid = ({
  id,
  grids,
  level,
  isSingle = false,
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
        <ImageGridItem
          key={image.id}
          image={image}
          index={index}
          level={level}
          isSingle={isSingle}
          hoverState={hoverState}
          onImageClick={onImageClick}
          setHoverState={setHoverState}
        />
      ))}
    </>
  )
}

export default ImageGrid
