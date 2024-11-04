import type { ImageGen } from '~/stores/app'

import type { Action } from '~/components/image'
import Heart from '~/components/heart'

interface FavoritesProps {
  favorites: ImageGen[]

  setFavorites: (favorite: ImageGen, scan?: boolean) => void
}

export default function Favorites({ favorites, setFavorites }: FavoritesProps) {
  const onImageClick = (action: Action, index: number) => {
    console.log(action, index)
  }

  const setFavorite = (favorite: ImageGen) => {
    const favoriteData = {
      ...favorite,
      isFavorite: false,
    }

    setFavorites(favoriteData, true)
  }

  return (
    <div className="relative space-y-4 mx-4">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="relative w-24 h-24 ring-2 ring-gray-300 group-hover:ring-violet-500"
        >
          <img src={favorite.src} alt={favorite.alt} className="w-full h-full object-cover" />

          <Heart
            isFavorite={true}
            className="absolute top-1 right-1 hover:opacity-75"
            setFavorite={() => setFavorite(favorite)}
          />
        </div>
      ))}
    </div>
  )
}
