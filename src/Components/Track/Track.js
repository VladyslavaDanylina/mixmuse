import React from "react";
import "./Track.css";

let globalAudio = new Audio();
let currentPlayingTrackId = null;

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };

    this.audio = null;
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.handleAudioEnd = this.handleAudioEnd.bind(this);
  }

  componentWillUnmount() {
    if (this.state.isPlaying) {
      globalAudio.pause();
      currentPlayingTrackId = null;
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  togglePreview() {
    const { previewUrl } = this.props.track;

    if (!previewUrl) return;

    // Stop other track if this one isn't the current
    if (currentPlayingTrackId !== this.props.track.id) {
      globalAudio.src = previewUrl;
      globalAudio.play();
      globalAudio.onended = this.handleAudioEnd;

      currentPlayingTrackId = this.props.track.id;
      this.setState({ isPlaying: true });
    } else {
      if (this.state.isPlaying) {
        globalAudio.pause();
        this.setState({ isPlaying: false });
      } else {
        globalAudio.play();
        this.setState({ isPlaying: true });
      }
    }
  }

  handleAudioEnd() {
    this.setState({ isPlaying: false });
    currentPlayingTrackId = null;
  }

  renderAction() {
    return (
      <button className="Track-action" onClick={this.props.isRemoval ? this.removeTrack : this.addTrack}>
        {this.props.isRemoval ? "-" : "+"}
      </button>
    );
  }

  render() {
    const { name, artist, album, albumCover } = this.props.track;
    const { previewUrl } = this.props.track;

    return (
      <div className="Track">
        <div className="Track-left">
          {albumCover && (
            <img
              src={albumCover}
              alt={`${name} album cover`}
              className="Track-album-art"
            />
          )}
          <div className="Track-information">
            <h3>{name}</h3>
            <p>{artist} | {album}</p>
            {previewUrl && (
              <button className="Track-play-button" onClick={this.togglePreview}>
                {this.state.isPlaying ? "⏸" : "▶️"}
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
