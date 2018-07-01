// FUNZIONI AUSILIARIE PER CARICARE LO SHADER CORRETTO E GESTIRE IL MATERIALE DEL MODELLO 3D IN BASE AI CLICK SUI MATERIALI DEL SITO
/**
 * This is a basic asyncronous shader loader for THREE.js.
 * 
 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
 * 
 * `onProgress` and `onError` are stadard TREE.js stuff. Look at 
 * https://threejs.org/examples/webgl_loader_obj.html for an example. 
 * 
 * @param {String} vertex_url URL to the vertex shader code.
 * @param {String} fragment_url URL to fragment shader code
 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
 * @param {function} onProgress Callback for the `onProgress` event. 
 * @param {function} onError Callback for the `onError` event.
 */
function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
  var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
  vertex_loader.setResponseType('text');
  vertex_loader.load(vertex_url, function (vertex_text) {
	var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
	fragment_loader.setResponseType('text');
	fragment_loader.load(fragment_url, function (fragment_text) {
	  onLoad(vertex_text, fragment_text);
	});
  }, onProgress, onError);
}
			
// Funzione chiamata dall'evento onClick passandogli il nome del materiale da impostare alla variabile globale materiale
function cambiaMateriale(nuovoMateriale){
	materiale = nuovoMateriale;  // cambio la variabile globale
	scegliShader(); // applico la modifica
}
			
// In base al valore della variabile globale materiale (una stringa che contiene il nome del materiale, modificata dal click sulla pagina html del sito)
// imposto il valore della variabile globale materialeShader che mi dice quale shader (compresi uniforms, vertex, fragment,...) utilizzare per il modello
function scegliShader(){
	switch(materiale){
		case "pietra":
			ShaderLoader("shader/base.vert", ("shader/pietra.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsPietra,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		case "oro":
			ShaderLoader("shader/base.vert", ("shader/oro.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsOro,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		case "dinamico":
			ShaderLoader("shader/base.vert", ("shader/dinamico.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsDinamico,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		default:
			break;
	} // switch	
}

// Funzione chiamata dall'evento onClick passandogli il nome della cubemap da impostare alla variabile globale cubemap
function cambiaCubeMap(nuovaCubeMap){
	cubemap = nuovaCubeMap;
}

// In base al valore della variabile globale cubemap restituisco la texture corrispondente
function scegliCubeMap(){
	switch(cubemap){
		case "colosseo":
			return textureCube1;
		case "fisherman":
			return textureCube2;
		case "fortpoint":
			return textureCube3;
		default:
			break;
	}
}

// In base al valore della variabile globale cubemap restituisco la texture corrispondente
function scegliIrradianceMap(){
	switch(cubemap){
		case "colosseo":
			return textureCubeIrr1;
		case "fisherman":
			return textureCubeIrr2;
		case "fortpoint":
			return textureCubeIrr3;
		default:
			break;
	}
}

// Funzione chiamata dall'evento onClick passandogli il nome della cubemap da impostare alla variabile globale cubemap
function cambiaStatoLuce1(movimento) {
	if(movimento == 'stop'){
		luceMov = false;
	}else{
		luceMov = true;
	}
}
		
// Funzione chiamata dall'evento onClick passandogli il nome della cubemap da impostare alla variabile globale cubemap
function cambiaStatoLuce2(movimento) {
	if(movimento == 'stop'){
		luceMov2 = false;
	}else{
		luceMov2 = true;
	}
}

// Funzione chiamata dall'evento onClick passandogli il nome della cubemap da impostare alla variabile globale cubemap
function cambiaStatoAngioletto(movimento) {
	if(movimento == 'stop'){
		angiolettoMov = false;
	}else{
		angiolettoMov = true;
	}
}