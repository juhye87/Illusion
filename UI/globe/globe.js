
window.onload = function init() 
{
	const canvas = document.getElementById( "gl-canvas" );
	const renderer = new THREE.WebGLRenderer({canvas});
	
	// Earth params
	var radius   = 0.35,
		segments = 32,
		rotation = 6;  

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
	camera.position.z = 1.5;

	scene.add(new THREE.AmbientLight(0xCCCCCC));

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere)

    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds)

	var stars = createStars(90, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera);

	const loader = new THREE.GLTFLoader();
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	
	loader.load('./model/pin.gltf', function(gltf){
	
		pin_sungnyemun = gltf.scene.children[0];
		pin_sungnyemun.name = 'sungnyemun';
		//console.log(pin_sungnyemun.name);
		pin_sungnyemun.scale.set(0.15,0.15,0.15);
		pin_sungnyemun.position.set(-0.1,0.22,-0.26);
		pin_sungnyemun.rotation.set(-15,-0.5,-0.7);
		scene.add(gltf.scene);

	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/pin.gltf', function(gltf){
	
		pin_StatueOfLiberty = gltf.scene.children[0];
		pin_StatueOfLiberty.name = 'StatueOfLiberty';
		//console.log(pin_StatueOfLiberty.name);
		pin_StatueOfLiberty.scale.set(0.15,0.15,0.15);
		pin_StatueOfLiberty.position.set(-0.12,0.19,0.27);
		pin_StatueOfLiberty.rotation.set(-0.4,-0.5,0.7);
		scene.add(gltf.scene);
		
	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/pin.gltf', function(gltf){
	
		pin_SydneyOperaHouse = gltf.scene.children[0];
		pin_SydneyOperaHouse.name = 'SydneyOperaHouse';
		//console.log(pin_SydneyOperaHouse.name);
		pin_SydneyOperaHouse.scale.set(0.15,0.15,0.15);
		pin_SydneyOperaHouse.position.set(-0.12,-0.14,-0.3);
		pin_SydneyOperaHouse.rotation.set(-10,-0.5,-0.7);
		scene.add(gltf.scene);

	}, undefined, function (error) {
		console.error(error);
	});

	
	loader.load('./model/pin.gltf', function(gltf){
	
		pin_eiffel_tower = gltf.scene.children[0];
		pin_eiffel_tower.name = 'eiffel_tower';
		//console.log(pin_eiffel_tower.name);
		pin_eiffel_tower.scale.set(0.15,0.15,0.15);
		pin_eiffel_tower.position.set(0.22,0.27,0.05);
		pin_eiffel_tower.rotation.set(-20,-5.5,-3);
		scene.add(gltf.scene);
		
	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/pin.gltf', function(gltf){
	
		pin_sphinx = gltf.scene.children[0];
		pin_sphinx.name = 'sphinx';
		//console.log(pin_sphinx.name);
		pin_sphinx.scale.set(0.15,0.15,0.15);
		pin_sphinx.position.set(0.3,0.17,-0.07);
		pin_sphinx.rotation.set(-14,-5,-3);
		scene.add(gltf.scene);
		
	}, undefined, function (error) {
		console.error(error);
	});

	// renderer.domElement.addEventListener('click', onClick, false);

	// function onClick() {
	// 	event.preventDefault();

	// 	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	// 	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	// 	raycaster.setFromCamera( mouse, camera );

	// 	var intersects = raycaster.intersectObjects( scene.children);

	// 	if (intersects.length > 0) {
	// 		console.log('Intersection:', intersects[0].object);
	// 		if (intersects[0].object.name === 'sungnyemun') {
	// 			console.log("click on sungnyemun");
	// 		}
	// 		if (intersects[0].object.name === 'StatueOfLiberty') {
	// 			console.log("click on StatueOfLiberty");
	// 		}
	// 		if (intersects[0].object.name === 'SydneyOperaHouse') {
	// 			console.log("click on SydneyOperaHouse");
	// 		}
	// 		if (intersects[0].object.name === 'eiffel_tower') {
	// 			console.log("click on eiffel_tower");
	// 		}
	// 		if (intersects[0].object.name === 'sphinx') {
	// 			console.log("click on sphinx");
	// 		}
	// 	}
	// }

	render();

	function render() {
		controls.update();	
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('./images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('./images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('./images/water_4k.png'),
				specular:    new THREE.Color('grey')							
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('./images/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('./images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}
}


