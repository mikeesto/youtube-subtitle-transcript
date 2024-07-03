# YouTube Subtitle Transcript

This library fetches transcripts of YouTube videos. It leverages YouTube's built-in captions and parses them into a friendly JSON format.

## Installation

`npm install youtube-subtitle-transcript`

## Usage

```ts
import { fetchTranscript } from "youtube-subtitle-transcript";

const { transcript, error } = await fetchTranscript("dQw4w9WgXcQ");
console.log(transcript);
```

## API Reference

```ts
fetchTranscript(videoId: string, languageCode?: string): Promise<FetchTranscriptResult>
```

- `videoId`: YouTube video ID (required).
- `languageCode`: Language code for the transcript (defaults to "en"). The library will always return manually created transcripts over automatically generated ones.
- Returns a Promise resolving to a `FetchTranscriptResult` object.

`FetchTranscriptResult` interface

- `transcript`: An array of `TranscriptEntry` objects. If no transcript can be found, the array will be empty.
- `error`: An optional error message that will be present when a transcript cannot be found. Primarily to assist with debugging.

`TranscriptEntry` interface

- `text`: The transcript text content.
- `start`: Starting time of the transcript segment in seconds (e.g. "1.23").
- `end`: Ending time of the transcript segment in seconds (e.g. "2.34").
- `duration`: Duration of the transcript segment in seconds (e.g. "1.11").

## Credit

This library was highly inspired by [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api). It is written in Python and has a lot more features than this one.

## License and disclaimer

MIT. This library uses undocumented parts of the YouTube API. It may break tomorrow.
