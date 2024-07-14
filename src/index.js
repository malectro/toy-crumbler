import 'src/index.css';
import {Scene, Geometry, PointsMaterial, LineBasicMaterial, AmbientLight, DirectionalLight, Mesh, Points, Line, Fog} from 'three';

import {topScene, camera, renderer, onUpdate} from 'src/renderer';
import {pointScene} from 'src/points';
import * as controls from 'src/controls';
import {vec2, vec3} from 'src/vector';
import {play, oscGain, lowPass, lowPassMod} from 'src/audio';


const fogColor = 0x000000;
const lightColor = 0xFFC361;


renderer.setClearColor(fogColor);

const light = new DirectionalLight(lightColor, 0.5);
light.position.set(-1, 1, 0);
topScene.add(light);

const light2 = new AmbientLight(lightColor, 0.5);
topScene.add(light2);

pointScene.position.setZ(1000);

controls.init({camera, scene: pointScene});


/*
window.addEventListener('click', () => {
  play();
});
*/

window.camera = camera;
window.scene = pointScene;

for (const name of [
  'touchstart', 'touchmove', 'touchend', 'touchforcechange',
]) {
  window.addEventListener(name, (event) => {
    event.preventDefault();
  });
}
