			// controllo che il browser supporti WebGL
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();  // se non lo supporta invio un messaggio
			
			// VARIABILI GLOBALI
			var container, stats, controls;
			var camera, scene, renderer;
			// ASSEGNO UN MATERIALE DI DEFAULT
			var materiale = "oro";
			var materialeLocale = materiale;
			var materialeShader;  // variabile globale che corrisponde allo ShaderMaterial che contiene uniforms, vertexshader, fragmentshader ed estensioni

			
			var larghezza, altezza;
			
			// CUBEMAP DA TEXTURE
			var loader = new THREE.CubeTextureLoader();
			loader.setPath( 'FishermansBastion/' );
			var textureCube = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube.minFilter = THREE.LinearMipMapLinearFilter;
			
			// TEXTURE DA PASSARE AGLI SHADER
			var diffuseMapPietra = new THREE.TextureLoader().load("map_2048/Base_Color_2048.png");
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
						normalScale: { type: "v2", value: new THREE.Vector2(1,1) },
						textureRepeat: { type: "v2", value: new THREE.Vector2(0,0) },
						specularMap: {type: "t", value: specularMapPietra },
						diffuseMap: {type: "t", value: diffuseMapPietra },
						roughnessMap: {type: "t", value: roughnessMapPietra },
						normalMap: {type: "t", value: normalMapPietra },
						aoMap: {type: "t", value: aoMapPietra }
			};
			
			// uniforms per il materiale oro
			var uniformsOro = {
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },
						clight:	{ type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
						cdiff:	{ type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) },
						cspec:	{ type: "v3", value: new THREE.Vector3(1.022, 0.782, 0.344) },
						roughness: { type: "float", value: 0.6 },
						normalScale: { type: "v2", value: new THREE.Vector2(1,1) },
						envMap: { type: "t", value: textureCube }
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
				camera = new THREE.PerspectiveCamera(45, larghezza / altezza, 1, 600);
				camera.position.set(0, 3, -20);
				camera.lookAt(new THREE.Vector3(0,0,0));
				
				// aggiungo i controlli
				controls = new THREE.OrbitControls( camera );
				// imposto le distanze per lo zoom-in e zoom-out
				controls.minDistance = 10;
				controls.maxDistance = 28;		
				controls.update();
				
				// rappresentazione geometrica luce puntuale (che ho gia aggiunto agli uniforms)
				var lucePuntuale = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ( {color: 0xffff00, wireframe:true} ) );
				lucePuntuale.position.set( 10.0, 10.0, -10.0 );
				scene.add(lucePuntuale); // luce sara il figlio in posizione 0 della scena (primo inserito)
				
				// carico il modello 3D
				caricaNuovoModello();  // modello sara il figlio in posizione 1 nella scena (secondo inserito)
				
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
				if(scene.children.length > 1){
					scene.remove(scene.children[1]); // rimuovo il modello che nel vettore dei figli della scena si trova in posizione 1
				}
			}
			
			function onWindowResize() {
				camera.aspect = larghezza / altezza;
				camera.updateProjectionMatrix();
				renderer.setSize( larghezza, altezza );
			}

			function animate() {
				if(materiale != materialeLocale){  // se il valore del materiale (globale) e' stato cambiato
					rimuoviModello();  // rimuovo il modello dalla scena
					caricaNuovoModello();  // carico un nuovo modello con il materiale aggiornato
					materialeLocale = materiale;
				}
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
				stats.update();
			} // animate()
			
			init();
			animate();
