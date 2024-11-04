import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
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

  setGrids: (grids: ImageGen[], emptyTempImageGrids?: boolean) => void
  setTempImageGrids: (grids: Record<string, ImageGen[]>) => void
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
          alt: 'Lorem ipsum dolor sit amet',
        },
      ],
    },

    setGrids: (g: ImageGen[], emptyTempImageGrids = false) =>
      set(() => {
        const latest = get()

        return {
          grids: [...latest.grids, ...g],
          tempImageGrids: emptyTempImageGrids ? {} : latest.tempImageGrids,
        }
      }),

    setTempImageGrids: (g: Record<string, ImageGen[]>) => set({ tempImageGrids: g }),
  })),
)
