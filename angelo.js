			// controllo che il browser supporti WebGL
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();  // se non lo supporta invio un messaggio
			
			// VARIABILI GLOBALI
			var container, stats, controls;
			var camera, scene, renderer;
			// VARIABILI GLOBALI PER LA GESTIONE DEI MATERIALI E DELLE CUBEMAP A RUN-TIME
			var materiale = "oro";
			var materialeLocale = materiale;
			var materialeShader;  // variabile globale che corrisponde allo ShaderMaterial che contiene uniforms, vertexshader, fragmentshader ed estensioni
			var cubemap = "colosseo";
			var cubemapLocale = cubemap;
			// LARGHEZZA E ALTEZZA DEL CANVAS IN CUI INSERIRE IL MODELLO
			var larghezza, altezza;
			
			// CUBEMAP DA TEXTURE
			
			var loader = new THREE.CubeTextureLoader();
			loader.setPath( 'Colosseum/' );
			var textureCube1 = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube1.minFilter = THREE.LinearMipMapLinearFilter;
			var textureCubeIrr1 = loader.load( [
				'posx_iem.jpg', 'negx_iem.jpg',
				'posy_iem.jpg', 'negy_iem.jpg',
				'posz_iem.jpg', 'negz_iem.jpg'
			] );
			textureCubeIrr1.minFilter = THREE.LinearMipMapLinearFilter;			
			
			loader.setPath( 'FishermansBastion/' );
			var textureCube2 = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube2.minFilter = THREE.LinearMipMapLinearFilter;
			var textureCubeIrr2 = loader.load( [
				'posx_iem.jpg', 'negx_iem.jpg',
				'posy_iem.jpg', 'negy_iem.jpg',
				'posz_iem.jpg', 'negz_iem.jpg'
			] );
			textureCubeIrr2.minFilter = THREE.LinearMipMapLinearFilter;
			
			loader.setPath( 'FortPoint/' );
			var textureCube3 = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube3.minFilter = THREE.LinearMipMapLinearFilter;
			var textureCubeIrr3 = loader.load( [
				'posx_iem.jpg', 'negx_iem.jpg',
				'posy_iem.jpg', 'negy_iem.jpg',
				'posz_iem.jpg', 'negz_iem.jpg'
			] );
			textureCubeIrr3.minFilter = THREE.LinearMipMapLinearFilter;
			
			// TEXTURE DA PASSARE ALLO SHADER "fragmentPietra.frag"
			var diffuseMapPietra = new THREE.TextureLoader().load("map_2048/Diffuse_2048.png");
			diffuseMapPietra.needsUpdate = true;
			var specularMapPietra = new THREE.TextureLoader().load("map_2048/Specular_2048.png");
			specularMapPietra.needsUpdate = true;
			var roughnessMapPietra = new THREE.TextureLoader().load("map_2048/Roughness_2048.png");
			roughnessMapPietra.needsUpdate = true;
			var normalMapPietra = new THREE.TextureLoader().load("map_2048/Normal_2048.png");
			normalMapPietra.needsUpdate = true;
			var aoMapPietra = new THREE.TextureLoader().load("map_2048/Ambient_Occlusion_2048.png");
			aoMapPietra.needsUpdate = true;
			
			// UNIFORMS DA PASSARE AGLI SHADER
			
			// uniform per il materiale pietra (da texture)
			var uniformsPietra = {
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },  // comune
						clight:	{ type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
						ambientLight: { type: "v3", value: new THREE.Vector3(0.3, 0.3, 0.3) }, // pietra
						normalScale: { type: "v2", value: new THREE.Vector2(0.0,0.0) },
						textureRepeat: { type: "v2", value: new THREE.Vector2(0,0) },
						specularMap: {type: "t", value: specularMapPietra },
						diffuseMap: {type: "t", value: diffuseMapPietra },
						roughnessMap: {type: "t", value: roughnessMapPietra },
						normalMap: {type: "t", value: normalMapPietra },
						aoMap: {type: "t", value: aoMapPietra },
						envMap: { type: "t", value: textureCube1 },
						IrrEnvMap: { type: "t", value: textureCubeIrr1 }
			};
			
			// uniforms per il materiale oro
			var uniformsOro = {
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },
						clight:	{ type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
						cdiff:	{ type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) },
						cspec:	{ type: "v3", value: new THREE.Vector3(1.022, 0.782, 0.344) }, // oro
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.913, 0.922, 0.924) },  // alluminio
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.972, 0.960, 0.915) },  // argento
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.664, 0.824, 0.850) }, // zinco
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.733, 0.697, 0.652) }, // palladio
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.955, 0.638, 0.538) }, // copper
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.673, 0.637, 0.585) }, // platino
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.660, 0.609, 0.526) }, // nickel
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.562, 0.565, 0.578) }, // ferro
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.549, 0.556, 0.554) }, // cromo
						//cspec:	{ type: "v3", value: new THREE.Vector3(0.542, 0.497, 0.449) }, // titanio
						roughness: { type: "f", value: 0.6 },
						normalScale: { type: "v2", value: new THREE.Vector2(1,1) },
						envMap: { type: "t", value: textureCube1 }
			};
			
			// per utilizzare questi attributi dei materiali
			var materialExtensions = {
				derivatives: true, // set to use derivatives
				shaderTextureLOD: true // set to use shader texture LOD
			};
			
			// imposto il valore della variabile materialeShader per poi averlo pronto quando carico il modello
			scegliShader();
			
			function init() {
				container = document.getElementById( 'canvas' );
				larghezza = document.getElementById('canvas').clientWidth;
				altezza = document.getElementById('canvas').clientHeight;
				
				scene = new THREE.Scene();
				scene.background = new THREE.Color("white");  // TODO temp
				
				// configurazione camera
				camera = new THREE.PerspectiveCamera(45, larghezza / altezza, 1, 400);
				camera.position.set(0, 3, -20);
				camera.lookAt(new THREE.Vector3(0,0,0));
				
				// aggiungo i controlli
				controls = new THREE.OrbitControls( camera );
				// imposto le distanze per lo zoom-in e zoom-out
				controls.minDistance = 12;
				controls.maxDistance = 28;
				controls.maxPolarAngle = Math.PI/2;
				controls.update();
				
				// rappresentazione geometrica luce puntuale (che ho gia aggiunto agli uniforms)
				var lucePuntuale = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ( {color: 0xffff00, wireframe:true} ) );
				lucePuntuale.position.set( 10.0, 10.0, -10.0 );
				scene.add(lucePuntuale); // luce sara il figlio in posizione 0 della scena (primo inserito)
				
				// carico il modello 3D
				caricaNuovoModello();  // modello sara il figlio in posizione 1 nella scena (secondo inserito)

				// creo un oggetto per nascondere i difetti della base del modello
				var baseGeometry = new THREE.BoxGeometry(10,1,10); //Misure arbitrarie, che siano sufficientemente elevate
				var baseMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF}); //TEMP dovra' essere trasparente
				baseAngioletto = new THREE.Mesh(baseGeometry, baseMaterial);
				baseAngioletto.position.y = -5;
			    scene.add(baseAngioletto);
				
				// configuro il renderer
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( larghezza, altezza );
				renderer.gammaOutput = true;
				container.appendChild( renderer.domElement );
				window.addEventListener( 'resize', onWindowResize, false );
				
				// stats
				stats = new Stats();
				container.appendChild( stats.dom );
				
			} // init()
			
			function caricaNuovoModello(){
				var loader = new THREE.GLTFLoader();
				loader.load( '3df_zephyr_example_0/scene.gltf', function ( gltf ) {
					gltf.scene.traverse( function ( child ) {
						if ( child.isMesh ) {
						// applico lo shader ad ogni figlio
						child.material = materialeShader;
						child.material.needsUpdate = true;
						}
					} );
					// l'oggetto e' molto grande quindi riduco le sue dimensioni per lavorare con valori "accettabili"
					gltf.scene.scale.multiplyScalar( 0.01 );
					gltf.scene.position.set(0,0,0);
					scene.add( gltf.scene );
				} );
			}
			
			function rimuoviModello(){
				if(scene.children.length > 2){ // la luce puntuale, la base dell'oggetto e l'oggetto
					scene.remove(scene.getObjectByName("OSG_Scene"));
				}
			}
			
			function aggiornaCubeMap(){
				if(cubemap != cubemapLocale){
					// aggiorno l'environment map di entrambi gli uniforms
					uniformsOro.envMap.value = scegliCubeMap();
					uniformsOro.envMap.needsUpdate = true;
					uniformsPietra.envMap.value = scegliCubeMap();
					uniformsPietra.envMap.needsUpdate = true;
					// aggiorno l'irradiance map
					uniformsPietra.IrrEnvMap.value = scegliIrradianceMap();
					uniformsPietra.IrrEnvMap.needsUpdate = true;
					// aggiorno la variabile locale dopo aver applicato le modifiche
					cubemapLocale = cubemap;
				}
			}
			
			function aggiornaMateriale(){
				if(materiale != materialeLocale){  // se il valore del materiale (globale) e' stato cambiato
					rimuoviModello();  // rimuovo il modello dalla scena
					caricaNuovoModello();  // carico un nuovo modello con il materiale aggiornato
					materialeLocale = materiale; // aggiorno la variabile locale dopo aver applicato le modifiche
				}
			}
			
			function onWindowResize() {
				camera.aspect = larghezza / altezza;
				camera.updateProjectionMatrix();
				renderer.setSize( larghezza, altezza );
			}

			function animate() {
				// controllo se devo modifcare le env map
				aggiornaCubeMap();
				// controllo se devo cambiare il materiale
				aggiornaMateriale();
				
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
				stats.update();
			} // animate()
			
			init();
			animate();
