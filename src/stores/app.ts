import type { StoreApi } from 'zustand'
import { create } from 'zustand'
// import { v4 as uuid } from 'uuid'

export type ImageGen = {
  src: string
  alt: string
}

const temp: ImageGen[] = [
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
  },
  {
    src: 'https://placehold.co/180',
    alt: 'Lorem ipsum dolor sit amet',
  },
]

export interface AppProps {
  grids: ImageGen[]
  tempImageGrids: Record<string, ImageGen[]>

  setGrids: (grids: ImageGen[]) => void
  setTempImageGrids: (grids: Record<string, ImageGen[]>) => void
}

export const useAppStore = create(
  (set: StoreApi<AppProps>['setState'], get: StoreApi<AppProps>['getState']) => ({
    grids: temp,
    tempImageGrids: {
      '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed': temp,
    },

    setGrids: (g: ImageGen[]) =>
      set(() => {
        const latest = get()

        return { ...latest, ...g }
      }),

    setTempImageGrids: (g: Record<string, ImageGen[]>) => set({ tempImageGrids: g }),
  }),
)
