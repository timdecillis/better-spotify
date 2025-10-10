import { playlistLength } from "../../consts/modes";

export const driftingOrbit = async (artist: string, song: string) => {
  const list = [];
  let current = {
    song: song,
    artist: artist,
  };
  list.push(current);
  for (let i = 0; i < playlistLength; i++) {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(
        current.artist
      )}&track=${encodeURIComponent(current.song)}&api_key=${
        process.env.NEXT_PUBLIC_LAST_FM_API_KEY
      }&format=json`
    );
    const data = await response.json();
    const song = data.similartracks.track[5].name;
    const artist = data.similartracks.track[5].artist.name;
    current = {
      song: song,
      artist: artist,
    };
    list.push({ song, artist });
  }
  return list;
};
