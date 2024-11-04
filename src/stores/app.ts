import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { updateFavoriteList } from '~/utils/image-action'

export type SetGridOptions = {
  replace?: boolean
  emptyTempImageGrids?: boolean
}

export type ImageGen = {
  src: string
  alt: string
  isFavorite: boolean
}

const temp: ImageGen[] = [
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
    isFavorite: false,
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
    isFavorite: false,
  },
  {
    src: 'https://placehold.co/180',
    alt: 'center image',
    isFavorite: false,
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
    isFavorite: false,
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Last image',
    isFavorite: false,
  },
]

export interface AppProps {
  grids: ImageGen[]
  tempImageGrids: Record<string, ImageGen[]>
  favorites: ImageGen[]

  setGrids: (grids: ImageGen[], options?: SetGridOptions) => void
  addTempImage: (data: Record<string, ImageGen[]>) => void
  removeTempImage: (id: string, grids: ImageGen[] | null) => void
  setFavorites: (favorite: ImageGen | ImageGen[]) => void
}

// Redux Devtools enabled for debugging
export const useAppStore = create<AppProps>()(
  devtools((set, get) => ({
    grids: temp,
    tempImageGrids: {
      '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed': temp,
      '2b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed': [
        {
          src: 'https://placehold.co/180',
          alt: 'testing for a single image',
          isFavorite: false,
        },
      ],
    },
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

        return { tempImageGrids: tempImageGrids ?? {} }
      }),

    setFavorites: (favorite: ImageGen | ImageGen[]) =>
      set(() => {
        const latest = get()
        let newFavorites: ImageGen[] = []

        // if the favorite is an array, set it directly, otherwise update the favorites list
        if (Array.isArray(favorite)) {
          newFavorites = favorite
        } else {
          newFavorites = updateFavoriteList(latest.favorites, favorite)

          window.localStorage.setItem('favorites', JSON.stringify(newFavorites))
        }

        return { favorites: newFavorites }
      }),
  })),
)
