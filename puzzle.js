
window.onload = function init() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
  camera.position.set(0, 0, 6);
  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x808080);
  var canvas = renderer.domElement;
  document.body.appendChild(canvas);

  //var controls = new THREE.OrbitControls(camera, canvas);


  var imageTexture = new THREE.TextureLoader().load( "resource/door.jpeg");

  console.log(imageTexture);
  //var texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/UV_Grid_Sm.jpg');
  var lineColor = new THREE.Color();
  
  var planeGeom = new THREE.PlaneBufferGeometry(2, 2);

  var instancedGeom = new THREE.InstancedBufferGeometry();
  instancedGeom.attributes.position = planeGeom.attributes.position;
  instancedGeom.attributes.uv = planeGeom.attributes.uv;
  instancedGeom.index = planeGeom.index;

  instancedGeom.addAttribute("instancePosition", new THREE.InstancedBufferAttribute(new Float32Array([-1.1, 1.1, 0, 1.1, 1.1, 0, -1.1, -1.1, 0, 1.1, -1.1, 0]), 3));
  instancedGeom.addAttribute("instanceUv", new THREE.InstancedBufferAttribute(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), 2));

  var material = new THREE.ShaderMaterial({
    uniforms: {
      texture1: { value: imageTexture },
      textureDivision: { value: new THREE.Vector2(2, 2) },
      time: { value: 0 }
    },
    vertexShader: `
    precision highp float;

    uniform vec2 textureDivision;
    uniform float time;

    attribute vec3 instancePosition;
    attribute vec2 instanceUv;
    
    varying vec2 vUv;

    void main(){
      vec2 slices = vec2(1.0) / textureDivision;
      vUv = slices * instanceUv + slices * uv;
      vec3 pos = position + instancePosition;
      pos += normalize(instancePosition) * (sin(time) * 0.5 + 0.5);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
  `,
    fragmentShader: `
    precision highp float;

    uniform sampler2D texture1;
    
    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D(texture1, vUv);
    }
  `
  });

  var instancedMesh = new THREE.Mesh(instancedGeom, material);
  instancedMesh.material.side = THREE.DoubleSide;
  scene.add(instancedMesh);

  scene.add(new THREE.AxesHelper(1));


  render();

  function render() {
    if (!resize(renderer)) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    var time = performance.now() / 1000;
    material.uniforms.time.value = time
    
    const rot = time * 1;

    console.log(material)
    instancedMesh.rotation.x = rot;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function resize(renderer) {
    const canvas = renderer.domElement;
    const width = 512;
    const height = 512;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

}
