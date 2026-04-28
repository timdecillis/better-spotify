import { playlistLength } from "../../consts/modes";
import { Song } from "@/app/types/modes";

import {
  getArtistTopTracks,
  getSimilarArtists,
  getSimilarTracks,
  getTrackInfo,
} from "../last-fm-methods";
import { getStaticOrbitStepSize } from "@/utils/utils";

const isDuplicate = (song: Song, list: Song[]): boolean =>
  list.some(
    (s) => s.name === song.name && s.artist.name === song.artist.name
  );

export const staticOrbit = async (
  artistName: string,
  songName: string,
  temperature: number
): Promise<Song[]> => {
  const trackInfo = await getTrackInfo(artistName, songName);
  if (!trackInfo) {
    console.log("no track info found", artistName, songName);
    return [];
  }

  const similarArtists = await getSimilarArtists(artistName);
  const similarTracks = await getSimilarTracks(artistName, songName);

  if (!similarArtists?.length || !similarTracks?.length) {
    console.log("insufficient data to build playlist");
    return [trackInfo];
  }

  const minTrackListLength = Math.min(
    similarTracks.length,
    similarArtists.length
  );

  const stepSize = getStaticOrbitStepSize(
    temperature,
    minTrackListLength,
    playlistLength
  );
  console.log("stepSize", stepSize);

  const assembledList: Song[] = [];
  while (
    assembledList.length < playlistLength - 1 &&
    (similarTracks.length > 0 || similarArtists.length > 0)
  ) {
    let song: Song | undefined;
    if (
      assembledList.length % 4 === 0 &&
      assembledList.length !== 0 &&
      temperature < 0.3 &&
      similarTracks.length > 0
    ) {
      const spliceIndex = Math.min(stepSize, similarTracks.length - 1);
      song = similarTracks.splice(spliceIndex, 1)[0];
      if (!song || isDuplicate(song, assembledList)) {
        continue;
      }
      console.log("assigning song from similarTracks,", song.name);
    } else if (similarArtists.length > 0) {
      const spliceIndex = Math.min(stepSize, similarArtists.length - 1);
      const artist = similarArtists.splice(spliceIndex, 1)[0];

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
      if (isDuplicate(song, assembledList)) {
        continue;
      }
      console.log("assigning song from similarArtistTracks,", song.name);
    } else {
      break;
    }
    assembledList.push(song!);
  }
  return [trackInfo, ...assembledList];
};
