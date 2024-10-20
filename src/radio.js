import fs from 'fs';
import Broadcast from './broadcast.js';
import Throttle from './throttle.js';
import Monitor from './monitor.js';

export const BITRATE = 128 * 1000;

class Radio {
  constructor() {
    this.ffmpeg = null;
    this.broadcaster = new Broadcast();
    this.throttler = new Throttle(BITRATE / 8);
    this.inputMonitor = new Monitor('logs/input.json');
    this.outputMonitor = new Monitor('logs/output.json');
    this.streamStartTime = null;
    this.run();
  }

  run() {
    const currentTrack = this.selectRandomTrack();
    const input = `./library/${currentTrack}`;
    console.log(`Now playing: ${currentTrack}`);
    this.streamStartTime = Date.now();
    const readableStream = fs.createReadStream(input);
    readableStream.pipe(this.throttler, { end: false }).pipe(this.broadcaster, { end: false });

    readableStream.on('end', () => {
      const streamDuration = (Date.now() - this.streamStartTime) / 1000; // Convert to seconds
      console.log(`Readable Stream ended. Time: ${streamDuration.toFixed(2)} seconds`);
      this.playNextTrack();
    });
  }

  playNextTrack() {
    setTimeout(() => this.run(), 20000);
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
