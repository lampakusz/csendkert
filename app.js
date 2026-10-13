/* Csendkert – alkalmazáslogika */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- állapot ---------- */
  const KEY = "csendkert.v1";
  const DEF = { name: "Laura", answers: {}, testIdx: 0, results: null, plan: [], done: {}, steps: {}, reflect: {}, journal: [], habits: {}, challengeStart: null, values: [], valueNotes: {}, seconds: 0, activity: {}, sound: true, speak: false, music: true };
  let S;
  try { S = Object.assign(JSON.parse(JSON.stringify(DEF)), JSON.parse(localStorage.getItem(KEY) || "{}")); }
  catch (e) { S = JSON.parse(JSON.stringify(DEF)); }
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const save = () => { S._ts = Date.now(); store(); Sync.push(); };

  /* ---------- felhőszinkron (Firebase) ----------
     Felhasználónként egy dokumentum: progress/{uid} = { json, ts }; a frissebb (_ts) állapot nyer.
     JSON-szövegként tároljuk, mert a Firestore nem enged egymásba ágyazott tömböket. */
  const Sync = (() => {
    const cfg = window.CK_SYNC || {};
    const fb = window.firebase;
    const on = !!(cfg.apiKey && cfg.projectId && fb);
    let auth = null, db = null, user = null, timer = null, busy = false, lastSync = null, onChange = () => {};
    const LINKED = KEY + ".linked"; // ezen az eszközön már összefésültük-e a felhővel
    const EMAIL = KEY + ".email";   // a belépési link visszaigazolásához
    const hasLocal = () => S.plan.length || S.journal.length || Object.keys(S.answers).length || Object.keys(S.activity).length;
    const ref = () => db.collection("progress").doc(user.uid);

    async function push() {
      if (!user) return false;
      try { await ref().set({ json: JSON.stringify(S), ts: S._ts || Date.now() }); }
      catch (e) { console.warn("Szinkron hiba:", e.message); return false; }
      lastSync = new Date(); onChange(); return true;
    }
    function apply(data) {
      S = Object.assign(JSON.parse(JSON.stringify(DEF)), data); store();
      if (!/^#(legzes-|meditacio-|idozito)/.test(location.hash)) route(); // futó gyakorlatot nem szakítunk meg
    }
    async function pull() {
      if (!user || busy) return;
      busy = true;
      try {
        let snap;
        try { snap = await ref().get(); } catch (e) { console.warn("Szinkron hiba:", e.message); return; }
        const remote = snap.exists ? JSON.parse(snap.data().json || "{}") : null;
        let linked = false; try { linked = localStorage.getItem(LINKED) === user.uid; } catch (e) {}
        if (!remote) { if (!S._ts) S._ts = Date.now(); store(); await push(); }
        else if (!linked && hasLocal() && (remote._ts || 0) !== (S._ts || 0)) {
          // első belépés olyan eszközön, ahol már van helyi haladás
          if (confirm("Ezen az eszközön is van mentett haladás, és a fiókodban is.\n\nOK: a fiókban lévőt töltöm be (az itteni elvész).\nMégse: az itteni adatokkal felülírom a fiókot.")) { apply(remote); lastSync = new Date(); }
          else { S._ts = Date.now(); store(); await push(); }
        }
        else if ((remote._ts || 0) > (S._ts || 0)) { apply(remote); lastSync = new Date(); }
        else if ((remote._ts || 0) < (S._ts || 0)) await push();
        else lastSync = new Date();
        try { localStorage.setItem(LINKED, user.uid); } catch (e) {}
        onChange();
      } finally { busy = false; }
    }
    if (on) {
      if (!fb.apps.length) fb.initializeApp(cfg);
      auth = fb.auth(); db = fb.firestore();
      // visszatérés a belépési linkről
      if (auth.isSignInWithEmailLink(location.href)) {
        let email = null; try { email = localStorage.getItem(EMAIL); } catch (e) {}
        if (!email) email = prompt("A belépés befejezéséhez add meg újra az e-mail-címed:");
        const clean = () => history.replaceState(null, "", location.pathname + location.hash);
        if (email) auth.signInWithEmailLink(email, location.href)
          .then(() => { try { localStorage.removeItem(EMAIL); } catch (e) {} clean(); toast("Bejelentkeztél."); })
          .catch((e) => { clean(); toast("A belépési link lejárt vagy már felhasználtad. Kérj újat a Beállításokban."); console.warn(e.message); });
      }
      auth.onAuthStateChanged((u) => {
        const was = user && user.uid; user = u;
        if (user && user.uid !== was) setTimeout(pull, 0);
        onChange();
      });
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") pull(); });
      window.addEventListener("pagehide", () => { if (timer) { clearTimeout(timer); timer = null; push(); } });
    }
    return {
      enabled: on,
      get user() { return user; },
      get lastSync() { return lastSync; },
      set onChange(f) { onChange = f || (() => {}); },
      push() { if (!user) return; clearTimeout(timer); timer = setTimeout(() => { timer = null; push(); }, 1500); },
      now: async () => { clearTimeout(timer); timer = null; await pull(); return !!lastSync; },
      signIn: async (email) => {
        try {
          await auth.sendSignInLinkToEmail(email, { url: location.origin + location.pathname, handleCodeInApp: true });
          try { localStorage.setItem(EMAIL, email); } catch (e) {}
          return {};
        } catch (error) { return { error }; }
      },
      signOut: async () => { await auth.signOut(); try { localStorage.removeItem(LINKED); } catch (e) {} }
    };
  })();

  const pad = (n) => String(n).padStart(2, "0");
  const dstr = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const today = () => dstr(new Date());
  const markActive = () => { S.activity[today()] = true; save(); };
  const huDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" }); };
  const fmtTime = (sec) => Math.floor(sec / 60) + ":" + pad(Math.max(0, Math.round(sec % 60)));

  const AREA = Object.fromEntries(CK.areas.map((a) => [a.id, a]));
  const LESSON = Object.fromEntries(CK.lessons.map((l) => [l.id, l]));
  const MED = Object.fromEntries(CK.meditations.map((m) => [m.id, m]));
  const BR = Object.fromEntries(CK.breathing.map((b) => [b.id, b]));
  const ac = (id) => `var(--a-${id})`;

  /* ---------- ikonok ---------- */
  const P = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    path: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5"/><path d="M8.5 7.5h7"/>',
    lotus: '<path d="M12 20c-4.5 0-8.5-2.2-9.5-6.5 3-.8 6.2.3 9.5 3.3 3.3-3 6.5-4.1 9.5-3.3-1 4.3-5 6.5-9.5 6.5z"/><path d="M12 16.8c-2.2-3.2-2.2-7.4 0-11.3 2.2 3.9 2.2 8.1 0 11.3z"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    leaf: '<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19l8-8"/>',
    wind: '<path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9 2.5h6"/>',
    card: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h3"/>',
    compass: '<path d="M12 3l3 9-3 9-3-9z"/><path d="M3 12h18" opacity=".5"/>',
    mountain: '<path d="M2.5 20l6.5-11 4 6.5 2.5-3.5 6 8z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    seed: '<circle cx="12" cy="14" r="5"/><path d="M12 9V3M12 5c2-2 4-2 5-1"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    skipF: '<path d="M6 5l9 7-9 7z"/><path d="M18 5v14"/>',
    skipB: '<path d="M18 5l-9 7 9 7z"/><path d="M6 5v14"/>',
    m1: '<path d="M7 15h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 15z"/><path d="M12 16l-2 3.5h3L11 23"/>',
    m2: '<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 1.5A3.3 3.3 0 0 0 7 18z"/>',
    m3: '<path d="M4 9h16M4 13h12M4 17h8"/>',
    m4: '<circle cx="9" cy="9" r="3"/><path d="M9 3v1M3 9h1M4.8 4.8l.7.7M13.2 4.8l-.7.7"/><path d="M10 20h8a3.3 3.3 0 0 0 0-6.6 5 5 0 0 0-9.4 1.3A2.7 2.7 0 0 0 10 20z"/>',
    m5: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`;

  /* ---------- hang ---------- */
  let AC = null;
  function audio() {
    if (!AC) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { AC = new C(); } catch (e) { return null; } }
    if (AC.state === "suspended") AC.resume();
    return AC;
  }
  function bell(base = 196, vol = 0.22, dur = 7) {
    if (!S.sound) return; const c = audio(); if (!c) return;
    const t = c.currentTime; const out = c.createGain(); out.gain.value = vol; out.connect(c.destination);
    [[1, 1], [1.004, 0.6], [2.76, 0.42], [5.4, 0.2], [8.93, 0.09]].forEach(([r, a]) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = base * r;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / Math.pow(r, 0.35));
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.1);
    });
  }
  function tone(kind) {
    if (!S.sound) return; const c = audio(); if (!c) return;
    const f = kind === "in" ? 392 : kind === "out" ? 294 : 330;
    const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 1.5);
  }
  let rain = null;
  function setRain(on) {
    $$(".amb").forEach((x) => (x.checked = on));
    $$(".amb-btn").forEach((x) => x.setAttribute("aria-pressed", on));
    if (!on) { if (rain) { const r = rain; rain = null; r.g.gain.setTargetAtTime(0, r.c.currentTime, 0.4); setTimeout(() => { try { r.src.stop(); } catch (e) {} }, 1500); } return; }
    const c = audio(); if (!c || rain) return;
    const len = c.sampleRate * 6, buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch); let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        let v = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        if (Math.random() < 0.0009) v += (Math.random() - 0.5) * 0.6;
        d[i] = v;
      }
    }
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
    const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 180;
    const g = c.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.32, c.currentTime, 1.2);
    src.connect(lp); lp.connect(hp); hp.connect(g); g.connect(c.destination); src.start();
    rain = { src, g, c };
  }

  /* ---------- meditációs háttérzene (generált) ----------
     Lassan váltakozó D-dúr pentaton akkordfelületek + szórványos csengőhangok, zengetővel. */
  let music = null;
  const mhz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const CHORDS = [[50, 57, 62, 66, 69], [43, 50, 59, 62, 66], [47, 54, 59, 62, 66], [45, 52, 57, 61, 64]]; // D, Gmaj7, Bm7, A
  const CHIME = [74, 76, 78, 81, 83, 86, 88];
  function reverbIR(c, sec = 5) {
    const len = Math.floor(c.sampleRate * sec), b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    return b;
  }
  function startMusic() {
    const c = audio(); if (!c || music) return;
    const master = c.createGain(); master.gain.value = 0; master.gain.setTargetAtTime(0.55, c.currentTime, 2.5); master.connect(c.destination);
    const verb = c.createConvolver(); verb.buffer = reverbIR(c); const wet = c.createGain(); wet.gain.value = 0.7; verb.connect(wet); wet.connect(master);
    const bus = c.createGain(); bus.connect(master); bus.connect(verb);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.Q.value = 0.3; lp.connect(bus);
    const M = { c, master, bus, lp, timers: [], idx: 0 };
    const pad = () => {
      const t = c.currentTime + 0.05, dur = 13, notes = CHORDS[M.idx++ % CHORDS.length];
      notes.forEach((m, i) => {
        [["sine", 0], ["triangle", 5]].forEach(([type, cents]) => {
          const o = c.createOscillator(), g = c.createGain();
          o.type = type; o.frequency.value = mhz(m); o.detune.value = cents + (Math.random() - 0.5) * 4;
          const peak = (type === "sine" ? 0.032 : 0.012) * (i === 0 ? 1.3 : 1);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 5); g.gain.setValueAtTime(peak, t + dur - 2); g.gain.linearRampToValueAtTime(0, t + dur + 5);
          o.connect(g); g.connect(lp); o.start(t); o.stop(t + dur + 5.2);
        });
      });
    };
    const chime = () => {
      const t = c.currentTime + 0.05, f = mhz(CHIME[Math.floor(Math.random() * CHIME.length)]);
      const pan = c.createStereoPanner ? c.createStereoPanner() : null; if (pan) { pan.pan.value = Math.random() * 1.2 - 0.6; pan.connect(bus); }
      [[1, 0.022], [2.01, 0.006], [3.98, 0.002]].forEach(([r, a]) => {
        const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f * r;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 6 / r);
        o.connect(g); g.connect(pan || bus); o.start(t); o.stop(t + 6.2);
      });
      M.timers.push(setTimeout(chime, 3500 + Math.random() * 7000));
    };
    pad(); M.timers.push(setInterval(pad, 12000)); M.timers.push(setTimeout(chime, 4000));
    music = M;
  }
  function stopMusic() {
    if (!music) return; const M = music; music = null;
    M.timers.forEach((x) => { clearTimeout(x); clearInterval(x); });
    M.master.gain.setTargetAtTime(0, M.c.currentTime, 0.8);
    setTimeout(() => { try { M.master.disconnect(); } catch (e) {} }, 4000);
  }
  function setMusic(on, persist = true) {
    if (persist && S.music !== on) { S.music = on; save(); }
    musicUI(on);
    on ? startMusic() : stopMusic();
  }
  function musicUI(on) {
    $$(".mus").forEach((x) => (x.checked = on));
    $$(".mus-btn").forEach((x) => x.setAttribute("aria-pressed", on));
  }
  let huVoice = null;
  function loadVoice() { try { huVoice = speechSynthesis.getVoices().find((v) => /^hu/i.test(v.lang)) || null; } catch (e) {} }
  if ("speechSynthesis" in window) { loadVoice(); try { speechSynthesis.onvoiceschanged = loadVoice; } catch (e) {} }
  function speak(text) {
    if (!S.speak || !("speechSynthesis" in window)) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "hu-HU"; u.rate = 0.86; u.pitch = 0.95; if (huVoice) u.voice = huVoice; speechSynthesis.speak(u); } catch (e) {}
  }

  /* ---------- segédek ---------- */
  let cleanups = [];
  const onCleanup = (f) => cleanups.push(f);
  function cleanup() { cleanups.forEach((f) => { try { f(); } catch (e) {} }); cleanups = []; try { speechSynthesis.cancel(); } catch (e) {} }
  async function wake() { try { if (navigator.wakeLock) { const w = await navigator.wakeLock.request("screen"); onCleanup(() => w.release()); } } catch (e) {} }
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400); }
  const addSeconds = (s) => { S.seconds = (S.seconds || 0) + s; markActive(); };

  /* ---------- felmérő kiértékelése ---------- */
  function computeResults() {
    const sum = {}, cnt = {};
    CK.questions.forEach((q, i) => { const v = S.answers[i]; if (v == null) return; const s = q.r ? 6 - v : v; sum[q.a] = (sum[q.a] || 0) + s; cnt[q.a] = (cnt[q.a] || 0) + 1; });
    const areas = {};
    CK.areas.forEach((a) => { const avg = cnt[a.id] ? sum[a.id] / cnt[a.id] : 3; const need = ((avg - 1) / 4) * 100; areas[a.id] = { strength: Math.round(100 - need) }; });
    const order = CK.areas.filter((a) => a.id !== "jelenlet").map((a) => a.id).sort((x, y) => areas[x].strength - areas[y].strength);
    order.forEach((id, i) => { const s = areas[id].strength; areas[id].level = i < 2 || s < 45 ? "focus" : s <= 65 ? "dev" : "str"; });
    const js = areas.jelenlet.strength; areas.jelenlet.level = js < 45 ? "focus" : js <= 65 ? "dev" : "str";
    return { date: today(), areas, order };
  }
  function buildPlan(r) {
    const L = (id) => CK.lessons.filter((l) => l.area === id).map((l) => l.id);
    const jel = L("jelenlet"); const jCount = r.areas.jelenlet.level === "focus" ? 5 : 3;
    const queues = r.order.filter((id) => r.areas[id].level !== "str").map((id) => (r.areas[id].level === "focus" ? L(id) : L(id).slice(0, 3)));
    const rr = [];
    while (queues.some((q) => q.length)) queues.forEach((q) => { if (q.length) rr.push(q.shift()); });
    const extra = jel.slice(2, jCount); const plan = jel.slice(0, 2);
    rr.forEach((id, i) => { plan.push(id); if ((i + 1) % 5 === 0 && extra.length) plan.push(extra.shift()); });
    plan.push(...extra);
    return plan;
  }
  const nextLesson = () => S.plan.find((id) => !S.done[id]) || null;
  const levelChip = (lv) => lv === "focus" ? '<span class="chip focus">Fő fókusz</span>' : lv === "dev" ? '<span class="chip dev">Fejlesztendő</span>' : '<span class="chip str">Erősség</span>';
  const toolHref = (t) => t.type === "med" ? "#meditacio-" + t.id : t.type === "breath" ? "#legzes-" + t.id : "#" + t.id;

  /* ---------- navigáció ---------- */
  const NAV = [["kezdolap", "Kezdőlap", "home"], ["utam", "Az utam", "path"], ["tananyag", "Tananyag", "book"], ["gyakorlas", "Gyakorlás", "lotus"], ["naplo", "Napló", "pen"]];
  function navGroup(h) {
    if (h.startsWith("lecke-") || h === "tananyag") return "tananyag";
    if (h === "utam" || h === "teszt") return "utam";
    if (h === "naplo") return "naplo";
    if (h === "kezdolap" || h === "beallitasok") return "kezdolap";
    return "gyakorlas";
  }
  function drawNav(h) {
    const g = navGroup(h);
    const html = NAV.map(([id, l, i]) => `<a href="#${id}" class="${g === id ? "on" : ""}" ${g === id ? 'aria-current="page"' : ""}>${ic(i)}<span>${l}</span></a>`).join("");
    $("#nav").innerHTML = html; $("#tabbar").innerHTML = html;
  }

  const ROUTES = {
    kezdolap: vHome, teszt: vTest, utam: vPath, tananyag: vLibrary, gyakorlas: vPractice, naplo: vJournal,
    "irigyseg-atalakito": () => vWizard("irigyseg"), "itelet-atalakito": () => vWizard("itelet"),
    ertekek: vValues, kartya: vCards, kihivas: vChallenge, idozito: vTimer, beallitasok: vSettings, legzes: () => vBreathList(), meditacio: () => vMedList()
  };
  function route() {
    cleanup();
    const h = (location.hash || "#kezdolap").slice(1) || "kezdolap";
    drawNav(h);
    const view = $("#view");
    let html;
    if (h.startsWith("lecke-") && LESSON[h.slice(6)]) html = vLesson(h.slice(6));
    else if (h.startsWith("legzes-") && BR[h.slice(7)]) html = vBreath(h.slice(7));
    else if (h.startsWith("meditacio-") && MED[h.slice(10)]) html = vMed(h.slice(10));
    else html = (ROUTES[h] || vHome)();
    if (typeof html === "string") { view.innerHTML = `<div class="fade-in">${html}</div>`; }
    if (view._after) { const f = view._after; view._after = null; f(view); }
    window.scrollTo(0, 0);
  }
  const after = (f) => { $("#view")._after = f; };
  window.addEventListener("hashchange", route);

  /* =================================================================
     KEZDŐLAP
     ================================================================= */
  function dailyWisdom(offset = 0) {
    const d = new Date(); const start = new Date(d.getFullYear(), 0, 0);
    const doy = Math.floor((d - start) / 864e5);
    return CK.wisdom[(doy + offset) % CK.wisdom.length];
  }
  function greet() { const h = new Date().getHours(); return h < 10 ? "Jó reggelt" : h < 18 ? "Szép napot" : "Szép estét"; }

  function vHome() {
    const r = S.results; const nx = nextLesson(); const w = dailyWisdom();
    const doneN = Object.keys(S.done).length; const planDone = S.plan.filter((id) => S.done[id]).length;
    const mins = Math.round((S.seconds || 0) / 60); const days = Object.keys(S.activity).length;
    const hero = `
      <section class="hero">
        <div class="stack">
          <p class="greet">${greet()}, ${esc(S.name)}.</p>
          <h1>Egy csendes hely,<br>ahol önmagadra figyelhetsz.</h1>
          <p class="lead">Napi 10–15 perc tanítás, gyakorlat és csend, a keleti bölcsesség és a mai pszichológia segítségével.</p>
        </div>
        <a class="orb-btn" href="#legzes-koherens" aria-label="Nyugodt légzés indítása"><span>Lélegezz</span></a>
      </section>`;
    let mainCard;
    if (!r) {
      mainCard = `
      <section class="card stack">
        <span class="eyebrow">Első lépés</span>
        <h2>Önismereti felmérő</h2>
        <p class="muted">28 rövid állítás, körülbelül 6 perc. A válaszaid alapján összeállítjuk a te személyes utadat: azokat a leckéket és gyakorlatokat, amelyek most a legtöbbet adhatják neked.</p>
        <div class="row"><a class="btn" href="#teszt">Felmérő indítása ${ic("arrowR").replace("<svg", '<svg width="18" height="18"')}</a><a class="btn ghost" href="#tananyag">Előbb körülnézek</a></div>
      </section>
      <section class="steps3">
        <div><span class="n">1</span><b>Felmérő</b><p class="small muted">Őszinte válaszok hat területen: jelenlét, együttörülés, jóindulat, elfogadás, önállóság, magabiztosság.</p></div>
        <div><span class="n">2</span><b>Személyes út</b><p class="small muted">A gyengébb területeidre összeállított lecke-sorrend, keleti tanításokkal és gyakorlatokkal.</p></div>
        <div><span class="n">3</span><b>Napi gyakorlás</b><p class="small muted">Légzés, vezetett meditáció, napló és egy 21 napos kihívás, hogy a változás beépüljön.</p></div>
      </section>`;
    } else {
      const focus = r.order.filter((id) => r.areas[id].level === "focus");
      const L = nx ? LESSON[nx] : null;
      mainCard = `
      <section class="card stack" style="--c:${L ? ac(L.area) : "var(--jade)"}">
        <div class="row between"><span class="eyebrow">${L ? "Következő lépés az utadon" : "Végigértél az utadon"}</span><span class="small muted num">${planDone} / ${S.plan.length} lecke</span></div>
        <div class="bar"><i style="width:${S.plan.length ? (planDone / S.plan.length) * 100 : 0}%"></i></div>
        ${L ? `<div class="stack" style="gap:6px">
            <span class="row small muted" style="gap:8px"><i class="dot"></i>${AREA[L.area].full} · ${L.min} perc</span>
            <h2>${L.title}</h2><p class="muted">${L.lead}</p></div>
            <div class="row"><a class="btn" href="#lecke-${L.id}">Lecke megnyitása</a><a class="btn ghost" href="#utam">Az egész út</a></div>`
          : `<h2>Gratulálok, ${esc(S.name)}!</h2><p class="muted">Minden leckét teljesítettél az utadon. Most érdemes újra kitölteni a felmérőt, és megnézni, mi változott.</p><div class="row"><a class="btn" href="#teszt" data-retake>Felmérő újra</a><a class="btn ghost" href="#tananyag">Tananyag böngészése</a></div>`}
        <div class="row small muted" style="gap:8px">Fókuszterületeid: ${focus.map((id) => `<span class="chip" style="color:${ac(id)}"><i class="dot" style="--c:${ac(id)}"></i>${AREA[id].name}</span>`).join("")}</div>
      </section>`;
    }
    const todayH = S.habits[today()] || {}; const hcount = Object.values(todayH).filter(Boolean).length;
    after((v) => { const rt = $("[data-retake]", v); if (rt) rt.addEventListener("click", () => { S.answers = {}; S.testIdx = 0; save(); }); });
    return `<div class="col">
      ${hero}
      ${mainCard}
      <section class="stats">
        <div><b>${doneN}</b><span>teljesített lecke</span></div>
        <div><b>${mins}</b><span>perc gyakorlás</span></div>
        <div><b>${S.journal.length}</b><span>naplóbejegyzés</span></div>
        <div><b>${days}</b><span>aktív nap</span></div>
      </section>
      <section class="wisdom"><span class="eyebrow" style="position:relative">A nap bölcsessége</span><q style="margin-top:10px">${w[0]}</q><cite>${w[1]}</cite><span class="glyph">道</span></section>
      <section class="stack">
        <h3>Gyors gyakorlás</h3>
        <div class="grid3">
          <a class="card linkcard" href="#legzes-doboz"><span class="icon-tile">${ic("wind")}</span><span class="t">Dobozlégzés</span><span class="d">2 perc fókusz egy nehéz helyzet előtt.</span></a>
          <a class="card linkcard" href="#meditacio-felhok"><span class="icon-tile">${ic("lotus")}</span><span class="t">Felhők az égen</span><span class="d">6 perces vezetett meditáció.</span></a>
          <a class="card linkcard" href="#kihivas"><span class="icon-tile">${ic("calendar")}</span><span class="t">Mai szokások</span><span class="d">${S.challengeStart ? `Ma ${hcount} / ${CK.habits.length} kész.` : "Indítsd el a 21 napos kihívást."}</span></a>
        </div>
      </section>
      <p class="footer-note">A Csendkert önismereti és személyiségfejlesztő gyakorlatokat kínál, nem helyettesíti a pszichológiai segítséget. Ha tartósan nehéz időszakon mész át, érdemes szakemberhez fordulni. Minden válaszod és jegyzeted csak ebben a böngészőben tárolódik.</p>
    </div>`;
  }

  /* =================================================================
     FELMÉRŐ
     ================================================================= */
  let testStarted = false;
  function vTest() {
    const n = CK.questions.length;
    const answered = Object.keys(S.answers).length;
    if (!testStarted) {
      after((v) => {
        $("#start", v).addEventListener("click", () => { if ($("#restart", v)?.checked) { S.answers = {}; S.testIdx = 0; save(); } testStarted = true; route(); });
      });
      return `<div class="col">
        <div class="stack"><span class="eyebrow">Önismereti felmérő</span><h1>Hol tartasz most?</h1>
        <p class="muted" style="font-size:1.08rem">${n} állítás következik. Mindegyiknél jelöld, mennyire jellemző rád <em>mostanában</em>, az elmúlt néhány hónapban.</p></div>
        <section class="card stack">
          <div class="stack" style="gap:10px">
            <p>${ic("check").replace("<svg", '<svg width="18" height="18" style="vertical-align:-3px;color:var(--jade)"')} Nincsenek jó vagy rossz válaszok. Minden állításban ott van valami, ami mindenkire igaz néha.</p>
            <p>${ic("check").replace("<svg", '<svg width="18" height="18" style="vertical-align:-3px;color:var(--jade)"')} Az első megérzésed általában a legpontosabb. Ne gondold túl.</p>
            <p>${ic("check").replace("<svg", '<svg width="18" height="18" style="vertical-align:-3px;color:var(--jade)"')} A válaszaidat senki más nem látja, csak ebben a böngészőben tárolódnak.</p>
            <p>${ic("check").replace("<svg", '<svg width="18" height="18" style="vertical-align:-3px;color:var(--jade)"')} Gyorsan válaszolhatsz az 1–5 billentyűkkel is.</p>
          </div>
          ${answered && answered < n ? `<label class="toggle"><input type="checkbox" id="restart"> Elölről kezdem (${answered} válasz már megvan)</label>` : ""}
          <div class="row"><button class="btn" id="start">${answered && answered < n ? "Folytatás" : "Kezdjük"}</button></div>
        </section></div>`;
    }
    let i = Math.min(S.testIdx || 0, n - 1);
    function draw() {
      const q = CK.questions[i]; const sel = S.answers[i];
      $("#view").innerHTML = `<div class="col fade-in"><div class="q-wrap">
        <div class="q-progress"><span class="small muted num">${i + 1} / ${n}</span><div class="bar"><i style="width:${(i / n) * 100}%"></i></div></div>
        <p class="q-text">${q.t}</p>
        <div class="scale" role="radiogroup" aria-label="Mennyire jellemző rád?">
          ${CK.scale.map((l, k) => `<button role="radio" aria-checked="${sel === k + 1}" class="${sel === k + 1 ? "sel" : ""}" data-v="${k + 1}"><span class="pip">${[1, 2, 3, 4, 5].map((p) => `<i class="${p <= k + 1 ? "f" : ""}"></i>`).join("")}</span>${l}<kbd>${k + 1}</kbd></button>`).join("")}
        </div>
        <div class="row between"><button class="btn ghost sm" id="back" ${i === 0 ? "disabled" : ""}>${ic("arrowL").replace("<svg", '<svg width="16" height="16"')} Vissza</button>
        <span class="small muted">Mostanában, az elmúlt hónapokban</span></div>
      </div></div>`;
      $$(".scale button").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.v)));
      $("#back").addEventListener("click", () => { if (i > 0) { i--; S.testIdx = i; save(); draw(); } });
    }
    function pick(v) {
      S.answers[i] = v; save();
      $$(".scale button").forEach((b) => b.classList.toggle("sel", +b.dataset.v === v));
      setTimeout(() => {
        if (i < n - 1) { i++; S.testIdx = i; save(); draw(); }
        else { S.results = computeResults(); S.plan = buildPlan(S.results); S.testIdx = 0; testStarted = false; markActive(); save(); location.hash = "#utam"; }
      }, 260);
    }
    const key = (e) => { if (/^[1-5]$/.test(e.key) && !e.target.closest("input,textarea")) pick(+e.key); };
    document.addEventListener("keydown", key); onCleanup(() => document.removeEventListener("keydown", key));
    after(() => draw());
    return "";
  }

  /* =================================================================
     AZ UTAM (eredmények + személyes terv)
     ================================================================= */
  function radar(r) {
    const W = 460, H = 380, cx = 230, cy = 190, R = 125;
    const ids = CK.areas.map((a) => a.id);
    const pt = (i, f) => { const a = ((-90 + i * 60) * Math.PI) / 180; return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f]; };
    const rings = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${ids.map((_, i) => pt(i, f).join(",")).join(" ")}" fill="none" stroke="var(--line)" stroke-width="1"/>`).join("");
    const axes = ids.map((_, i) => { const [x, y] = pt(i, 1); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`; }).join("");
    const poly = ids.map((id, i) => pt(i, Math.max(0.04, r.areas[id].strength / 100)).join(",")).join(" ");
    const dots = ids.map((id, i) => { const [x, y] = pt(i, Math.max(0.04, r.areas[id].strength / 100)); return `<circle cx="${x}" cy="${y}" r="5.5" fill="${ac(id)}" stroke="var(--surface)" stroke-width="2"/>`; }).join("");
    const labels = ids.map((id, i) => {
      const a = ((-90 + i * 60) * Math.PI) / 180; const [x, y] = pt(i, 1.13); const c = Math.cos(a);
      const anchor = c > 0.3 ? "start" : c < -0.3 ? "end" : "middle"; const dy = Math.sin(a) < -0.5 ? -8 : Math.sin(a) > 0.5 ? 14 : 0;
      return `<text x="${x}" y="${y + dy}" text-anchor="${anchor}" font-size="14" fill="var(--ink)" font-family="Figtree, sans-serif" font-weight="600">${AREA[id].name}</text><text x="${x}" y="${y + dy + 17}" text-anchor="${anchor}" font-size="12.5" fill="var(--muted)" font-family="Figtree, sans-serif">${r.areas[id].strength}%</text>`;
    }).join("");
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Területek erőssége">
      ${rings}${axes}
      <text x="${cx + 4}" y="${cy - R * 0.5 + 4}" font-size="10" fill="var(--muted)" font-family="Figtree, sans-serif">50</text>
      <polygon points="${poly}" fill="var(--jade)" fill-opacity=".16" stroke="var(--jade)" stroke-width="2" stroke-linejoin="round"/>
      ${dots}${labels}</svg>`;
  }
  function vPath() {
    const r = S.results;
    if (!r) return `<div class="col"><div class="stack"><span class="eyebrow">Az utam</span><h1>Még nincs személyes utad</h1>
      <p class="muted">A felmérő kitöltése után itt látod majd, mely területekre érdemes most figyelned, és milyen sorrendben haladj a leckékkel.</p></div>
      <div class="row"><a class="btn" href="#teszt">Felmérő indítása</a></div></div>`;
    const sorted = ["jelenlet", ...r.order];
    const focus = r.order.filter((id) => r.areas[id].level === "focus");
    const strong = sorted.filter((id) => r.areas[id].level === "str");
    const allHigh = focus.every((id) => r.areas[id].strength > 65);
    const nx = nextLesson();
    after((v) => { $("#retake", v).addEventListener("click", () => { S.answers = {}; S.testIdx = 0; testStarted = true; save(); location.hash = "#teszt"; }); });
    return `<div class="col wide">
      <div class="stack"><span class="eyebrow">Az utam · felmérés: ${huDate(r.date)}</span>
        <h1>${esc(S.name)}, ez most a te utad</h1>
        <p class="muted" style="max-width:42rem;font-size:1.06rem">A diagram azt mutatja, mennyire érzed erősnek magad az egyes területeken. A kisebb értékek nem hibák. Ezek azok a helyek, ahol most a legtöbbet nőhetsz.</p></div>
      <section class="card radar-wrap">
        <div>${radar(r)}</div>
        <div class="stack">
          ${sorted.map((id) => `<div class="area-row" style="--c:${ac(id)}"><span class="nm"><i class="dot"></i>${AREA[id].full}</span>${levelChip(r.areas[id].level)}<div class="bar"><i style="width:${r.areas[id].strength}%"></i></div></div>`).join("")}
        </div>
      </section>
      <section class="grid2">
        <div class="card stack"><span class="eyebrow">Fő fókusz</span>
          ${focus.map((id) => `<div class="stack" style="gap:4px"><h3 style="color:${ac(id)}">${AREA[id].full} <span class="small muted">· ${AREA[id].pali}</span></h3><p class="small">${AREA[id].desc}</p></div>`).join("")}
          ${allHigh ? `<p class="small muted">Minden területen viszonylag erősnek érzed magad. Ezek a te relatív növekedési pontjaid.</p>` : ""}
        </div>
        <div class="card stack"><span class="eyebrow">Amire építhetsz</span>
          ${strong.length ? strong.map((id) => `<div class="stack" style="gap:4px"><h3 style="color:${ac(id)}">${AREA[id].full}</h3><p class="small muted">${AREA[id].short} Ez most az egyik erősséged, támaszkodj rá a többi terület fejlesztésében.</p></div>`).join("") : `<p class="small muted">Most minden terület fejlődési lehetőség. Ez nem baj: így minden lépés látható változást hozhat. A jelenléttel kezdünk, mert az mindenre hat.</p>`}
          <p class="small muted">A jelenlét leckéi minden út elején állnak, mert az önmegfigyelés nélkül a többi gyakorlat sem tud gyökeret ereszteni.</p>
        </div>
      </section>
      <section class="card stack">
        <div class="row between"><div class="stack" style="gap:4px"><span class="eyebrow">Személyes leckesorrend</span><h2>${S.plan.length} lecke, a te tempódban</h2></div>
        ${nx ? `<a class="btn" href="#lecke-${nx}">Folytatás</a>` : ""}</div>
        <p class="small muted">Javaslat: hetente 2–3 lecke, közben naponta néhány perc gyakorlás. Egy-egy lecke feladatával érdemes 2–3 napig élni, mielőtt továbblépsz.</p>
        <ol class="path">
          ${S.plan.map((id, k) => { const L = LESSON[id]; const st = S.done[id] ? "done" : id === nx ? "next" : ""; return `<li class="${st}"><span class="idx">${S.done[id] ? ic("check").replace("<svg", '<svg width="14" height="14"') : k + 1}</span>
            <div class="stack" style="gap:2px;min-width:0"><a href="#lecke-${id}">${L.title}</a><span class="meta"><i class="dot" style="--c:${ac(L.area)}"></i>${AREA[L.area].name} · ${L.min} perc</span></div>
            ${id === nx ? '<span class="chip focus">Következő</span>' : S.done[id] ? '<span class="chip dev">Kész</span>' : ""}</li>`; }).join("")}
        </ol>
      </section>
      <div class="row"><button class="btn ghost" id="retake">Felmérő újra kitöltése</button><span class="small muted">Az elvégzett leckék és a napló megmaradnak.</span></div>
    </div>`;
  }

  /* =================================================================
     TANANYAG
     ================================================================= */
  let libFilter = "all";
  function vLibrary() {
    const inPlan = new Set(S.plan);
    const draw = () => {
      const areas = CK.areas.filter((a) => libFilter === "all" || CK.lessons.some((l) => l.area === a.id && inPlan.has(l.id)));
      $("#libs").innerHTML = areas.map((a) => {
        const ls = CK.lessons.filter((l) => l.area === a.id && (libFilter === "all" || inPlan.has(l.id)));
        const d = ls.filter((l) => S.done[l.id]).length;
        return `<section class="stack" style="--c:${ac(a.id)};gap:16px">
          <div class="area-head"><div class="area-glyph" aria-hidden="true">${a.glyph}</div>
            <div class="stack" style="gap:6px"><div class="row" style="gap:10px"><h2>${a.full}</h2>${S.results ? levelChip(S.results.areas[a.id].level) : ""}</div>
            <span class="small muted">${a.pali} · ${d}/${ls.length} kész</span><p class="muted" style="max-width:44rem">${a.desc}</p></div></div>
          <div class="lesson-list">${ls.map((l) => `<a class="lesson-item" href="#lecke-${l.id}"><span class="t">${l.title}</span><span class="l">${l.lead}</span>
            <span class="foot">${S.done[l.id] ? `<span class="check">${ic("check")}</span> Kész ·` : ""} ${l.min} perc ${inPlan.has(l.id) && !S.done[l.id] ? '<span class="chip dev">Az utadon</span>' : ""}</span></a>`).join("")}</div>
        </section>`;
      }).join('<hr class="soft">');
      $$(".seg button").forEach((b) => b.classList.toggle("on", b.dataset.f === libFilter));
    };
    after((v) => { $$(".seg button", v).forEach((b) => b.addEventListener("click", () => { libFilter = b.dataset.f; draw(); })); draw(); });
    return `<div class="col wide">
      <div class="row between" style="align-items:end"><div class="stack"><span class="eyebrow">Tananyag</span><h1>Hat terület, harminc lecke</h1>
      <p class="muted" style="max-width:40rem">Minden lecke egy keleti tanításra épül: buddhista szövegekre, a Tao Te Kingre, Konfuciuszra, a Bhagavad Gítára és a zen hagyományra, és mindegyikhez tartozik egy gyakorlat és egy napi feladat.</p></div>
      ${S.plan.length ? `<div class="seg" role="group" aria-label="Szűrés"><button data-f="all">Minden lecke</button><button data-f="plan">Csak az utam</button></div>` : ""}</div>
      <div id="libs" class="stack" style="gap:44px"></div></div>`;
  }

  /* =================================================================
     LECKE
     ================================================================= */
  function vLesson(id) {
    const L = LESSON[id]; const A = AREA[L.area];
    const seq = S.plan.includes(id) ? S.plan : CK.lessons.filter((l) => l.area === L.area).map((l) => l.id);
    const pos = seq.indexOf(id); const prev = seq[pos - 1], next = seq[pos + 1];
    const steps = S.steps[id] || {}; const refl = S.reflect[id] || {};
    after((v) => {
      $$(".practice input", v).forEach((cb) => cb.addEventListener("change", () => {
        S.steps[id] = S.steps[id] || {}; S.steps[id][cb.dataset.i] = cb.checked; save(); cb.closest("li").classList.toggle("ok", cb.checked);
      }));
      $$("textarea[data-r]", v).forEach((ta) => {
        let t; ta.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => {
          S.reflect[id] = S.reflect[id] || {}; S.reflect[id][ta.dataset.r] = ta.value; save();
          const s = $(`#saved-${ta.dataset.r}`, v); s.classList.add("show"); setTimeout(() => s.classList.remove("show"), 1400);
        }, 500); });
      });
      $("#complete", v).addEventListener("click", () => {
        if (S.done[id]) { delete S.done[id]; save(); route(); return; }
        S.done[id] = today(); markActive(); save(); bell(262, 0.12, 4); toast("Lecke teljesítve. Szép munka!");
        route();
      });
    });
    return `<article class="col">
      <nav class="crumbs" aria-label="Útvonal"><a href="#tananyag">Tananyag</a><span>/</span><span style="color:${ac(L.area)}">${A.full}</span></nav>
      <header class="lesson-head" style="--c:${ac(L.area)}">
        <span class="row small muted" style="gap:8px"><i class="dot"></i>${A.pali} · ${L.min} perc ${S.done[id] ? '· <span class="chip dev">Teljesítve</span>' : ""}</span>
        <h1>${L.title}</h1><p class="lead">${L.lead}</p>
      </header>
      ${L.story ? `<section class="story"><h3>${L.story.title}</h3>${L.story.text.map((p) => `<p>${p}</p>`).join("")}</section>` : ""}
      <section class="prose">${L.body.map((p) => `<p>${p}</p>`).join("")}</section>
      <section class="wisdom"><q>${L.wisdom.t}</q><cite>${L.wisdom.s}</cite><span class="glyph">${A.glyph}</span></section>
      <section class="card practice stack"><span class="eyebrow">Gyakorlat</span><h2>${L.practice.title}</h2>
        <ol>${L.practice.steps.map((s, i) => `<li class="${steps[i] ? "ok" : ""}"><label><input type="checkbox" data-i="${i}" ${steps[i] ? "checked" : ""}><span>${s}</span></label></li>`).join("")}</ol>
        ${L.note ? `<p class="note">${L.note}</p>` : ""}
        ${L.tool ? `<div class="row"><a class="btn soft" href="${toolHref(L.tool)}">${ic(L.tool.type === "med" ? "lotus" : L.tool.type === "breath" ? "wind" : "leaf").replace("<svg", '<svg width="18" height="18"')} ${L.tool.label}</a></div>` : ""}
      </section>
      <section class="task">${ic("leaf")}<div class="stack" style="gap:6px"><span class="eyebrow">Mai feladat</span><p>${L.task}</p></div></section>
      <section class="stack"><span class="eyebrow">Elmélkedés</span><h2>Írd le, ami benned van</h2>
        <p class="small muted">Nem kell szépen fogalmaznod. A válaszaid automatikusan mentődnek, és a Naplóban is megtalálod őket.</p>
        ${L.reflect.map((q, i) => `<div><label class="q" for="r-${id}-${i}">${q}</label><textarea id="r-${id}-${i}" data-r="${i}" placeholder="Írj ide…">${esc(refl[i] || "")}</textarea><span class="saved" id="saved-${i}">Mentve</span></div>`).join("")}
      </section>
      <section class="complete-bar">
        <div class="stack" style="gap:2px"><b>${S.done[id] ? "Ezt a leckét már teljesítetted." : "Elolvastad, kipróbáltad a gyakorlatot?"}</b><span class="small muted">${S.done[id] ? "Bármikor visszatérhetsz hozzá." : "Jelöld késznek, és lépj tovább, amikor készen állsz."}</span></div>
        <button class="btn ${S.done[id] ? "ghost" : ""}" id="complete">${S.done[id] ? "Visszavonás" : "Lecke teljesítve"}</button>
      </section>
      <nav class="row between">
        ${prev ? `<a class="btn ghost sm" href="#lecke-${prev}">${ic("arrowL").replace("<svg", '<svg width="16" height="16"')} ${LESSON[prev].title}</a>` : "<span></span>"}
        ${next ? `<a class="btn ${S.done[id] ? "" : "ghost"} sm" href="#lecke-${next}">${LESSON[next].title} ${ic("arrowR").replace("<svg", '<svg width="16" height="16"')}</a>` : ""}
      </nav>
    </article>`;
  }

  /* =================================================================
     GYAKORLÁS – központ
     ================================================================= */
  function vPractice() {
    const card = (href, icon, t, d) => `<a class="card linkcard" href="${href}"><span class="icon-tile">${ic(icon)}</span><span class="t">${t}</span><span class="d">${d}</span></a>`;
    return `<div class="col wide">
      <div class="stack"><span class="eyebrow">Gyakorlás</span><h1>A gyakorlás terme</h1><p class="muted" style="max-width:40rem">A tanítás csak akkor válik a sajátoddá, ha gyakorlod. Itt mindent megtalálsz, a két perces légzéstől a mélyebb meditációig.</p></div>
      <section class="stack"><h2>Légzőgyakorlatok</h2><div class="grid3">
        ${CK.breathing.map((b) => card("#legzes-" + b.id, "wind", b.name, `<span class="chip" style="margin-bottom:4px">${b.tag}</span><br>${b.desc}`)).join("")}
      </div></section>
      <section class="stack"><h2>Vezetett meditációk</h2><div class="grid3">
        ${CK.meditations.map((m) => card("#meditacio-" + m.id, m.id === "hegy" ? "mountain" : m.id === "metta" || m.id === "onegyutterzes" ? "heart" : "lotus", m.title, `${Math.round(m.steps.reduce((s, x) => s + x[0], 0) / 60)} perc · ${m.desc}`)).join("")}
      </div></section>
      <section class="stack"><h2>Eszközök</h2><div class="grid3">
        ${card("#irigyseg-atalakito", "seed", "Irigység-átalakító", "Öt lépés, amely az irigység szúrását irányjelzővé és jókívánsággá alakítja.")}
        ${card("#itelet-atalakito", "compass", "Ítélet-átalakító", "Tény vagy történet? Egy gyors útmutató, ha valakiről túl gyorsan ítélkeznél.")}
        ${card("#ertekek", "compass", "Értékiránytű", "Válaszd ki az 5 legfontosabb értékedet, hogy önállóbban dönthess.")}
        ${card("#kihivas", "calendar", "21 napos kihívás", "Hét apró napi szokás, hogy a változás beépüljön a hétköznapokba.")}
        ${card("#idozito", "timer", "Meditációs időzítő", "Csendes ülés tibeti tálhanggal, szabadon választható időtartammal.")}
        ${card("#kartya", "card", "Bölcsességkártyák", "Húzz egy lapot, és vidd magaddal a mondatot egész nap.")}
      </div></section>
    </div>`;
  }
  const vBreathList = () => { location.replace("#gyakorlas"); return ""; };
  const vMedList = () => { location.replace("#gyakorlas"); return ""; };

  /* ---------- légzés lejátszó ---------- */
  function vBreath(id) {
    const b = BR[id]; let rounds = b.rounds;
    const cycle = b.phases.reduce((s, p) => s + p[1], 0);
    let timer = null, running = false, pi = 0, round = 1, remain = 0, startedAt = 0;
    after((v) => {
      const orb = $(".breath-orb", v), lab = $("#bl", v), cnt = $("#bc", v), rnd = $("#br", v), go = $("#go", v), tot = $("#tot", v);
      const scaleFor = (k) => (k === "in" || k === "hold" ? 1 : 0.5);
      const updTot = () => { tot.textContent = `${rounds} kör · kb. ${fmtTime(cycle * rounds)}`; $("#rn", v).textContent = rounds + " kör"; };
      function phase() {
        const [k, s, l] = b.phases[pi];
        orb.style.transitionDuration = (k === "hold" || k === "hold0" ? 0.3 : s) + "s";
        orb.style.transform = `scale(${scaleFor(k)})`;
        lab.textContent = l; remain = s; cnt.textContent = remain; rnd.textContent = `${round}. kör / ${rounds}`; tone(k);
      }
      function tick() {
        remain--;
        if (remain > 0) { cnt.textContent = remain; return; }
        pi++;
        if (pi >= b.phases.length) { pi = 0; round++; if (round > rounds) return finish(); }
        phase();
      }
      function finish() {
        clearInterval(timer); running = false; addSeconds(Math.round((Date.now() - startedAt) / 1000)); save();
        orb.style.transitionDuration = "2s"; orb.style.transform = "scale(.75)";
        lab.textContent = "Kész"; cnt.textContent = ""; rnd.textContent = "Figyeld meg, hogyan érzed most magad."; bell(220, 0.18, 6);
        go.innerHTML = ic("play").replace("<svg", '<svg width="18" height="18"') + " Újra"; pi = 0; round = 1;
      }
      go.addEventListener("click", () => {
        if (running) { clearInterval(timer); running = false; orb.style.transitionDuration = "0s"; orb.style.transform = getComputedStyle(orb).transform; go.innerHTML = ic("play").replace("<svg", '<svg width="18" height="18"') + " Folytatás"; lab.textContent = "Szünet"; return; }
        audio(); if (!startedAt || round === 1 && pi === 0) startedAt = Date.now();
        running = true; go.innerHTML = ic("pause").replace("<svg", '<svg width="18" height="18"') + " Szünet"; wake();
        phase(); timer = setInterval(tick, 1000);
      });
      $("#reset", v).addEventListener("click", () => { clearInterval(timer); running = false; pi = 0; round = 1; startedAt = 0; orb.style.transitionDuration = "1s"; orb.style.transform = "scale(.5)"; lab.textContent = "Kényelmes ülés"; cnt.textContent = ""; rnd.textContent = ""; go.innerHTML = ic("play").replace("<svg", '<svg width="18" height="18"') + " Indítás"; });
      $("#minus", v).addEventListener("click", () => { rounds = Math.max(1, rounds - 1); updTot(); });
      $("#plus", v).addEventListener("click", () => { rounds = Math.min(60, rounds + 1); updTot(); });
      $("#snd", v).addEventListener("change", (e) => { S.sound = e.target.checked; save(); });
      updTot();
      onCleanup(() => clearInterval(timer));
    });
    return `<div class="col">
      <nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>Légzés</span></nav>
      <div class="stack"><span class="eyebrow">${b.tag}</span><h1>${b.name}</h1><p class="muted">${b.desc}</p></div>
      <section class="card player">
        <div class="breath-stage"><div class="breath-ring"></div><div class="breath-orb"></div>
          <div class="breath-label"><b id="bl">Kényelmes ülés</b><span id="bc"></span></div></div>
        <p class="small muted" id="br" style="min-height:1.4em"></p>
        <div class="row" style="justify-content:center"><button class="btn" id="go">${ic("play").replace("<svg", '<svg width="18" height="18"')} Indítás</button><button class="btn ghost" id="reset">${ic("stop").replace("<svg", '<svg width="16" height="16"')} Leállítás</button></div>
        <div class="row" style="justify-content:center;gap:18px">
          <span class="stepper"><button id="minus" aria-label="Kevesebb kör">−</button><span id="rn"></span><button id="plus" aria-label="Több kör">+</button></span>
          <label class="toggle"><input type="checkbox" id="snd" ${S.sound ? "checked" : ""}> Hangjelzés</label>
        </div>
        <p class="small muted" id="tot"></p>
      </section>
      <section class="card stack"><h3>Az ütem</h3>
        <div class="row" style="gap:8px">${b.phases.map((p) => `<span class="chip">${p[2]} · ${p[1]} mp</span>`).join("")}</div>
        <p class="small muted">Ülj egyenes háttal, lazítsd el a vállad és az állkapcsod. Ha szédülsz vagy kellemetlen, térj vissza a természetes légzéshez. A légzésnek kényelmesnek kell maradnia, ne erőltesd.</p>
      </section>
    </div>`;
  }

  /* ---------- meditáció lejátszó ---------- */
  function vMed(id) {
    const m = MED[id]; const total = m.steps.reduce((s, x) => s + x[0], 0);
    let idx = 0, remain = m.steps[0][0], elapsed = 0, timer = null, running = false, begun = false;
    const hasSpeech = "speechSynthesis" in window;
    after((v) => {
      const txt = $("#mt", v), prog = $("#mp", v), time = $("#mtime", v), go = $("#go", v), stepL = $("#ms", v);
      const offset = () => m.steps.slice(0, idx).reduce((s, x) => s + x[0], 0);
      function show(say) {
        txt.classList.add("fade");
        setTimeout(() => { txt.textContent = m.steps[idx][1]; txt.classList.remove("fade"); }, 450);
        stepL.textContent = `${idx + 1}. rész / ${m.steps.length}`;
        if (say) setTimeout(() => speak(m.steps[idx][1]), 500);
      }
      function upd() { prog.style.width = (elapsed / total) * 100 + "%"; time.textContent = `${fmtTime(elapsed)} / ${fmtTime(total)}`; }
      function tick() {
        elapsed++; remain--; upd();
        if (remain <= 0) { idx++; if (idx >= m.steps.length) return finish(); remain = m.steps[idx][0]; show(true); }
      }
      function finish() {
        clearInterval(timer); running = false; addSeconds(elapsed); save(); bell(196, 0.22, 8);
        txt.textContent = `Köszönöm, hogy időt szántál magadra, ${S.name}. Maradj még egy pillanatig ebben a csendben.`;
        speak("Köszönöm, hogy időt szántál magadra."); stepL.textContent = "Vége";
        go.innerHTML = ic("play").replace("<svg", '<svg width="18" height="18"') + " Újrakezdés";
        idx = 0; remain = m.steps[0][0]; elapsed = 0; begun = false;
      }
      go.addEventListener("click", () => {
        if (running) { clearInterval(timer); running = false; try { speechSynthesis.pause(); } catch (e) {} go.innerHTML = ic("play").replace("<svg", '<svg width="18" height="18"') + " Folytatás"; return; }
        audio(); running = true; wake();
        go.innerHTML = ic("pause").replace("<svg", '<svg width="18" height="18"') + " Szünet";
        if (!begun) { begun = true; bell(196, 0.2, 7); show(false); setTimeout(() => { if (running) speak(m.steps[idx][1]); }, 1800); }
        else { try { speechSynthesis.resume(); } catch (e) {} }
        timer = setInterval(tick, 1000);
      });
      $("#next", v).addEventListener("click", () => { if (idx < m.steps.length - 1) { elapsed = offset() + m.steps[idx][0]; idx++; remain = m.steps[idx][0]; show(running); upd(); begun = true; } });
      $("#prev", v).addEventListener("click", () => { if (idx > 0) { idx--; elapsed = offset(); remain = m.steps[idx][0]; show(running); upd(); } });
      $("#snd", v).addEventListener("change", (e) => { S.sound = e.target.checked; save(); });
      const sp = $("#spk", v); if (sp) sp.addEventListener("change", (e) => { S.speak = e.target.checked; save(); if (!S.speak) try { speechSynthesis.cancel(); } catch (er) {} });
      upd(); stepL.textContent = `${m.steps.length} rész`;
      onCleanup(() => clearInterval(timer));
    });
    return `<div class="col">
      <nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>Meditáció</span></nav>
      <div class="stack"><span class="eyebrow" style="color:${ac(m.area)}">${AREA[m.area].full} · ${Math.round(total / 60)} perc</span><h1>${m.title}</h1><p class="muted">${m.desc}</p></div>
      <section class="card player">
        <span class="eyebrow" id="ms"></span>
        <p class="med-text" id="mt">${m.steps[0][1]}</p>
        <div style="width:100%;max-width:30rem" class="stack"><div class="bar"><i id="mp" style="width:0"></i></div><span class="small muted num" id="mtime"></span></div>
        <div class="row" style="justify-content:center">
          <button class="btn ghost sm" id="prev" aria-label="Előző rész">${ic("skipB").replace("<svg", '<svg width="16" height="16"')}</button>
          <button class="btn" id="go">${ic("play").replace("<svg", '<svg width="18" height="18"')} Indítás</button>
          <button class="btn ghost sm" id="next" aria-label="Következő rész">${ic("skipF").replace("<svg", '<svg width="16" height="16"')}</button>
        </div>
        <div class="row" style="justify-content:center;gap:18px">
          <label class="toggle"><input type="checkbox" id="snd" ${S.sound ? "checked" : ""}> Tálhang</label>
          ${hasSpeech ? `<label class="toggle"><input type="checkbox" id="spk" ${S.speak ? "checked" : ""}> Felolvasás${huVoice ? "" : " (ha van magyar hang)"}</label>` : ""}
        </div>
      </section>
      <p class="small muted">Tipp: olvasd a szöveget, majd csukd be a szemed, amíg a következő rész meg nem jelenik. A szöveg magától lép tovább.</p>
    </div>`;
  }

  /* ---------- időzítő ---------- */
  function vTimer() {
    let mins = 10, interval = 0, timer = null, remain = 0, total = 0, running = false;
    const C = 2 * Math.PI * 108;
    after((v) => {
      const ring = $("#ring", v), tt = $("#tt", v), go = $("#go", v);
      const pills = (sel, val, set) => $$(sel + " button", v).forEach((b) => { b.classList.toggle("on", +b.dataset.v === val); b.onclick = () => { set(+b.dataset.v); pills(sel, +b.dataset.v, set); if (!running) { tt.textContent = fmtTime(mins * 60); } }; });
      pills("#mins", mins, (x) => (mins = x)); pills("#ivl", interval, (x) => (interval = x));
      const draw = () => { ring.style.strokeDashoffset = C * (1 - (total ? (total - remain) / total : 0)); tt.textContent = fmtTime(remain); };
      function stop(done) {
        clearInterval(timer); running = false; go.innerHTML = ic("play").replace("<svg", '<svg width="18" height="18"') + " Indítás";
        if (done) { bell(196, 0.24, 9); addSeconds(total); save(); toast("Az ülés véget ért. Köszönöm, hogy megálltál."); }
        else if (total - remain > 30) { addSeconds(total - remain); save(); }
        remain = 0; total = 0; ring.style.strokeDashoffset = 0; tt.textContent = fmtTime(mins * 60);
      }
      go.addEventListener("click", () => {
        if (running) return stop(false);
        audio(); total = mins * 60; remain = total; running = true; wake(); bell(196, 0.2, 7);
        go.innerHTML = ic("stop").replace("<svg", '<svg width="16" height="16"') + " Befejezés"; draw();
        timer = setInterval(() => { remain--; draw(); if (interval && remain > 0 && (total - remain) % (interval * 60) === 0) bell(262, 0.1, 4); if (remain <= 0) stop(true); }, 1000);
      });
      tt.textContent = fmtTime(mins * 60);
      onCleanup(() => clearInterval(timer));
    });
    return `<div class="col">
      <nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>Időzítő</span></nav>
      <div class="stack"><span class="eyebrow">Csendes ülés</span><h1>Meditációs időzítő</h1><p class="muted">Nincs instrukció, csak te és a csend. A kezdetet és a véget egy tibeti tál hangja jelzi. Figyeld a légzésedet, és ha elkalandozol, szelíden térj vissza.</p></div>
      <section class="card player">
        <svg class="ring-svg" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="108" fill="none" stroke="var(--surface-2)" stroke-width="6"/>
          <circle id="ring" cx="120" cy="120" r="108" fill="none" stroke="var(--jade)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0" transform="rotate(-90 120 120)" style="transition:stroke-dashoffset 1s linear"/>
          <text x="120" y="132" text-anchor="middle" font-size="40" fill="var(--ink)" font-family="Marcellus, serif" id="tt"></text></svg>
        <div class="stack" style="align-items:center;gap:8px"><span class="small muted">Időtartam (perc)</span><div class="pills" id="mins">${[3, 5, 10, 15, 20, 30].map((x) => `<button data-v="${x}">${x}</button>`).join("")}</div></div>
        <div class="stack" style="align-items:center;gap:8px"><span class="small muted">Köztes harang</span><div class="pills" id="ivl"><button data-v="0">Nincs</button><button data-v="1">Percenként</button><button data-v="5">5 percenként</button></div></div>
        <button class="btn" id="go">${ic("play").replace("<svg", '<svg width="18" height="18"')} Indítás</button>
      </section>
    </div>`;
  }

  /* =================================================================
     ÁTALAKÍTÓK (varázslók)
     ================================================================= */
  const WIZ = {
    irigyseg: { title: "Irigység-átalakító", eyebrow: "Muditá-gyakorlat", intro: "Az irigység nem szégyen, hanem egy jelzés. Ez az öt lépés segít meghallani, mit üzen, és a szúrást jókívánsággá alakítani.", type: "irigyseg",
      steps: [
        { t: "Mi történt?", h: "Írd le röviden, tényszerűen: kire és mire érzel most irigységet? Nem kell szépíteni, ezt csak te látod.", f: [{ k: "mi", ty: "ta", ph: "Pl. Eszter dicséretet kapott a vezetőtől a projektért, amin én is dolgoztam." }] },
        { t: "Mit érzel, és hol?", h: "Nevezd meg, és figyeld meg a testedben. Ami megnevezhető, az kezelhető.", f: [{ k: "ero", ty: "range", l: "Milyen erős most az érzés?" }, { k: "test", ty: "ta", l: "Hol érzed a testedben? Milyen más érzés kíséri?", ph: "Pl. szorítás a mellkasban, egy kis szomorúság és sértettség." }] },
        { t: "Mire vágysz valójában?", h: "Az irigység megmutatja, mi fontos neked. Válaszd ki, ami igaz, és fogalmazd meg a saját szavaiddal.", f: [{ k: "vagy", ty: "pills", o: ["Elismerés", "Biztonság", "Szabadság", "Szeretet", "Siker", "Könnyedség", "Kapcsolat", "Pihenés", "Fejlődés", "Önbizalom"] }, { k: "vagyText", ty: "ta", l: "Ha ez nekem is meglenne, mit adna?", ph: "Pl. Azt érezném, hogy számítok, és látják, mennyit dolgozom." }] },
        { t: "Mi a te következő lépésed?", h: "Nem az a kérdés, mi vehető el tőle. Az a kérdés, mit tehetsz te magadért. Elég egy kis lépés ezen a héten.", f: [{ k: "lepes", ty: "ta", ph: "Pl. Megkérem a vezetőmet egy rövid visszajelzésre a saját munkámról." }] },
        { t: "Muditá-kívánság", h: "Fogalmazz meg egy jókívánságot neki. Nem kell, hogy már teljesen így érezd. Mondd el magadban lassan háromszor, mindegyiket egy-egy lélegzettel.", f: [{ k: "kivansag", ty: "ta", def: "Örülök, hogy ez neked sikerült. Az örömöd nem vesz el tőlem semmit. Bárcsak megmaradna a boldogságod." }, { k: "utana", ty: "range", l: "És most milyen erős az irigység?" }] }
      ],
      sum: [["mi", "Mi történt"], ["ero", "Erősség előtte"], ["test", "Testi érzés"], ["vagy", "Amire vágyom"], ["vagyText", "Amit adna"], ["lepes", "Következő lépésem"], ["kivansag", "Jókívánságom"], ["utana", "Erősség utána"]] },
    itelet: { title: "Ítélet-átalakító", eyebrow: "Upekkhá-gyakorlat", intro: "Ha valakiről gyorsan és keményen ítélkezel, ez az öt lépés segít különválasztani a tényt a történettől, és kíváncsisággal nézni rá.", type: "itelet",
      steps: [
        { t: "Mi a gondolatod?", h: "Kiről ítélkezel, és mit gondolsz róla? Írd le úgy, ahogy a fejedben szól.", f: [{ k: "gondolat", ty: "ta", ph: "Pl. Gábor nagyképű, mindig mindent jobban tud." }] },
        { t: "Tény vagy történet?", h: "Mit rögzítene egy videókamera? Csak a látható, hallható viselkedést írd le, értékelés nélkül.", f: [{ k: "teny", ty: "ta", ph: "Pl. A tegnapi megbeszélésen kétszer közbeszólt, amikor beszéltem." }] },
        { t: "Más magyarázatok", h: "Írj legalább két másik lehetséges okot a viselkedésére. Mi lehet mögötte? Félelem, nyomás, fáradtság, más neveltetés?", f: [{ k: "magyarazat", ty: "ta", ph: "Pl. Lehet, hogy ő is bizonytalan, és így próbál bizonyítani. Lehet, hogy a vezetője nyomást tesz rá." }] },
        { t: "Csakúgy, mint én", h: "Miben hasonlít rád? Milyen szükséglete vagy félelme lehet, ami neked is ismerős?", f: [{ k: "hasonlo", ty: "ta", ph: "Pl. Ő is szeretné, ha elismernék. Én is szoktam túl sokat beszélni, amikor ideges vagyok." }] },
        { t: "Mit választasz?", h: "Mit szeretnél ezután tenni vagy elengedni? Az elfogadás nem jelenti azt, hogy mindennel egyetértesz.", f: [{ k: "valasz", ty: "pills", o: ["Elengedem", "Beszélek vele", "Határt húzok", "Kíváncsi leszek", "Jót kívánok neki"] }, { k: "valaszText", ty: "ta", l: "Konkrétan:", ph: "Pl. Legközelebb nyugodtan jelzem, hogy szeretném befejezni a gondolatomat." }] }
      ],
      sum: [["gondolat", "Az eredeti ítélet"], ["teny", "A tény"], ["magyarazat", "Más magyarázatok"], ["hasonlo", "Csakúgy, mint én"], ["valasz", "Amit választok"], ["valaszText", "Konkrétan"]] }
  };
  function vWizard(kind) {
    const W = WIZ[kind]; let step = 0; const data = {};
    W.steps.forEach((s) => s.f.forEach((f) => { data[f.k] = f.ty === "pills" ? [] : f.ty === "range" ? 5 : f.def || ""; }));
    function draw() {
      const v = $("#wiz");
      if (step >= W.steps.length) {
        v.innerHTML = `<section class="card stack summary"><span class="eyebrow">Összegzés</span><h2>Ezt fedezted fel</h2><dl>
          ${W.sum.filter(([k]) => (Array.isArray(data[k]) ? data[k].length : String(data[k]).trim())).map(([k, l]) => `<div><dt>${l}</dt><dd>${esc(Array.isArray(data[k]) ? data[k].join(", ") : k === "ero" || k === "utana" ? data[k] + " / 10" : data[k])}</dd></div>`).join("")}
          </dl>${kind === "irigyseg" && data.ero > data.utana ? `<p class="small" style="color:var(--jade)">Az érzés ereje ${data.ero}-ről ${data.utana}-re csökkent.</p>` : ""}
          <div class="row"><button class="btn" id="wsave">Mentés a naplóba</button><button class="btn ghost" id="wback">Vissza</button></div></section>`;
        $("#wsave").onclick = () => { S.journal.unshift({ id: Date.now(), date: today(), type: W.type, data: JSON.parse(JSON.stringify(data)) }); markActive(); save(); toast("Elmentve a naplóba."); location.hash = "#naplo"; };
        $("#wback").onclick = () => { step--; draw(); };
        $("#wsteps").innerHTML = W.steps.map(() => '<i class="on"></i>').join("");
        return;
      }
      const s = W.steps[step];
      $("#wsteps").innerHTML = W.steps.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("");
      v.innerHTML = `<section class="card stack"><span class="eyebrow num">${step + 1}. lépés / ${W.steps.length}</span><h2>${s.t}</h2><p class="muted">${s.h}</p>
        ${s.f.map((f) => {
          const id = "w-" + f.k;
          if (f.ty === "ta") return `<div>${f.l ? `<label class="q" for="${id}">${f.l}</label>` : ""}<textarea id="${id}" data-k="${f.k}" placeholder="${esc(f.ph || "")}">${esc(data[f.k])}</textarea></div>`;
          if (f.ty === "range") return `<div><label class="q" for="${id}">${f.l} <b class="num" id="${id}-v">${data[f.k]}</b> / 10</label><input type="range" id="${id}" min="1" max="10" value="${data[f.k]}" data-k="${f.k}"></div>`;
          return `<div class="pills" data-k="${f.k}">${f.o.map((o) => `<button type="button" class="${data[f.k].includes(o) ? "on" : ""}">${o}</button>`).join("")}</div>`;
        }).join("")}
        <div class="row between"><button class="btn ghost" id="wprev" ${step === 0 ? "disabled" : ""}>Vissza</button><button class="btn" id="wnext">${step === W.steps.length - 1 ? "Összegzés" : "Tovább"}</button></div></section>`;
      $$("textarea", v).forEach((t) => t.addEventListener("input", () => (data[t.dataset.k] = t.value)));
      $$("input[type=range]", v).forEach((r) => r.addEventListener("input", () => { data[r.dataset.k] = +r.value; $("#" + r.id + "-v").textContent = r.value; }));
      $$(".pills", v).forEach((p) => $$("button", p).forEach((b) => b.addEventListener("click", () => { const a = data[p.dataset.k]; const i = a.indexOf(b.textContent); if (i >= 0) a.splice(i, 1); else a.push(b.textContent); b.classList.toggle("on"); })));
      $("#wprev").onclick = () => { step--; draw(); };
      $("#wnext").onclick = () => { step++; draw(); window.scrollTo({ top: 0, behavior: "smooth" }); };
      const first = $("textarea", v); if (first && step > 0) first.focus();
    }
    after(() => draw());
    return `<div class="col"><nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>${W.title}</span></nav>
      <div class="stack"><span class="eyebrow">${W.eyebrow}</span><h1>${W.title}</h1><p class="muted">${W.intro}</p></div>
      <div class="wiz-steps" id="wsteps"></div><div id="wiz"></div></div>`;
  }

  /* =================================================================
     ÉRTÉKIRÁNYTŰ
     ================================================================= */
  function vValues() {
    after((v) => {
      const draw = () => {
        $("#vals", v).innerHTML = CK.values.map((x) => `<button type="button" class="${S.values.includes(x) ? "on" : ""}" ${!S.values.includes(x) && S.values.length >= 5 ? "disabled style='opacity:.4'" : ""}>${x}</button>`).join("");
        $("#vc", v).textContent = `${S.values.length} / 5 kiválasztva`;
        $("#vnotes", v).innerHTML = S.values.length ? S.values.map((x, i) => `<div><label class="q" for="vn-${i}">${i + 1}. ${x}: hogyan jelenik meg ez az életemben, és hol hiányzik?</label><textarea id="vn-${i}" data-v="${esc(x)}" placeholder="Írj ide…">${esc(S.valueNotes[x] || "")}</textarea></div>`).join("") : `<p class="muted small">Válassz ki legalább egy értéket, és itt megjelennek a hozzá tartozó kérdések.</p>`;
        $$("#vals button", v).forEach((b) => b.addEventListener("click", () => { const i = S.values.indexOf(b.textContent); if (i >= 0) S.values.splice(i, 1); else if (S.values.length < 5) S.values.push(b.textContent); save(); draw(); }));
        $$("#vnotes textarea", v).forEach((t) => t.addEventListener("input", () => { S.valueNotes[t.dataset.v] = t.value; save(); }));
      };
      draw();
    });
    return `<div class="col"><nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>Értékiránytű</span></nav>
      <div class="stack"><span class="eyebrow">Szvadharma · a saját utad</span><h1>Értékiránytű</h1><p class="muted">Ha tudod, mi fontos neked, nem kell mások jóváhagyására várnod. Válaszd ki azt az öt értéket, amely nélkül nem te lennél. Ne azt, aminek lennie <em>kellene</em>, hanem azt, ami valóban mozgat.</p></div>
      <section class="card stack"><div class="row between"><h3>Válassz ötöt</h3><span class="small muted num" id="vc"></span></div><div class="pills values-grid" id="vals"></div></section>
      <section class="stack" id="vnotes"></section>
      <section class="task">${ic("compass")}<div class="stack" style="gap:6px"><span class="eyebrow">Használat</span><p>Egy döntés előtt nézd meg az öt értékedet, és kérdezd meg: melyik lehetőség szolgálja a legjobban azt, ami nekem fontos?</p></div></section>
    </div>`;
  }

  /* =================================================================
     BÖLCSESSÉGKÁRTYÁK
     ================================================================= */
  function vCards() {
    let i = Math.floor(Math.random() * CK.wisdom.length);
    after((v) => {
      const card = $("#wcard", v);
      const put = () => { $("q", card).textContent = CK.wisdom[i][0]; $("cite", card).textContent = CK.wisdom[i][1]; };
      put();
      $("#draw", v).addEventListener("click", () => {
        card.classList.add("flip");
        setTimeout(() => { let j; do { j = Math.floor(Math.random() * CK.wisdom.length); } while (j === i); i = j; put(); card.classList.remove("flip"); }, 380);
      });
    });
    return `<div class="col"><nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>Bölcsességkártyák</span></nav>
      <div class="stack"><span class="eyebrow">${CK.wisdom.length} lap</span><h1>Bölcsességkártyák</h1><p class="muted">Húzz egy lapot. Olvasd el lassan háromszor, és vidd magaddal a napodba. Ha jólesik, írd le a naplóba, mit jelent neked ma.</p></div>
      <div class="deck"><section class="wisdom" id="wcard"><q></q><cite></cite><span class="glyph">禅</span></section></div>
      <div class="row"><button class="btn" id="draw">Új lap húzása</button><a class="btn ghost" href="#naplo">Napló</a></div></div>`;
  }

  /* =================================================================
     21 NAPOS KIHÍVÁS
     ================================================================= */
  function vChallenge() {
    const focusAreas = S.results ? Object.keys(S.results.areas).filter((k) => S.results.areas[k].level !== "str") : [];
    if (!S.challengeStart) {
      after((v) => $("#cstart", v).addEventListener("click", () => { S.challengeStart = today(); markActive(); save(); route(); }));
      return `<div class="col"><nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>21 napos kihívás</span></nav>
        <div class="stack"><span class="eyebrow">Szokásépítés</span><h1>21 nap, apró lépésekkel</h1><p class="muted">A jellem a szokásokból épül. A következő három hétben naponta pipáld ki, melyik apró gyakorlatot sikerült megtenned. Nem kell mindet minden nap, elég, ha elindulsz.</p></div>
        <section class="card stack">${CK.habits.map((h) => `<div class="row" style="gap:10px"><i class="dot" style="--c:${ac(h.a)}"></i><span>${h.t}</span>${focusAreas.includes(h.a) ? '<span class="chip dev">Neked ajánlott</span>' : ""}</div>`).join("")}</section>
        <div class="row"><button class="btn" id="cstart">Kihívás indítása ma</button></div></div>`;
    }
    const [y, mo, d] = S.challengeStart.split("-").map(Number); const start = new Date(y, mo - 1, d);
    const dayN = Math.floor((new Date(new Date().toDateString()) - start) / 864e5) + 1;
    const dates = Array.from({ length: 21 }, (_, k) => dstr(new Date(y, mo - 1, d + k)));
    const td = today(); const th = S.habits[td] || {};
    after((v) => {
      $$(".habit input", v).forEach((cb) => cb.addEventListener("change", () => { S.habits[td] = S.habits[td] || {}; S.habits[td][cb.dataset.h] = cb.checked; markActive(); save(); route(); }));
      const rs = $("#crestart", v); if (rs) rs.addEventListener("click", () => { $("#cconfirm", v).hidden = false; });
      const ok = $("#cyes", v); if (ok) ok.addEventListener("click", () => { S.challengeStart = today(); save(); route(); });
      const no = $("#cno", v); if (no) no.addEventListener("click", () => { $("#cconfirm", v).hidden = true; });
    });
    const totalChecks = dates.reduce((s, dt) => s + Object.values(S.habits[dt] || {}).filter(Boolean).length, 0);
    return `<div class="col"><nav class="crumbs"><a href="#gyakorlas">Gyakorlás</a><span>/</span><span>21 napos kihívás</span></nav>
      <div class="stack"><span class="eyebrow num">${dayN > 21 ? "A kihívás véget ért" : `${dayN}. nap / 21`}</span><h1>${dayN > 21 ? "Végigcsináltad!" : "Mai apró lépések"}</h1>
      <p class="muted">${dayN > 21 ? `21 nap alatt összesen ${totalChecks} apró jó lépést tettél meg. Kezdhetsz egy újabb kört.` : "Pipáld ki, ami ma sikerült. Holnap új nap."}</p></div>
      ${dayN <= 21 ? `<section class="card stack" style="gap:2px">${CK.habits.map((h) => `<label class="habit"><input type="checkbox" data-h="${h.id}" ${th[h.id] ? "checked" : ""}><span>${h.t}</span>${focusAreas.includes(h.a) ? '<span class="chip dev">Ajánlott</span>' : `<i class="dot" style="--c:${ac(h.a)}"></i>`}</label>`).join("")}</section>` : ""}
      <section class="card stack"><div class="row between"><h3>A 21 nap</h3><span class="small muted num">${totalChecks} pipa összesen</span></div>
        <div class="days">${dates.map((dt, k) => { const c = Object.values(S.habits[dt] || {}).filter(Boolean).length; return `<div class="${c >= 4 ? "full" : c ? "part" : ""} ${dt === td ? "today" : ""}" title="${huDate(dt)}: ${c} szokás">${k + 1}</div>`; }).join("")}</div>
        <div class="row small muted" style="gap:14px"><span class="row" style="gap:6px"><i class="dot" style="--c:var(--jade-soft)"></i>1–3 szokás</span><span class="row" style="gap:6px"><i class="dot" style="--c:var(--jade)"></i>4 vagy több</span></div>
      </section>
      <div class="row"><button class="btn ghost sm" id="crestart">Újrakezdés mától</button></div>
      <div class="confirm" id="cconfirm" hidden>Biztosan újrakezded? A korábbi pipák megmaradnak, de a 21 nap mától számít. <button class="btn sm" id="cyes">Igen, újrakezdem</button><button class="btn ghost sm" id="cno">Mégse</button></div>
    </div>`;
  }

  /* =================================================================
     NAPLÓ
     ================================================================= */
  function entryText(e) {
    if (e.type === "naplo") return [e.mood ? "Hangulat: " + CK.moods[e.mood - 1].l : "", e.emotions && e.emotions.length ? "Érzések: " + e.emotions.join(", ") : "", e.good && e.good.filter(Boolean).length ? "Hálás vagyok: " + e.good.filter(Boolean).join("; ") : "", e.text || ""].filter(Boolean).join("\n");
    const W = WIZ[e.type]; return W.sum.filter(([k]) => e.data[k] && String(e.data[k]).length).map(([k, l]) => `${l}: ${Array.isArray(e.data[k]) ? e.data[k].join(", ") : e.data[k]}`).join("\n");
  }
  function vJournal() {
    let mood = 0; const emos = new Set();
    after((v) => {
      $$(".moods button", v).forEach((b) => b.addEventListener("click", () => { mood = +b.dataset.v; $$(".moods button", v).forEach((x) => x.classList.toggle("on", x === b)); }));
      $$("#emos button", v).forEach((b) => b.addEventListener("click", () => { emos.has(b.textContent) ? emos.delete(b.textContent) : emos.add(b.textContent); b.classList.toggle("on"); }));
      $("#jsave", v).addEventListener("click", () => {
        const good = [1, 2, 3].map((k) => $("#g" + k, v).value.trim()); const text = $("#jt", v).value.trim();
        if (!mood && !emos.size && !good.some(Boolean) && !text) { toast("Írj vagy jelölj be valamit a mentéshez."); return; }
        S.journal.unshift({ id: Date.now(), date: today(), type: "naplo", mood, emotions: [...emos], good, text }); markActive(); save(); toast("Bejegyzés elmentve."); route();
      });
      $$(".entry .x", v).forEach((b) => b.addEventListener("click", () => {
        const box = b.closest(".entry"); const c = $(".confirm", box);
        if (c) { c.hidden = false; return; }
      }));
      $$(".entry [data-del]", v).forEach((b) => b.addEventListener("click", () => { S.journal = S.journal.filter((e) => String(e.id) !== b.dataset.del); save(); route(); }));
      $$(".entry [data-keep]", v).forEach((b) => b.addEventListener("click", () => { b.closest(".confirm").hidden = true; }));
      const cp = $("#copy", v);
      if (cp) cp.addEventListener("click", () => {
        const txt = S.journal.map((e) => `${huDate(e.date)} – ${e.type === "naplo" ? "Napló" : WIZ[e.type].title}\n${entryText(e)}`).join("\n\n");
        const fallback = () => { const ta = $("#copyta", v); ta.hidden = false; ta.value = txt; ta.select(); toast("Jelöld ki és másold a szöveget."); };
        try { navigator.clipboard.writeText(txt).then(() => toast("A napló a vágólapra került."), fallback); } catch (e) { fallback(); }
      });
    });
    const reflections = Object.entries(S.reflect).filter(([, o]) => Object.values(o).some((x) => x && x.trim()));
    const label = (e) => (e.type === "naplo" ? "Napló" : WIZ[e.type].title);
    return `<div class="col">
      <div class="stack"><span class="eyebrow">${huDate(today())}</span><h1>Napló</h1><p class="muted">Pár perc este elég. Az írás lelassít, és segít meglátni a mintázatokat, amelyek a napok forgatagában rejtve maradnak.</p></div>
      <section class="card stack">
        <div><span class="q">Milyen ma a belső időjárásod?</span>
          <div class="moods">${CK.moods.map((m) => `<button type="button" data-v="${m.v}" aria-label="${m.l}">${ic("m" + m.v)}<span>${m.c}</span></button>`).join("")}</div></div>
        <div><span class="q">Milyen érzések voltak jelen ma?</span><div class="pills" id="emos">${CK.emotions.map((x) => `<button type="button">${x}</button>`).join("")}</div></div>
        <div><span class="q">Három jó dolog ma, és mi volt benne a te részed</span><div class="stack" style="gap:8px">${[1, 2, 3].map((k) => `<input type="text" id="g${k}" placeholder="${k}.">`).join("")}</div></div>
        <div><label class="q" for="jt">Gondolatok, felismerések</label><textarea id="jt" placeholder="Mit vettél észre ma magadban? Mi volt nehéz? Mire vagy büszke?"></textarea></div>
        <div class="row"><button class="btn" id="jsave">Bejegyzés mentése</button></div>
      </section>
      <section class="stack"><div class="row between"><h2>Korábbi bejegyzések</h2>${S.journal.length ? '<button class="btn ghost sm" id="copy">Az egész napló másolása</button>' : ""}</div>
        <textarea id="copyta" hidden readonly style="min-height:160px"></textarea>
        ${S.journal.length ? `<div class="card" style="padding-block:4px">${S.journal.map((e) => `<div class="entry">
          <div class="head"><span class="chip ${e.type === "naplo" ? "" : "dev"}">${label(e)}</span><span>${huDate(e.date)}</span>${e.mood ? `<span>· ${CK.moods[e.mood - 1].c}</span>` : ""}<button class="x" type="button">Törlés</button></div>
          <div class="body">${esc(entryText(e))}</div>
          <div class="confirm" hidden>Biztosan törlöd ezt a bejegyzést? <button class="btn sm" data-del="${e.id}">Igen, törlöm</button><button class="btn ghost sm" data-keep>Mégse</button></div>
        </div>`).join("")}</div>` : `<p class="muted">Még nincs bejegyzésed. Az első lehet ma este pár sor arról, mi történt benned.</p>`}
      </section>
      ${reflections.length ? `<section class="stack"><h2>Elmélkedéseid a leckékből</h2><div class="card" style="padding-block:4px">${reflections.map(([lid, o]) => `<div class="entry"><div class="head"><span class="chip" style="color:${ac(LESSON[lid].area)}">${AREA[LESSON[lid].area].name}</span><a href="#lecke-${lid}">${LESSON[lid].title}</a></div>
        ${Object.entries(o).filter(([, x]) => x && x.trim()).map(([qi, x]) => `<div><p class="small muted">${LESSON[lid].reflect[qi]}</p><p class="body">${esc(x)}</p></div>`).join("")}</div>`).join("")}</div></section>` : ""}
    </div>`;
  }

  /* =================================================================
     BEÁLLÍTÁSOK
     ================================================================= */
  function vSettings() {
    after((v) => {
      $("#nm", v).addEventListener("change", (e) => { S.name = e.target.value.trim() || "Laura"; save(); toast("Elmentve."); });
      $("#snd", v).addEventListener("change", (e) => { S.sound = e.target.checked; save(); });
      $(".mus", v).addEventListener("change", (e) => setMusic(e.target.checked));
      $("#testbell", v).addEventListener("click", () => { const o = S.sound; S.sound = true; bell(); S.sound = o; });
      $("#reset", v).addEventListener("click", () => ($("#rconf", v).hidden = false));
      $("#rno", v).addEventListener("click", () => ($("#rconf", v).hidden = true));
      $("#ryes", v).addEventListener("click", () => { const n = S.name; S = JSON.parse(JSON.stringify(DEF)); S.name = n; testStarted = false; save(); toast("Minden adat törölve."); location.hash = "#kezdolap"; });
      const box = $("#sync", v);
      if (!box) return;
      const draw = () => {
        if (!box.isConnected) { Sync.onChange = null; return; }
        const u = Sync.user;
        box.innerHTML = u
          ? `<p class="small muted">Bejelentkezve: <strong>${esc(u.email)}</strong>${Sync.lastSync ? ` · utolsó szinkron: ${Sync.lastSync.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}` : ""}</p>
             <div class="row"><button class="btn ghost sm" id="snow">Szinkronizálás most</button><button class="btn ghost sm" id="sout">Kijelentkezés</button></div>`
          : `<p class="small muted">Add meg az e-mail-címed, és küldünk egy belépési linket. Minden eszközön ugyanazzal a címmel lépj be, és a haladásod mindenhol ugyanaz lesz.</p>
             <div class="row"><input type="email" id="semail" placeholder="te@pelda.hu" autocomplete="email" style="max-width:20rem"><button class="btn sm" id="sgo">Belépési link küldése</button></div>`;
        if (u) {
          $("#snow", box).onclick = async () => toast((await Sync.now()) ? "Szinkronizálva." : "A szinkron most nem sikerült.");
          $("#sout", box).onclick = async () => { await Sync.signOut(); toast("Kijelentkeztél. Az adatok ezen az eszközön megmaradnak."); };
        } else {
          $("#sgo", box).onclick = async () => {
            const email = $("#semail", box).value.trim();
            if (!/^\S+@\S+\.\S+$/.test(email)) { toast("Adj meg egy érvényes e-mail-címet."); return; }
            const { error } = await Sync.signIn(email);
            toast(error ? "Nem sikerült elküldeni: " + error.message : "Elküldtük a linket – nézd meg a postafiókod.");
          };
        }
      };
      Sync.onChange = draw; draw();
    });
    return `<div class="col"><div class="stack"><span class="eyebrow">Beállítások</span><h1>Beállítások és adatok</h1></div>
      <section class="card stack"><div><label class="q" for="nm">Hogyan szólítsunk?</label><input type="text" id="nm" value="${esc(S.name)}" style="max-width:20rem"></div>
        <label class="toggle"><input type="checkbox" class="mus" ${S.music ? "checked" : ""}> Meditációs háttérzene (az első kattintásra indul)</label>
        <label class="toggle"><input type="checkbox" id="snd" ${S.sound ? "checked" : ""}> Hangjelzések (tibeti tál, légzésütem)</label>
        <div><button class="btn ghost sm" id="testbell">Tálhang kipróbálása</button></div></section>
      ${Sync.enabled ? `<section class="card stack"><h3>Szinkronizálás több eszközön</h3><div class="stack" id="sync"></div></section>` : ""}
      <section class="card stack"><h3>Az adataid</h3><p class="small muted">${Sync.enabled
        ? "Válaszaid, jegyzeteid és haladásod ebben a böngészőben tárolódnak, és ha bejelentkezel, a fiókodhoz is mentjük őket, így más eszközön is folytathatod. A fiókod adatait csak te látod."
        : "Minden válaszod, jegyzeted és haladásod csak ebben a böngészőben, ezen az eszközön tárolódik. Senki más nem látja. Ha törlöd a böngésző adatait vagy másik eszközt használsz, ezek nem lesznek elérhetők, ezért a fontos naplóbejegyzéseket érdemes időnként kimásolni a Napló oldalon."}</p>
        <div><button class="btn ghost sm" id="reset">Minden adat törlése</button></div>
        <div class="confirm" id="rconf" hidden>Ez véglegesen törli a felmérőt, a haladást és a naplót. <button class="btn sm" id="ryes">Igen, törlöm</button><button class="btn ghost sm" id="rno">Mégse</button></div></section>
      <section class="card stack"><h3>A forrásokról</h3><p class="small muted">A leckékben szereplő idézetek a buddhista páli kánonból (Dhammapada, szutták), Lao-ce Tao Te Kingjéből, Csuang-cétől, Konfuciusz Beszélgetéseiből, a Bhagavad Gítából, Patandzsali Jóga-szútráiból, Sántidévától és a zen hagyományból származnak, saját, szabad magyar fordításban. A pszichológiai háttér (érzelemcímkézés, önegyüttérzés, jóindulatú és rosszindulatú irigység, aktív-építő válasz) a mai kutatásokra támaszkodik.</p>
        <p class="small muted">A Csendkert önismereti eszköz, nem helyettesíti a pszichológus vagy orvos segítségét.</p></section>
    </div>`;
  }

  /* ---------- indítás ---------- */
  $$(".amb").forEach((x) => x.addEventListener("change", (e) => setRain(e.target.checked)));
  $$(".amb-btn").forEach((x) => x.addEventListener("click", () => setRain(!rain)));
  $$(".mus").forEach((x) => x.addEventListener("change", (e) => setMusic(e.target.checked)));
  $$(".mus-btn").forEach((x) => x.addEventListener("click", () => setMusic(!music)));
  // a böngésző csak felhasználói mozdulat után enged hangot: az első kattintásra/billentyűre indul a zene
  musicUI(!!S.music);
  if (S.music) {
    const kick = (e) => {
      if (e.target.closest && e.target.closest(".mus, .mus-btn")) return; // a kapcsoló maga kezeli
      ["pointerdown", "keydown", "touchstart"].forEach((t) => removeEventListener(t, kick, true));
      if (S.music) startMusic();
    };
    ["pointerdown", "keydown", "touchstart"].forEach((t) => addEventListener(t, kick, true));
  }
  route();
})();
