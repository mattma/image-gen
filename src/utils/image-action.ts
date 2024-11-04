import { v4 as uuid } from 'uuid'

import type { ImageGen } from '~/stores/app'

export function addImage(image: ImageGen): Record<string, ImageGen[]> {
  const id = uuid()

  return { [id]: [image] }
}

// if the grids size is 5, remove the image and return the new grids
// otherwise, return null to remove the entire grid
export function removeImage(index: number, grids: ImageGen[]): ImageGen[] | null {
  const size = grids.length
  let ret = null

  if (size === 5) {
    grids.splice(index, 1, { src: '', alt: '' })

    // since the image src can be empty, remove the entire grid
    const filteredGrids = grids.filter((grid) => grid.src !== '')
    ret = filteredGrids.length > 0 ? grids : null
  }

  return ret
}

function generate(count: number): ImageGen[] {
  return Array.from({ length: count }, () => ({
    src: 'https://placehold.co/180',
    alt: 'generated',
  }))
}

export function generateImage(
  id: string,
  index: number,
  grids: ImageGen[],
): Record<string, ImageGen[]> {
  const size = grids.length
  let ret = {}

  // if grid size is 5, generate another 5 images in a new grid
  // otherwise, generate 4 more images in the current grid, keep the current index image in the middle
  if (size === 5) {
    const newId = uuid()

    ret = { [newId]: generate(5) }
  } else if (size === 1) {
    const newGrids = generate(4)
    newGrids.splice(2, 0, grids[index])

    ret = { [id]: newGrids }
  }

  return ret
}
