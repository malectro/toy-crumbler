import {onUpdate, camera} from 'src/renderer';
import {createLine, removeLine, pointsGeometryStatic} from 'src/points';
import {delay, context as audioContext} from 'src/audio';
import * as monosynth from 'src/audio/monosynth';
import {vec2, vec3} from 'src/vector';


const crumbles = new Map();


const halfWidth = window.innerWidth / 2;
const halfHeight = window.innerHeight / 2;
const worldHeight = Math.sin((camera.fov / 2) * Math.PI / 180) * 1000 * 2;
const screenToWorld = worldHeight / innerHeight;

export function createCrumble(touch) {
  const id = touch.identifier || 1;
  const crumble = {
    touch,
    line: createLine(),
    synth: monosynth.create(audioContext),
  };
  crumbles.set(id, crumble);

  crumble.line.object.position.set(screenToWorld * (touch.pageX - halfWidth), screenToWorld * (touch.pageY - halfHeight), 0);
  delay.receive(crumble.synth);

  return crumble;
}

export function attackCrumble(touch) {
  const id = touch.identifier || 1;
  let crumble = crumbles.get(id);

  if (!crumble) {
    crumble = createCrumble(touch);
  }

  clearTimeout(crumble.releaseTimeout);
  monosynth.down(crumble.synth, touch.force || 0);
}

export function changeCrumble(touch) {
  const id = touch.identifier || 1;
  const crumble = crumbles.get(id);
  crumble.touch = touch;

  monosynth.adjust(crumble.synth, touch.force || 0);
}

export function releaseCrumble(touch) {
  const id = touch.identifier || 1;
  const crumble = crumbles.get(id);
  const endTime = monosynth.up(crumble.synth);

  console.log('release', crumbles.size);

  clearTimeout(crumble.releaseTimeout);
  crumble.releaseTimeout = setTimeout(() => removeCrumble(touch), (endTime - audioContext.currentTime) * 1000);
}

export function removeCrumble(touch) {
  const id = touch.identifier || 1;
  const crumble = crumbles.get(id);
  removeLine(crumble.line);
  monosynth.destroy(crumble.synth);
  crumbles.delete(id);
}


const deltaTime = 1000 / 60;
const rumbleDecay = 0.9;
const minRumble = 0.001;

const zeroVertex = vec3(0, 0, 0);

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
