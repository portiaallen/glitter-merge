import type { CityBrief as CityBriefData } from "../destination/brief";

interface CityBriefProps {
  brief: CityBriefData;
  selectedHint: string | null;
}

export function CityBrief({ brief, selectedHint }: CityBriefProps) {
  return (
    <section className="city-brief" aria-label="City brief" aria-live="polite">
      <p className="brief-kicker">{selectedHint ? "This stack" : brief.kicker}</p>
      <h2 className="brief-title">{selectedHint ?? brief.title}</h2>
      <p className="brief-detail">{brief.detail}</p>
    </section>
  );
}
