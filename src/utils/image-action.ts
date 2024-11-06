import { v4 as uuid } from 'uuid'

import type { ImageGen } from '~/stores/app'

import { fetchChatCompletion, fetchImage } from '~/services/api'

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

async function generate(prompt: string): Promise<ImageGen[] | null> {
  const prompts = await fetchChatCompletion(prompt)

  if (prompts && prompts.length > 0) {
    console.log('prompts', prompts)

    const images = await Promise.all(
      prompts.map(async (alt: string) => {
        const result = await fetchImage(alt)

        return {
          id: uuid(),
          src: result?.images[0].url ?? '',
          alt,
          isFavorite: false,
        }
      }),
    )

    console.log('images', images)

    return images
  }

  return null
}

export async function generateImage(image: ImageGen): Promise<{
  data: Record<string, ImageGen[]>
  prompt: string
}> {
  let ret = {}
  const gridId = uuid()
  const newGrids = await generate(image.alt)
  let prompt = image.alt

  if (newGrids) {
    // make sure the new image has a new id
    const newImage = { ...image, id: uuid(), isFavorite: false }

    newGrids.splice(2, 0, newImage)

    ret = { [gridId]: newGrids }
    prompt = newGrids[newGrids.length - 1].alt
  }

  return { data: ret, prompt }
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
