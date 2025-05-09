import React from "react";
import Spotify from "./Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const token = await Spotify.getAccessToken();
      if (!token) {
        this.setState({ error: "Failed to get access token", loading: false });
        return;
      }

      const playlists = await Spotify.getUserPlaylists();
      this.setState({ playlists, loading: false });
    } catch (error) {
      console.error("App init error:", error);
      this.setState({ error: error.message || "Something went wrong", loading: false });
    }
  }

  render() {
    const { playlists, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h1>Your Spotify Playlists</h1>
        <ul>
          {playlists.map((p) => (
            <li key={p.playlistId}>{p.playlistName}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
