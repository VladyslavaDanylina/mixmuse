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
    const { isRemoval } = this.props;
    return (
      <button
        className="Track-action"
        onClick={isRemoval ? this.removeTrack : this.addTrack}
      >
        {isRemoval ? "−" : "+"}
      </button>
    );
  }

  render() {
    const { name, artist, album, albumImage, previewUrl, uri } = this.props.track;

    return (
      <div className="Track">
        {albumImage && (
          <img
            src={albumImage}
            alt={`${name} album cover`}
            className="Track-album-art"
          />
        )}

        <div className="Track-information">
          <h3>{name}</h3>
          <p>{artist} | {album}</p>

          <div className="Track-controls">
            {previewUrl && (
              <audio controls className="Track-audio">
                <source src={previewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {this.props.onPlay && uri && (
              <button onClick={() => this.props.onPlay(uri)} className="Track-play-btn">
                ▶ Play
              </button>
            )}
          </div>
        </div>

        {this.renderAction()}
      </div>
    );
  }
}

export default Track;
