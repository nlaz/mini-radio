const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateSessionId() {
  const numPossible = POSSIBLE_CHARS.length;
  const sessionIDArray = new Array(10)
    .fill(null)
    .map(() => POSSIBLE_CHARS.charAt((Math.random() * numPossible) | 0));
  return sessionIDArray.join('');
}

export const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;
