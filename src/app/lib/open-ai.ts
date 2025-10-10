"use server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getSimilarArtists(
  song: string,
  artist: string,
  temperature: number
) {
  const response = await client.responses.create({
    model: "gpt-5-chat-latest",
    input: `Based on this song: ${song}, ${artist}, on a scale of 0 to 10, 
    
    (0 being a similar song by the same artist, 1 being maybe a song by the same artist or a song by a very similar artist, 
    2 being a song by a similar artist, 3 being a song by a slightly different artist, 4 being a song by a different artist, 
    5 being a song by a decidedly different artist, 6 being a song by a much different artist, 7 being a song by a completely different artist, 
    8 being a song by a very very different artist, 9 being a song by a very very very different artist, and 10 being a song by a completely unrelated artist), return a song based on this number: 
    ${temperature}. 
    
    Examples:

    Starting song: "Smells Like Teen Spirit"
    Starting artist: Nirvana

    Temperature: 0
    Returned song: "Come as You Are" by Nirvana

    Temperature: 1
    Returned song: "Jeremy" by Pearl Jam

    Temperature: 2
    Returned song: "Enter Sandman" by Metallica
    
    Temperature: 3
    Returned song: "Dreams" by Fleetwood Mac

    Temperature: 4
    Returned song: "Kill This Love" by Blackpink

    Temperature: 5
    Returned song: "Humble" by Kendrick Lamar

    Temperature: 6

  Returned song: "You Dropped a Bomb on Me" by The Gap Band

    Temperature: 7
   Returned song: "Song For My Father" by Frank Horace Silver

    Temperature: 8
    Returned song: "Music for 18 Musicians" by Steve Reich

    Temperature: 9
Returned song: "Requiem" by Mozart

    Temperature: 10
    Returned song: "Tilak Kamod" by Ravi Shankar

    These are just examples, please be creative and provide ample variation in your responses.
Return only the name of the song and the artist name.

    `,
  });

  return response.output_text;
}
