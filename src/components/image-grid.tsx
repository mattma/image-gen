import { useState } from 'react'
import Img, { type Action, type ImageDragging } from '~/components/image'

const ImageGrid = () => {
  const [dragState, setDragState] = useState<ImageDragging>({ dragging: false, index: -1 })

  const onImageClick = (action: Action, index: number) => {
    console.log(action, index)
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`relative first:col-start-2 first:col-span-2 [&:nth-child(2)]:col-start-1 [&:nth-child(3)]:col-start-2 [&:nth-child(4)]:col-start-3 last:col-start-2 last:col-span-1 ${dragState.dragging && index === dragState.index ? 'z-50' : 'z-0'}`}
        >
          <Img
            src="https://placehold.co/180"
            alt={`${index + 1} Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet`}
            index={index}
            onClick={(action: Action) => onImageClick(action, index)}
            setDragState={setDragState}
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
