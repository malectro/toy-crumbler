import times from 'lodash/times';
import {createDelay} from 'src/audio/delay';


const notes = times(88).map(note => Math.pow(2, (note - 49) / 12) * 440);


export const context = new AudioContext();

// postfx
export const masterGain = context.createGain();
masterGain.connect(context.destination);
masterGain.gain.value = 0.5;

export const delay = createDelay(context);
delay.connect(masterGain);
delay.delayTime.value = 0.2;
delay.blend.value = 0.4;
delay.feedback.value = 0.5;


// osc
const osc = context.createOscillator();
osc.type = 'sawtooth';
osc.frequency.value = notes[8];
osc.start(context.currentTime);

export const oscGain = context.createGain();
oscGain.gain.value = 0;

osc.connect(oscGain);

const envToFrequency = context.createGain();
envToFrequency.gain.value = 100000;
oscGain.connect(envToFrequency);

const highPass = context.createBiquadFilter();
highPass.frequency.value = 0;
highPass.type = 'highpass';
highPass.Q.value = 700;
oscGain.connect(highPass);

const highPassMod = context.createGain();
highPassMod.gain.value = 0.01;
envToFrequency.connect(highPassMod);
highPassMod.connect(highPass.frequency);

export const lowPass = context.createBiquadFilter();
lowPass.frequency.value = 0;
lowPass.type = 'lowpass';
lowPass.Q.value = 500;
highPass.connect(lowPass);

export const lowPassMod = context.createGain();
lowPassMod.gain.value = 1;
envToFrequency.connect(lowPassMod);
lowPassMod.connect(lowPass.frequency);

delay.receive(lowPass);

const attack = 0.01;
const decay = 0.2;
const sustain = 0.6;
const release = 0.5;
export function down(velocity = 1) {
  const {currentTime} = context;
  const {gain} = oscGain;

  gain.cancelScheduledValues(currentTime);

  let time = currentTime + attack;
  gain.exponentialRampToValueAtTime(1, time);

  time = time + decay;
  gain.exponentialRampToValueAtTime(sustain, time);

  return time;
}

export function up(startTime) {
  const {gain} = oscGain;
  let time = startTime || context.currentTime;

  if (!startTime) {
    gain.cancelScheduledValues(time);
  }

  time = time + release;
  gain.linearRampToValueAtTime(0, time);

  return time;
}

export function play() {
  let time = down();
  up(time);
};

