/* Csendkert – AI-kapcsolat (Firebase AI Logic + Gemini Developer API).
   Külön moduláris Firebase-példány, mert a szinkron a compat SDK-t használja.
   Csak az app.js hívja, mindig felhasználói gombnyomásra. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-ai.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app-check.js";

const cfg = window.CK_SYNC || {};
if (cfg.ai && cfg.apiKey) {
  const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = cfg;
  const app = initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId }, "csendkert-ai");
  // App Check: 2026. november 2-ától kötelező az AI Logic-hoz
  if (cfg.recaptchaKey) initializeAppCheck(app, { provider: new ReCaptchaV3Provider(cfg.recaptchaKey), isTokenAutoRefreshEnabled: true });
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const MODELS = cfg.aiModels || ["gemini-3.5-flash", "gemini-3.5-flash-lite"];

  window.CKAI = {
    async generate({ prompt, system, json = false }) {
      let last;
      for (const name of MODELS) {
        try {
          const model = getGenerativeModel(ai, {
            model: name,
            systemInstruction: system,
            generationConfig: { temperature: 0.8, ...(json ? { responseMimeType: "application/json" } : {}) }
          });
          const res = await model.generateContent(prompt);
          return res.response.text();
        } catch (e) {
          last = e;
          // csak akkor próbáljuk a következő modellt, ha ez nem elérhető / túlterhelt
          if (!/404|not.?found|unsupported|503|overloaded|unavailable/i.test(String(e && e.message))) break;
        }
      }
      throw last;
    }
  };
  window.dispatchEvent(new Event("ckai-ready"));
}
