import React, { useState } from 'react'

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('')

  const handleSearch = () => {
    onSearch(term)
  }

  return (
    <div className="SearchBar">
      <input type="text" placeholder="Enter a song, artist, or genre" value={term} onChange={e => setTerm(e.target.value)} />
      <button onClick={handleSearch}>SEARCH</button>
    </div>
  )
}

export default SearchBar
