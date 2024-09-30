import fs from 'fs';
import { spawn } from 'child_process';
import Broadcast from './broadcast.js';
import { ffmpegArgs } from './utils.js';

class Radio {
  constructor(params) {
    this.broadcast = new Broadcast();
  }

  start() {
    const currentTrack = this.selectRandomTrack();
    const input = `./library/${currentTrack}`;
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs(input));
    ffmpegProcess.stdout.pipe(this.broadcast);
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
}

export default Radio;
