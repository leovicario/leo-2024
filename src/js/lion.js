import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );

camera.position.z = 70;  
camera.position.y = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );


// spheres

let sphereGeometry = new THREE.SphereGeometry(2);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xFFF000,
  side: THREE.DoubleSide,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const addSpheres = function () {
  for (let i = 0; i < 10; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(i * 10, i * 0.3, i * 0.3)
    sphere.name = 'sphere' + i;
  }


}

addSpheres ();

// planes + wall

const planeGeometry = new THREE.PlaneGeometry(500,500);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00000,
  side: THREE.DoubleSide})
const wallMaterial = new THREE.MeshBasicMaterial({color: 0x1A1A1A, side: THREE.DoubleSide})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
const wall = new THREE.Mesh(planeGeometry, wallMaterial);

scene.add(plane);
scene.add(wall);


plane.rotation.x = -0.5*Math.PI;
plane.position.set(0,-20,0)
wall.position.set(0,0,-100)

let lionMesh;

const loader = new GLTFLoader(); 
loader.load('/models/lion-2.glb', (gltf) => {


  gltf.scene.traverse(child => {
    if (child.isMesh) {   
      child.name = "lion-serpent";
      lionMesh = child;
    }
  });

  lionMesh.scale.set(10, 10, 10);
  lionMesh.position.z = -20;
  lionMesh.material.wireframe = true;
  lionMesh.material.emissiveIntensity = 10;
  lionMesh.material.emissive.set = 0xFFFFFF;

  console.log(lionMesh);

  scene.add(gltf.scene);

}, undefined, function (error) {
  console.error(error);   
});



const light = new THREE.AmbientLight( 0x404040, 100 ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );



// postprocessing + bloom

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass (
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.6,
    1,
    0.1,
);

composer.addPass(bloomPass);

// bloomPass.strength = 0.5;
// bloomPass.radius = 10;
// bloomPass.threshold = 0.1;

renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1;

const sfear = scene.getObjectByName('sphere1')

// render function

function animate() {
	requestAnimationFrame( animate );
  composer.render();

  controls.update();
  sfear.position.y += 0.01;

	//renderer.render( scene, camera );
}

//renderer.setAnimationLoop(animate);
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / this.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})