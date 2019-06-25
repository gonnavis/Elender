var camera, scene, renderer, control, orbit;

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

  control.attach(mesh);
  scene.add(control);

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

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function render() {

  renderer.render(scene, camera);

}