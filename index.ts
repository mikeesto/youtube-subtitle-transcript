import { parseXML } from "./utils/parseXML";

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
  end: string;
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

  try {
    const textElements = parseXML(xmlString);
    const subtitles: TranscriptEntry[] = [];

    // Attempt to handle mismatch between start and dur attributes in XML
    textElements.forEach((element, index) => {
      const start = element.start;
      let end: number;
      let duration: number;

      if (index < textElements.length - 1) {
        const nextStart = textElements[index + 1].start;
        end = nextStart;
        duration = nextStart - start;
      } else {
        duration = element.dur;
        end = start + duration;
      }

      subtitles.push({
        start: start.toFixed(2),
        end: end.toFixed(2),
        duration: duration.toFixed(2),
        text: element.content,
      });
    });

    return subtitles;
  } catch (err) {
    throw new Error("Failed to parse XML:", err);
  }
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
