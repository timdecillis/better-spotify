"use client";

import { useEffect, useState } from "react";

export function Dashboard() {
  const [artist, setArtist] = useState<any>(null);

  console.log("artist :>> ", artist);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchArtist = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("artist:", data);
        setArtist(data);
      } catch (err) {
        console.error("Failed to fetch artist:", err);
      }
    };

    fetchArtist();
  }, []);

  return (
    <div>{artist ? <h1>{artist.name}</h1> : <p>Loading artist...</p>}</div>
  );
}
