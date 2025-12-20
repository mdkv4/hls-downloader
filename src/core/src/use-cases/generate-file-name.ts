import { Playlist, Level } from "../entities";
import filenamify from "filenamify";

type GenerateFileNameOptions = {
  container?: "mp4" | "mkv";
};

export const generateFileName = () => {
  const run = (
    playlist: Playlist,
    level: Level,
    options?: GenerateFileNameOptions
  ): string => {
    const path = playlist.uri.split("?")[0];
    const chunks = path.split("/");
    const playlistFilename = chunks[chunks.length - 1];
    const playlistFilenameWithoutExt = playlistFilename.split(".m3u8")[0];
    const container = options?.container ?? "mp4";

    const filename = playlist.pageTitle
      ? `${playlist.pageTitle}-${playlistFilenameWithoutExt}.${container}`
      : `${playlistFilenameWithoutExt}.${container}`;

    // Remove invisible Unicode control characters
    const cleaned = filename
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '')
      .replace(/[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E]/g, '');

    const sanitized = filenamify(cleaned, { replacement: '-' }).normalize("NFC");

    if (sanitized !== filename) {
      console.debug("[generateFileName v2] Sanitized filename:", {
        version: 2,
        original: filename,
        cleaned,
        sanitized,
        hadInvisibleChars: filename !== cleaned
      });
    }

    return sanitized;
  };
  return run;
};
