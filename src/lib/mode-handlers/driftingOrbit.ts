import { playlistLength } from "../../consts/modes";
import { Song } from "@/app/types/modes";
import {
  getArtistTopTracks,
  getSimilarArtists,
  getTrackInfo,
} from "../last-fm-methods";
import { getDriftingOrbitStepSize } from "@/utils/utils";

const isDuplicate = (song: Song, list: Song[]): boolean =>
  list.some(
    (s) => s.name === song.name && s.artist.name === song.artist.name
  );

export const driftingOrbit = async (
  artistName: string,
  songName: string,
  temperature: number
): Promise<Song[]> => {
  const trackInfo = await getTrackInfo(artistName, songName);
  if (!trackInfo) {
    console.log("no track info found", artistName, songName);
    return [];
  }

  const playlist: Song[] = [trackInfo];
  const usedArtistNames = new Set<string>([trackInfo.artist.name]);

  while (playlist.length < playlistLength) {
    try {
      const seedArtist = playlist[playlist.length - 1].artist.name;

      let similarArtists = await getSimilarArtists(seedArtist);
      if (!similarArtists?.length) {
        console.log("No similar artists found for", seedArtist);
        return playlist;
      }

      similarArtists = similarArtists.filter(
        (a: { name: string }) => !usedArtistNames.has(a.name)
      );

      if (!similarArtists.length) {
        console.log("No unused similar artists left for", seedArtist);
        return playlist;
      }

      const stepSize = getDriftingOrbitStepSize(
        temperature,
        similarArtists.length
      );

      // Clamp index to valid range
      const index = Math.min(stepSize, similarArtists.length - 1);
      const selectedArtist = similarArtists[index];

      if (!selectedArtist) {
        console.log("Could not select an artist");
        break;
      }

      usedArtistNames.add(selectedArtist.name);

      const artistTopTracks = await getArtistTopTracks(selectedArtist.name);

      if (!artistTopTracks?.length) {
        console.log("No top tracks for", selectedArtist.name);
        continue;
      }

      const nextTrack = artistTopTracks.find(
        (t: Song) => !isDuplicate(t, playlist)
      );

      if (!nextTrack) {
        console.log("No new tracks available for", selectedArtist.name);
        continue;
      }

      playlist.push(nextTrack);

      console.log("Added track", nextTrack.name, "by", nextTrack.artist.name);
    } catch (error) {
      console.log("error getting similar artists", error);
      return playlist;
    }
  }

  return playlist;
};
