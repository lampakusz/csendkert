/* Csendkert – felhőszinkron beállításai (Firebase).
   Firebase Console → Project settings → General → Your apps → Web app → "SDK setup and configuration" → Config.
   Ezek az értékek nyilvánosak lehetnek (a böngészőbe kerülnek), az adatokat a firestore.rules szabályai védik.
   Ha üresen hagyod, az app csak helyben (localStorage) tárol, mint eddig. */
window.CK_SYNC = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};
