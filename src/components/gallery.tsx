import type { ImageGen } from '~/stores/app'

import Img from '~/components/image'

type GalleryProps = {
  grids: ImageGen[]
}

export default function Gallery({ grids }: GalleryProps) {
  return (
    <>
      {grids.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {grids.map((grid, index) => (
            <Img key={index} {...grid} onClick={() => {}} />
          ))}
        </div>
      ) : null}
    </>
  )
}
