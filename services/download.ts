import path from "path";
import fs from "fs";
import axios from "axios";

const RAPIDAPI_HOST = "tiktok-video-downloader-api.p.rapidapi.com";

export type TikTokDownloadResult = {
  videoPath: string;
};

const download = async (
  originalUrl: string,
  outputFileName: string,
  tempDir: string
): Promise<TikTokDownloadResult> => {

  const options = {
    method: "GET" as const,
    url: `https://${RAPIDAPI_HOST}/media`,
    params: {
      videoUrl: originalUrl,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY as string,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
  };

  let response;
  try {
    response = await axios.request<{ downloadUrl?: string }>({
      ...options,
      validateStatus: () => true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  if (response.status !== 200) {
    const err = new Error(`Download failed: ${response.status}`);
    console.log(err);
    throw err;
  }

  const downloadUrl = response.data?.downloadUrl;

  if (typeof downloadUrl !== "string" || !downloadUrl.startsWith("http")) {
    const err = new Error("API did not return downloadUrl");
    console.log(err);
    throw err;
  }

  let videoResponse;
  try {
    videoResponse = await axios.request({
      method: "GET",
      url: downloadUrl,
      responseType: "arraybuffer",
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

  const videoBuffer = Buffer.from(videoResponse.data as ArrayBuffer);
  if (videoBuffer.length === 0) {
    const err = new Error("Download returned empty video");
    console.log(err);
    throw err;
  }

  const videoPath = path.join(tempDir, `${outputFileName}.mp4`);
  fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(videoPath, videoBuffer);

  return { videoPath };
};

export default download;
