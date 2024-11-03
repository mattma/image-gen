import Img, { type Action } from '~/components/image'

const ImageGrid = () => {
  const onImageClick = (action: Action, index: number) => {
    console.log(action, index)
  }

  return (
    <div className="relative grid grid-cols-3 gap-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="hover:z-10">
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
