import type { ReactNode } from "react";
import type { VenueView } from "../destination/landmarks";

interface NeighborhoodProps {
  venues: readonly VenueView[];
  focusId?: string | null;
  children: ReactNode;
}

export function Neighborhood({ venues, focusId, children }: NeighborhoodProps) {
  return (
    <div className="city-block">
      <ul className="frontage" aria-label="Glitter Neighborhood">
        {venues.map((venue) => (
          <li
            key={venue.id}
            className={`venue is-${venue.status} venue-${venue.id}${
              focusId === venue.id ? " is-focus" : ""
            }`}
            style={{ ["--venue-accent" as string]: venue.accent }}
          >
            <span className="venue-build" aria-hidden="true">
              <span className="venue-roof" />
              <span className="venue-face">
                <span className="venue-mark">{venue.mark}</span>
              </span>
              {venue.status === "locked" ? <span className="venue-rope" /> : null}
            </span>
            <span className="venue-label">{venue.label}</span>
            <span className="sr-only">
              {venue.status === "open"
                ? `${venue.name} is open`
                : venue.status === "stirring"
                  ? `${venue.name} is coming to life`
                  : `${venue.label} is still waiting`}
            </span>
          </li>
        ))}
      </ul>
      <div className="plaza-lot">{children}</div>
    </div>
  );
}
