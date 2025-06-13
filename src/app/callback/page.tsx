// src/app/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleSpotifyCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const codeVerifier = localStorage.getItem("code_verifier");

      if (!code || !codeVerifier) {
        console.error("Missing code or verifier");
        return;
      }

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      });

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });

        const tokens = await response.json();
        if (tokens.access_token) {
          localStorage.setItem("access_token", tokens.access_token);
          localStorage.setItem("refresh_token", tokens.refresh_token);
          router.push("/dashboard");
        } else {
          console.error("Token exchange failed:", tokens);
        }
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    }

    handleSpotifyCallback();
  }, [router]);

  return <p>Signing in with Spotify…</p>;
}
