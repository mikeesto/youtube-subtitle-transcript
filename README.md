# YouTube Subtitle Transcript

This library fetches transcripts of YouTube videos. It leverages YouTube's built-in captions and parses them into a friendly JSON format.

## Installation

`npm install youtube-subtitle-transcript`

## Usage

```ts
import { fetchTranscript } from "youtube-subtitle-transcript";

const subtitles = await fetchTranscript("dQw4w9WgXcQ");
console.log(subtitles);
```

## API Reference

```ts
fetchTranscript(videoId: string, languageCode?: string): Promise<TranscriptEntry[]>
```

- `videoId`: YouTube video ID (required).
- `languageCode`: Language code for the transcript (defaults to "en"). The library will always return manually created transcripts over automatically generated ones.
- Returns a Promise resolving to an array of `TranscriptEntry` objects.

`TranscriptEntry` interface

- `text`: The transcript text content.
- `start`: Starting time of the transcript segment in seconds (e.g., "1.23").
- `duration`: Duration of the transcript segment in seconds (e.g., "5.67").

## Credit

This library was highly inspired by [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) which is written in Python and has a lot more functionality than this one.

## License and disclaimer

MIT. This library uses undocumented parts of the YouTube API. It may break tomorrow.
