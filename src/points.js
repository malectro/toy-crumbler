import {Scene, Geometry, PointsMaterial, LineBasicMaterial, Line} from 'three';
import random from 'lodash/random';
import {vec2, vec3} from 'src/vector';
import {topScene} from 'src/renderer';


const vertices = 1000;
const worldWidth = 1000;

const halfWidth = worldWidth / 2;


function randomPoint() {
  return random(-halfWidth, halfWidth, true);
}

export const pointScene = new Scene();
topScene.add(pointScene);

export const pointsGeometryStatic = new Geometry();
for (let i = 0; i < vertices; i++) {
  pointsGeometryStatic.vertices.push(vec3(randomPoint(), randomPoint(), randomPoint()));
}

const pointsMaterial = new PointsMaterial({
  color: 0xffffff,
  size: 2.0,
  sizeAttenuation: true,
});

const lineMaterial = new LineBasicMaterial({
  color: 0xffffff,
});

export const lines = new Set();

export function createPoints() {
  const pointsGeometry = pointsGeometryStatic.clone();
  pointsGeometry.vertices.forEach(vertex => vertex.multiplyScalar(0.001));
  return pointsGeometry;
}

export function createLine() {
  const points = createPoints();
  const line = new Line(points, lineMaterial);
  pointScene.add(line);
  const blip = {
    object: line,
    geometry: points,
  };
  //lines.add(blip);
  return blip;
}

export function removeLine(blip) {
  pointScene.remove(blip.object);
  console.log('removing line', pointScene.children.length);
  //lines.remove(blip);
}

