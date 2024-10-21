import fs from 'fs';
import Broadcast from './broadcast.js';
import Throttle from './throttle.js';

export const bitrate = 196 * 1000;

class Radio {
  constructor() {
    this.ffmpeg = null;
    this.broadcaster = new Broadcast();
    this.throttler = new Throttle(bitrate / 8);
    this.run();
  }

  run() {
    const currentTrack = this.selectRandomTrack();
    const filepath = `./library/${currentTrack}`;
    const stream = fs.createReadStream(filepath);
    console.log(`Now playing: ${currentTrack}`);

    stream.pipe(this.throttler, { end: false }).pipe(this.broadcaster, { end: false });
    stream.on('end', () => this.nextTrack());
  }

  nextTrack() {
    this.throttler = new Throttle(bitrate / 8);
    this.run();
  }

  selectRandomTrack() {
    const files = fs.readdirSync('./library');
    const mp3Files = files.filter((file) => file.toLowerCase().endsWith('.mp3'));
    return mp3Files.length > 0 ? mp3Files[Math.floor(Math.random() * mp3Files.length)] : null;
  }

  subscribe() {
    return this.broadcaster.subscribe();
  }

  unsubscribe(id) {
    this.broadcaster.unsubscribe(id);
  }
}

export default Radio;
