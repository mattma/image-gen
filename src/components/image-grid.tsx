import { useState } from 'react'

import type { ImageGen, ActiveImageGen } from '~/stores/app'

import type { Action, ImageHoverState } from '~/components/image'
import ImageGridItem from '~/components/image-grid-item'

import { addImage, removeImage, generateImage } from '~/utils/image-action'

interface ImageGridProps {
  id: string
  grids: ImageGen[]
  level: number
  // used to determine if the image grid contains a single image
  isSingle?: boolean
  activeImageId?: string
  addTempImage: (data: Record<string, ImageGen[]>) => void
  removeTempImage: (id: string, grids: ImageGen[] | null) => void
  setFavorites: (favorite: ImageGen) => void
  setActiveImage: (image: ActiveImageGen | null) => void
  updatePromptText: (text: string) => void
}

const ImageGrid = ({
  id,
  grids,
  level,
  isSingle = false,
  activeImageId,
  addTempImage,
  removeTempImage,
  setFavorites,
  setActiveImage,
  updatePromptText,
}: ImageGridProps) => {
  const [hoverState, setHoverState] = useState<ImageHoverState>({ hover: false, index: -1 })

  const onImageClick = async (action: Action, index: number) => {
    switch (action) {
      case 'ADD':
        const addData = addImage(grids[index])
        addTempImage(addData)
        updatePromptText(grids[index].alt)
        break

      case 'REMOVE':
        const removeData = removeImage(index, grids)
        removeTempImage(id, removeData)
        break

      case 'GENERATE':
        const { data: generateData, prompt } = await generateImage(grids[index])
        addTempImage(generateData)
        updatePromptText(prompt)

        // remove the current image because we are generating a new grid with the current image as the center
        const removeCurrentData = removeImage(index, grids)
        removeTempImage(id, removeCurrentData)

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
          groupId={id}
          hoverState={hoverState}
          activeImageId={activeImageId}
          onImageClick={onImageClick}
          setHoverState={setHoverState}
          setActiveImage={setActiveImage}
        />
      ))}
    </>
  )
}

export default ImageGrid
