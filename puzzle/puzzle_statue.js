var time = 0;


window.onload = function init() {
  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera( -10, 10, 7, -7, 0, 50);

  const rand1 = Math.random() * 10.0;
  const rand2 = Math.random() * 10.0;
  const rand3 = Math.random() * 10.0;



   camera.position.set(rand1, rand2, rand3);



  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x108080);
  var canvas = renderer.domElement;
  document.body.appendChild(canvas);

  
  var controls = new THREE.TrackballControls(camera);
   controls.rotateSpeed = 0.5; 
   controls.zoomSpeed = 1.2; 
   controls.minDistance = 2; 
   controls.maxDistance = 8 ; 

   controls.panSpeed = 0.3;
   controls.noPan="true";

  var pieces = 8;
  var imageTexture = new THREE.TextureLoader().load( "../resource/StatueOfLiberty.webp");

  var planeGeom = new THREE.PlaneBufferGeometry(pieces, pieces);

  var instancedGeom = new THREE.InstancedBufferGeometry();
  instancedGeom.attributes.position = planeGeom.attributes.position;
  instancedGeom.attributes.uv = planeGeom.attributes.uv;
  instancedGeom.index = planeGeom.index;

  var genPosition = generatePosition(pieces, 28);
  var genUv = generateUv(pieces);
  var genScale = generateScale(pieces, 0.2);

  // console.log(instancedGeom);
  // console.log(genPosition);

  instancedGeom.addAttribute("instancePosition", new THREE.InstancedBufferAttribute(flatten(genPosition), 3));
  instancedGeom.addAttribute("instanceUv", new THREE.InstancedBufferAttribute(flatten(genUv), 2));
  instancedGeom.addAttribute("instanceScale", new THREE.InstancedBufferAttribute(flatten(genScale), 3))

  var material = new THREE.ShaderMaterial({
    uniforms: {
      texture1: { value: imageTexture },
      textureDivision: { value: new THREE.Vector2(pieces, pieces) },
      time: { value: 0 }
    },
    vertexShader: `
    precision highp float;

    uniform vec2 textureDivision;
    uniform float time;

    attribute vec3 instanceScale;
    attribute vec3 instancePosition;
    attribute vec2 instanceUv;
    
    varying vec2 vUv;

    void main(){
      vec2 slices = vec2(1.0) / textureDivision;
      vUv = slices * instanceUv + slices * uv;
      vec3 pos = position + instancePosition;
      pos = pos * instanceScale;
      //pos += normalize(instancePosition);
      
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
   
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  function resize(renderer) {
    const canvas = renderer.domElement;
    const width = 1920;
    const height = 1080;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function generatePosition(pieces, scale) {
    
    var ret = [];
    var division = 2 / (pieces - 1);
    for(var divX = -1; divX <= 1; divX += division) {
      for(var divY = 1; divY >= -1; divY -= division) {
        var randDepth = Math.floor(Math.random() * (5 - (-5))) + -5;
        var coord = vec3(divX * scale, divY * scale, randDepth);
        ret.push(coord);
      }
    }
    
    return ret;
  }
  function generateUv(pieces) {
    var ret = [];
    var division = 1 / (pieces - 1);
    for(var divX = 0; divX < pieces; divX += 1) {
      for(var divY = pieces - 1; divY >= 0; divY -= 1) {
        var coord = vec2(divX, divY);
        
        ret.push(coord);
      }
    }
    return ret;
  }

  function generateScale(pieces, scale){
    var ret = [];
    for(var i = 0; i < Math.pow(pieces, 2); i++) {
      var coord = vec3(scale, scale, 1);
      ret.push(coord);
    }

    return ret;
  }

var tes = 0;


  controls.addEventListener( "change", (event) => {  


    if(tes == 0){
    start();
    tes = 1;
    }
    // console.log( controls.object.position ); 
    console.log( controls.object.position ); 



    if(camera.position.x < 0.03 && camera.position.x > -0.03){

      if(camera.position.y < 0.03 && camera.position.y > -0.03){

      var result = "Solved in  ";

      var mins = Math.floor(time/10/60);
      var secs = Math.floor(time/10 % 60);
      var hours = Math.floor(time/10/60/60);
      var tenths = time % 10;
      if(mins < 10){
        mins = "0" + mins;
      }
      if(secs < 10){
        secs = "0" + secs;
      }
      if(time==1){
        tenths="0";
      }

      result = result + hours + ":" + mins + ":" + secs + ":" + tenths+ "0";

      controls.noRotate = true;
      controls.noZoom = true;

      tempx = camera.position.x;
      tempy = camera.position.y;


      alert(result);
      camera.position.set(0.01, 0.01, 8);
      console.log( controls.object.position ); 

      
      reset();

      window.open("/UI/pages/game_complete.html", "_self", "fullscreen" )

    }

  }



  });

}
var running = 0;
function start(){
   running=1;
   increment();
 }
function pause(){
  running = 0;
  }

function reset(){
  time=0;
  running = 0;
  document.getElementById("output").innerHTML = "0:00:00:00";
}
function increment(){
  if(running == 1){
    setTimeout(function(){
      time++;
      var mins = Math.floor(time/10/60);
      var secs = Math.floor(time/10 % 60);
      var hours = Math.floor(time/10/60/60);
      var tenths = time % 10;
      if(mins < 10){
        mins = "0" + mins;
      }
      if(secs < 10){
        secs = "0" + secs;
      }
      if(time==1){
        tenths="0";
      }
      document.getElementById("output").innerHTML = hours + ":" + mins + ":" + secs + ":" + tenths+ "0";
      increment();
    },100)
  }
}