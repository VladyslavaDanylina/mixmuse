import React from "react";
import PropTypes from "prop-types";
import Track from "../Track/Track";
import "./TrackList.css";

export default class TrackList extends React.Component {
  render() {
    const { tracks = [], onAdd, onRemove, isRemoval, onPlay } = this.props;

    return (
      <div className="TrackList">
        {tracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            onAdd={onAdd}
            onRemove={onRemove}
            isRemoval={isRemoval}
            onPlay={onPlay} // ✅ Properly passed here
          />
        ))}
      </div>
    );
  }
}

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  isRemoval: PropTypes.bool,
  onPlay: PropTypes.func,
};
