import noop from 'lodash/noop';
import {Scene, OrthographicCamera, PerspectiveCamera, WebGLRenderer} from 'three';
import {vec2, vec3} from 'src/vector';


const viewDistance = 1000;


export const topScene = new Scene();
//export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, viewDistance);
//const {innerWidth: width, innerHeight: height} = window;
const width = 4;
const height = width * window.innerHeight / window.innerWidth;
export const camera = new OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2, 0.1, viewDistance);
export const renderer = new WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
//export const rayPlane = new Plane();

document.body.appendChild(renderer.domElement);

let handlers = [];
export function onUpdate(handler) {
  handlers.push(handler);
}
let lastTime = 0;
function render(time) {
  requestAnimationFrame(render);
  for (let i = 0; i < handlers.length; i++) {
    handlers[i](time, time - lastTime);
  }
  renderer.render(topScene, camera);
  lastTime = time;
}
requestAnimationFrame(render);

camera.position.set(0, 0, 0);
camera.lookAt(vec3(0, 0, 1));

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleResize);
