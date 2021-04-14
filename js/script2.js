// (function() {
    // Set our main variables
    let scene,  
      renderer,
      container,
      camera,
      model,                              // Our character
      neck,                               // Reference to the neck bone in the skeleton
      waist,  
      Lforearm,
      Rforearm,                             // Reference to the waist bone in the skeleton
      possibleAnims,
      offsetx,                      // Animations found in our file
      mixer,                              // THREE.js animations mixer
      anim1,   
      anim2,  
      anim3, 
      fileAnimations,                         // Idle, the default state our character returns to
      clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
      currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
      raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
      loaderAnim = document.getElementById('js-loader');
    
    // })();

    var dict2 ={
      "cup": 6,
      "spoon": 14,
      "bottle": 100,
      "remote": 2,
    }

    var dict ={
      "cup": "img/Cup.glb",
      "spoon": "img/spoon.glb",
      "bottle": "img/Bottle.glb",
      "remote": "img/remote.glb",
    }
    // const MODEL_PATH , scale; 
    offsetx =( window.innerWidth - 1280 )/2;
    init(); 

    function init() {
    
        // const MODEL_PATH ='img/Spoon.glb';
        const MODEL_PATH =dict[params.char1];
        const scale = dict2[params.char1];
        globalVariable.char1 = params.char1;
        globalVariable.char2 = params.char2;
        globalVariable.char3 = params.char3;

        console.log(scale);
        // Init the scene
        scene = new THREE.Scene();


        //Init Renderer
        renderer = new THREE.WebGLRenderer({ alpha : true});
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(1066, 900);
        renderer.setClearColor( 0x000000, 0 );
        container = document.getElementById('c').appendChild(renderer.domElement);

        // document.body.appendChild(renderer.domElement);

        // Add a camera
        camera = new THREE.PerspectiveCamera(
            80,
            1280/720,
            0.1,
            1000
        );
        camera.position.z = 80
        camera.position.x = 0;
        camera.position.y = -5;


        var loader = new THREE.GLTFLoader();

        loader.load(
        MODEL_PATH,
        function(gltf) {
        // A lot is going to happen here
        model = gltf.scene;
        fileAnimations = gltf.animations;
        // console.log(fileAnimations);

        model.traverse(o => {
            
            if (o.isBone) {
              // console.log(o.name);
            }

            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
              // o.material = stacy_mtl;
            }


            if (o.isBone && o.name === 'mixamorigLeftShoulder') { 
                neck = o;
            }
            if (o.isBone && o.name === 'mixamorigRightShoulder') { 
              waist = o;
          }

        });

          // Set the models initial scale
        // model.scale.set(130, 130, 130);
        model.scale.set(scale,scale,scale);


        model.position.y = -20;
        model.rotation.y = 0.5

        // console.log(model.rotation.y)
        scene.add(model);
        console.log("scene", scene);

        // loaderAnim.remove();

        mixer = new THREE.AnimationMixer(model);

        console.log(fileAnimations);

        if(globalVariable.char1 == "cup"){
        // anim3 = mixer.clipAction(fileAnimations[2]);
        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'sad');
        // console.log(idleAnim.tracks);
        idleAnim.tracks.splice(21, 3);
        idleAnim.tracks.splice(78, 3);
        anim3 = mixer.clipAction(idleAnim);
        anim3.play();

        }
        console.log(anim1)

        },
        undefined, // We don't need this function
        function(error) {
            console.error(error);
        }
        
        );

        // Add lights
        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
        hemiLight.position.set(0, 50, 0);
        // Add hemisphere light to scene
        scene.add(hemiLight);

        let d = 8.25;
        let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
        dirLight.position.set(-8, 12, 8);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 1500;
        dirLight.shadow.camera.left = d * -1;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = d * -1;
        // Add directional Light to scene
        scene.add(dirLight);
    }

    function update() {

        if (mixer) {
            mixer.update(clock.getDelta());
          }
        renderer.render(scene, camera);
        requestAnimationFrame(update);

        var tag = document.getElementById('c');
        tag.style.top = (globalVariable.y1+300) + 'px';
        tag.style.left = globalVariable.x1 + offsetx + 'px';
        // console.log(globalVariable.dist1);
  // const old_min = -350 , old_max = -75 , new_max = 2100 , new_min = 800;
        camera.position.z = ( (-1* globalVariable.z1 - -150) / (-15-  -150) ) * (80 - 30) + 30

        if(neck && waist){
          // moveJoint2(globalVariable.x1, globalVariable.y1 , neck);
          checkJoint(globalVariable.y1- globalVariable.r16y, 1,waist);
          checkJoint(globalVariable.y1- globalVariable.r8y , -1 ,neck);
          // console.log(neck.rotation.x);
          

        }
        if(globalVariable.r12y >= globalVariable.r9y && globalVariable.r20y >= globalVariable.r9y && globalVariable.r9y>=0){
            // console.log(true)
            // model.rotation.y += 0.005;
            
            model.rotation.y += 0.05
        }
        if(globalVariable.anim1bool)
        {
          console.log("scream: ", anim1);
        anim1 = mixer.clipAction(fileAnimations[0]);


        if(globalVariable.char1 == "cup"){
          anim3.enabled = false;
          playModifierAnimation(anim3, 0.25, anim1, 0.25);
  
          }
          else{
            anim1.setLoop(THREE.LoopOnce);
            anim1.reset();
            anim1.play();
          }


          globalVariable.anim1bool = false;
        }
        if(globalVariable.anim2bool)
        {
          anim2 = mixer.clipAction(fileAnimations[1]);

          if(globalVariable.char1 == "cup"){
            anim3.enabled = false;
            playModifierAnimation(anim3, 0.25, anim2, 0.25);
    
          }
          else{
            anim2.setLoop(THREE.LoopOnce);
            anim2.reset();
            anim2.play();
          }
          globalVariable.anim2bool = false;
        }

        // if(globalVariable.change)
        // {
        //   change_char();
        //   globalVariable.change = false;
        // }
      }
      update();

// deadpool
var temp;
var i = 0 , csize = 5 ;

var arr =new Array(csize) ;

function smooth(arr){
  var sum = 0;
  for(var j = 0 ; j < csize ; j++){
    sum+= arr[j];
  }
  return sum / csize ;
}
      function checkJoint(y, sign, joint){
          // const old_min = -350 , old_max = -75 , new_max = 2100 , new_min = -1.5;
          // joint.rotation.x=( (y - globalVariable.dist2*2) / (globalVariable.dist2*2 -  0) ) * (1.7 - (-1.5)) + (-1.5)

        temp =  ( (y - globalVariable.dist1*2) / (globalVariable.dist1*2 -  0) ) * (1.7 - (-1.5)) + (-1.5)
        // temp =  ( (y -globalVariable.dist1y*2) / (globalVariable.dist1y*2 -  0) ) * (1.7 - (-1.7)) + (-1.7)
        if (temp < -1.7)
          temp = -1.7;
        if (temp >1.7)
        temp = 1.7;
        // else if (temp < -1.5)

        joint.rotation.x = -1* temp.toFixed(4);
        joint.rotation.z = sign * 0.9;
        joint.rotation.y = -1 * sign * 0.3;

      }

    

    function playOnClick() {
        // let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
        playModifierAnimation(idle, 0.25, cheer, 0.25);
      }

      function playModifierAnimation(from, fSpeed, to, tSpeed) {
        to.setLoop(THREE.LoopOnce);
        to.reset();
        to.play();
        from.crossFadeTo(to, fSpeed, true);
        setTimeout(function() {
          from.enabled = true;
          to.crossFadeTo(from, tSpeed, true);
          currentlyAnimating = false;
        }, to._clip.duration * 1000 - ((tSpeed + fSpeed) * 1000));
      }

// function change_char(){
//   scene.remove(model);
//   var temp = globalVariable.char1 ;
//   globalVariable.char1 = globalVariable.char3 ;
//   globalVariable.char3 = temp;
//   const MODEL_PATH =dict[globalVariable.char1];
//   const scale = dict2[globalVariable.char1];

//   var loader = new THREE.GLTFLoader();

//   loader.load(
//   MODEL_PATH,
//   function(gltf) {
//   // A lot is going to happen here
//   model = gltf.scene;
//   let fileAnimations = gltf.animations;
//   // console.log(fileAnimations);

//   model.traverse(o => {
      
//       if (o.isBone) {
//         // console.log(o.name);
//       }

//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//         // o.material = stacy_mtl;
//       }


//       if (o.isBone && o.name === 'mixamorigLeftShoulder') { 
//           neck = o;
//       }
//       if (o.isBone && o.name === 'mixamorigRightShoulder') { 
//         waist = o;
//     }

//   });

//     // Set the models initial scale
//   // model.scale.set(130, 130, 130);
//   model.scale.set(scale,scale,scale);


//   model.position.y = -11;
//   model.rotation.y = 0.5

//   // console.log(model.rotation.y)
//   scene.add(model);
//   console.log("scene", scene);

//   // loaderAnim.remove();

//   mixer = new THREE.AnimationMixer(model);

//   console.log(fileAnimations);
//   if(globalVariable.char1 == "cup"){
//     // anim3 = mixer.clipAction(fileAnimations[2]);
//     let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'sad');
//     // console.log(idleAnim.tracks);
//     idleAnim.tracks.splice(21, 3);
//     // idleAnim.tracks.splice(24, 3);
//     // idleAnim.tracks.splice(24, 3);
//     // idleAnim.tracks.splice(78, 3);
//     idleAnim.tracks.splice(78, 3);
//     anim3 = mixer.clipAction(idleAnim);
//     anim3.play();

//     }

//   },
//   undefined, // We don't need this function
//   function(error) {
//       console.error(error);
//   }
  
//   );


// }