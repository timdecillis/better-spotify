import { ENDPOINTS } from "@/consts/endpoints";
import { playlistLength } from "../../consts/modes";
import { Song } from "@/app/types/modes";
import { shuffle } from "@/utils/utils";
import {
  getArtistTopTracks,
  getSimilarArtists,
  getSimilarTracks,
  getTrackInfo,
} from "../last-fm-methods";

export const staticOrbit = async (artistName: string, songName: string) => {
  const similarArtistTracksPool: Song[] = [];

  const trackInfo = await getTrackInfo(artistName, songName);
  if (!trackInfo) {
    console.log("no track info found", artistName, songName);
  }

  const similarArtists = await getSimilarArtists(artistName);

  for (let i = 0; i < similarArtists.length; i++) {
    const artist = similarArtists[i];
    const topTracks = await getArtistTopTracks(artist.name);
    if (!topTracks) {
      continue;
    }
    similarArtistTracksPool.push(topTracks[0]);
  }

  const similarTracks = await getSimilarTracks(artistName, songName);
  const assembledList: Song[] = [];
  while (assembledList.length < playlistLength - 1) {
    if (assembledList.length % 4 === 0 && assembledList.length !== 0) {
      console.log(
        "adding from similarTracks, assembledList length: ",
        assembledList.length
      );
      // pop the first song from there into the assembledList
      const song = similarTracks.shift();
      if (!song) {
        continue;
      }
      if (assembledList.some((s) => s.mbid === song.mbid)) {
        continue;
      }

      assembledList.push(song);
      // continue
      continue;
    }
    // pop the first song from similarArtistTracksPool into the assembledList
    console.log(
      "adding from similarArtistTracksPool, assembledList length: ",
      assembledList.length
    );
    const song = similarArtistTracksPool.shift();
    if (!song) {
      continue;
    }
    if (assembledList.some((s) => s.mbid === song.mbid)) {
      continue;
    }
    assembledList.push(song);
  }
  return [{ ...trackInfo, source: "seed" }, ...assembledList];
};

// TODO: prevent dupes
