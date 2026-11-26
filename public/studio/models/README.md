# Modelli della vetrina

I modelli sono facoltativi e valgono solo per gli orologi nel portaorologi: senza file (o se il caricamento fallisce) si usa l'orologio procedurale. Le auto sono stampe fotografiche appese al muro e usano il campo `photo`.

1. Cerca su [Sketchfab](https://sketchfab.com/) o [Poly Pizza](https://poly.pizza/) il modello esatto. Verifica che sia scaricabile e che la licenza consenta il riutilizzo sul portfolio (CC0, CC BY o CC BY-SA). Non usare asset con licenza editoriale, NC, ND o sconosciuta.
2. Scarica/esporta in formato GLB con texture incorporate; riduci ogni texture a un massimo di 512 × 512 px. Verifica anche eventuali marchi e diritti di terzi.
3. Orienta il modello prima dell'esportazione: Y verso l'alto; X è l'asse longitudinale dell'auto (muso verso +X), oppure il diametro orizzontale del quadrante; il quadrante dell'orologio guarda verso +Z. Applica le trasformazioni. Il loader scala e centra automaticamente il bounding box; l'auto poggia sul ripiano.
4. Salva qui il `.glb`. In `lib/studio-content.ts` aggiungi alla voce corrispondente `model: "/studio/models/nome.glb"`, `modelCredit` (autore), `modelLicense` (nome e versione), `modelLicenseUrl` (link alla licenza) e `modelSource` (scheda originale). La pagina `/crediti` mostra queste informazioni. Indica eventuali modifiche richieste dalla licenza.
5. Per animare le lancette, usa nodi separati `HourHand`, `MinuteHand`, `SecondHand` con pivot al centro del quadrante, asse Z come asse di rotazione e lancette a ore 12 nella posa iniziale. Se i nomi non corrispondono, il modello resta statico.
6. Verifica dimensioni, orientamento, leggibilità e assenza di contatti con i modelli vicini nello studio.
