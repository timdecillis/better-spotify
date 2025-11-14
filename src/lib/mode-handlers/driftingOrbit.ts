import { playlistLength } from "../../consts/modes";
import { Song } from "@/app/types/modes";
import {
  getArtistTopTracks,
  getSimilarArtists,
  getTrackInfo,
} from "../last-fm-methods";
import { getDriftingOrbitStepSize } from "@/utils/utils";

export const driftingOrbit = async (
  artistName: string,
  songName: string,
  temperature: number
) => {
  const trackInfo = await getTrackInfo(artistName, songName);
  if (!trackInfo) {
    console.log("no track info found", artistName, songName);
  }

  const playlist: Song[] = [trackInfo];
  const usedArtistNames = new Set<string>([trackInfo.artist.name]);

  while (playlist.length < playlistLength) {
    try {
      const seedArtist = playlist[playlist.length - 1].artist.name;

      // Get new similar artists for the new seed each time
      let similarArtists = await getSimilarArtists(seedArtist);
      if (!similarArtists?.length) {
        console.log("No similar artists found for", seedArtist);
        return playlist;
      }

      // Remove artists we've already tried
      similarArtists = similarArtists.filter(
        (a) => !usedArtistNames.has(a.name)
      );

      if (!similarArtists.length) {
        console.log("No unused similar artists left for", seedArtist);
        return playlist;
      }

      const stepSize = getDriftingOrbitStepSize(
        temperature,
        similarArtists.length
      );

      let selectedArtist: { name: string } | null = null;

      // Search forward from stepSize → end
      for (let i = stepSize; i < similarArtists.length; i++) {
        selectedArtist = similarArtists[i];
        break;
      }

      // If not found (rare), search backward
      if (!selectedArtist) {
        for (let i = stepSize - 1; i >= 0; i--) {
          selectedArtist = similarArtists[i];
          break;
        }
      }

      if (!selectedArtist) {
        console.log("Could not select an artist");
        break;
      }

      // Mark artist as used
      usedArtistNames.add(selectedArtist.name);

      // Fetch top tracks for this new artist
      const artistTopTracks = await getArtistTopTracks(selectedArtist.name);

      if (!artistTopTracks?.length) {
        console.log("No top tracks for", selectedArtist.name);
        continue;
      }

      // Choose a track not already in playlist
      const nextTrack = artistTopTracks.find(
        (t) => !playlist.some((song) => song.mbid === t.mbid)
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
