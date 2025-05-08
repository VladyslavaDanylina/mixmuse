import { useEffect, useState } from "react";

const SpotifyPlayer = ({ accessToken, trackUri }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(0.5);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (window.Spotify) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!accessToken || !window.Spotify || player) return;

    const newPlayer = new window.Spotify.Player({
      name: "MixMuse Player",
      getOAuthToken: cb => cb(accessToken),
      volume,
    });

    newPlayer.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      setDeviceId(device_id);
    });

    newPlayer.addListener("initialization_error", ({ message }) => {
      console.error("Initialization Error:", message);
    });

    newPlayer.addListener("authentication_error", ({ message }) => {
      console.error("Authentication Error:", message);
    });

    newPlayer.addListener("account_error", ({ message }) => {
      console.error("Account Error:", message);
    });

    newPlayer.connect();
    setPlayer(newPlayer);

    return () => {
      newPlayer.disconnect();
    };
  }, [accessToken, volume, player]);

  // Update volume if changed
  useEffect(() => {
    if (player) {
      player.setVolume(volume).catch((err) =>
        console.error("Failed to set volume", err)
      );
    }
  }, [volume, player]);

  // Transfer playback and play
  useEffect(() => {
    if (!deviceId || !trackUri || !accessToken) return;

    const play = async () => {
      try {
        // Transfer playback
        await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: true,
          }),
        });

        // Play track
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [trackUri] }),
        });
      } catch (err) {
        console.error("Playback error:", err);
      }
    };

    play();
  }, [deviceId, trackUri, accessToken]);

  return (
    <div className="SpotifyPlayer">
      <p>Spotify Player is Ready</p>
      <label>
        Volume: {Math.round(volume * 100)}%
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
};

export default SpotifyPlayer;
