import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

// Node.js-only — do NOT import this from middleware or Edge routes

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, 'hex');
  const derivedHash = scryptSync(password, salt, 64);
  return timingSafeEqual(hashBuffer, derivedHash);
}
