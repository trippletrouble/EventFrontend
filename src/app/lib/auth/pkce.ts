import { createHash, randomBytes } from 'crypto';

const b64url = (b: Buffer) => b.toString('base64url');

export const generateVerifier = () => b64url(randomBytes(32));
export const challengeFromVerifier = (v: string) =>
  b64url(createHash('sha256').update(v).digest());
export const randomToken = () => b64url(randomBytes(16));