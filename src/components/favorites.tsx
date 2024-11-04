import type { ImageGen } from '~/stores/app'

import { type Action } from '~/components/image'

interface FavoritesProps {
  favorites: ImageGen[]
}

export default function Favorites({ favorites }: FavoritesProps) {
  const onImageClick = (action: Action, index: number) => {
    console.log(action, index)
  }

  return (
    <div className="relative space-y-4 mx-4">
      {favorites.map((favorite, index) => (
        <div
          key={index}
          className="w-24 h-24 ring-2 ring-gray-300 group-hover:ring-violet-500 z-0 hover:z-50"
        >
          <img src={favorite.src} alt={favorite.alt} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  )
}
