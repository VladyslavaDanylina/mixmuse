import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.state = {
      isPlaying: false,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  togglePlay() {
    const audio = this.audioRef.current;
    if (!audio) return;

    if (this.state.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    this.setState((prev) => ({ isPlaying: !prev.isPlaying }));
  }

  renderAction() {
    return (
      <button
        className="Track-action"
        onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}
      >
        {this.props.isRemoval ? "-" : "+"}
      </button>
    );
  }

  renderPlayButton() {
    const { previewUrl } = this.props.track;

    if (!previewUrl) return null;

    return (
      <>
        <button
          className="Track-play-button"
          onClick={this.togglePlay}
          title={this.state.isPlaying ? "Pause" : "Play"}
        >
          {this.state.isPlaying ? "⏸" : "▶️"}
        </button>
        <audio ref={this.audioRef} src={previewUrl} onEnded={() => this.setState({ isPlaying: false })} />
      </>
    );
  }

  render() {
    const { name, artist, album, albumCover } = this.props.track;

    return (
      <div className="Track">
        <div className="Track-left">
          {albumCover && (
            <img
              src={albumCover}
              alt={`${name} album cover`}
              className="Track-album-art"
              style={{ width: "64px", height: "64px", marginRight: "10px" }}
            />
          )}
          <div className="Track-information">
            <h3>{name}</h3>
            <p>
              {artist} | {album}
            </p>
          </div>
        </div>
        <div className="Track-buttons">
          {this.renderPlayButton()}
          {this.renderAction()}
        </div>
      </div>
    );
  }
}

export default Track;
