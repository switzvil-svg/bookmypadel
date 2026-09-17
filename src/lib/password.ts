// PBKDF2 via Web Crypto — works unchanged on both plain Node (`next dev`) and
// the Cloudflare Workers runtime (`workerd`), unlike native-binding hashers
// (e.g. bcrypt), which can't run in Workers at all (no filesystem, no native
// addons). Stored format: "<iterations>:<salt-hex>:<hash-hex>".

const ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function deriveHash(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH_BITS
  );
  return toHex(new Uint8Array(bits));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveHash(password, salt, ITERATIONS);
  return `${ITERATIONS}:${toHex(salt)}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [iterationsStr, saltHex, hashHex] = stored.split(":");
  const iterations = Number(iterationsStr);
  if (!iterations || !saltHex || !hashHex) return false;
  const salt = fromHex(saltHex);
  const candidate = await deriveHash(password, salt, iterations);
  return timingSafeEqual(candidate, hashHex);
}
