import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  renderAction() {
    return (
      <button className="Track-action" onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}>
        {this.props.isRemoval ? "-" : "+"}
      </button>
    );
  }

  render() {
    const { name, artist, album, albumCover, previewUrl } = this.props.track;

    return (
      <div className="Track">
        <div className="Track-left">
        {albumCover && (
          <img
            src={albumCover}
            alt={`${name} album cover`}
            className="Track-album-art"
            style={{ width: '64px', height: '64px', marginRight: '10px' }}
          />
        )}
        <div className="Track-information">
          <h3>{name}</h3>
          <p>{artist} | {album}</p>
          {previewUrl && (
            <audio controls className="Track-audio">
              <source src={previewUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
        </div>
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;

