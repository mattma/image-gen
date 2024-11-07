// get a random integer between min and max
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Space out the images grid as a cross
// image width is 180px, add 20px gap between images
export const getTopPosition = (top: number, index: number, gap = 200): number => {
  if (Number.isInteger(index)) {
    switch (index) {
      case 0:
        return top - gap
      case 4:
        return top + gap
    }
  }

  return top
}

// Space out the images grid as a cross
// image width is 180px, add 20px gap between images
export const getLeftPosition = (left: number, index: number, gap = 200): number => {
  if (Number.isInteger(index)) {
    switch (index) {
      case 1:
        return left - gap
      case 3:
        return left + gap
    }
  }

  return left
}
