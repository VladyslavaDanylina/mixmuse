let accessToken;
let userId;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = "https://vladyslavadanylina.github.io/mixmuse/";
 // "http://localhost:3000"; // Must match spotify app setting exactly & include trailing slash.

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
  
    const storedToken = localStorage.getItem("spotify_access_token");
    const tokenExpiry = localStorage.getItem("spotify_token_expiry");
    const now = new Date().getTime();
  
    if (storedToken && tokenExpiry && now < tokenExpiry) {
      accessToken = storedToken;
      return accessToken;
    }
  
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]) * 1000;
      const expiryTime = new Date().getTime() + expiresIn;
  
      // Save in localStorage
      localStorage.setItem("spotify_access_token", accessToken);
      localStorage.setItem("spotify_token_expiry", expiryTime);
  
      // Auto clear when token expires
      window.setTimeout(() => {
        accessToken = "";
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_token_expiry");
      }, expiresIn);
  
      // Clean up the URL (very important to avoid infinite redirect)
      window.history.replaceState({}, document.title, "/mixmuse/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  

  getCurrentUserId() {
    if (userId) {
      return userId;
    }

    const accessToken = Spotify.getAccessToken();

    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return userId;
      })
      .catch(function (err) {
        console.log("Fetch problem line 47: " + err.message);
      });
  },

  getUserPlaylists() {
    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return Promise.resolve(Spotify.getCurrentUserId()).then((response) => {
      userId = response;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: "GET",
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          if (!jsonResponse.items) {
            return [];
          }
          return jsonResponse.items.map((playlist) => ({
            playlistName: playlist.name,
            playlistId: playlist.id,
          }));
        });
    });
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  // name = playlist name
  savePlayList(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return Promise.resolve(Spotify.getCurrentUserId()).then((response) => {
      userId = response;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ name: name }),
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          const playlistId = jsonResponse.id;
          return fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
            {
              headers: headers,
              method: "POST",
              body: JSON.stringify({ uris: trackUris }),
            }
          );
        })
        .catch(function (err) {
          console.log("Fetch problem: ", err.message);
        });
    });
  },
};

export default Spotify;
