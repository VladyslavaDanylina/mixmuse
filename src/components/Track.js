import React from 'react'

function Track({ track, onAdd, onRemove, isRemoval }) {
  const handleClick = () => {
    isRemoval ? onRemove(track) : onAdd(track)
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      <button onClick={handleClick}>{isRemoval ? '-' : '+'}</button>
    </div>
  )
}

export default Track
