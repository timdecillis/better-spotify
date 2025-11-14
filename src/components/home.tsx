"use client";

import { Mode, Song } from "@/app/types/modes";
import { modes } from "@/consts/modes";
import { useState } from "react";

export default function Home() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [temperature, setTemperature] = useState(0.5);
  const [endTemperature, setEndTemperature] = useState(0.5);
  const [mode, setMode] = useState<Mode>(modes[0]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setPlaylist([]);
    const handler = mode.handler;
    setLoading(true);
    const playlist = await handler(artist, song, temperature);
    if (playlist?.length === 0 || !playlist) {
      setLoading(false);
      setMessage("No similar tracks found");
      return;
    }
    setPlaylist(playlist);
    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] p-12 flex flex-col gap-8">
      <h4 className="text-5xl font-bold">Orbit.fm</h4>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-col w-1/2">
        <label htmlFor="artist">Artist</label>
        <input
          onChange={(e) => setArtist(e.target.value)}
          className="bg-amber-50 text-black p-1 rounded-xs "
          placeholder="Enter the artist"
          value={artist}
        ></input>
        <label htmlFor="song">Song</label>
        <input
          onChange={(e) => setSong(e.target.value)}
          className="bg-amber-50 text-black p-1 rounded-xs "
          placeholder="Enter the song"
          value={song}
        ></input>
        <label htmlFor="mode">Mode</label>
        <select
          onChange={(e) =>
            setMode(modes.find((mode) => mode.name === e.target.value)!)
          }
          className="bg-amber-50 text-black p-1 rounded-xs "
          value={mode.name}
        >
          {modes.map((modeOption, i) => (
            <option key={i} value={modeOption.name}>
              {modeOption.name}
            </option>
          ))}
        </select>
        <div className="text-sm text-pink-200">{mode.description}</div>
        <label htmlFor="temperature">
          {mode.range ? "Start Temperature" : "Temperature"} -{" "}
          <span className="text-md font-bold text-pink-200">{temperature}</span>
        </label>
        <div className="flex gap-2 w-full justify-between">
          <h4 className="text-xs">More similar</h4>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="bg-amber-50 text-black p-1 rounded-xs w-[80%]"
            value={temperature}
          />
          <h4 className="text-xs">Less similar</h4>
        </div>
        {mode.range && (
          <>
            <label htmlFor="mode">
              End Temperature -{" "}
              <span className="text-md font-bold text-pink-200">
                {endTemperature}
              </span>
            </label>
            <div className="flex gap-2 ">
              <h4 className="text-xs">More similar</h4>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={(e) => setEndTemperature(Number(e.target.value))}
                className="bg-amber-50 text-black p-1 rounded-xs w-[80%] "
                value={endTemperature}
              />
              <h4 className="text-xs">Less similar</h4>
            </div>
          </>
        )}
        <button
          className="border-1 border-amber-50 w-fit rounded-md py-1 px-4"
          type="submit"
        >
          Search
        </button>
      </form>
      {message && <div className="text-lg text-pink-200">{message}</div>}
      {playlist.length > 0 && (
        <div>
          {playlist.map((track, i) => (
            <div className="text-lg text-gray-100" key={i}>
              <span className="font-extrabold text-cyan-200">{track.name}</span>{" "}
              by{" "}
              <span className="font-semibold text-pink-200">
                {track.artist.name}
              </span>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div className="text-lg text-pink-200">Assembling your planets...</div>
      )}
    </div>
  );
}
