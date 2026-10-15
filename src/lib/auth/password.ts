import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// scrypt with OWASP-recommended cost (N=2^17, r=8, p=1). Format: scrypt$N$r$p$salt$hash (base64url).
const N = 2 ** 17;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEM = 256 * N * R; // scrypt needs ~128*N*r bytes; leave headroom.

function derive(password: string, salt: Buffer, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, opts, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, { N, r: R, p: P, maxmem: MAX_MEM });
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, n, r, p, saltB64, keyB64] = stored.split("$");
  if (algo !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64url");
  const opts = { N: Number(n), r: Number(r), p: Number(p), maxmem: 256 * Number(n) * Number(r) };
  const actual = await derive(password, Buffer.from(saltB64, "base64url"), opts);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** A real hash of a random password, verified against when an email doesn't exist so
 *  "unknown email" and "wrong password" take the same time. */
let dummyHash: Promise<string> | undefined;
export const getDummyHash = () => (dummyHash ??= hashPassword(randomBytes(16).toString("hex")));
