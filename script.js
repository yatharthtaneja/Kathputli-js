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
      possibleAnims,                      // Animations found in our file
      mixer,                              // THREE.js animations mixer
      idle,   
      cheer,                            // Idle, the default state our character returns to
      clock = new THREE.Clock(),          // Used for anims, which run to a clock instead of frame rate 
      currentlyAnimating = false,         // Used to check whether characters neck is being used in another anim
      raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
      loaderAnim = document.getElementById('js-loader');
    
    // })();

    

    init(); 

    function init() {
    
        // const MODEL_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb';
        const MODEL_PATH ='img/remote.glb';
        // const canvas = document.querySelector('#c2');
        // const backgroundColor = 0xf1f1f1;
        
        // Init the scene
        scene = new THREE.Scene();
        // scene.background = new THREE.Color(backgroundColor);
        // scene.fog = new THREE.Fog(backgroundColor, 60, 100);

        //Init Renderer
        renderer = new THREE.WebGLRenderer({ alpha : true});
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(1066, 600);
        renderer.setClearColor( 0x000000, 0 );
        container = document.getElementById('wrapper').appendChild(renderer.domElement);

        // document.body.appendChild(renderer.domElement);

        // Add a camera
        camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 30 
        camera.position.x = 0;
        camera.position.y = -3;


        var loader = new THREE.GLTFLoader();

        loader.load(
        MODEL_PATH,
        function(gltf) {
        // A lot is going to happen here
        model = gltf.scene;
        let fileAnimations = gltf.animations;
        console.log(fileAnimations);

        model.traverse(o => {
            
            if (o.isBone) {
              console.log(o.name);
            }

            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
              // o.material = stacy_mtl;
            }
          
            // Reference the neck and waist bones
          //   if (o.isBone && o.name === 'mixamorigLeftArm') { 
          //       neck = o;
          //   }
          //   if (o.isBone && o.name === 'mixamorigRightArm') { 
          //     // console.log("ess");
          //       waist = o;
          //   }

          //   if (o.isBone && o.name === 'mixamorigLeftForeArm') { 
          //     Lforearm = o;
          // }
          // if (o.isBone && o.name === 'mixamorigRightForeArm') { 
          //   // console.log("ess");
          //     Rforearm = o;
          // }
            if (o.isBone && o.name === 'mixamorigLeftShoulder') { 
                neck = o;
            }

        });

          // Set the models initial scale
        model.scale.set(120, 120, 120);

        model.position.y = -11;
    
        scene.add(model);

        // loaderAnim.remove();

        mixer = new THREE.AnimationMixer(model);

        // let clips = fileAnimations.filter(val => val.name !== 'idle');
        // possibleAnims = clips.map(val => {
        //     let clip = THREE.AnimationClip.findByName(clips, val.name);
        //     // clip.tracks.splice(6, 3);
        //     // clip.tracks.splice(78, 3);
        //     clip = mixer.clipAction(clip);
        //     return clip;
        //    }
        //   );
        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');
        console.log(idleAnim.tracks);
        idleAnim.tracks.splice(21, 3);
        // idleAnim.tracks.splice(24, 3);
        // idleAnim.tracks.splice(24, 3);
        // idleAnim.tracks.splice(78, 3);
        // idleAnim.tracks.splice(78, 3);
        idle = mixer.clipAction(idleAnim);
        idle.play();

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

        var tag = document.getElementById('wrapper');
        tag.style.top = (globalVariable.y2+100) + 'px';
        tag.style.left = globalVariable.x2 + 'px';
        // var mousecoords = getMousePos(globalVariable.x1,globalVariable.y1);
          // console.log(globalVariable.l20x,globalVariable.l20y);

        if (neck && waist && Rforearm && Lforearm ) {
            // moveJoint(globalVariable.x2- globalVariable.l8x, globalVariable.y2 - globalVariable.l8y, waist, 50);
            // moveJoint(globalVariable.x2 - globalVariable.l20x,globalVariable.y2- globalVariable.l20y, neck, 50);
            // moveJoint(globalVariable.x2- globalVariable.l8x, globalVariable.y2 - globalVariable.l8y, Rforearm, 50);
            // moveJoint(globalVariable.x2 - globalVariable.l20x,globalVariable.y2- globalVariable.l20y, Lforearm, 50);
            // moveJoint2(globalVariable.x1, globalVariable.y1 , Rforearm);
            // moveJoint2(globalVariable.x1, globalVariable.y1 , Lforearm);
            // console.log(Rforearm.position.x , Lforearm.position.x);
            moveJoint2(globalVariable.x1, globalVariable.y1 , neck);


        }
        if(neck){
          moveJoint2(globalVariable.x1, globalVariable.y1 , neck);

        }
        // if (!currentlyAnimating  && globalVariable.z2> 200) {
        //   currentlyAnimating = true;
        //   playOnClick();
          // && globalVariable.z1> 200
      // }

      }
      update();

// deadpool

      
      function getMousePos(x1,y1) {
        return { x: x1, y: y1 };
      }

      function getMousePoscoord(e) {
        console.log(e.clientX, e.clientY );
      }
      
      function moveJoint(x,y, joint, degreeLimit) {

        let degrees = getMouseDegrees(x, y, degreeLimit);

        joint.rotation.y = THREE.Math.degToRad(degrees.y);
        joint.rotation.x = THREE.Math.degToRad(degrees.x);
      }

      function moveJoint2(x,y, joint) {


        // joint.lookAt(x,y,100);
        // joint.lookAt(x,y,100);

        // const v = new THREE.Vector3(0,1,1);
        // console.log((globalVariable.y2 - globalVariable.l8y )/ 720 * 360 );
        console.log(joint.rotation.x ,joint.rotation.z );
        // joint.rotateY(THREE.Math.degToRad((globalVariable.y2 - globalVariable.l8y )/ 720 * 360 ));
        joint.rotateY(THREE.Math.degToRad(Math.PI / 2) );
        
        // isko koi nahi chedhega
        // joint.rotation.z = -1.7;
        // joint.rotation.x = 1.7;
        // joint.rotation.y = 0.3;

                joint.rotation.z = -1.7;
        joint.rotation.x = 1.8;
        joint.rotation.y = 0.3;

        
      }


      function getMouseDegrees(x, y, degreeLimit) {
        let dx = 0,
            dy = 0,
            xdiff,
            xPercentage,
            ydiff,
            yPercentage;
      
        // let w = { x: window.innerWidth, y: window.innerHeight };
        // let w = { x: 1280, y:720 };

        let w = { x: globalVariable.dist2 +50, y: 2*globalVariable.dist2y +50 };

      
        // Left (Rotates neck left between 0 and -degreeLimit)
        
         // 1. If cursor is in the left half of screen
        if (x <= w.x / 2) {
          // 2. Get the difference between middle of screen and cursor position
          xdiff = w.x / 2 - x;  
          // 3. Find the percentage of that difference (percentage toward edge of screen)
          xPercentage = (xdiff / (w.x / 2)) * 100;
          // 4. Convert that to a percentage of the maximum rotation we allow for the neck
          dx = ((degreeLimit * xPercentage) / 100) * -1; }
      // Right (Rotates neck right between 0 and degreeLimit)
        if (x >= w.x / 2) {
          xdiff = x - w.x / 2;
          xPercentage = (xdiff / (w.x / 2)) * 100;
          dx = (degreeLimit * xPercentage) / 100;
        }
        // Up (Rotates neck up between 0 and -degreeLimit)
        if (y <= w.y / 2) {
          ydiff = w.y / 2 - y;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          // Note that I cut degreeLimit in half when she looks up
          dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
          }
        
        // Down (Rotates neck down between 0 and degreeLimit)
        if (y >= w.y / 2) {
          ydiff = y - w.y / 2;
          yPercentage = (ydiff / (w.y / 2)) * 100;
          dy = (degreeLimit * yPercentage) / 100;
        }
        return { x: dx, y: dy };
      }


    function playOnClick() {
        let anim = Math.floor(Math.random() * possibleAnims.length) + 0;
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