import type { ImageGen, ActiveImageGen, TempImageGridData } from '~/stores/app'

import Heart from '~/components/heart'

import { addImage, generateImage, generateDefaultImage } from '~/utils/image-action'
import { getRandomInt } from '~/utils/util'

interface FavoritesProps {
  favorites: ImageGen[]

  setFavorites: (favorite: ImageGen, scan?: boolean) => void
  addTempImage: (data: Record<string, TempImageGridData>, activeImage?: ActiveImageGen) => void
  updatePromptText: (prompt: string) => void
}

const Favorites = ({ favorites, setFavorites, addTempImage, updatePromptText }: FavoritesProps) => {
  const actions = [
    {
      icon: '+',
      onClick: (favorite: ImageGen) => {
        const { gridId: imageGridId, data: addData } = addImage(favorite)
        const activeImage: ActiveImageGen = { ...addData[0], groupId: imageGridId }
        addTempImage(
          {
            [imageGridId]: {
              images: addData,
              position: { x: getRandomInt(180, 360), y: getRandomInt(180, 360) },
            },
          },
          activeImage,
        )
        updatePromptText(favorite.alt)
      },
    },
    {
      icon: '!',
      onClick: async (favorite: ImageGen) => {
        const position = { x: getRandomInt(360, 480), y: getRandomInt(360, 480) }
        // generate a default image array with a loading image
        const { data: defaultImages, gridId } = generateDefaultImage(favorite)
        addTempImage({ [gridId]: { images: defaultImages, position } })

        const { data: generateData, prompt } = await generateImage(favorite)
        if (generateData) {
          addTempImage({ [gridId]: { images: generateData, position } })
          updatePromptText(prompt)
        }
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
          className="group relative w-24 h-24 ring-2 ring-gray-300 hover:ring-violet-500"
        >
          <img
            src={favorite.src}
            alt={favorite.alt}
            className="w-full h-full object-cover group-hover:opacity-75"
          />

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

export default Favorites
