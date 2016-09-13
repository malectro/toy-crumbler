import times from 'lodash/times';
import {createDelay} from 'src/audio/delay';


const notes = times(88).map(note => Math.pow(2, (note - 49) / 12) * 440);


const AudioContext = window.AudioContext || window.webkitAudioContext;
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
export const oscGain = context.createGain();
oscGain.gain.value = 0;

const envToFrequency = context.createGain();
envToFrequency.gain.value = 100000;
oscGain.connect(envToFrequency);

const highPass = context.createBiquadFilter();
highPass.frequency.value = 0;
highPass.type = 'highpass';
highPass.gain.value = 0.2;
highPass.Q.value = 700;
oscGain.connect(highPass);

const highPassMod = context.createGain();
highPassMod.gain.value = 0.001;
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
const decay = 0.1;
const sustain = 0.6;
const release = 0.5;

const loudRange = 1 - sustain;

let oscs = {};
export function down(velocity = 0, id = 0) {
  const {currentTime} = context;
  const {gain} = oscGain;

  const osc = context.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = notes[8];
  osc.start(currentTime);
  osc.connect(oscGain);

  oscs[id] = osc;

  gain.cancelScheduledValues(currentTime);

  let time = currentTime + attack;
  gain.exponentialRampToValueAtTime(1, time);

  time = time + decay;
  gain.exponentialRampToValueAtTime(sustain + velocity * loudRange, time);

  return time;
}

export function push(velocity = 0, id = 0) {
  const {currentTime} = context;
  const {gain} = oscGain;
  const osc = oscs[id];

  gain.cancelScheduledValues(currentTime);
  gain.exponentialRampToValueAtTime(sustain + velocity * loudRange, currentTime + 0.01);
}

export function up(startTime, id = 0) {
  const {gain} = oscGain;
  const osc = oscs[id];
  let time = startTime || context.currentTime;

  if (!startTime) {
    gain.cancelScheduledValues(time);
  }

  time = time + release;
  gain.linearRampToValueAtTime(0, time);

  osc.stop(time);
  delete oscs[id];

  return time;
}

export function play() {
  let time = down();
  up(time);
};

