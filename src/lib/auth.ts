// Edge-compatible — uses Web Crypto only. Safe to import from middleware.

export const SESSION_COOKIE = 'ce_session';

async function hmacSign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacVerify(data: string, sig: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const sigBytes = Uint8Array.from(
    (sig.match(/../g) ?? []).map(h => parseInt(h, 16)),
  );
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
}

export async function createSessionToken(secret: string): Promise<string> {
  const ts = Date.now().toString();
  const sig = await hmacSign(ts, secret);
  return `${ts}.${sig}`;
}

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const dot = token.indexOf('.');
  if (dot === -1) return false;
  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!ts || !sig) return false;
  const age = Date.now() - parseInt(ts, 10);
  if (age < 0 || age > SESSION_MAX_AGE_MS) return false;
  return hmacVerify(ts, sig, secret);
}
