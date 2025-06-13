// src/api/spotify.ts
import { getAccessToken } from "../auth/token";

export async function fetchSpotifyProfile() {
  const token = getAccessToken();
  if (!token) throw new Error("No access token");

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}
