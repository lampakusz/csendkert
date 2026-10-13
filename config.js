/* Csendkert – felhőszinkron beállításai (Firebase).
   Firebase Console → Project settings → General → Your apps → Web app → "SDK setup and configuration" → Config.
   Ezek az értékek nyilvánosak lehetnek (a böngészőbe kerülnek), az adatokat a firestore.rules szabályai védik.
   Ha üresen hagyod, az app csak helyben (localStorage) tárol, mint eddig. */
window.CK_SYNC = {
  apiKey: "AIzaSyCnYLk9rMRrvCAyQqocC3jM8FlnZZdx2Wk",
  authDomain: "csendkert-e4f12.firebaseapp.com",
  projectId: "csendkert-e4f12",
  storageBucket: "csendkert-e4f12.firebasestorage.app",
  messagingSenderId: "966483606966",
  appId: "1:966483606966:web:093e86be96c7aacb2d5517"
};
