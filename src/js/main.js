import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );


camera.position.z = -100;  
camera.position.y = 30;
camera.position.x = -50;



const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color( 0x2C2C2C);

// const controls = new OrbitControls( camera, renderer.domElement );

// spheres

// let sphereGeometry = new THREE.SphereGeometry(2);
// const sphereMaterial = new THREE.MeshBasicMaterial({
//   color: 0xC00E28,
//   side: THREE.DoubleSide,
// })
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);


// const addSpheres = function () {
//   for (let i = 0; i < 10; i++) {
//     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//     scene.add(sphere);
//     sphere.position.set(i * 10, i * 0.3, i * 0.3)
//     sphere.name = 'sphere' + i;
//   }


// }

// addSpheres ();

// scene.add(sphere)

let lionMesh;

const loader = new GLTFLoader(); 
loader.load('/models/lion-2.glb', (gltf) => {


  gltf.scene.traverse(child => {
    if (child.isMesh) {   
      child.name = "lion-serpent";
      lionMesh = child;
    }
  });

  console.log(lionMesh);
    gltf.scene.scale.setScalar( 2 );
    gltf.scene.rotation.set(0,6,0)
    gltf.scene.position.set(30,0,0)


  lionMesh.scale.set(10, 10, 10);
  lionMesh.position.z = -30;
  lionMesh.material.wireframe = false;
  lionMesh.material.emissiveIntensity = 10;
  lionMesh.material.emissive.set = 0xFFFFFF;
  
  camera.lookAt( lionMesh.position );
  console.log(lionMesh.position)

  scene.add(gltf.scene);

    // animation

    let tl = gsap.timeline({
      scrollTrigger: {
          trigger:'main',
          start: 'top',
          end: 'center',
          scrub: true,
          markers: false,       
      }
    })
    
    gsap.to(lionMesh.rotation, { z: 360, duration: 10000, ease: "ease" });
 
    
    tl.fromTo(lionMesh.position,  {
      z: -30,
      y: 0,
      x: 0,
    }, {
      z: -30,
      y: 30,
      x: 0,
    }, )

    tl.fromTo(lionMesh.rotation, {
    }, {
      
      z: -10,
      y: 0,
      x: 0,

    }, )



}, undefined, function (error) {
  console.error(error);   
});



const light = new THREE.AmbientLight( 0xffffff, 0 ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xff2945,13);
scene.add( directionalLight );

directionalLight.position.set(-500,-500,550)

const directionalLightCross = new THREE.DirectionalLight( 0x2cbae8,5);
scene.add( directionalLightCross );

directionalLightCross.position.set(500,500,-550)

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
renderer.toneMappingExposure = 0.05;


// render function

function animate() {
	requestAnimationFrame( animate );
  composer.render();

  // controls.update();

  // resizing 
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  })
  
  // lionMesh.rotation.z += 0.0003;
  
	//renderer.render( scene, camera );
}

//renderer.setAnimationLoop(animate);
animate();

