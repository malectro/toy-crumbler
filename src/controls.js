import forEach from 'lodash/forEach';
import {vec3} from 'src/vector';
import {attackCrumble, changeCrumble, releaseCrumble} from 'src/crumble';


export function init({camera, scene}) {
  let dir = camera.getWorldDirection();
  let sideDir = vec3(dir.z, 0, dir.x);

  window.addEventListener('wheel', event => {
    event.preventDefault();

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


  let mouseStart;
  function handleMouseDown(event) {
    event.preventDefault();
    mouseStart = event;
    attackCrumble(event);
  }

  function handleMouseMove(event) {
    event.preventDefault();
    if (mouseStart) {
      changeCrumble(event);
      //rotate(mouseStart, event);
    }
  }

  function handleMouseUp(event) {
    event.preventDefault();
    mouseStart = null;
    releaseCrumble(event);
  }
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);


  const touches = {};
  let touchCount = 0;
  function handleTouchStart(event) {
    event.preventDefault();

    forEach(event.changedTouches, touch => {
      touches[touch.identifier] = {
        pageX: touch.pageX,
        pageY: touch.pageY,
      };
      touchCount++;
      console.log('start', touchCount);
      console.log('hi', touch.force, touch.identifier);

      attackCrumble(touch);
    });
  }

  function handleTouchMove(event) {
    event.preventDefault();
    forEach(event.changedTouches, touch => {
      changeCrumble(touch);
      //rotate(touches[touch.identifier], touch);
      console.log('move', touch.force, touch.identifier);
    });
  }

  function handleTouchEnd(event) {
    event.preventDefault();
    forEach(event.changedTouches, touch => {
      delete touches[touch.identifier];
      touchCount--;
      releaseCrumble(touch);
    });
  }
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('touchcancel', handleTouchEnd);


  function rotate(start, current) {
    scene.rotation.y = (current.pageX - start.pageX) * 0.01;
    scene.rotation.x = (current.pageY - start.pageY) * 0.01;
  }
}

