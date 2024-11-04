import { v4 as uuid } from 'uuid'

import type { ImageGen } from '~/stores/app'

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
