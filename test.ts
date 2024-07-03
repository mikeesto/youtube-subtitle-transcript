import { fetchTranscript } from "./index";

async function runTest() {
  try {
    const videoId = "dQw4w9WgXcQ"; // This is the ID for "Never Gonna Give You Up"

    console.log("Fetching transcript...");
    const { transcript } = await fetchTranscript(videoId);

    console.log(transcript);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

runTest();
