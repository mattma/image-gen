import { v4 as uuid } from 'uuid'

import type { ImageGen } from '~/stores/app'

import { fetchImage } from '~/services/api'

export function addImage(image: ImageGen): Record<string, ImageGen[]> {
  const gridId = uuid()
  const imageId = uuid()

  return { [gridId]: [{ ...image, id: imageId, isFavorite: false }] }
}

// if the grids size is 5, remove the image and return the new grids
// otherwise, return null to remove the entire grid
export function removeImage(index: number, grids: ImageGen[]): ImageGen[] | null {
  const size = grids.length
  let ret = null

  if (size === 5) {
    grids.splice(index, 1, { id: uuid(), src: '', alt: '', isFavorite: false })

    // since the image src can be empty, remove the entire grid
    const filteredGrids = grids.filter((grid) => grid.src !== '')
    ret = filteredGrids.length > 0 ? grids : null
  }

  return ret
}

async function generate(prompt: string, count: number): Promise<ImageGen[] | null> {
  const result = await fetchImage(prompt, count)

  if (result) {
    console.log('result', result)
    const images = result.images.map((image) => ({
      id: uuid(),
      src: image.url,
      alt: prompt,
      isFavorite: false,
    }))

    return images
  }

  return null
}

export async function generateImage(
  id: string | null,
  index: number,
  grids: ImageGen[],
): Promise<Record<string, ImageGen[]>> {
  id = id ?? uuid() // if id is null, generate a new uuid for grid id

  const size = grids.length
  let ret = {}

  // if grid size is 5, generate another 5 images in a new grid
  // otherwise, generate 4 more images in the current grid, keep the current index image in the middle
  if (size === 5) {
    const newId = uuid()

    ret = { [newId]: generate('', 5) }
  } else if (size === 1) {
    const alt = grids[index].alt
    const newGrids = await generate(alt, 4)

    if (newGrids) {
      // make sure the new image has a new id
      const newImage = { ...grids[index], id: uuid(), isFavorite: false }

      newGrids.splice(2, 0, newImage)

      ret = { [id as string]: newGrids }
    }
  }

  return ret
}

// if the current favorite is already in the favorites list, remove it
// otherwise, add it to the favorites list
export function updateFavoriteList(favorites: ImageGen[], currentFavorite: ImageGen): ImageGen[] {
  let newFavorites = [...favorites]

  if (currentFavorite.isFavorite) {
    newFavorites.push(currentFavorite)
  } else {
    newFavorites = newFavorites.filter((favorite) => favorite.id !== currentFavorite.id)
  }

  return newFavorites
}
