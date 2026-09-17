import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: this app has no ISR/ on-demand revalidation to speak of (pages are either
// fully static or fully dynamic per-request), so the R2-backed incremental cache override isn't
// needed here — keeps the setup to the two buckets/DB this app actually uses.
export default defineCloudflareConfig();
