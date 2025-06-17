import fs from 'fs';

const FILE_PATH = './lastTweet.json';

export function getLastTweetId() {
  if (!fs.existsSync(FILE_PATH)) return null;
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data).id;
  } catch {
    return null;
  }
}

export function setLastTweetId(id) {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ id }), 'utf-8');
}
