import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const FFMPEG_BIN = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";

function getFfmpegPath(): string {
  const fromEnv = process.env.FFMPEG_BIN;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  const staticPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", FFMPEG_BIN);
  if (fs.existsSync(staticPath)) return staticPath;
  return "ffmpeg";
}

const convert = async (mp4Path: string): Promise<string> => {
  ffmpeg.setFfmpegPath(getFfmpegPath());
  const mp3Path = path.join(path.dirname(mp4Path), path.basename(mp4Path, ".mp4") + ".mp3");

  return new Promise((resolve, reject) => {
    ffmpeg(mp4Path)
      .noVideo()
      .audioCodec("libmp3lame")
      .output(mp3Path)
      .on("end", () => resolve(mp3Path))
      .on("error", (err: Error) => {
        console.log(err);
        reject(err);
      })
      .run();
  });
};

export default convert;