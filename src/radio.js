import fs from 'fs';
import Broadcast from './broadcast.js';
import Throttle from './throttle.js';
import { ffmpegArgs, BITRATE } from './utils.js';

class Radio {
  constructor() {
    this.ffmpeg = null;
    this.broadcaster = new Broadcast();
    this.throttler = new Throttle(BITRATE / 8);
    this.run();
  }

  run() {
    const currentTrack = this.selectRandomTrack();
    const input = `./library/${currentTrack}`;
    console.log(`Now playing: ${currentTrack}`);
    const readableStream = fs.createReadStream(input);
    readableStream.pipe(this.throttler).pipe(this.broadcaster);

    readableStream.on('end', () => {
      console.log('readableStream ended!');
    });
  }

  selectRandomTrack() {
    const files = fs.readdirSync('./library');
    return files[Math.floor(Math.random() * files.length)];
  }

  subscribe() {
    return this.broadcaster.subscribe();
  }

  unsubscribe(id) {
    this.broadcaster.unsubscribe(id);
  }

  stop() {
    this.run();
  }
}

export default Radio;
