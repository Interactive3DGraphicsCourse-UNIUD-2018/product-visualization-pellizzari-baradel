# Journal

*29 maggio*

Ricerca di possibili file 3D per lo svolgimento del progetto dal sito SketchFab.

*1 giugno*

Test del corretto funzionamento dei file e del giusto rapporto qualità/complessità degli oggetti trovati.

*4 giugno*

Aggiunti file html e CSS per la visiualizzazione di un prodotto in un sito generico, è stato creato un sito di prova in modo da rispecchiare un possibile layout e una possibile applicazione reale.

*20 giugno*

Applicati alcuni semplici shader al modello

*21 giugno*

* Inserito uno shader che carica la texture al modello e un paio di luci
* Trovate alcune environment map per il modello
* Inserito lo shader per materiale metallico (primo tentativo con l'oro)

*22 giugno*

* Fix alla pagina html del sito
* Shader in file separati

*23 giugno*

* Aggiunta la possibilità di cambiare materiale tramite click sul sito
* Spostata la scena da file html a file js per gestirla più comodamente
* Inserito file js esterno con funzioni ausiliarie per gestire il cambio dei materiali

*27 giugno*

* Aggiunta la possibilità di cambiare cubemap dal sito
* Sistemata applicazione della texture pietra (errore nel valore del parametro normalScale negli uniform)

*28 giugno*

* Spostato il file ausiliarie.js nella cartella lib
* Limitati gli OrbitControls in modo che non si veda la parte inferiore (la base) della scultura

*29 giugno*

* Aggiunto piano per mascherare gli errori della base del modello
* Creata pagina secondaria per la visualizzazione del prodotto con luci dinamiche
* Aggiunta mini-sezione acquisto
* Aggiunta irradiance map allo shader pietra.frag

*30 giugno*

* Inserita scena dinamica con possibilita di mettere in pausa singolarmente i vari elementi che compongono l'animazione
* Inserito nuovo shader per la scena
* Fix agli altri shader

## Difficoltà incontrate

* Gestire gli shader in file separati
* Gestire il cambiamento dei materiali del modello tramite "click" sul logo del materiale sulla pagina html
* Ottenere irradiance map dalle texture

## Browser utilizzati per i test

* Chrome
* Firefox

## Altri software utilizzati

* Bitmap2material per generare le varie texture da utilizzare negli shader
* cmftStudio per ottenere l'irradiance map a partire da un'immagine

## Fonti

* https://sketchfab.com/
* http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
* https://stackoverflow.com/questions/29928973/how-do-you-update-a-uniform-in-three-js
