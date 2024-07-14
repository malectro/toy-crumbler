import forEach from 'lodash/forEach';
import {vec3} from 'src/vector';
import {initMobileAudio, context as audioContext} from 'src/audio';
import {attackSpeed, changeSpeed, releaseSpeed, attackCrumble, changeCrumble, releaseCrumble} from 'src/crumble';


export function init({camera, scene}) {
  let dir = camera.getWorldDirection();
  let sideDir = vec3(dir.z, 0, dir.x);

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

  function touchStart(event) {
    console.log('touch start');

    //initMobileAudio();

    activePointers.add(event.pointerId);
    attackSpeed(event);
  }

  const activePointers = new Set();
  let working = false;
  function handleTouchStart(event) {
    event.preventDefault();
    console.log('yo');

    if (!working) {
      working = true;
    audioContext.resume().then(() => {
        console.log('resumed');
      working = true;
      touchStart(event);
    }, (error) => {
      console.error(error);
    });

      return;
    }

    touchStart(event);
  }

  function handleTouchMove(event) {
    if (activePointers.has(event.pointerId)) {
      event.preventDefault();
      console.log('touch move');
      changeSpeed(event);
    }
  }

  function handleTouchEnd(event) {
    if (activePointers.has(event.pointerId)) {
      event.preventDefault();
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
