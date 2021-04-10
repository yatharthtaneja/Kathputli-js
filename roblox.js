
let build;

const scene = new THREE.Scene();
const loader = new THREE.GLTFLoader();
let container;
loader.load( 'img/sports.glb', function ( gltf ) {
     build = gltf.scene.children[0];
    build.scale.set(2,2,2);

	scene.add( gltf.scene ); // loading and adding the model to the scene

}, undefined, function ( error ) {

	console.error( error );

} );
const camera = new THREE.PerspectiveCamera(400, 2, 0.1, 10000); // creating a perspective camera
camera.position.set(500,200,1200);
// camera.zoom = 0.1;
const renderer = new THREE.WebGLRenderer({alpha: true}); //creating a renderer with alpha value true
// const renderer = new THREE.WebGLRenderer(); //creating a renderer with alpha value true

renderer.setSize(800, 400);
renderer.setClearColor( 0x000000, 0 ); // so that i can have a transparent background 
container = document.getElementById('c').appendChild(renderer.domElement);
// putting the enderer inside the div
var controls = new THREE.OrbitControls(camera , renderer.domElement);
controls.addEventListener('change', renderer); // creaating a controller so that we can control the model
// controls.enableZoom=false; //disabling the zoom motion so that we can scroll the page

const frontSpot = new THREE.SpotLight(0xeeeece);
frontSpot.position.set(1000, 1000, 1000);
scene.add(frontSpot);
// adding lots of lights by experimenting 
const frontSpot2 = new THREE.SpotLight(0xddddce);
frontSpot2.position.set(-500, -500, -500);
scene.add(frontSpot2);
const hlight = new THREE.AmbientLight (0x3d3d3d,7);
    scene.add(hlight);
  const  directionalLight = new THREE.DirectionalLight(0x3d3d3d,10);
    directionalLight.position.set(0.5,0.5,0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
   const  light = new THREE.PointLight(0x3d3d3d,10);
    light.position.set(0,1,1);
    scene.add(light);
// binding keys to controll the model 
    document.addEventListener('keydown', function(e) {
      switch (e.keyCode) {
          case 65:
               camera.position.z+=10
              break;
          case 87:
            build.rotation.x += 0.05;

              break;
          case 68:

               build.rotation.y += 0.05;
              break;
          case 83:
              build.rotation.x -= 0.05;
              break;
      }
  }); 
const animate = function () {
  requestAnimationFrame(animate);
//function the render the scene ... 
  renderer.render(scene, camera);
  var tag = document.getElementById('c');
  tag.style.top = globalVariable.y1 + 'px';
  tag.style.left = globalVariable.x1 + 'px';

    // const old_value = -1* globalVariable.z1;
    // const old_min = -350 , old_max = -75 , new_max = 2100 , new_min = 800;
    camera.position.z = ( (-1* globalVariable.z1 - -350) / (-75-  -350) ) * (3000 - 400) + 400
  console.log("hello " + globalVariable.dist1);
  // console.log("z " +-1* globalVariable.z1);
  // camera.position.z = new_value;
};


animate();

