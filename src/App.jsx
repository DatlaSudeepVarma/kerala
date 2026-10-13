import { useEffect, useState } from "react";
import poster from "./assets/new poster.png";
import { UNITS, announcement, pad, remaining } from "./countdown.js";

export default function App() {
  const [parts, setParts] = useState(() => remaining(new Date()));
  const [status, setStatus] = useState(() => announcement(remaining(new Date())));

  useEffect(() => {
    let pending = 0;
    let finished = false;

    const paint = () => {
      const next = remaining(new Date());
      setParts(next);
      setStatus((current) => {
        const text = announcement(next);
        return current === text ? current : text;
      });
      if (next.done) {
        finished = true;
        window.clearTimeout(pending);
      }
      return next.done;
    };

    const queue = () => {
      window.clearTimeout(pending);
      if (finished || document.hidden) return;
      const wait = 1000 - (Date.now() % 1000);
      pending = window.setTimeout(() => {
        if (!paint()) queue();
      }, wait);
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.clearTimeout(pending);
        return;
      }
      if (!paint()) queue();
    };

    if (!paint()) queue();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      finished = true;
      window.clearTimeout(pending);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <main className={parts.done ? "stage arrived" : "stage"}>
      <div className="poster-wrap">
      <img
        className="poster"
        src={poster}
        width="1870"
        height="841"
        alt="A man in a flat cap points toward a glowing metal title that reads Kerala, in a green forest"
        decoding="async"
        fetchPriority="high"
      />
      <section className="panel" aria-label="Countdown to Kerala">
        <p className="caption">
          <span className="line">The wait ends.</span>
          <span className="line">The journey begins.</span>
        </p>
        {parts.done ? <h1>It's time. Let's go.</h1> : null}
        <div className="timer" role="group" aria-hidden="true">
          {UNITS.flatMap((unit, index) => {
            const piece = (
              <div className="unit" key={unit.key}>
                <span className="num">{pad(parts[unit.key])}</span>
                <span className="label">{unit.label}</span>
              </div>
            );
            if (index === 0) return [piece];
            return [
              <span className="colon" key={`${unit.key}-colon`}>:</span>,
              piece,
            ];
          })}
        </div>
        <p className="when">
          <time dateTime="2026-10-23T06:00:00+05:30">23 October · 6:00 AM IST</time>
        </p>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </section>
      </div>
    </main>
  );
}
