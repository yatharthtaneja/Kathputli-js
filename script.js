// (function() {
    // Set our main variables
    let scene,  
      renderer,
      container,
      camera,
      model,                              // Our character
      neck,                               // Reference to the neck bone in the skeleton
      waist,                               // Reference to the waist bone in the skeleton
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
        const MODEL_PATH ='./DISTrial.glb';
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
        renderer.setSize(800, 400);
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
            if (o.isBone && o.name === 'mixamorigSpine2') { 
                neck = o;
            }
            if (o.isBone && o.name === 'mixamorigLeftLeg') { 
                waist = o;
            }
        });

          // Set the models initial scale
        model.scale.set(1, 1, 1);

        model.position.y = -11;
    
        scene.add(model);

        // loaderAnim.remove();

        mixer = new THREE.AnimationMixer(model);

        let clips = fileAnimations.filter(val => val.name !== 'Idle');
        possibleAnims = clips.map(val => {
            let clip = THREE.AnimationClip.findByName(clips, val.name);
            clip.tracks.splice(6, 3);
            clip.tracks.splice(63, 3);
            clip = mixer.clipAction(clip);
            return clip;
           }
          );
        let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'Idle');
        console.log(idleAnim.tracks);
        idleAnim.tracks.splice(6, 3);
        idleAnim.tracks.splice(6, 3);
        idleAnim.tracks.splice(63, 3);
        idle = mixer.clipAction(idleAnim);
        cheer = mixer.clipAction(THREE.AnimationClip.findByName(fileAnimations, 'Cheer'))
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

        var mousecoords = getMousePos(globalVariable.x1,globalVariable.y1);

        if (neck && waist) {
            moveJoint(mousecoords, neck, 50);
            moveJoint(mousecoords, waist, 50);
        }
        if (!currentlyAnimating  && globalVariable.z1> 200) {
          currentlyAnimating = true;
          playOnClick();
          // && globalVariable.z1> 200
      }

      }
      update();


      // document.addEventListener('mousemove', function(e) {
      //   var mousecoords = getMousePos(e);

      //   if (neck && waist) {
      //       moveJoint(mousecoords, neck, 50);
      //       moveJoint(mousecoords, waist, 50);
      //   }

      // });
      
      function getMousePos(x1,y1) {
        return { x: x1, y: y1 };
      }

      function moveJoint(mouse, joint, degreeLimit) {
        let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.Math.degToRad(degrees.x);
        joint.rotation.x = THREE.Math.degToRad(degrees.y);
      }


      // iske nneeche ka nahi chaeye


      function getMouseDegrees(x, y, degreeLimit) {
        let dx = 0,
            dy = 0,
            xdiff,
            xPercentage,
            ydiff,
            yPercentage;
      
        let w = { x: window.innerWidth, y: window.innerHeight };
      
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

      document.addEventListener('mousemove', function(e) {

        window.addEventListener('click', e => raycast(e));
        window.addEventListener('touchend', e => raycast(e, true));

        function raycast(e, touch = false) {
        var mouse = {};
        if (touch) {
            mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
            mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
        } else {
            mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
            mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
        }
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects[0]) {
            var object = intersects[0].object;
            console.log(object.name)
            if (object.name === '') {
              
            if (!currentlyAnimating) {
                currentlyAnimating = true;
                playOnClick();
            }
            }
        }
        }
          
    })

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