import { playlistLength } from "../../consts/modes";
import { Song } from "@/app/types/modes";

import {
  getArtistTopTracks,
  getSimilarArtists,
  getSimilarTracks,
  getTrackInfo,
} from "../last-fm-methods";
import { getStaticOrbitStepSize } from "@/utils/utils";

export const staticOrbit = async (
  artistName: string,
  songName: string,
  temperature: number
) => {
  const trackInfo = await getTrackInfo(artistName, songName);
  if (!trackInfo) {
    console.log("no track info found", artistName, songName);
  }
  const similarArtistTracksPool: Song[] = [];

  const similarArtists = await getSimilarArtists(artistName);

  // for (let i = 0; i < similarArtists.length; i++) {
  //   const artist = similarArtists[i];
  //   const topTracks = await getArtistTopTracks(artist.name);
  //   if (!topTracks) {
  //     continue;
  //   }
  //   similarArtistTracksPool.push(topTracks[0]);
  // }

  const similarTracks = await getSimilarTracks(artistName, songName);

  const minTrackListLength = Math.min(
    similarTracks.length,
    similarArtists.length
  );

  const stepSize = getStaticOrbitStepSize(
    temperature,
    minTrackListLength,
    playlistLength
  );

  const assembledList: Song[] = [];
  while (assembledList.length < playlistLength - 1) {
    let song;
    if (
      assembledList.length % 4 === 0 &&
      assembledList.length !== 0 &&
      temperature < 0.3
    ) {
      song = similarTracks.splice(stepSize, 1)[0];
      if (!song) {
        continue;
      }
      if (assembledList.some((s) => s.mbid === song.mbid)) {
        continue;
      }
      console.log("assigning song from similarTracks,", song.name);
    } else {
      const artist = similarArtists.splice(stepSize, 1)[0];

      const topTracks = await getArtistTopTracks(artist.name);
      if (!topTracks) {
        console.log("no top tracks found for artist", artist.name);
        continue;
      }
      song = topTracks[0];
      if (!song) {
        console.log("no song found from top tracks for artist", artist.name);
        continue;
      }
      if (assembledList.some((s) => s.mbid === song.mbid)) {
        continue;
      }
      console.log("assigning song from similarArtistTracks,", song.name);
    }
    assembledList.push(song);
  }
  return [{ ...trackInfo, source: "seed" }, ...assembledList];
};
