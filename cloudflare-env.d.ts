// Merges this app's own bindings into the `CloudflareEnv` interface that
// `@opennextjs/cloudflare`'s `getCloudflareContext().env` is typed with.
// Runtime binding types (D1Database, R2Bucket, ...) come from `worker-configuration.d.ts`
// (regenerate via `npx wrangler types` after editing wrangler.jsonc).
export {};

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    PHOTOS: R2Bucket;
    ADMIN_ACCESS_CODE: string;
  }
}
