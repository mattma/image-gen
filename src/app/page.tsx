'use client'

import { useState } from 'react'
import { useShallow } from 'zustand/shallow'

import { useAppStore, type ImageGen } from '~/stores/app'

import Search from '~/components/search'
import ImageGrid from '~/components/image-grid'
import Img from '~/components/image'
import Gallery from '~/components/gallery'

export default function Home() {
  const [girds, tempImageGrids, setGrids] = useAppStore(
    useShallow((state) => [state.grids, state.tempImageGrids, state.setGrids]),
  )

  const [query, setQuery] = useState('')

  const tempImageGridsKeys = Object.keys(tempImageGrids)

  const handleArrange = () => {
    const tempGirds: ImageGen[] = []

    tempImageGridsKeys.forEach((key) => {
      if (tempImageGrids[key].length > 0) {
        tempGirds.push(...tempImageGrids[key])
      }
    })

    setGrids(tempGirds, true)
  }

  return (
    <>
      <div className="mt-4">
        <h1 className="text-3xl font-bold text-center">Live Image Generation</h1>

        <div className="my-4 flex gap-2 justify-center">
          <Search query={query} setQuery={setQuery} />

          <button
            className="block px-4 py-2 bg-gradient-to-r from-violet-700 to-blue-500 text-white ring-1 ring-inset ring-white/20 rounded-md font-medium"
            onClick={handleArrange}
          >
            Arrange in Grid
          </button>
        </div>
      </div>

      <div className="mt-4 ml-20 w-[600px]">
        <Img
          src="https://placehold.co/180"
          alt="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet"
          onClick={() => {}}
        />

        {tempImageGridsKeys.length > 0 &&
          tempImageGridsKeys.map((key) => <ImageGrid key={key} grids={tempImageGrids[key]} />)}
      </div>

      <div className="mt-4 mx-8">
        <Gallery grids={girds} />
      </div>
    </>
  )
}
