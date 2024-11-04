type SearchProps = {
  query: string
  setQuery: (query: string) => void
}

const Search = ({ query, setQuery }: SearchProps) => {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="block w-96 px-4 py-2 rounded-md border border-gray-500"
    />
  )
}

export default Search
