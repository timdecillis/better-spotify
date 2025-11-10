import { ENDPOINTS } from "@/consts/endpoints";
import { playlistLength } from "../../consts/modes";
import { Song } from "@/app/types/modes";
import { shuffle } from "@/utils/utils";

export const driftingOrbit = async (
  artistName: string,
  songName: string,
  temperature: number
) => {
  const pool: Song[] = [];

  const infoUrl = ENDPOINTS.TRACK.GET_INFO(artistName, songName);
  const infoResponse = await fetch(infoUrl);
  if (!infoResponse.ok) {
    return pool;
  }

  const infoData = await infoResponse.json();
  if (!infoData.track) {
    return pool;
  }

  // Add the seed track to the pool
  pool.push(infoData.track);

  let currentArtist = infoData.track.artist.name;

  while (pool.length < playlistLength) {
    const similarArtistsResponse = await fetch(
      ENDPOINTS.ARTIST.GET_SIMILAR(currentArtist)
    );
    if (!similarArtistsResponse.ok) {
      console.log("error getting similar artists");
      return pool;
    }
    const similarArtistsData = await similarArtistsResponse.json();
    if (!similarArtistsData.similarartists.artist) {
      console.log("error getting similar artists");
      return pool;
    }

    let trackAdded = false;
    for (
      let i = 0;
      i < similarArtistsData.similarartists.artist.length && !trackAdded;
      i++
    ) {
      const similarArtist = similarArtistsData.similarartists.artist[i];
      const similarArtistTopTracksResponse = await fetch(
        ENDPOINTS.ARTIST.TOP_TRACKS(similarArtist.name)
      );

      if (!similarArtistTopTracksResponse.ok) {
        console.log("error getting similar artist top tracks");
        continue;
      }
      const similarArtistTopTracksData =
        await similarArtistTopTracksResponse.json();
      if (!similarArtistTopTracksData?.toptracks?.track) {
        console.log("error getting similar artist top tracks");
        continue;
      }
      const similarArtistTopTracks =
        similarArtistTopTracksData?.toptracks?.track;
      for (let j = 0; j < similarArtistTopTracks.length && !trackAdded; j++) {
        const similarArtistTopTrack = similarArtistTopTracks[j];
        if (pool.some((song) => song.mbid === similarArtistTopTrack.mbid)) {
          continue;
        }
        pool.push(similarArtistTopTrack);
        currentArtist = similarArtistTopTrack.artist.name; // Update current artist
        trackAdded = true;
      }
    }

    // If no track was added from any similar artist, break to avoid infinite loop
    if (!trackAdded) {
      console.log("No new tracks found from similar artists");
      break;
    }
  }

  const shuffledPool = shuffle(pool.slice(1));

  const playlist = [pool[0], ...shuffledPool];
  return playlist;
};
