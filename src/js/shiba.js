import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as dat from 'dat.gui';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );

camera.position.z = 100;  
camera.position.y = 60;
camera.position.x = 95;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

// spheres

let sphereGeometry = new THREE.SphereGeometry(2);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xC00E28,
  side: THREE.DoubleSide,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);


// const addSpheres = function () {
//   for (let i = 0; i < 10; i++) {
//     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//     scene.add(sphere);
//     sphere.position.set(i * 10, i * 0.3, i * 0.3)
//     sphere.name = 'sphere' + i;
//   }


// }

// addSpheres ();

scene.add(sphere)

// planes + wall

const planeGeometry = new THREE.PlaneGeometry(500,500);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x2b0000,
  side: THREE.DoubleSide})
const wallMaterial = new THREE.MeshBasicMaterial({color: 0x2b0000, side: THREE.DoubleSide})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const wall = new THREE.Mesh(planeGeometry, wallMaterial);

scene.add(plane);
scene.add(wall);


plane.rotation.x = -0.5*Math.PI;
plane.position.set(0,-20,0)
wall.position.set(0,0,-100)

let lionMesh;

const loader = new GLTFLoader(); 
loader.load('/models/shiba.glb', (gltf) => {


  gltf.scene.traverse(child => {
    if (child.isMesh) {   
      child.name = "lion-serpent";
      lionMesh = gltf.scene;
    }
  });

    gltf.scene.scale.setScalar( 50 );
    gltf.scene.rotation.set(0,0,0)
    gltf.scene.position.set(0,30,0)


  // lionMesh.scale.set(100, 100, 100);
  // lionMesh.position.z = 0;
  // lionMesh.material.wireframe = false;
  // lionMesh.material.emissiveIntensity = 10;
  // lionMesh.material.emissive.set = 0xFFFFFF;


  scene.add(gltf.scene);

}, undefined, function (error) {
  console.error(error);   
});



const light = new THREE.AmbientLight( 0xfff, 0 ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0 );
scene.add( directionalLight );

directionalLight.position.set(60,0,11)

// postprocessing + bloom

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass (
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1,
    1,
    0.1,
);

composer.addPass(bloomPass);

// bloomPass.strength = 0.5;
// bloomPass.radius = 10;
// bloomPass.threshold = 0.1;

renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1;


// add gui helper
const gui = new dat.GUI();

const options = {
  sphereColor: '#C00E28',
  wireframe: false,
  x: 0,
  bloomIntensity: 1,
  positionX: directionalLight.position.x,
  positionY: directionalLight.position.y,
  positionZ: directionalLight.position.z,
  cameraX: camera.position.x,
  cameraY: camera.position.y,
  cameraZ: camera.position.z,
}

gui.addColor(options, 'sphereColor').onChange(function(e){
  sphere.material.color.set(e);
  wall.material.color.set(e);
  plane.material.color.set(e);
})

gui.add(options, 'wireframe').onChange(function(e){
  sphere.material.wireframe = e;
  lionMesh.material.wireframe = e;
})

gui.add(options, 'x', 0, 50).onChange(function(e){
  sphere.position.x = e;
})

gui.add(options, 'positionX', -500,500).onChange(function(e){
  directionalLight.position.x = e;
})

gui.add(options, 'positionY', -500,500).onChange(function(e){
  directionalLight.position.y = e;
})

gui.add(options, 'positionZ', -500,500).onChange(function(e){
  directionalLight.position.z = e;
})

gui.add(options, 'cameraX', -500,500).onChange(function(e){
  camera.position.x = e;
})

gui.add(options, 'cameraY', -500,500).onChange(function(e){
  camera.position.y = e;
})

gui.add(options, 'cameraZ', -500,500).onChange(function(e){
  camera.position.z = e;
})

gui.add(options, 'bloomIntensity', 0,5).onChange(function(e){
  bloomPass.strength = e;
})






// render function

function animate() {
	requestAnimationFrame( animate );
  composer.render();

  lionMesh.rotation.y += 0.001;
  controls.update();
  

	//renderer.render( scene, camera );
}

//renderer.setAnimationLoop(animate);
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})