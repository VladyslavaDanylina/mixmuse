import React from 'react';

const clientId = '2873a116bcf948b1975152029d117629';
const redirectUri = 'https://mixmuse.netlify.app/';
const scope = 'playlist-modify-public';

function LoginButton() {
  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="LoginButton">
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
}

export default LoginButton;
