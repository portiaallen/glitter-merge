const HIDDEN = new Set(["ticked", "moved"]);

export function isPlayerFacingEvent(kind: string): boolean {
  return !HIDDEN.has(kind);
}
