import { useEffect, useState } from "react";

const SpotifyPlayer = ({ accessToken, trackUri }) => {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    if (!accessToken || !window.Spotify) return;

    const newPlayer = new window.Spotify.Player({
      name: "MixMuse Player",
      getOAuthToken: cb => cb(accessToken),
      volume: 0.5,
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

    return () => newPlayer.disconnect();
  }, [accessToken]);

  useEffect(() => {
    if (!deviceId || !trackUri || !accessToken) return;

    const play = async () => {
      try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [trackUri] }),
        });
      } catch (error) {
        console.error("Failed to play track:", error);
      }
    };

    play();
  }, [deviceId, trackUri, accessToken]);

  return <div>Spotify Player is Ready</div>;
};

export default SpotifyPlayer;
