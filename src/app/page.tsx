'use client'

import { useState, useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

import { useAppStore, type ImageGen } from '~/stores/app'

import Favorites from '~/components/favorites'
import Search from '~/components/search'
import ImageGrid from '~/components/image-grid'
import Gallery from '~/components/gallery'

export default function Home() {
  const [girds, tempImageGrids, favorites, setGrids, addTempImage, removeTempImage, setFavorites] =
    useAppStore(
      useShallow((state) => [
        state.grids,
        state.tempImageGrids,
        state.favorites,
        state.setGrids,
        state.addTempImage,
        state.removeTempImage,
        state.setFavorites,
      ]),
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

    setGrids(tempGirds, { emptyTempImageGrids: true })
  }

  // Initialize page load with favorites from local storage
  useEffect(() => {
    const favorites = JSON.parse(window.localStorage.getItem('favorites') ?? '[]')

    setFavorites(favorites)
  }, [setFavorites])

  return (
    <div className="flex w-full h-full">
      <aside className="relative w-[128px] bg-gray-100 border-r border-gray-200">
        <div className="sticky top-5">
          <div className="overflow-y-auto">
            <h3 className="mb-2 pl-4 text-sm font-medium tracking-tight  text-gray-700">
              Favorites ({favorites.length})
            </h3>
            <Favorites favorites={favorites} />
          </div>
        </div>
      </aside>

      <section className="flex-1 space-y-8 px-8 overflow-y-auto">
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

        <div className="h-[60%] bg-gray-100">
          {tempImageGridsKeys.length > 0 &&
            tempImageGridsKeys.map((key) => (
              <ImageGrid
                key={key}
                id={key}
                grids={tempImageGrids[key]}
                addTempImage={addTempImage}
                removeTempImage={removeTempImage}
                setFavorites={setFavorites}
              />
            ))}
        </div>

        <div className="">
          <Gallery
            grids={girds}
            addTempImage={addTempImage}
            setGrids={setGrids}
            setFavorites={setFavorites}
          />
        </div>
      </section>
    </div>
  )
}
