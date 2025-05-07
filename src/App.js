import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import Playlist from './components/Playlist'
import Spotify from './services/Spotify'

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [playlistName, setPlaylistName] = useState('New Playlist')
  const [playlistTracks, setPlaylistTracks] = useState([])

  const handleSearch = async (term) => {
    const results = await Spotify.search(term);
    setSearchResults(results);
  };  

 

  const addTrack = (track) => {
    if (playlistTracks.find(t => t.id === track.id)) return
    setPlaylistTracks(prev => [...prev, track])
  }

  const removeTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id))
  }

  const savePlaylist = async () => {
    const trackUris = playlistTracks.map(track => track.uri)
    await Spotify.savePlaylist(playlistName, trackUris)
    setPlaylistName('New Playlist')
    setPlaylistTracks([])
  }

  return (
    <div className="App">
      <h1>MixMuse</h1>
      <SearchBar onSearch={handleSearch} />
<SearchResults results={searchResults} onAdd={addTrack} />
      <div className="App-playlist">
        <SearchResults results={searchResults} onAdd={addTrack} />
        <Playlist 
          name={playlistName}
          tracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={setPlaylistName}
          onSave={savePlaylist}
        />
      </div>
    </div>
  )
}

export default App
