import React, { useState } from 'react'

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('')

  const handleSearch = () => {
    onSearch(term)
  }

  return (
    <div className="SearchBar">
      <label htmlFor="search-input" className="sr-only">Search</label>
      <input
        id="search-input"
        name="search"
        type="text"
        placeholder="Enter a song, artist, or genre"
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
      <button onClick={handleSearch}>SEARCH</button>
    </div>
  )
}

export default SearchBar
