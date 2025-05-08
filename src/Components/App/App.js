import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import PlaylistList from "../PlaylistList/PlaylistList";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: null,
      searchResults: [],
      playlistName: "New Playlist Name",
      playlistTracks: [],
      playlists: [],
      currentlyPlayingUri: null,
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.setPlayingTrack = this.setPlayingTrack.bind(this);
  }

  componentDidMount() {
    this.getUserPlaylists();
    Spotify.getAccessToken().then((token) => {
      this.setState({ accessToken: token });
    });
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists().then((playlists) => {
      this.setState({ playlists });
    });
  }

  addTrack(track) {
    const tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    this.setState({ playlistTracks: [...tracks, track] });
  }

  removeTrack(track) {
    const tracks = this.state.playlistTracks.filter(
      (currentTrack) => track.id !== currentTrack.id
    );
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    if (!trackUris.length) {
      alert("Your playlist is empty! Please add tracks.");
      return;
    }

    Spotify.savePlayList(this.state.playlistName, trackUris).then(() => {
      this.getUserPlaylists();
      this.setState({
        playlistName: "New Playlist Name",
        playlistTracks: [],
      });
    });
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults });
    });
  }

  setPlayingTrack(uri) {
    this.setState({ currentlyPlayingUri: uri });
  }

  render() {
    const {
      accessToken,
      searchResults,
      playlistName,
      playlistTracks,
      playlists,
      currentlyPlayingUri,
    } = this.state;

    return (
      <div>
        <h1>
          <span className="highlight">MixMuse</span>
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={searchResults}
              onAdd={this.addTrack}
              onPlay={this.setPlayingTrack}
            />
            <Playlist
              playlistName={playlistName}
              playlistTracks={playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
          <PlaylistList playlists={playlists} />
          {accessToken && currentlyPlayingUri && (
            <SpotifyPlayer
              accessToken={accessToken}
              trackUri={currentlyPlayingUri}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;

