'use client'

import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { useShallow } from 'zustand/shallow'

import { useAppStore, type ActiveImageGen, type ImageGen } from '~/stores/app'

import Favorites from '~/components/favorites'
import SidebarToggle from '~/components/sidebar-toggle'
import ImageGrid from '~/components/image-grid'
import Gallery from '~/components/gallery'

import { fetchImage } from '~/services/api'

export default function Home() {
  const [
    girds,
    tempImageGrids,
    favorites,
    activeImage,
    setGrids,
    addTempImage,
    removeTempImage,
    setFavorites,
    setActiveImage,
    setCurrentImageGen,
  ] = useAppStore(
    useShallow((state) => [
      state.grids,
      state.tempImageGrids,
      state.favorites,
      state.activeImage,
      state.setGrids,
      state.addTempImage,
      state.removeTempImage,
      state.setFavorites,
      state.setActiveImage,
      state.setCurrentImageGen,
    ]),
  )

  const queryRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const tempImageGridsKeys = Object.keys(tempImageGrids)

  const [tempGridSingle, setTempGridSingle] = useState<{ id: string; data: ActiveImageGen[] }[]>([])
  const [tempGridFive, setTempGridFive] = useState<{ id: string; data: ActiveImageGen[] }[]>([])

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      ;(async function () {
        const result = await fetchImage(debouncedQuery)

        if (result) {
          // create a new entry in the temp image grids
          const imageData: Pick<ImageGen, 'src' | 'alt'> = {
            src: result.images[0].url,
            alt: result.prompt,
          }

          setCurrentImageGen(imageData)
        }
      })()
    }
  }, [debouncedQuery, setCurrentImageGen])

  useEffect(() => {
    // debounce query by 800 ms
    const timeoutId = setTimeout(() => setDebouncedQuery(query), 800)
    return () => clearTimeout(timeoutId)
  }, [query])

  useEffect(() => {
    const keys = Object.keys(tempImageGrids)
    const singleGroup: { id: string; data: ActiveImageGen[] }[] = []
    const fiveGroup: { id: string; data: ActiveImageGen[] }[] = []

    if (keys.length > 0) {
      keys.forEach((key) => {
        const gridSize = tempImageGrids[key].length

        if (gridSize === 1) {
          singleGroup.push({ id: key, data: tempImageGrids[key] })
        } else if (gridSize === 5) {
          fiveGroup.push({ id: key, data: tempImageGrids[key] })
        }
      })
    }

    setTempGridSingle(singleGroup)
    setTempGridFive(fiveGroup)
  }, [tempImageGrids])

  // Initialize page load with favorites from local storage
  useEffect(() => {
    const favorites = JSON.parse(window.localStorage.getItem('favorites') ?? '[]')

    setFavorites(favorites)
  }, [setFavorites])

  const handleArrange = () => {
    const tempGirds: ActiveImageGen[] = []

    tempImageGridsKeys.forEach((key) => {
      if (tempImageGrids[key].length > 0) {
        for (const image of tempImageGrids[key]) {
          // Add to the beginning of the array if image is not empty
          if (image && image.src !== '') {
            tempGirds.unshift(image)
          }
        }
      }
    })

    setGrids(tempGirds, { emptyTempImageGrids: true })
  }

  const updatePromptText = (prompt: string) => {
    if (queryRef.current) {
      queryRef.current.value = prompt
    }
  }

  const handleSetActiveImage = (image: ActiveImageGen | null) => {
    setActiveImage(image)

    // update the prompt text when active image is set
    if (image) {
      updatePromptText(image.alt)
    }
  }

  return (
    <div className="flex w-full h-full">
      <aside
        className={`relative py-4 bg-gray-100 border-r border-gray-200 transition-width duration-300 overflow-y-auto ${isSidebarOpen ? 'w-[128px]' : 'w-0'}`}
      >
        <div className="sticky">
          <h3 className="mb-2 pl-4 text-sm font-medium tracking-tight  text-gray-700">
            Favorites <span className="text-xs text-gray-500">({favorites.length})</span>
          </h3>
          <Favorites
            favorites={favorites}
            setFavorites={setFavorites}
            addTempImage={addTempImage}
            updatePromptText={updatePromptText}
          />
        </div>
      </aside>

      <section className="relative flex-1 space-y-8 px-8 overflow-y-auto">
        <div
          className="absolute top-4 left-2 hover:opacity-75 hover:cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <SidebarToggle />
        </div>

        <div className="mt-4">
          <h1 className="text-3xl font-bold text-center">Live Image Generation</h1>

          <div className="my-4 flex gap-2 justify-center">
            <input
              ref={queryRef}
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="block w-96 px-4 py-2 rounded-md border border-gray-500"
            />

            <button
              className="block px-4 py-2 bg-gradient-to-r from-violet-700 to-blue-500 text-white ring-1 ring-inset ring-white/20 rounded-md font-medium"
              onClick={handleArrange}
            >
              Arrange in Grid
            </button>
          </div>
        </div>

        <div className="relative h-[60%]">
          {tempGridFive.map((group, level) => (
            <div key={group.id} className="w-[600px] grid grid-rows-3 grid-cols-3 gap-4">
              <ImageGrid
                id={group.id}
                level={level}
                grids={group.data}
                activeImageId={activeImage?.id}
                addTempImage={addTempImage}
                removeTempImage={removeTempImage}
                setFavorites={setFavorites}
                setActiveImage={handleSetActiveImage}
                updatePromptText={updatePromptText}
              />
            </div>
          ))}

          <div className="absolute top-0 left-0">
            {tempGridSingle.map((single, level) => (
              <ImageGrid
                key={single.id}
                id={single.id}
                level={level}
                grids={single.data}
                activeImageId={activeImage?.id}
                isSingle={true}
                addTempImage={addTempImage}
                removeTempImage={removeTempImage}
                setFavorites={setFavorites}
                setActiveImage={handleSetActiveImage}
                updatePromptText={updatePromptText}
              />
            ))}
          </div>
        </div>

        <div className="">
          <Gallery
            grids={girds}
            addTempImage={addTempImage}
            setGrids={setGrids}
            setFavorites={setFavorites}
            updatePromptText={updatePromptText}
          />
        </div>
      </section>
    </div>
  )
}
