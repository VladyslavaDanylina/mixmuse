const clientId = '2873a116bcf948b1975152029d117629';
const redirectUri = 'https://mixmuse.netlify.app/'; // Change when deployed
const scope = 'playlist-modify-public';
let accessToken

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      window.setTimeout(() => accessToken = '', expiresIn * 1000)
      window.history.pushState('Access Token', null, '/')
      
      return accessToken
    } else {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;
      window.location = authUrl;
    }
  },

  async search(term) {
    const token = this.getAccessToken();
    console.log('Spotify token:', token); // 🔍 See if token is valid
  
    if (!token) {
      console.error('Missing token!');
      return [];
    }
  
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const json = await response.json();
    console.log('Spotify response:', json);
    
    if (!json.tracks) return [];
  
    return json.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));
  }
  ,

  async savePlaylist(name, uris) {
    if (!name || !uris.length) return

    const token = this.getAccessToken()
    const headers = { Authorization: `Bearer ${token}` }

    const userRes = await fetch('https://api.spotify.com/v1/me', { headers })
    const userId = (await userRes.json()).id

    const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name })
    })

    const playlistId = (await playlistRes.json()).id

    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uris })
    })
  }
}

export default Spotify
