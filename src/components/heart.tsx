import type { MouseEvent } from 'react'

type HeartProps = {
  isFavorite: boolean
  className?: string

  setFavorite: (e: MouseEvent) => void
}

const Heart = ({ isFavorite, className = '', setFavorite }: HeartProps) => {
  return (
    <div className={`hover:cursor-pointer ${className}`} onClick={setFavorite}>
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        viewBox="0 0 122.88 107.39"
      >
        <path
          d="M60.83,17.18c8-8.35,13.62-15.57,26-17C110-2.46,131.27,21.26,119.57,44.61c-3.33,6.65-10.11,14.56-17.61,22.32-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.55C29.16,76.89,1,55.92,0,29.94-.63,11.74,13.73.08,30.25.29c14.76.2,21,7.54,30.58,16.89Z"
          className={`${isFavorite ? 'fill-red-500' : 'fill-white'}`}
        />
      </svg>
      <p className="sr-only">Heart for favorite</p>
    </div>
  )
}

export default Heart
