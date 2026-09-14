import type { CoachHint } from "@game/index";

interface CoachBannerProps {
  hint: CoachHint;
  preview: string | null;
}

export function CoachBanner({ hint, preview }: CoachBannerProps) {
  return (
    <p
      className={`coach coach-${hint.tone}`}
      role="status"
      aria-live="polite"
    >
      {preview ?? hint.label}
    </p>
  );
}
