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

