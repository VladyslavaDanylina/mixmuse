import React, { useState } from 'react';
import styles from './styles/SearchBar.module.css';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleSearch = () => {
    onSearch(term);
  };

  return (
    <div className={styles.SearchBar}>
      <input
        placeholder="Enter a song, album, or artist"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button onClick={handleSearch}>SEARCH</button>
    </div>
  );
}

export default SearchBar;
