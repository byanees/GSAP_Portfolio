// The headline numbers, each written once. The profile, case studies, home
// hero, intro reel, FAQ, meta descriptions, and llms.txt all read from here, so
// changing a figure here changes it everywhere it is quoted.
//
// Blog posts are the exception: they are dated write-ups, and keep the numbers
// they were published with.
//
// Import with a relative path ("./metrics"), never "@/data/metrics":
// vite.config.ts loads these files without the "@" alias.

export const METRICS = {
  /** Years in the industry. Also written out in words in PROFILE.aboutLead. */
  years: "3+",
  /** Push notifications sent by one scheduler run, and how long a run takes. */
  notificationsPerRun: "700-800k",
  /** En dash, as a range should be. */
  runMinutes: "6–8",
  /** Concurrent sessions held after the Redis multiplexing fix. */
  concurrentSessions: "600k+",
  /** Merchants that adopted Request to Pay. */
  merchants: "4,000+",
  /** Agents on the telco agent apps in Tanzania. */
  agents: "60,000+",
};
