import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

import { updateFavoriteList } from '~/utils/image-action'

export type SetGridOptions = {
  replace?: boolean
  emptyTempImageGrids?: boolean
}

export type ImageGen = {
  id: string
  src: string
  alt: string
  isFavorite: boolean
}

const temp = (): ImageGen[] => {
  return [
    {
      id: uuidv4(),
      src: 'https://placehold.co/180',
      alt: '1 Lorem ipsum dolor sit amet',
      isFavorite: false,
    },
    {
      id: uuidv4(),
      src: 'https://placehold.co/180',
      alt: '2 Lorem ipsum dolor sit amet',
      isFavorite: false,
    },
    {
      id: uuidv4(),
      src: 'https://placehold.co/180',
      alt: '3 center image',
      isFavorite: false,
    },
    {
      id: uuidv4(),
      src: 'https://placehold.co/180',
      alt: '4 Lorem ipsum dolor sit amet',
      isFavorite: false,
    },
    {
      id: uuidv4(),
      src: 'https://placehold.co/180',
      alt: '5 Last image',
      isFavorite: false,
    },
  ]
}

export interface AppProps {
  grids: ImageGen[]
  tempImageGrids: Record<string, ImageGen[]>
  favorites: ImageGen[]

  setGrids: (grids: ImageGen[], options?: SetGridOptions) => void
  addTempImage: (data: Record<string, ImageGen[]>) => void
  removeTempImage: (id: string, grids: ImageGen[] | null) => void
  setFavorites: (favorite: ImageGen | ImageGen[], scan?: boolean) => void
}

// Redux Devtools enabled for debugging
export const useAppStore = create<AppProps>()(
  devtools((set, get) => ({
    grids: temp(),
    tempImageGrids: {},
    // tempImageGrids: {
    //   '1c9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed': [...temp(), ...temp()],
    // },
    favorites: [],

    setGrids: (newGrids: ImageGen[], options?: SetGridOptions) =>
      set(() => {
        const latest = get()

        return {
          grids: options?.replace ? newGrids : [...latest.grids, ...newGrids],
          tempImageGrids: options?.emptyTempImageGrids ? {} : latest.tempImageGrids,
        }
      }),

    addTempImage: (data: Record<string, ImageGen[]>) =>
      set(() => {
        const latest = get()
        const tempImageGrids = { ...latest.tempImageGrids, ...data }

        return { tempImageGrids }
      }),

    removeTempImage: (id: string, grids: ImageGen[] | null) =>
      set(() => {
        const latest = get()
        const tempImageGrids = { ...latest.tempImageGrids }

        if (grids) {
          tempImageGrids[id] = grids
        } else {
          delete tempImageGrids[id]
        }

        return { tempImageGrids }
      }),

    // scan is used to scan the favorite image in `tempImageGrids` and `grids`, used in `Favorites` component
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

            tempImageGrids = Object.keys(tempImageGrids).reduce<Record<string, ImageGen[]>>(
              (acc, key) => {
                acc[key] = tempImageGrids[key].map((image) =>
                  image.id === favorite.id
                    ? {
                        ...image,
                        isFavorite: false,
                      }
                    : image,
                )
                return acc
              },
              {},
            ) as Record<string, ImageGen[]>
          }
        }

        return { favorites: newFavorites, tempImageGrids, grids }
      }),
  })),
)
