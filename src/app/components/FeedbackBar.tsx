import type { GameEvent } from "@game/index";
import { isPlayerFacingEvent } from "../feedback/events";

interface FeedbackBarProps {
  events: readonly GameEvent[];
}

export function FeedbackBar({ events }: FeedbackBarProps) {
  const visible = events.filter((event) => isPlayerFacingEvent(event.kind));
  const latest = visible[visible.length - 1];
  const rewarded = visible.find((event) => event.kind === "rewarded");
  const text = latest
    ? rewarded && latest.kind === "merged"
      ? `${latest.message} ${rewarded.message}`
      : latest.message
    : "Stack matching jewels. Discover new glam.";

  return (
    <div className="toast" role="status" aria-live="polite">
      <p>{text}</p>
    </div>
  );
}
