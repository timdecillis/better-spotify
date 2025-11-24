import { ENDPOINTS } from "@/consts/endpoints";

export const getTrackInfo = async (artist: string, track: string) => {
  const url = ENDPOINTS.TRACK.GET_INFO(artist, track);
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data.track) {
    return null;
  }
  return data.track;
};

export const getSimilarArtists = async (artist: string) => {
  const response = await fetch(ENDPOINTS.ARTIST.GET_SIMILAR(artist));
  console.log("response :>> ", response);
  if (!response.ok) {
    console.log("error getting similar artists");
    return null;
  }

  const data = await response.json();
  if (!data.similarartists.artist) {
    return null;
  }
  return data.similarartists.artist;
};

export const getArtistTopTracks = async (artist: string) => {
  const response = await fetch(ENDPOINTS.ARTIST.TOP_TRACKS(artist));
  if (!response.ok) {
    console.log("error getting artist top tracks");
    return null;
  }
  const data = await response.json();
  if (!data?.toptracks?.track) {
    console.log("no top tracks found", artist);
    return null;
  }
  return data.toptracks.track;
};

export const getSimilarTracks = async (artist: string, song: string) => {
  const similarTracksResponse = await fetch(
    ENDPOINTS.TRACK.GET_SIMILAR(artist, song)
  );
  if (!similarTracksResponse.ok) {
    console.log("error getting similar tracks");
    return null;
  }
  const similarTracksData = await similarTracksResponse.json();
  if (!similarTracksData?.similartracks?.track) {
    console.log("no similar tracks found");
    return null;
  }
  return similarTracksData.similartracks.track;
};

export const search = async (artist: string, song: string) => {
  const response = await fetch(ENDPOINTS.TRACK.SEARCH(song, artist));
  if (!response.ok) {
    console.log("error searching for track");
    return null;
  }
  const data = await response.json();
  return data;
};
