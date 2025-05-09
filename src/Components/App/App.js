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

  async componentDidMount() {
    try {
      const token = await Spotify.getAccessToken();
      if (!token) {
        console.error("Access token not found");
        return;
      }

      this.setState({ accessToken: token });

      const playlists = await Spotify.getUserPlaylists();
      this.setState({ playlists });
    } catch (error) {
      console.error("Error during Spotify auth or playlist fetch:", error);
    }
  }

  async getUserPlaylists() {
    try {
      const playlists = await Spotify.getUserPlaylists();
      this.setState({ playlists });
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    }
  }

  addTrack(track) {
    const exists = this.state.playlistTracks.some((t) => t.id === track.id);
    if (exists) return;
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

  async savePlaylist() {
    const { playlistName, playlistTracks } = this.state;
    const trackUris = playlistTracks.map((track) => track.uri);

    if (!trackUris.length) {
      alert("Your playlist is empty! Please add tracks.");
      return;
    }

    try {
      await Spotify.savePlayList(playlistName, trackUris);
      await this.getUserPlaylists();
      this.setState({
        playlistName: "New Playlist Name",
        playlistTracks: [],
      });
    } catch (error) {
      console.error("Failed to save playlist:", error);
      alert("There was an issue saving your playlist. Please try again.");
    }
  }

  search(term) {
    Spotify.search(term).then((results) => {
      this.setState({ searchResults: results });
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
            <SpotifyPlayer accessToken={accessToken} trackUri={currentlyPlayingUri} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
