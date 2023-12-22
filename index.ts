import * as xml2js from "xml2js";

const YOUTUBE_WATCH_URL = "https://www.youtube.com/watch?v=";

interface CaptionTrack {
  languageCode: string;
  baseUrl: string;
}

interface CaptionsInfo {
  captionTracks: CaptionTrack[];
}

interface TranscriptEntry {
  text: string;
  start: string;
  duration: string;
}

interface FetchTranscriptResult {
  transcript: TranscriptEntry[];
  error?: string;
}

async function getCaptionsInfo(videoId: string): Promise<CaptionsInfo> {
  const response = await fetch(YOUTUBE_WATCH_URL + videoId);
  const html = await response.text();

  // Regex to match captions JSON script tag
  const captionsScriptRegex = /ytInitialPlayerResponse\s+=\s+({.+?});/;
  const match = captionsScriptRegex.exec(html);

  if (!match) {
    throw new Error("Captions not found");
  }

  const { captions } = JSON.parse(match[1]);

  if (!captions) {
    throw new Error("Captions not found");
  }

  return captions.playerCaptionsTracklistRenderer;
}

function getTranscriptUrl(
  languageCode: string,
  captionsInfo: CaptionsInfo
): string {
  const captionTrack = captionsInfo.captionTracks.find(
    (track) => track.languageCode === languageCode
  );

  if (!captionTrack) {
    throw new Error("Transcript for language code not found");
  }

  return captionTrack.baseUrl;
}

async function fetchSubtitles(
  transcriptUrl: string
): Promise<TranscriptEntry[]> {
  const response = await fetch(transcriptUrl);
  const xmlString = await response.text();

  const subtitles: TranscriptEntry[] = [];

  try {
    const result = await xml2js.parseStringPromise(xmlString);

    // Extract text from each text element in the parsed XML
    const textElements = result.transcript.text;
    textElements.forEach((element: any) => {
      subtitles.push({
        text: element._,
        start: element.$.start,
        duration: element.$.dur,
      });
    });
  } catch (err) {
    throw new Error(err);
  }

  return subtitles;
}

export async function fetchTranscript(
  videoId: string,
  languageCode: string = "en"
): Promise<FetchTranscriptResult> {
  if (!videoId) {
    throw new Error("fetchTranscript requires a video ID as a parameter");
  }

  try {
    const captionsInfo = await getCaptionsInfo(videoId);
    const transcriptUrl = getTranscriptUrl(languageCode, captionsInfo);
    const transcript = await fetchSubtitles(transcriptUrl);

    return { transcript };
  } catch (err) {
    return { transcript: [], error: err.message };
  }
}
