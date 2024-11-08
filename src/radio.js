import fs from 'fs';
import { Mp3Parser } from 'mp3-parser';
import { Throttler } from 'throttler';
import Broadcast from './broadcast.js';
import { folder } from './utils.js';

export const bitrate = 196 * 1000;

const mp3Parser = new Mp3Parser();

class Radio {
  constructor() {
    this.broadcaster = new Broadcast();
    this.throttler = null;
    this.run();
  }

  async run() {
    const { currentTrack, filepath } = this.selectRandomTrack();
    const stream = fs.createReadStream(filepath);
    const metadata = await mp3Parser.parse(filepath);
    this.throttler = new Throttler(metadata.bitrate / 8);
    console.log(`Now playing: ${currentTrack}`);

    stream.pipe(this.throttler, { end: false }).pipe(this.broadcaster, { end: false });
    stream.on('end', () => this.nextTrack());
  }

  nextTrack() {
    this.run();
  }

  selectRandomTrack() {
    const files = fs.readdirSync(folder);
    const mp3Files = files.filter((file) => file.toLowerCase().endsWith('.mp3'));

    if (!mp3Files?.length) {
      throw Error(`No MP3 files found in the folder: ${folder}`);
    }

    const currentTrack = mp3Files[Math.floor(Math.random() * mp3Files.length)];
    const filepath = `${folder}/${currentTrack}`;
    return { currentTrack, filepath };
  }

  subscribe() {
    return this.broadcaster.subscribe();
  }

  unsubscribe(id) {
    this.broadcaster.unsubscribe(id);
  }
}

export default Radio;
