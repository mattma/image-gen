import type { ImageGen, SetGridOptions } from '~/stores/app'

import Img, { type Action } from '~/components/image'

import { addImage, generateImage } from '~/utils/image-action'

type GalleryProps = {
  grids: ImageGen[]

  addTempImage: (data: Record<string, ImageGen[]>, id?: string) => void
  setGrids: (grids: ImageGen[], options?: SetGridOptions) => void
  setFavorites: (favorite: ImageGen) => void
}

const Gallery = ({ grids, addTempImage, setGrids, setFavorites }: GalleryProps) => {
  const onImageClick = async (action: Action, index: number) => {
    switch (action) {
      case 'ADD':
        const addData = addImage(grids[index])
        addTempImage(addData)
        break

      case 'REMOVE':
        const newGrids = [...grids]
        newGrids.splice(index, 1)

        setGrids(newGrids, { replace: true })
        break

      case 'GENERATE':
        // generate a new UUID, and set current image as the center in new image grid
        const generateData = await generateImage(null, 0, [grids[index]])
        addTempImage(generateData)

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
              <Img {...grid} onClick={(action: Action) => onImageClick(action, index)} />
            </div>
          ))}
        </div>
      ) : null}
    </>
  )
}

export default Gallery
