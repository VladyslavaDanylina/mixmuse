import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import PlaylistList from "../PlaylistList/PlaylistList";
import Spotify from "../../util/Spotify";
import { initializePlayer, playTrack, transferPlaybackHere } from "../Player/Player";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist Name",
      playlistTracks: [],
      playlists: [],
      selectedPlaylistId: null,
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }

  async componentDidMount() {
    await Spotify.getAccessToken();
    initializePlayer();

    // Delay playback transfer to wait for device ID to be stored
    setTimeout(async () => {
      await transferPlaybackHere();
    }, 1500);

    this.getUserPlaylists();
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists()
      .then((playlists) => this.setState({ playlists }))
      .catch((err) => console.error("Failed to fetch playlists:", err));
  }

  selectPlaylist(playlistId) {
    const selected = this.state.playlists.find((p) => p.playlistId === playlistId);
    if (!selected) return;

    Spotify.getPlaylistTracks(playlistId)
      .then((tracks) => {
        this.setState({
          selectedPlaylistId: playlistId,
          playlistName: selected.playlistName,
          playlistTracks: tracks,
        });
      })
      .catch((err) => console.error("Failed to load selected playlist tracks:", err));
  }

  addTrack(track) {
    if (this.state.playlistTracks.find((t) => t.id === track.id)) return;
    this.setState((prevState) => ({
      playlistTracks: [...prevState.playlistTracks, track],
    }));
  }

  removeTrack(track) {
    this.setState((prevState) => ({
      playlistTracks: prevState.playlistTracks.filter((t) => t.id !== track.id),
    }));
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const { playlistName, playlistTracks, selectedPlaylistId } = this.state;
    const trackUris = playlistTracks.map((t) => t.uri);

    if (!trackUris.length) {
      alert("Your playlist is empty. Add some tracks first!");
      return;
    }

    const action = selectedPlaylistId
      ? Spotify.updatePlaylist(selectedPlaylistId, playlistName, trackUris)
      : Spotify.savePlayList(playlistName, trackUris);

    action
      .then(() => {
        this.getUserPlaylists();
        this.setState({
          playlistName: "New Playlist Name",
          playlistTracks: [],
          selectedPlaylistId: null,
        });
      })
      .catch((err) => console.error("Error saving/updating playlist:", err));
  }

  search(term) {
    Spotify.search(term)
      .then((searchResults) => this.setState({ searchResults }))
      .catch((err) => console.error("Search error:", err));
  }

  render() {
    const { searchResults, playlistName, playlistTracks, playlists } = this.state;

    return (
      <div>
        <h1>
          Mix<span className="highlight">Muse</span>
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={searchResults} onAdd={this.addTrack} />
            <Playlist
              playlistName={playlistName}
              playlistTracks={playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
          <PlaylistList playlists={playlists} onSelect={this.selectPlaylist} />
        </div>
      </div>
    );
  }
}

export default App;
