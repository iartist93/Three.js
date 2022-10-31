import './style.css';
import * as THREE from 'three';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

//----------------------------------
// Object
//----------------------------------

// const mesh = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

scene.add(mesh);

//----------------------------------
// Camera
//----------------------------------

let fov = 75;
const zoomAmount = 10;
const aspectRation = sizes.width / sizes.height;
const frustumSize = 1;

let camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height);

camera = new THREE.OrthographicCamera(
  -frustumSize * aspectRation,
  frustumSize * aspectRation,
  frustumSize,
  -frustumSize,
  0.1,
  100
);

camera.zoom = 1;
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 4;
camera.lookAt(mesh.position);
scene.add(camera);

//----------------------------------
// Renderer
//----------------------------------

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

//----------------------------------
// event listeners
//----------------------------------

const zoomInButton = document.querySelector('button.zoomIn');
const zoomOutButton = document.querySelector('button.zoomOut');

zoomInButton.addEventListener('click', (e) => {
  console.log('ZoomIn +');
  e.stopPropagation();
  fov -= zoomAmount;
  camera.zoom += 0.1;
});

zoomOutButton.addEventListener('click', (e) => {
  e.stopPropagation();
  fov += zoomAmount;

  camera.zoom -= 0.1;
});

canvas.addEventListener('keydown', (e) => {
  console.log('========> event ', e.key, e.code);
  if (e.key === '=') {
    fov -= zoomAmount;
    camera.zoom += 0.1;
  } else if (e.key === '-') {
    fov += zoomAmount;
    camera.zoom -= 0.1;
  }
});

const onMouseMove = (e) => {
  const mouseRange = clipCoord(event.clientX, sizes.width) / screen.width + 0.5; // [0.5 .. 1]
  fov = mouseRange * 75;
  camera.zoom = mouseRange;
};

const onMouseDown = (e) => {};

canvas.addEventListener('mousedown', (event) => {
  onMouseDown(event);
  canvas.addEventListener('mousemove', onMouseMove);
});

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', onMouseMove);
});

function clipCoord(val, max) {
  return Math.min(Math.max(0, val), max);
}

//----------------------------------
// tick - update
//----------------------------------

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.rotation.y = elapsedTime;

  camera.fov = fov;
  camera.updateProjectionMatrix();

  console.log('FOV : ', fov, 'Camera.fov: ', camera.fov);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
