import fs from "node:fs";
import path from "node:path";
import type { AgnisClip } from "./content";

/*
 * Media for the /agnis page. Server-only (reads public/ with fs): the page is
 * static, so these checks run at build time and recordings that land later
 * show up on the next build. The clip list and its copy live in content.ts
 * (public/videos/agnis/<id>[-crop].{webm,mp4,png}).
 */

export { agnisDemo } from "@/features/landing/media";

export type ResolvedClip = AgnisClip & {
  /** Video URL to hand to <AutoVideo> (a .webm also gets its .mp4 twin), or null if not recorded yet. */
  src: string | null;
  poster: string | null;
  /** width / height read from the PNG poster; null when unknown. */
  ratio: number | null;
};

const PUBLIC_DIR = path.join(process.cwd(), "public");

function exists(publicPath: string) {
  try {
    return fs.existsSync(path.join(PUBLIC_DIR, ...publicPath.split("/").filter(Boolean)));
  } catch {
    return false;
  }
}

/** Reads the IHDR width/height of a PNG under public/. */
function pngRatio(publicPath: string): number | null {
  try {
    const fd = fs.openSync(path.join(PUBLIC_DIR, ...publicPath.split("/").filter(Boolean)), "r");
    const header = Buffer.alloc(24);
    fs.readSync(fd, header, 0, 24, 0);
    fs.closeSync(fd);
    if (header.toString("ascii", 12, 16) !== "IHDR") return null;
    const width = header.readUInt32BE(16);
    const height = header.readUInt32BE(20);
    return width > 0 && height > 0 ? width / height : null;
  } catch {
    return null;
  }
}

/** Picks the best files for a clip: the `-crop` variant first, then the full recording. */
export function resolveClip(clip: AgnisClip): ResolvedClip {
  for (const base of [`/videos/agnis/${clip.id}-crop`, `/videos/agnis/${clip.id}`]) {
    const src = exists(`${base}.webm`) ? `${base}.webm` : exists(`${base}.mp4`) ? `${base}.mp4` : null;
    const poster = exists(`${base}.png`) ? `${base}.png` : null;
    if (src || poster) return { ...clip, src, poster, ratio: poster ? pngRatio(poster) : null };
  }
  return { ...clip, src: null, poster: null, ratio: null };
}
