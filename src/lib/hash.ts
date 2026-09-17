export function hashSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pickFromSeed<T>(seed: string, arr: T[]): T {
  return arr[hashSeed(seed) % arr.length];
}
