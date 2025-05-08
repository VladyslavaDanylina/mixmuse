import React, { useRef, useState } from "react";
import "./Track.css";

const Track = ({ track, onAdd, onRemove, isRemoval, onPlay }) => {
  const { name, artist, album, albumImage, previewUrl } = track;
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);

  const addTrack = () => onAdd && onAdd(track);
  const removeTrack = () => onRemove && onRemove(track);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
    onPlay && onPlay(track.uri); // optional external handler
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const renderAction = () => (
    <button className="Track-action" onClick={isRemoval ? removeTrack : addTrack}>
      {isRemoval ? "-" : "+"}
    </button>
  );

  return (
    <div className="Track">
      <div className="Track-left">
        {previewUrl && (
          <button className="Track-play-button" onClick={handlePlay}>▶</button>
        )}
        {albumImage && (
          <img
            src={albumImage}
            alt={`${name} album art`}
            className="Track-album-art"
          />
        )}
        {previewUrl && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="Track-volume"
          />
        )}
      </div>
      <div className="Track-information">
        <h3>{name}</h3>
        <p>{artist} | {album}</p>
        {previewUrl && (
          <audio ref={audioRef} src={previewUrl} preload="auto" />
        )}
      </div>
      {renderAction()}
    </div>
  );
};

export default Track;
