let accessToken;
let userId;
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = "https://vladyslavadanylina.github.io/mixmuse/";
const scope = "playlist-modify-public";

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  values.forEach((v) => result += charset[v % charset.length]);
  return result;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(str) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const Spotify = {
  async getAccessToken() {
    if (accessToken) return accessToken;
  
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
  
    if (!code) {
      const codeVerifier = generateRandomString(128);
      localStorage.setItem("code_verifier", codeVerifier);
  
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64UrlEncode(hashed);
  
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  
      window.location = authUrl;
      return;
    }
  
    const codeVerifier = localStorage.getItem("code_verifier");
  
    if (!codeVerifier) {
      console.error("Missing code_verifier. Restarting auth flow.");
      localStorage.removeItem("code_verifier");
      window.location.href = "/";
      return;
    }
  
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    });
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body
    });
  
    const data = await response.json();
  
    if (data.access_token) {
      accessToken = data.access_token;
      window.history.replaceState({}, document.title, "/mixmuse");
      return accessToken;
    } else {
      console.error("Token exchange failed", data);
    }
  },
  async getCurrentUserId() {
    if (userId) return userId;

    const token = await this.getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await response.json();
    userId = json.id;
    return userId;
  },

  async getUserPlaylists() {
    const token = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const userId = await this.getCurrentUserId();

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers,
    });

    const json = await response.json();
    return (json.items || []).map((playlist) => ({
      playlistName: playlist.name,
      playlistId: playlist.id,
    }));
  },

  async search(term) {
    const token = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    if (!json.tracks) return [];

    return json.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlayList(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = await this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const userId = await this.getCurrentUserId();

    const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name }),
    });

    const playlist = await createResponse.json();
    const playlistId = playlist.id;

    await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ uris: trackUris }),
    });
  },
};

export default Spotify;
