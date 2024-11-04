import type { ImageGen } from '~/stores/app'

import Heart from '~/components/heart'

import { addImage, generateImage } from '~/utils/image-action'

interface FavoritesProps {
  favorites: ImageGen[]

  setFavorites: (favorite: ImageGen, scan?: boolean) => void
  addTempImage: (data: Record<string, ImageGen[]>) => void
}

export default function Favorites({ favorites, setFavorites, addTempImage }: FavoritesProps) {
  const actions = [
    {
      icon: '+',
      onClick: (favorite: ImageGen) => {
        const addData = addImage(favorite)
        addTempImage(addData)
      },
      className: '',
    },
    {
      icon: '!',
      onClick: (favorite: ImageGen) => {
        const generateData = generateImage(null, 0, [favorite])
        addTempImage(generateData)
      },
      className: 'pt-[1.5px]',
    },
  ]

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

          <div className="absolute bottom-1 right-1 flex gap-1">
            {actions.map((action) => (
              <div
                key={action.icon}
                onClick={() => action.onClick(favorite)}
                className={`w-4 h-4 bg-black/50 rounded-full text-white font-bold text-center hover:cursor-pointer hover:bg-black/75 leading-none text-sm ${
                  action.className ? action.className : ''
                }`}
              >
                {action.icon}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
