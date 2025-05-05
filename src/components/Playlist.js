import React from 'react';
import TrackList from './TrackList';
import styles from './styles/Playlist.module.css';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
  return (
    <div className={styles.Playlist}>
      <input value={playlistName} onChange={(e) => onNameChange(e.target.value)} />
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;
