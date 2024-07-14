import {onUpdate, camera} from 'src/renderer';
import {createLine, removeLine, pointsGeometryStatic} from 'src/points';
import {delay, context as audioContext} from 'src/audio';
import notes from 'src/audio/notes';
import * as monosynth from 'src/audio/monosynth';
import {exponentialAdjust} from 'src/audio/param';
import {vec2, vec3} from 'src/vector';
import {exp} from 'src/scale';


const freqFloor = notes[2];
const freqCeiling = notes[30];
const yToFreq = exp(2, [freqFloor, freqCeiling]);
const xToFreq = exp(2, [notes[12], notes[87]]);
const PI2 = Math.PI * 2;

const halfWidth = window.innerWidth / 2;
const halfHeight = window.innerHeight / 2;
const worldHeight = Math.sin((camera.fov / 2) * Math.PI / 180) * 1000 * 2;
const screenToWorld = 1.2 * worldHeight / window.innerHeight;

const crumbles = new Map();

export function createCrumble(touch) {
  const id = touch.pointerId || 1;

  const frequency = yToFreq(touch.pageY / window.innerHeight);
  const lowPass = xToFreq(touch.pageX / window.innerWidth);

  const crumble = {
    touch: {
      pageX: touch.pageX,
      pageY: touch.pageY,
    },
    line: createLine(),
    synth: monosynth.create(audioContext, {
      frequency,
      lowPass,
    }),
  };
  crumbles.set(id, crumble);

  crumble.line.object.position.set(screenToWorld * (halfWidth - touch.pageX), screenToWorld * (halfHeight - touch.pageY), 0);
  delay.receive(crumble.synth);

  return crumble;
}

let lastX = 0;
window.speed = 0;
const decay = 0.9;

export const lfo = audioContext.createOscillator();
lfo.type = 'sine';
lfo.frequency.value = 0.1;

let synth;

function start() {
synth = monosynth.create(audioContext, {
  type: 'square',
  release: 5,
  lowPass: notes[50],
});
delay.receive(synth);
synth.gain.gain.value = 0.1;

lfo.connect(synth.lowPassMod);

  audioContext.resume();
  console.log('starting');
synth.osc.start(audioContext.currentTime);
lfo.start(audioContext.currentTime);

window.lfo = lfo;
window.audio = audioContext;
}


let started = false;
export function attackSpeed(touch) {
  if (!started) {
    started = true;
    start();
  }
  lastX = touch.pageX;
  monosynth.down(synth, 1);
}
export function changeSpeed(touch) {
  speed = (lastX - touch.pageX) * 0.1;
  lfo.frequency.cancelScheduledValues(audioContext.currentTime);
  lfo.frequency.linearRampToValueAtTime(speed, audioContext.currentTime + 0.01);
  console.log('ramping', lfo.frequency.value, speed, audioContext.currentTime);
  lastX = touch.pageX;
}

export function releaseSpeed(touch) {
  //monosynth.up(synth);
  synth.gain.gain.cancelScheduledValues(audioContext.currentTime);
  synth.gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 5);
  lfo.frequency.setTargetAtTime(0.1, audioContext.currentTime + 0.02, 0.9);
}

onUpdate((time, delta) => {
  return;
  if (speed !== 0) {
    speed *= decay;
    if (Math.abs(speed) < 0.00001) {
      speed = 0;
    }
    /*
    lfo.frequency.cancelScheduledValues(audioContext.currentTime);
    lfo.frequency.linearRampToValueAtTime(speed, audioContext.currentTime + delta * 0.001);
    */
  }
});

export function attackCrumble(touch) {
  const id = touch.pointerId || 1;
  let crumble = crumbles.get(id);

  if (!crumble) {
    crumble = createCrumble(touch);
  }

  clearTimeout(crumble.releaseTimeout);
  monosynth.down(crumble.synth, touch.force || 0);
}

export function changeCrumble(touch) {
  const id = touch.pointerId || 1;
  const crumble = crumbles.get(id);
  //crumble.touch = touch;

  const yPos = touch.pageY / window.innerHeight;
  const xPos = touch.pageX / window.innerWidth;
  const yChange = (touch.pageY - crumble.touch.pageY) / window.innerHeight;
  const xChange = (touch.pageX - crumble.touch.pageX) / window.innerWidth;

  const frequency = yToFreq(yPos);
  monosynth.adjust(crumble.synth, touch.force || 0, frequency);

  const lowPass = xToFreq(xPos);
  exponentialAdjust(crumble.synth.lowPass.frequency, lowPass, audioContext.currentTime);

  crumble.line.object.rotation.set(yChange * PI2, xChange * PI2, 0);
}

export function releaseCrumble(touch) {
  const id = touch.pointerId || 1;
  const crumble = crumbles.get(id);
  const endTime = monosynth.up(crumble.synth);

  console.log('release', crumbles.size);

  clearTimeout(crumble.releaseTimeout);
  crumble.releaseTimeout = setTimeout(() => removeCrumble(touch), (endTime - audioContext.currentTime) * 1000);
}

export function removeCrumble(touch) {
  const id = touch.pointerId || 1;
  const crumble = crumbles.get(id);
  removeLine(crumble.line);
  monosynth.destroy(crumble.synth);
  crumbles.delete(id);
}


const deltaTime = 1000 / 60;
const rumbleDecay = 0.9;
const minRumble = 0.001;

const zeroVertex = vec3(0, 0, 0);

/*j
onUpdate(time => {
  const staticVertices = pointsGeometryStatic.vertices;

  for (let [i, crumble] of crumbles) {
    const {geometry} = crumble.line;
    const {vertices} = geometry;

    const rumbleFactor = crumble.synth.gain.gain.value;

    if (rumbleFactor > 0) {
      let vertex, staticVertex;
      for (let i = 0; i < vertices.length; i++) {
        vertex = vertices[i];
        staticVertex = staticVertices[i];

        vertex.copy(zeroVertex);
        vertex.addScaledVector(staticVertex, Math.random() * rumbleFactor);
      }

      geometry.verticesNeedUpdate = true;
    }
  }
});
*/
