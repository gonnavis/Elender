var camera, scene, renderer, control, orbit;
var raycaster = new THREE.Raycaster();

var mouse = new THREE.Vector2();
var objects = []
var selectedObjects = [];

var composer, effectFXAA, outlinePass;

var params = {
  edgeStrength: 3.0,
  edgeGlow: 0.0,
  edgeThickness: 1.0,
  pulsePeriod: 0,
  rotate: false,
  usePatternTexture: false
};

init();
render();

function init() {

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.set(1000, 500, 1000);
  camera.lookAt(0, 200, 0);

  scene = new THREE.Scene();
  scene.add(new THREE.GridHelper(1000, 10));

  var light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(1, 1, 1);
  scene.add(light);

  var texture = new THREE.TextureLoader().load('./src/assets/crate.gif', render);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
  var material = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true
  });

  orbit = new THREE.OrbitControls(camera, renderer.domElement);
  orbit.update();
  orbit.addEventListener('change', render);

  control = new THREE.TransformControls(camera, renderer.domElement);
  control.addEventListener('change', render);

  control.addEventListener('dragging-changed', function (event) {

    orbit.enabled = !event.value;

  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  objects.push(mesh)
  control.attach(mesh);
  scene.add(control);



  var geometry = new THREE.ConeGeometry(50, 200, 32);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff00
  });
  var cone = new THREE.Mesh(geometry, material);
  scene.add(cone);
  cone.position.x = -500
  objects.push(cone)
  // control.attach(cone)

  // postprocessing

  composer = new THREE.EffectComposer(renderer);

  var renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  composer.addPass(outlinePass);

  window.addEventListener('resize', onWindowResize, false);

  window.addEventListener('keydown', function (event) {

    switch (event.keyCode) {

      case 81: // Q
        control.setSpace(control.space === "local" ? "world" : "local");
        break;

      case 17: // Ctrl
        control.setTranslationSnap(100);
        control.setRotationSnap(THREE.Math.degToRad(15));
        break;

      case 87: // W
        control.setMode("translate");
        break;

      case 69: // E
        control.setMode("rotate");
        break;

      case 82: // R
        control.setMode("scale");
        break;

      case 187:
      case 107: // +, =, num+
        control.setSize(control.size + 0.1);
        break;

      case 189:
      case 109: // -, _, num-
        control.setSize(Math.max(control.size - 0.1, 0.1));
        break;

      case 88: // X
        control.showX = !control.showX;
        break;

      case 89: // Y
        control.showY = !control.showY;
        break;

      case 90: // Z
        control.showZ = !control.showZ;
        break;

      case 32: // Spacebar
        control.enabled = !control.enabled;
        break;

    }

  });

  window.addEventListener('keyup', function (event) {

    switch (event.keyCode) {

      case 17: // Ctrl
        control.setTranslationSnap(null);
        control.setRotationSnap(null);
        break;

    }

  });

  window.addEventListener('click', onClick);
  window.addEventListener('mousemove', onTouchMove);
  window.addEventListener('touchmove', onTouchMove);

  function onClick(event) {

    var x, y;

    if (event.changedTouches) {

      x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;

    } else {

      x = event.clientX;
      y = event.clientY;

    }

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    checkIntersection();

    render()
  }

  function onTouchMove(event) {

    var x, y;

    if (event.changedTouches) {

      x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;

    } else {

      x = event.clientX;
      y = event.clientY;

    }

    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;

    // checkIntersection();

    render()
  }

  function addSelectedObject(object) {

    selectedObjects = [];
    selectedObjects.push(object);

  }

  function checkIntersection() {

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects, true);

    if (intersects.length > 0) {

      var selectedObject = intersects[0].object;
      // addSelectedObject(selectedObject);
      // outlinePass.selectedObjects = selectedObjects;
      control.attach(selectedObject)

    } else {

      outlinePass.selectedObjects = [];

    }

  }

}

function onWindowResize() {

  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);

  effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

}

function render() {

  // stats.begin();

  // var timer = performance.now();

  // if (params.rotate) {

  // group.rotation.y = timer * 0.0001;

  // }

  // controls.update();

  // renderer.render(scene, camera)
  if (window.composer) composer.render();

  // stats.end();

}