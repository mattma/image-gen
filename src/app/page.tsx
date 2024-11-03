'use client'

import { useState } from 'react'

import Search from '~/components/search'
import ImageGrid from '~/components/image-grid'

export default function Home() {
  const [query, setQuery] = useState('')

  const handleArrange = () => {
    console.log('arrange')
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

        <div className="mt-4">
          <ImageGrid />
        </div>
      </div>
    </>
  )
}
