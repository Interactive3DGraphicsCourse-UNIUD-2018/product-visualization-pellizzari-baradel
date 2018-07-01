// controllo che il browser supporti WebGL
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();  // se non lo supporta invio un messaggio
			
// VARIABILI GLOBALI
var container, stats, controls;
var camera, scene, renderer;
// VARIABILI GLOBALI PER LA GESTIONE DEI MATERIALI E DELLE CUBEMAP
var materiale = "dinamico";
var materialeLocale = materiale;
var materialeShader;  // variabile globale che corrisponde allo ShaderMaterial che contiene uniforms, vertexshader, fragmentshader ed estensioni
var cubemap = "colosseo";
var cubemapLocale = cubemap;
// LARGHEZZA E ALTEZZA DEL CANVAS IN CUI INSERIRE IL MODELLO
var larghezza, altezza;
// VARIABILI PER LA MODIFICA DELLA DINAMICITA DELLA SCENA
var stato = 0;
var rotazioneAngelo = true;
var angeloCaricato = false;
var luceMov = true;
var luceMov2 = true;
var angiolettoMov = true;

    // rappresentazione geometrica luci puntuali (da aggiungere agli uniforms la seconda)
    angoloLuce = Math.PI;
    angoloLuce2 = 0;
    lucePuntuale = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ( {color: 0xffff00, wireframe:true} ) );
    lucePuntuale2 = new THREE.Mesh( new THREE.SphereGeometry (1, 16, 16), new THREE.MeshBasicMaterial ( {color: 0xffff00, wireframe:true} ) );
    lucePuntuale.position.set( 7.5, 10.0, 0 );
    lucePuntuale2.position.set (10, 7, 0);

    state = 0; // indica se le luci stanno salendo o scendendo nell'animazione 0 scendono, 1 salgono
    state2 = 0;

// CUBEMAP DA TEXTURE

var loader = new THREE.CubeTextureLoader();
loader.setPath( 'Colosseum/' );
var textureCube1 = loader.load( [
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
] );
textureCube1.minFilter = THREE.LinearMipMapLinearFilter;

loader.setPath( 'FishermansBastion/' );
var textureCube2 = loader.load( [
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
] );
textureCube2.minFilter = THREE.LinearMipMapLinearFilter;

loader.setPath( 'FortPoint/' );
var textureCube3 = loader.load( [
    'posx.jpg', 'negx.jpg',
    'posy.jpg', 'negy.jpg',
    'posz.jpg', 'negz.jpg'
] );
textureCube3.minFilter = THREE.LinearMipMapLinearFilter;


// UNIFORMS DA PASSARE AGLI SHADER

// uniforms per il materiale oro
var uniformsDinamico = {
            pointLightPosition:	{ type: "v3", value: new THREE.Vector3() },
            pointLightPosition2:	{ type: "v3", value: new THREE.Vector3() },
            clight:	{ type: "v3", value: new THREE.Vector3(0.0, 2.0, 2.0) },
            cdiff:	{ type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) },
            //cspec:	{ type: "v3", value: new THREE.Vector3(1.022, 0.782, 0.344) }, // oro
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.913, 0.922, 0.924) },  // alluminio
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.972, 0.960, 0.915) },  // argento
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.664, 0.824, 0.850) }, // zinco
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.733, 0.697, 0.652) }, // palladio
            cspec:	{ type: "v3", value: new THREE.Vector3(0.955, 0.638, 0.538) }, // copper
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.673, 0.637, 0.585) }, // platino
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.660, 0.609, 0.526) }, // nickel
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.562, 0.565, 0.578) }, // ferro
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.549, 0.556, 0.554) }, // cromo
            //cspec:	{ type: "v3", value: new THREE.Vector3(0.542, 0.497, 0.449) }, // titanio
            roughness: { type: "f", value: 1.0 },
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
	    scene.add(lucePuntuale, lucePuntuale2);
    
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
    

    
    // carico il modello 3D
    pivotAngelo = new THREE.Object3D();
    caricaNuovoModello();  // modello sara il figlio in posizione 1 nella scena (secondo inserito)
    scene.add(pivotAngelo);

    // creo un oggetto per nascondere i difetti della base del modello
    var baseGeometry = new THREE.BoxGeometry(10,1,10); //Misure arbitrarie, che siano sufficientemente elevate
    var baseMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF}); //TEMP dovra' essere trasparente
    baseAngioletto = new THREE.Mesh(baseGeometry, baseMaterial);
    baseAngioletto.position.y = -5;
    pivotAngelo.add(baseAngioletto);
    
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
        pivotAngelo.add( gltf.scene );
        angelo = gltf.scene;
        angeloCaricato = true;
    } );
}

function aggiornaLuci(){
	uniformsDinamico.pointLightPosition.value = lucePuntuale.position;
	uniformsDinamico.pointLightPosition.needsUpdate = true;
	uniformsDinamico.pointLightPosition2.value = lucePuntuale2.position;
	uniformsDinamico.pointLightPosition2.needsUpdate = true;	
}

function onWindowResize() {
    camera.aspect = larghezza / altezza;
    camera.updateProjectionMatrix();
    renderer.setSize( larghezza, altezza );
}

function animate() {
	
	aggiornaLuci();
    
    if(luceMov){
        lucePuntuale.position.x = 7.5*Math.cos(angoloLuce);
        lucePuntuale.position.z = -7.5*Math.sin(angoloLuce);
        angoloLuce += 0.5 * Math.PI/180;
        if(state == 0) {
            if(lucePuntuale.position.y >= -1){
                lucePuntuale.position.y -= 0.015;
            }else{
                state = 1;
            }
        }else{
            if(lucePuntuale.position.y <= 13) {
                lucePuntuale.position.y += 0.015;
            }else{
                state = 0;
            }
        }
    }

    if(luceMov2){
        angoloLuce2 +=  1.0 * Math.PI/180;
        lucePuntuale2.position.x = 10*Math.cos(angoloLuce2);
        lucePuntuale2.position.z = -10*Math.sin(angoloLuce2);
        if(state2 == 0) {
            if(lucePuntuale2.position.y >= -1){
                lucePuntuale2.position.y -= 0.01;
            }else{
                state2 = 1;
            }
        }else{
            if(lucePuntuale2.position.y <= 13) {
                lucePuntuale2.position.y += 0.01;
            }else{
                state2 = 0;
            }
        }
    }
    if(angiolettoMov){
        pivotAngelo.rotateY(0.002);
    }

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update();
} // animate()

init();
animate();
