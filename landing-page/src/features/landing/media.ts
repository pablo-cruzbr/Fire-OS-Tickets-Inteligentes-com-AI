import type { Text } from "@/i18n/text";

/*
 * Registry of the landing's looping background videos (public/videos).
 * Posters are frames grabbed at ~1s (public/videos/posters, 1280x720 JPG).
 */

export type LandingVideoId = "ethernet-cables" | "laptop-repair" | "thermal-paste" | "solar-panels";

export type LandingVideo = {
  id: LandingVideoId;
  src: string;
  poster: string;
  /** Short description of what the clip shows (usable as aria-label). */
  title: Text;
  /** Segment label, matching `segments[].short` in ./segments. */
  segment: Text;
  /** Matching `segments[].id` in ./segments. */
  segmentId: string;
};

export const videos: LandingVideo[] = [
  {
    id: "ethernet-cables",
    src: "/videos/ethernet-cables.mp4",
    poster: "/videos/posters/ethernet-cables.jpg",
    title: { pt: "Técnico conectando cabos de rede em um rack", en: "Technician connecting network cables in a rack" },
    segment: { pt: "Internet e telecom", en: "Internet and telecom" },
    segmentId: "telecom",
  },
  {
    id: "laptop-repair",
    src: "/videos/laptop-repair.mp4",
    poster: "/videos/posters/laptop-repair.jpg",
    title: { pt: "Reparo de placa eletrônica na bancada", en: "Circuit board repair on the bench" },
    segment: { pt: "Assistência técnica", en: "Electronics repair" },
    segmentId: "assistencia",
  },
  {
    id: "thermal-paste",
    src: "/videos/thermal-paste.mp4",
    poster: "/videos/posters/thermal-paste.jpg",
    title: { pt: "Técnico aplicando pasta térmica em uma placa-mãe", en: "Technician applying thermal paste to a motherboard" },
    segment: { pt: "Suporte de TI", en: "IT support" },
    segmentId: "helpdesk",
  },
  {
    id: "solar-panels",
    src: "/videos/solar-panels.mp4",
    poster: "/videos/posters/solar-panels.jpg",
    title: { pt: "Técnico instalando painéis solares em um telhado", en: "Technician installing solar panels on a roof" },
    segment: { pt: "Energia solar", en: "Solar" },
    segmentId: "solar",
  },
];

export const videoById = Object.fromEntries(videos.map((video) => [video.id, video])) as Record<
  LandingVideoId,
  LandingVideo
>;

/** Screen recording of the Fire OS dashboard (recorded separately). */
export const dashboardTour = {
  src: "/videos/dashboard-tour.webm",
  poster: "/videos/dashboard-tour.png",
  title: { pt: "Tour pelo painel do Fire OS", en: "Tour of the Fire OS dashboard" },
};

/** Agnis panel recording (cropped to the chat), shown in the "Recursos" bento. */
export const agnisDemo = {
  src: "/videos/agnis-ai.webm",
  poster: "/videos/agnis-ai.png",
  title: { pt: "Agnis respondendo perguntas sobre chamados e técnicos", en: "Agnis answering questions about tickets and technicians" },
};

/**
 * Screen recording of the mobile app (portrait, recorded separately). The
 * files may not exist yet: <AppDemoPhone> checks for them at build time and
 * falls back to the poster, then to a static app-screen placeholder.
 */
export const appDemo = {
  src: "/videos/app-os.webm",
  poster: "/videos/app-os.png",
  title: { pt: "Técnico preenchendo uma OS no app Fire OS", en: "Technician filling in a work order in the Fire OS app" },
};
