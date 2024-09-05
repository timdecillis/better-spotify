import { user } from "./dummyData";

const { songs } = user;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3>Spotify, but better</h3>
      <div>
        {songs.map((song, i) => (
          <div key={i}>{song.title}</div>
        ))}
      </div>
    </main>
  );
}
