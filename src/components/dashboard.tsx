"use client";

import { useEffect, useState } from "react";

export function Dashboard() {
  const [artist, setArtist] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const artistId = "5RTLRtXjbXI2lSXc6jxlAz";

  // Fetch a specific artist once on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchArtist = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setArtist(data);
      } catch (err) {
        console.error("Failed to fetch artist:", err);
      }
    };

    fetchArtist();
  }, []);

  // Debounce input: wait 500ms after user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // adjust delay as needed

    return () => clearTimeout(timeout);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) return;
    searchArtists(debouncedQuery);
  }, [debouncedQuery]);

  const searchArtists = async (term: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        term
      )}&type=artist`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setResults(result.artists.items || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-11 gap-4">
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <input
          value={query}
          placeholder="Enter an artist"
          className="bg-amber-50 text-black"
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <div>
        {results.length === 0 ? (
          <h1>No artists to show</h1>
        ) : (
          results.map((result) => <div key={result.id}>{result.name}</div>)
        )}
      </div>
    </div>
  );
}
