import { playlistLength } from "../../consts/modes";

export const staticOrbit = async (artist: string, song: string) => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(
      artist
    )}&track=${encodeURIComponent(song)}&api_key=${
      process.env.NEXT_PUBLIC_LAST_FM_API_KEY
    }&format=json`
  );

  const data = await response.json();
  console.log("data", data);
  if (data.similartracks.track.length === 0) {
    return [];
  }
  const list = [];
  list.push({ song, artist });
  for (let i = 0; i < playlistLength; i++) {
    const song = data.similartracks.track[i].name;
    const artist = data.similartracks.track[i].artist.name;
    list.push({ song, artist });
  }
  return list;
};
