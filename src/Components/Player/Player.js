import Spotify from "../../util/Spotify";

let player;

export const initializePlayer = () => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    Spotify.getAccessToken().then(token => {
      player = new window.Spotify.Player({
        name: 'MixMuse Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      player.addListener('initialization_error', ({ message }) => console.error(message));
      player.addListener('authentication_error', ({ message }) => console.error(message));
      player.addListener('account_error', ({ message }) => console.error(message));
      player.addListener('playback_error', ({ message }) => console.error(message));

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        localStorage.setItem('spotify_device_id', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
    });
  };
};

export async function transferPlaybackHere() {
  const token = await Spotify.getAccessToken();
  const deviceId = localStorage.getItem("spotify_device_id");

  if (!deviceId) {
    console.error("Device ID not found. Make sure the player is initialized.");
    return;
  }

  await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false,
    }),
  });
}

export async function playTrack(uri) {
  const token = await Spotify.getAccessToken();
  const deviceId = localStorage.getItem("spotify_device_id");

  if (!deviceId) {
    console.error("Device ID not found. Make sure the player is initialized.");
    return;
  }

  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [uri] }),
  });
}
