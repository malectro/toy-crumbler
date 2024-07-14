import {createDelay} from 'src/audio/delay';
import notes from 'src/audio/notes';


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


let mobile = false;
export function initMobileAudio() {
  if (mobile) {
    return;
  }

  mobile = true;
  const osc = context.createOscillator();

  const gain = context.createGain();
  gain.gain.value = 0.01;

  osc.connect(gain);
  gain.connect(context.destination);

  osc.start(0);
  osc.stop(context.currentTime + 1);
}

