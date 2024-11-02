'use client'

type SearchProps = {
  query: string
  setQuery: (query: string) => void
}

export default function Search({ query, setQuery }: SearchProps) {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="block w-96 px-4 py-2 rounded-md border border-gray-500"
    />
  )
}
