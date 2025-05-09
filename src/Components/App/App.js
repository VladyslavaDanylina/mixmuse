import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import PlaylistList from "../PlaylistList/PlaylistList";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "New Playlist Name",
      playlistTracks: [],
      playlists: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
  }

  componentDidMount() {
    this.getUserPlaylists();
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists()
      .then((playlists) => {
        this.setState({ playlists });
      })
      .catch((err) => {
        console.error("Failed to fetch playlists:", err);
      });
  }

  addTrack(track) {
    if (this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    this.setState((prevState) => ({
      playlistTracks: [...prevState.playlistTracks, track],
    }));
  }

  removeTrack(track) {
    this.setState((prevState) => ({
      playlistTracks: prevState.playlistTracks.filter(
        (currentTrack) => track.id !== currentTrack.id
      ),
    }));
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

    Spotify.savePlayList(this.state.playlistName, trackUris)
      .then(() => {
        this.getUserPlaylists();
        this.setState({
          playlistName: "New Playlist Name",
          playlistTracks: [],
        });
      })
      .catch((err) => {
        console.error("Error saving playlist:", err);
      });
  }

  search(term) {
    Spotify.search(term)
      .then((searchResults) => {
        this.setState({ searchResults });
      })
      .catch((err) => {
        console.error("Search error:", err);
      });
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
            <SearchResults
              searchResults={searchResults}
              onAdd={this.addTrack}
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
        </div>
      </div>
    );
  }
}

export default App;
