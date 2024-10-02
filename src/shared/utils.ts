import path from 'path';

export const srcPath = path.join(__dirname, '..');
export const tmpPath = path.resolve(srcPath, 'tmp');
export const publicPath = path.resolve(srcPath, 'public');

export function generateRandomFileName(extension = 'txt', length = 8) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  const date = new Date()
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return `${date.getTime()}${randomString}.${extension}`;
}
