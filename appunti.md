# Da fare:

## Scena:

* sistemare base della statua nel caso dell'aggiunta di una cubemap esterna (opzionale)
* Abbassare il limite massimo della luce su y nella scena dinamica, va troppo in alto
* plastica.frag come pietra.frag (irradiance) (?)

## Varie:

* README

## Pagina

* Aggiungere immagine plastica al posto del legno
* Sistemare i link esteticamente
* Usare un font decente

Aggiunti commenti: aus, ang, anglucidin
pietra.frag: rimosso uniform envmap, modificato outRad*(vec3(1.0)-fresnel)/PI (outRad era moltiplicato per la brdf speculare), rimossa funzione BRDF_Specular_GGX_Env, commentato uVv
oro.frag: rimosso commento, rimosso uniform normalScale (non utilizzato), commentato uVv
dinamico.frag: rimosso uniform normalScale (non utilizzato)
plastica.frag: rimosso uniform normalScale (non utilizzato), rimosso uniform uVv (non utilizzato)
angelo.js: rimosso uniform normalScale (non utilizzato), TODO scegliere roughness plastica, TODO scegliere cdiff plastica, rimosso uniform normalScale
angeloLuciDinamiche.js: rimosso uniform normalScale (non utilizzato), aumentato uniform roughness