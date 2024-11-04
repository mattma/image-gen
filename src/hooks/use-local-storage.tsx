import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState(() => {
    let currentValue

    try {
      currentValue = JSON.parse(localStorage.getItem(key) || String(defaultValue))
    } catch (e: unknown) {
      currentValue = defaultValue
      console.error(e)
    }

    return currentValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}

export default useLocalStorage
