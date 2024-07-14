import 'src/index.css';
import {Scene, BoxGeometry, AmbientLight, DirectionalLight, Mesh, MeshStandardMaterial} from 'three';
import {vec2, vec3} from 'src/vector';

import {topScene, camera, renderer, onUpdate} from 'src/renderer';
import * as controls from 'src/controls';
import {play, oscGain, lowPass, lowPassMod} from 'src/audio';
import {lfo} from 'src/crumble';


const fogColor = 0x000000;
const lightColor = 0xFFC361;


renderer.setClearColor(fogColor);

const light = new DirectionalLight(lightColor, 0.5);
light.position.set(-1, 1, 1);
topScene.add(light);

const light2 = new AmbientLight(lightColor, 0.5);
topScene.add(light2);

const boxScene = new Scene();
boxScene.position.z = 2;
topScene.add(boxScene);

const boxGeom = new BoxGeometry(1, 1, 1);
const boxMaterial = new MeshStandardMaterial({

});
const boxMesh = new Mesh(boxGeom, boxMaterial);
boxMesh.rotation.set(Math.PI / 4, Math.PI / 4, 0);
boxScene.add(boxMesh);

controls.init({camera, scene: boxScene});

onUpdate((time, delta) => {
  boxScene.rotation.y += lfo.frequency.value * Math.PI * 2 * delta * 0.001;
});


/*
window.addEventListener('click', () => {
  play();
});
*/

window.box = boxMesh;
window.camera = camera;
//window.scene = pointScene;
