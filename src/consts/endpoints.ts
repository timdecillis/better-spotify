const BASE_LAST_FM_URL = "https://ws.audioscrobbler.com/2.0";

export const ENDPOINTS = {
  OPENAI: "https://api.openai.com/v1/responses",
  TRACK: {
    GET_SIMILAR: (artist: string, song: string) =>
      `${BASE_LAST_FM_URL}/?method=track.getsimilar&artist=${encodeURIComponent(
        artist
      )}&track=${encodeURIComponent(song)}&api_key=${
        process.env.NEXT_PUBLIC_LAST_FM_API_KEY
      }&format=json`,
    GET_INFO: (artist: string, track: string) =>
      `${BASE_LAST_FM_URL}/?method=track.getinfo&artist=${encodeURIComponent(
        artist
      )}&track=${encodeURIComponent(track)}&api_key=${
        process.env.NEXT_PUBLIC_LAST_FM_API_KEY
      }&format=json`,
  },

  ARTIST: {
    GET_SIMILAR: (artist: string) =>
      `${BASE_LAST_FM_URL}/?method=artist.getsimilar&artist=${encodeURIComponent(
        artist
      )}&api_key=${process.env.NEXT_PUBLIC_LAST_FM_API_KEY}&format=json`,
    TOP_TRACKS: (artist: string) =>
      `${BASE_LAST_FM_URL}/?method=artist.gettoptracks&artist=${artist}&api_key=${process.env.NEXT_PUBLIC_LAST_FM_API_KEY}&format=json`,
  },
};
