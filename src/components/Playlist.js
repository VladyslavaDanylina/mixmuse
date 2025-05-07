import React from 'react'
import TrackList from './TrackList'

function Playlist({ name, tracks, onRemove, onNameChange, onSave }) {
  return (
    <div className="Playlist">
      <input value={name} onChange={e => onNameChange(e.target.value)} />
      <TrackList tracks={tracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  )
}

export default Playlist
