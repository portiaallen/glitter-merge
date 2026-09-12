import type { CoachHint } from "@game/index";

interface CoachBannerProps {
  hint: CoachHint;
  preview: string | null;
}

export function CoachBanner({ hint, preview }: CoachBannerProps) {
  return (
    <p className={`whisper whisper-${hint.tone}`} role="status" aria-live="polite">
      {preview ?? hint.label}
    </p>
  );
}
