import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const transcribe = async (mp3Path: string): Promise<string> => {
  try {
    const stream = fs.createReadStream(mp3Path);
    const transcription = await openai.audio.transcriptions.create({
      file: stream,
      model: "gpt-4o-transcribe",
    });
    return typeof transcription.text === "string" ? transcription.text : "";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default transcribe;