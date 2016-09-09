import 'src/index.css';
import random from 'lodash/random';
import {Scene, Geometry, PointsMaterial, LineBasicMaterial, AmbientLight, DirectionalLight, Mesh, Points, Line, Fog} from 'three';

import {topScene, camera, renderer} from 'src/renderer';
import * as controls from 'src/controls';
import {vec2, vec3} from 'src/vector';
import {load as loadAtlas} from 'src/atlas-texture';


const fogColor = 0x000000;
const lightColor = 0xFFC361;
const worldWidth = 1000;
const vertices = 1000;

const halfWidth = worldWidth / 2;


renderer.setClearColor(fogColor);

const light = new DirectionalLight(lightColor, 0.5);
light.position.set(-1, 1, 0);
topScene.add(light);

const light2 = new AmbientLight(lightColor, 0.5);
topScene.add(light2);


function randomPoint() {
  return random(-halfWidth, halfWidth, true);
}
const pointScene = new Scene();
topScene.add(pointScene);

const pointsGeometry = new Geometry();
for (let i = 0; i < vertices; i++) {
  pointsGeometry.vertices.push(vec3(randomPoint(), randomPoint(), randomPoint()));
}

const pointsMaterial = new PointsMaterial({
  color: 0xffffff,
  size: 2.0,
  sizeAttenuation: true,
});

const points = new Points(pointsGeometry, pointsMaterial);
pointScene.add(points);

const lineMaterial = new LineBasicMaterial({
  color: 0xffffff,
});
const line = new Line(pointsGeometry, lineMaterial);
pointScene.add(line);


controls.init({camera, scene: pointScene});

