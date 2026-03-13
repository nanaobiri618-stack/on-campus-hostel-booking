import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export function signJwt(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
