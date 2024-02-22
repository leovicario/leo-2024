import * as dat from 'dat.gui';

// add gui helper

const gui = new dat.GUI();

const options = {
  lightColor: '#C00E28',
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

gui.addColor(options, 'lightColor').onChange(function(e){
  directionalLight.color.set(e);
})

gui.add(options, 'wireframe').onChange(function(e){
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