// src/components/LoginButton.tsx
"use client";

import { generateCodeChallenge, generateCodeVerifier } from "@/auth/pkce";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
const scope = "user-read-private user-read-email"; // or whatever scopes you need

export function SpotifyHome() {
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();

    localStorage.setItem("code_verifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      scope,
    });

    const authorizeUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

    window.location.href = authorizeUrl;
  };

  return <button onClick={handleLogin}>Login with Spotify</button>;
}
