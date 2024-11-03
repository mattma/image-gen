import Img, { type Action } from '~/components/image'

const ImageGrid = () => {
  const onImageClick = (action: Action, index: number) => {
    console.log(action, index)
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="relative z-0 hover:z-10 first:col-start-2 first:col-span-3 last:col-span-3 last:col-start-2"
        >
          <Img
            src="https://placehold.co/180"
            alt="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet"
            onClick={(action: Action) => onImageClick(action, index)}
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
