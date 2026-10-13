export const TARGET = new Date("2026-10-23T06:00:00+05:30");

export const UNITS = [
  { key: "months", label: "Months" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function pad(value) {
  return String(value).padStart(2, "0");
}

function addMonths(date, count) {
  const next = new Date(date.getTime());
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + count);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
}

export function remaining(now = new Date(), target = TARGET) {
  if (!(target instanceof Date) || Number.isNaN(target.getTime()) || now >= target) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }

  let months =
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
  if (addMonths(now, months) > target) months -= 1;
  if (months < 0) months = 0;

  let diff = target.getTime() - addMonths(now, months).getTime();
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000);
  diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);

  return { months, days, hours, minutes, seconds, done: false };
}

export function announcement(parts) {
  if (parts.done) return "It's time. Let's go.";
  return `${parts.months} months, ${parts.days} days, ${parts.hours} hours, and ${parts.minutes} minutes until 23 October at 6:00 AM India time.`;
}
