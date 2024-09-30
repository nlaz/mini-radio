import fs from 'fs';
import { spawn } from 'child_process';
import Broadcast from './broadcast.js';
import { ffmpegArgs } from './utils.js';

class Radio {
  constructor() {
    this.ffmpeg = null;
    this.broadcast = new Broadcast();
    this.run();
  }

  run() {
    const currentTrack = this.selectRandomTrack();
    const input = `./library/${currentTrack}`;
    this.ffmpeg = spawn('ffmpeg', ffmpegArgs(input));
    console.log(`Now playing: ${currentTrack}`);

    this.ffmpeg.on('close', () => this.stop());
    this.ffmpeg.on('error', () => this.stop());
    this.ffmpeg.stdout.pipe(this.broadcast);
  }

  selectRandomTrack() {
    const files = fs.readdirSync('./library');
    return files[Math.floor(Math.random() * files.length)];
  }

  subscribe() {
    return this.broadcast.subscribe();
  }

  unsubscribe(id) {
    this.broadcast.unsubscribe(id);
  }

  stop() {
    this.run();
  }
}

export default Radio;
