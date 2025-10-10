"use client";

import { useEffect, useState } from "react";

export function Dashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState("");
  const [relatedArtist, setRelatedArtist] = useState();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

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
      console.log("result :>> ", result);
      setResults(result.artists.items || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleSearch = async (id: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      const url = `https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/related-artists`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("related :>> ", result);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-11 gap-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-2 relative"
      >
        <input
          value={query}
          placeholder="Enter an artist"
          className="bg-amber-50 text-black"
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && results.length > 0 && (
          <ul className="bg-amber-50 text-black absolute top-full mt-1 w-full border border-gray-300 rounded-md shadow-lg z-10">
            {results.map((result) => (
              <li
                onClick={() => handleSearch(result.id)}
                key={result.id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {result.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
