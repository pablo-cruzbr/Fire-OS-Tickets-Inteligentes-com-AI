import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { TbCamera, TbCheck, TbMapPin, TbPlayerPauseFilled } from "react-icons/tb";
import { AutoVideo } from "@/components/media/AutoVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { appDemo } from "./media";

/** True when `publicPath` (e.g. "/videos/app-os.webm") exists under public/. Runs at build time for static pages. */
function publicFileExists(publicPath: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", ...publicPath.split("/").filter(Boolean)));
  } catch {
    return false;
  }
}

type AppDemoPhoneProps = {
  /** Classes for the PhoneFrame (width, positioning). */
  className?: string;
  /** Device width (see PhoneFrame). */
  width?: number | string;
  /** Load the poster eagerly (above-the-fold usage). */
  priority?: boolean;
};

/**
 * The mobile-app recording inside a PhoneFrame. Server component: it checks
 * public/ for the video and poster (at build time on static pages) and picks
 * the best available screen — video (with poster if present) → poster image →
 * a static mock of the app's OS screen — so it renders fine before the
 * recording exists.
 */
export function AppDemoPhone({ className, width, priority = false }: AppDemoPhoneProps) {
  const hasVideo = publicFileExists(appDemo.src);
  const hasPoster = publicFileExists(appDemo.poster);

  return (
    <PhoneFrame className={className} width={width}>
      {hasVideo ? (
        <AutoVideo
          src={appDemo.src}
          poster={hasPoster ? appDemo.poster : undefined}
          mode="inview"
          preload="metadata"
          label={appDemo.title}
          showToggle
          className="h-full w-full"
          videoClassName="h-full w-full object-cover object-top"
        />
      ) : hasPoster ? (
        <Image
          src={appDemo.poster}
          alt={appDemo.title}
          fill
          priority={priority}
          sizes="320px"
          className="object-cover object-top"
        />
      ) : (
        <AppScreenPlaceholder />
      )}
    </PhoneFrame>
  );
}

/**
 * Static mock of the app's "OS em atendimento" screen, shown until the real
 * recording lands. Sized in cqw (of the phone width) so it scales with the
 * device. Colours follow the app (navy header, purple actions).
 */
function AppScreenPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Tela do app Fire OS com uma ordem de serviço em atendimento"
      className="flex h-full w-full flex-col bg-[#f3f4f9] text-[3.6cqw] leading-tight text-[#0f1431]"
    >
      {/* Header with status bar */}
      <div className="bg-[linear-gradient(160deg,#0f1431_0%,#2a1f5c_60%,#4e3182_100%)] px-[6cqw] pb-[7cqw] pt-[3.4cqw] text-white">
        <div className="flex items-center justify-between px-[2cqw] text-[3.4cqw] font-semibold">
          <span>9:41</span>
          <span aria-hidden className="flex items-center gap-[1.2cqw]">
            <span className="flex items-end gap-[0.5cqw]">
              {[1.2, 1.8, 2.4, 3].map((h) => (
                <span key={h} className="w-[0.8cqw] rounded-[0.3cqw] bg-white" style={{ height: `${h}cqw` }} />
              ))}
            </span>
            <span className="relative h-[2.8cqw] w-[5.6cqw] rounded-[0.8cqw] border-[0.35cqw] border-white/70 p-[0.35cqw]">
              <span className="block h-full w-[75%] rounded-[0.3cqw] bg-white" />
            </span>
          </span>
        </div>
        <p className="mt-[7cqw] text-[3.2cqw] text-white/65">Olá, Carlos</p>
        <div className="mt-[1cqw] flex items-center justify-between">
          <p className="text-[6cqw] font-semibold">Minhas OS</p>
          <span className="rounded-full bg-white/15 px-[2.6cqw] py-[1cqw] text-[3cqw] font-medium">3 hoje</span>
        </div>
      </div>

      {/* OS card */}
      <div className="-mt-[4cqw] flex flex-1 flex-col gap-[3cqw] px-[4cqw] pb-[4cqw]">
        <div className="rounded-[4cqw] bg-white p-[4cqw] shadow-[0_1cqw_3cqw_rgba(15,20,49,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-[3cqw] font-semibold text-[#4e3182]">OS #1042</span>
            <span className="flex items-center gap-[1cqw] rounded-full bg-[#27ae60]/12 px-[2.2cqw] py-[0.8cqw] text-[2.7cqw] font-semibold text-[#1e874b]">
              <span className="h-[1.6cqw] w-[1.6cqw] rounded-full bg-[#27ae60]" />
              Em atendimento
            </span>
          </div>
          <p className="mt-[2cqw] text-[4.4cqw] font-semibold">Clínica Vida Nova</p>
          <p className="mt-[1cqw] flex items-center gap-[1cqw] text-[3cqw] text-[#6c757d]">
            <TbMapPin aria-hidden className="shrink-0" /> Av. Paulista, 1578 · 2,4 km
          </p>
          <div className="mt-[3cqw] flex items-center justify-between rounded-[3cqw] bg-[#f3f4f9] px-[3cqw] py-[2.4cqw]">
            <div>
              <p className="text-[2.6cqw] text-[#6c757d]">Tempo de atendimento</p>
              <p className="text-[6cqw] font-semibold tabular-nums tracking-tight">00:42:17</p>
            </div>
            <span className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-[#4e3182] text-[4cqw] text-white">
              <TbPlayerPauseFilled aria-hidden />
            </span>
          </div>
        </div>

        {/* Photos */}
        <div className="rounded-[4cqw] bg-white p-[4cqw] shadow-[0_1cqw_3cqw_rgba(15,20,49,0.08)]">
          <p className="text-[3.2cqw] font-semibold">Fotos do atendimento</p>
          <div className="mt-[2.4cqw] grid grid-cols-3 gap-[2cqw]">
            <div className="relative aspect-square overflow-hidden rounded-[2.4cqw]">
              <Image src="/app/tecnico-campo.jpg" alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div className="aspect-square rounded-[2.4cqw] bg-[linear-gradient(135deg,#cfd5ea,#e7eaf5)]" />
            <div className="flex aspect-square items-center justify-center rounded-[2.4cqw] border-[0.4cqw] border-dashed border-[#4e3182]/40 text-[5cqw] text-[#4e3182]">
              <TbCamera aria-hidden />
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-[4cqw] bg-white p-[4cqw] shadow-[0_1cqw_3cqw_rgba(15,20,49,0.08)]">
          <p className="text-[3.2cqw] font-semibold">Checklist do serviço</p>
          <ul className="mt-[2cqw] flex flex-col gap-[1.8cqw] text-[3cqw]">
            {[
              { item: "Teste do equipamento", done: true },
              { item: "Limpeza e organização", done: true },
              { item: "Orientação ao cliente", done: false },
            ].map(({ item, done }) => (
              <li key={item} className="flex items-center gap-[2cqw]">
                <span
                  className={
                    done
                      ? "flex h-[4cqw] w-[4cqw] items-center justify-center rounded-[1cqw] bg-[#27ae60] text-[3cqw] text-white"
                      : "h-[4cqw] w-[4cqw] rounded-[1cqw] border-[0.4cqw] border-[#bdc3c7]"
                  }
                >
                  {done ? <TbCheck aria-hidden /> : null}
                </span>
                <span className={done ? "text-[#6c757d] line-through" : undefined}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Signature */}
        <div className="rounded-[4cqw] bg-white p-[4cqw] shadow-[0_1cqw_3cqw_rgba(15,20,49,0.08)]">
          <p className="text-[3.2cqw] font-semibold">Assinatura do cliente</p>
          <svg viewBox="0 0 200 44" className="mt-[1.6cqw] h-[10cqw] w-full text-[#0f1431]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 30 C 18 6, 26 6, 24 28 S 40 40, 48 18 S 60 4, 62 26 C 64 36, 74 34, 82 22 C 88 14, 94 16, 96 26 C 98 34, 110 30, 118 20 C 124 12, 132 14, 130 24 C 128 32, 140 34, 150 26" />
            <path d="M6 40 H 194" stroke="#bdc3c7" strokeWidth={1} strokeDasharray="4 4" />
          </svg>
        </div>

        <span className="mt-auto flex items-center justify-center gap-[1.6cqw] rounded-[3cqw] bg-[#4e3182] py-[3.2cqw] text-[3.6cqw] font-semibold text-white">
          <TbCheck aria-hidden /> Concluir OS
        </span>
      </div>
    </div>
  );
}
