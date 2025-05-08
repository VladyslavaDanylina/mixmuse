import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button className="Track-action" onClick={this.removeTrack}>
          -
        </button>
      );
    } else {
      return (
        <button className="Track-action" onClick={this.addTrack}>
          +
        </button>
      );
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    const { name, artist, album, albumImage, previewUrl } = this.props.track;

    return (
      <div className="Track">
        {albumImage && (
          <img
            src={albumImage}
            alt={`${name} album art`}
            className="Track-album-art"
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
        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
