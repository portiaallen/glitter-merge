/**
 * Decorative Glitter City atmosphere only.
 * No camera, no buildings as gameplay, no characters — a static illustrated place.
 */
export function Environment() {
  return (
    <div className="environment" aria-hidden="true">
      <div className="sky" />
      <div className="sun-jewel" />
      <div className="aurora" />
      <div className="silk silk-a" />
      <div className="silk silk-b" />
      <div className="skyline">
        <span className="tower tower-a" />
        <span className="tower tower-b" />
        <span className="tower tower-c" />
        <span className="tower tower-d" />
        <span className="tower tower-e" />
        <span className="tower tower-f" />
        <span className="tower tower-g" />
      </div>
      <div className="hills">
        <span className="hill hill-a" />
        <span className="hill hill-b" />
        <span className="hill hill-c" />
      </div>
      <div className="distant-grove">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} className={`grove-tree grove-tree-${index}`} />
        ))}
      </div>
      <div className="palms">
        <span className="palm palm-left" />
        <span className="palm palm-right" />
      </div>
      <div className="garden">
        <span className="bloom bloom-a" />
        <span className="bloom bloom-b" />
        <span className="bloom bloom-c" />
        <span className="bloom bloom-d" />
      </div>
      <div className="foreground-garden">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} className={`garden-spark garden-spark-${index}`} />
        ))}
      </div>
      <div className="lanterns">
        <span className="lantern lantern-a" />
        <span className="lantern lantern-b" />
        <span className="lantern lantern-c" />
      </div>
      <div className="sparkles">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} className={`spark spark-${index}`} />
        ))}
      </div>
      <div className="glow-orb glow-left" />
      <div className="glow-orb glow-right" />
    </div>
  );
}
