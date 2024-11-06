import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

import { updateFavoriteList } from '~/utils/image-action'
import { getRandomInt } from '~/utils/util'

export type SetGridOptions = {
  replace?: boolean
  emptyTempImageGrids?: boolean
  emptyActiveImage?: boolean
}

export type ImageGen = {
  id: string
  src: string
  alt: string
  isFavorite: boolean
}

export interface ActiveImageGen extends ImageGen {
  groupId?: string
}

export type TempImageGridData = {
  images: ImageGen[]
  position: { x: number; y: number }
}

export interface AppProps {
  grids: ImageGen[]
  tempImageGrids: Record<string, TempImageGridData>
  favorites: ImageGen[]
  activeImage: ActiveImageGen | null

  setGrids: (grids: ImageGen[], options?: SetGridOptions) => void
  addTempImage: (data: Record<string, TempImageGridData>, activeImage?: ActiveImageGen) => void
  removeTempImage: (id: string, grids: ImageGen[] | null, removeImageId: string) => void
  setFavorites: (favorite: ImageGen | ImageGen[], scan?: boolean) => void
  setActiveImage: (image: ActiveImageGen | null) => void
  setCurrentImageGen: (image: Pick<ImageGen, 'src' | 'alt'>) => void
}

// Redux Devtools enabled for debugging
export const useAppStore = create<AppProps>()(
  devtools((set, get) => ({
    grids: [],
    tempImageGrids: {},
    favorites: [],
    activeImage: null,

    setGrids: (newGrids: ImageGen[], options?: SetGridOptions) =>
      set(() => {
        const latest = get()

        return {
          grids: options?.replace ? newGrids : [...newGrids, ...latest.grids],
          tempImageGrids: options?.emptyTempImageGrids ? {} : latest.tempImageGrids,
          activeImage: options?.emptyActiveImage ? null : latest.activeImage,
        }
      }),

    // optionally, when duplicate or add a new image, by default, it will set it as active
    addTempImage: (data: Record<string, TempImageGridData>, activeImage?: ActiveImageGen) =>
      set(() => {
        const latest = get()
        const tempImageGrids = { ...latest.tempImageGrids, ...data }
        const updatedActiveImage = activeImage ? activeImage : latest.activeImage

        return { tempImageGrids, activeImage: updatedActiveImage }
      }),

    removeTempImage: (id: string, grids: ImageGen[] | null, removeImageId: string) =>
      set(() => {
        const latest = get()
        const tempImageGrids = { ...latest.tempImageGrids }
        let activeImage = latest.activeImage

        if (grids) {
          tempImageGrids[id] = { images: grids, position: tempImageGrids[id].position }
        } else {
          delete tempImageGrids[id]
        }

        // if the active image is the one being removed, set it to null
        if (activeImage?.id === removeImageId) {
          activeImage = null
        }

        return { tempImageGrids, activeImage }
      }),

    // scan is used to scan the favorite image in `tempImageGrids` and `grids`, used in `Favorites` component. Enables two way binding between `grids`,`tempImageGrids` and `favorites`
    setFavorites: (favorite: ImageGen | ImageGen[], scan = false) =>
      set(() => {
        const latest = get()
        let tempImageGrids = latest.tempImageGrids
        let grids = latest.grids
        let newFavorites: ImageGen[] = []

        // if the favorite is an array, set it directly, otherwise update the favorites list
        if (Array.isArray(favorite)) {
          newFavorites = favorite
        } else {
          newFavorites = updateFavoriteList(latest.favorites, favorite)

          window.localStorage.setItem('favorites', JSON.stringify(newFavorites))

          // setup two way binding between `grids`,`tempImageGrids` and `favorites`
          if (scan) {
            // if scan is true, remove the favorite image from `grids`
            grids = grids.map((image) =>
              image.id === favorite.id
                ? {
                    ...image,
                    isFavorite: false,
                  }
                : image,
            )

            tempImageGrids = Object.keys(tempImageGrids).reduce<Record<string, TempImageGridData>>(
              (acc, key) => {
                acc[key] = {
                  images: tempImageGrids[key].images.map((image) =>
                    image.id === favorite.id
                      ? {
                          ...image,
                          isFavorite: false,
                        }
                      : image,
                  ),
                  position: tempImageGrids[key].position,
                }
                return acc
              },
              {},
            ) as Record<string, TempImageGridData>
          }
        }

        return { favorites: newFavorites, tempImageGrids, grids }
      }),

    setActiveImage: (image: ActiveImageGen | null) => set(() => ({ activeImage: image })),

    setCurrentImageGen: (image: Pick<ImageGen, 'src' | 'alt'>) =>
      set(() => {
        const latest = get()
        const { tempImageGrids, activeImage } = latest

        const groupId = activeImage?.groupId ?? uuid()
        const position = { x: getRandomInt(180, 360), y: getRandomInt(180, 360) }

        const updatedActiveImage: ImageGen = {
          ...image,
          id: activeImage?.id ?? uuid(),
          isFavorite: activeImage?.isFavorite ?? false,
        }

        return {
          tempImageGrids: {
            ...tempImageGrids,
            [groupId]: { images: [updatedActiveImage], position },
          },
          activeImage: { ...updatedActiveImage, groupId },
        }
      }),
  })),
)
