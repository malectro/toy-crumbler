import {Scene, PerspectiveCamera, WebGLRenderer} from 'three';
import {vec2, vec3} from 'src/vector';


const viewDistance = 1000;


export const topScene = new Scene();
export const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, viewDistance);
export const renderer = new WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function render() {
  requestAnimationFrame(render);
  renderer.render(topScene, camera);
}
render();

camera.position.set(0, 0, 0);
camera.lookAt(vec3(0, 0, 1));

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleResize);

