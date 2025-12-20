import { Level, Playlist } from "../entities";
import filenamify from "filenamify";

export const generateSubtitleFileName = () => {
  const run = (playlist: Playlist, level: Level): string => {
    const baseTitle =
      playlist.pageTitle && playlist.pageTitle.trim().length > 0
        ? playlist.pageTitle
        : "subtitle";

    const language = level.language || level.name || level.id || "track";
    const sanitizedLanguage = `${language}`.replace(/\s+/g, "-");

    const filename = `${baseTitle}-${sanitizedLanguage}.vtt`;

    // Remove invisible Unicode control characters
    const cleaned = filename
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, '')
      .replace(/[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E]/g, '');

    const sanitized = filenamify(cleaned, { replacement: '-' }).normalize("NFC");

    if (sanitized !== filename) {
      console.debug("[generateSubtitleFileName v2] Sanitized filename:", {
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
