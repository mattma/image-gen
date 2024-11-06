import { useState, type MouseEvent } from 'react'

import type { ImageGen, ActiveImageGen, TempImageGridData } from '~/stores/app'

import type { Action, ImageHoverState } from '~/components/image'
import ImageGridItem from '~/components/image-grid-item'

import { addImage, removeImage, generateImage, generateDefaultImage } from '~/utils/image-action'

interface ImageGridProps {
  id: string
  grids: ImageGen[]
  // used to determine if the image grid contains a single image
  isSingle?: boolean
  activeImageId?: string

  addTempImage: (data: Record<string, TempImageGridData>, activeImage?: ActiveImageGen) => void
  removeTempImage: (id: string, grids: ImageGen[] | null, removeImageId: string) => void
  setFavorites: (favorite: ImageGen) => void
  setActiveImage: (image: ActiveImageGen | null) => void
  updatePromptText: (text: string) => void
}

const ImageGrid = ({
  id,
  grids,
  isSingle = false,
  activeImageId,
  addTempImage,
  removeTempImage,
  setFavorites,
  setActiveImage,
  updatePromptText,
}: ImageGridProps) => {
  const [hoverState, setHoverState] = useState<ImageHoverState>({ hover: false, index: -1 })

  const onImageClick = async (e: MouseEvent, action: Action, index: number) => {
    switch (action) {
      case 'ADD':
        const { gridId: imageGridId, data: addData } = addImage(grids[index])
        const activeImage: ActiveImageGen = { ...addData[0], groupId: imageGridId }

        addTempImage(
          { [imageGridId]: { images: addData, position: { x: e.pageX, y: e.pageY } } },
          activeImage,
        )
        updatePromptText(grids[index].alt)
        break

      case 'REMOVE':
        const removeImageId = grids[index].id
        const removeData = removeImage(index, grids)
        removeTempImage(id, removeData, removeImageId)
        break

      case 'GENERATE':
        const image = grids[index]
        const position = { x: e.pageX - 350, y: e.pageY - 355 }

        // generate a default image array with a loading image
        const { data: defaultImages, gridId } = generateDefaultImage(image)
        addTempImage({
          [gridId]: { images: defaultImages, position },
        })

        const { data: generateData, prompt } = await generateImage(image)
        if (generateData) {
          addTempImage({
            [gridId]: { images: generateData, position },
          })
          updatePromptText(prompt)
        }

        // remove the current image because we are generating a new grid with the current image as the center
        const removedImageId = grids[index].id
        const removeCurrentData = removeImage(index, grids)
        removeTempImage(id, removeCurrentData, removedImageId)

        break

      case 'FAVORITE':
        const favoriteData = [...grids]
        favoriteData[index].isFavorite = !favoriteData[index].isFavorite

        setFavorites(favoriteData[index])
        addTempImage({ [id]: { images: favoriteData, position: { x: 0, y: 0 } } })
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
