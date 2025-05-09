import React from "react";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import "./PlaylistList.css";

export default class PlaylistList extends React.Component {
  handleSelect = (playlistId) => {
    if (this.props.onSelect) {
      this.props.onSelect(playlistId);
    }
  };

  render() {
    const { playlists } = this.props;

    return (
      <div className="PlaylistList">
        <h2>Your Playlists</h2>
        {playlists && playlists.length > 0 ? (
          playlists.map((playlist) => (
            <PlaylistItem
              key={playlist.playlistId}
              name={playlist.playlistName}
              playlistId={playlist.playlistId}
              onSelect={this.handleSelect}
            />
          ))
        ) : (
          <p>No playlists found.</p>
        )}
      </div>
    );
  }
}
