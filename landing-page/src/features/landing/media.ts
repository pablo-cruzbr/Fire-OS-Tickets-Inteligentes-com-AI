/*
 * Registry of the landing's looping background videos (public/videos).
 * Posters are frames grabbed at ~1s (public/videos/posters, 1280x720 JPG).
 */

export type LandingVideoId = "ethernet-cables" | "laptop-repair" | "thermal-paste" | "solar-panels";

export type LandingVideo = {
  id: LandingVideoId;
  src: string;
  poster: string;
  /** Short pt-BR description of what the clip shows (usable as aria-label). */
  title: string;
  /** Segment label, matching `segments[].short` in ./segments. */
  segment: string;
  /** Matching `segments[].id` in ./segments. */
  segmentId: string;
};

export const videos: LandingVideo[] = [
  {
    id: "ethernet-cables",
    src: "/videos/ethernet-cables.mp4",
    poster: "/videos/posters/ethernet-cables.jpg",
    title: "Técnico conectando cabos de rede em um rack",
    segment: "Internet e telecom",
    segmentId: "telecom",
  },
  {
    id: "laptop-repair",
    src: "/videos/laptop-repair.mp4",
    poster: "/videos/posters/laptop-repair.jpg",
    title: "Reparo de placa eletrônica na bancada",
    segment: "Assistência técnica",
    segmentId: "assistencia",
  },
  {
    id: "thermal-paste",
    src: "/videos/thermal-paste.mp4",
    poster: "/videos/posters/thermal-paste.jpg",
    title: "Técnico aplicando pasta térmica em uma placa-mãe",
    segment: "Suporte de TI",
    segmentId: "helpdesk",
  },
  {
    id: "solar-panels",
    src: "/videos/solar-panels.mp4",
    poster: "/videos/posters/solar-panels.jpg",
    title: "Técnico instalando painéis solares em um telhado",
    segment: "Energia solar",
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
  title: "Tour pelo painel do Fire OS",
} as const;
