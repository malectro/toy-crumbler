import forEach from 'lodash/forEach';
import {vec3} from 'src/vector';
import {initMobileAudio} from 'src/audio';
import {attackSpeed, changeSpeed, releaseSpeed, attackCrumble, changeCrumble, releaseCrumble} from 'src/crumble';


export function init({camera, scene}) {
  let dir = camera.getWorldDirection();
  let sideDir = vec3(dir.z, 0, dir.x);

  window.addEventListener('wheel', event => {
    event.preventDefault();

    return;

    dir = camera.getWorldDirection(dir);
    sideDir.set(dir.z, 0, dir.x);

    if (event.shiftKey) {
      /*
      terrainMesh.position.x += event.deltaX * 0.1;
      terrainMesh.position.z += event.deltaY * 0.1;
      */
      scene.position.y += event.deltaY * 0.1;
    } else if (event.altKey) {
      //camera.rotation.x -= event.deltaY * 0.01;
      camera.rotation.y += event.deltaX * 0.01;
    } else {
      /*
      scene.rotation.x += event.deltaY * 0.01;
      scene.rotation.y += event.deltaX * 0.01;
      */
      scene.position.addScaledVector(dir, event.deltaY);
      //scene.position.addScaledVector(sideDir, event.deltaX);
      /*
      terrainMesh.position.x += event.deltaX * 0.1;
      terrainMesh.position.y += event.deltaY * 0.1;
      */
    }
  });

  /*
  let mouseStart;
  function handleMouseDown(event) {
    event.preventDefault();
    mouseStart = event;
    //attackCrumble(event);
    attackSpeed(event);
  }

  function handleMouseMove(event) {
    event.preventDefault();
    if (mouseStart) {
      //changeCrumble(event);
      changeSpeed(event);
      //rotate(mouseStart, event);
    }
  }

  function handleMouseUp(event) {
    event.preventDefault();
    mouseStart = null;
    releaseSpeed(event);
    //releaseCrumble(event);
  }
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  */

  const activePointers = new Set();
  function handleTouchStart(event) {
    event.preventDefault();

    initMobileAudio();

    activePointers.add(event.pointerId);
    attackSpeed(event);
  }

  function handleTouchMove(event) {
    event.preventDefault();
    if (activePointers.has(event.pointerId)) {
      changeSpeed(event);
    }
  }

  function handleTouchEnd(event) {
    event.preventDefault();

    if (activePointers.has(event.pointerId)) {
      activePointers.delete(event.pointerId);
      releaseSpeed(event);
    }
  }

  window.addEventListener('pointerdown', handleTouchStart, {capture: true});
  window.addEventListener('pointermove', handleTouchMove, {capture: true});
  window.addEventListener('pointerup', handleTouchEnd, {capture: true});
  window.addEventListener('pointerleave', handleTouchEnd, {capture: true});
  window.addEventListener('pointercancel', handleTouchEnd, {capture: true});


  function rotate(start, current) {
    scene.rotation.y = (current.pageX - start.pageX) * 0.01;
    scene.rotation.x = (current.pageY - start.pageY) * 0.01;
  }
}
