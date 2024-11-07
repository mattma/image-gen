import { type MouseEvent } from 'react'

import type { ActiveImageGen, ImageGen, SetGridOptions, TempImageGridData } from '~/stores/app'

import Img, { type Action } from '~/components/image'

import { addImage, generateImage, generateDefaultImage } from '~/utils/image-action'
import { getRandomInt } from '~/utils/util'

type GalleryProps = {
  grids: ImageGen[]

  addTempImage: (data: Record<string, TempImageGridData>, activeImage?: ActiveImageGen) => void
  setGrids: (grids: ImageGen[], options?: SetGridOptions) => void
  setFavorites: (favorite: ImageGen) => void
  updatePromptText: (text: string) => void
}

const Gallery = ({
  grids,
  addTempImage,
  setGrids,
  setFavorites,
  updatePromptText,
}: GalleryProps) => {
  const onImageClick = async (e: MouseEvent, action: Action, index: number) => {
    switch (action) {
      case 'ADD':
        // the position of the image grid is to the top left of the current image position because image is 180 * 180
        const addPosition = {
          x: e.pageX - getRandomInt(180, 240),
          y: e.pageY - getRandomInt(180, 240),
        }
        const { gridId: imageGridId, data: addData } = addImage(grids[index])
        const activeImage: ActiveImageGen = { ...addData[0], groupId: imageGridId }

        addTempImage({ [imageGridId]: { images: addData, position: addPosition } }, activeImage)
        updatePromptText(grids[index].alt)
        break

      case 'REMOVE':
        const newGrids = [...grids]
        newGrids.splice(index, 1)

        setGrids(newGrids, { replace: true })
        break

      case 'GENERATE':
        // to be centered in the image grid, mouse cursor position is at the "Generate" button, so subtract 152px from the x and 162px from the y position to negative value of the generate button position
        const position = { x: e.pageX - 152, y: e.pageY - 162 }
        // generate a default image array with a loading image
        const { data: defaultImages, gridId } = generateDefaultImage(grids[index])
        addTempImage({ [gridId]: { images: defaultImages, position } })

        // generate a new UUID, and set current image as the center in new image grid
        const { data: generateData, prompt } = await generateImage(grids[index])

        if (generateData) {
          addTempImage({ [gridId]: { images: generateData, position } })
          updatePromptText(prompt)
        }

        // remove the current image from the grid
        const updatedGrids = [...grids]
        updatedGrids.splice(index, 1)
        setGrids(updatedGrids, { replace: true })
        break

      case 'FAVORITE':
        const favoriteData = [...grids]
        favoriteData[index].isFavorite = !favoriteData[index].isFavorite

        setFavorites(favoriteData[index])
        setGrids(favoriteData, { replace: true })
        break
    }
  }

  return (
    <>
      {grids.length > 0 ? (
        <div className="relative flex flex-wrap gap-4">
          {grids.map((grid, index) => (
            <div key={grid.id} className="z-0 hover:z-50">
              <Img
                {...grid}
                onClick={(e: MouseEvent, action: Action) => onImageClick(e, action, index)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

export default Gallery
