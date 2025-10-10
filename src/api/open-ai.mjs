import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5",
  input:
    "You are a music expert. Name 10 musical artists that are similar to Nirvana.",
});

console.log(response.output_text);
