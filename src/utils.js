const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const BITRATE = 196 * 1024;

export function generateSessionId() {
  const numPossible = POSSIBLE_CHARS.length;
  const sessionIDArray = new Array(10)
    .fill(null)
    .map(() => POSSIBLE_CHARS.charAt((Math.random() * numPossible) | 0));
  return sessionIDArray.join('');
}

export const ffmpegArgs = (input) => {
  return [
    '-re',
    '-y',
    '-loglevel',
    'error',
    '-i',
    input,
    '-ac',
    2,
    '-b:a',
    BITRATE,
    '-ar',
    '48000',
    '-vn',
    '-f',
    'mp3',
    'pipe:1',
  ];
};
