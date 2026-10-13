/* Csendkert – tartalom: területek, felmérő, leckék, meditációk, légzés, bölcsességek */
window.CK = {};

CK.areas = [
  { id: "jelenlet", name: "Jelenlét", full: "Jelenlét és önmegfigyelés", pali: "Szati", glyph: "念",
    short: "Az alap: észrevenni, mi történik benned, mielőtt reagálsz.",
    desc: "Minden belső változás azzal kezdődik, hogy észreveszed a saját gondolataidat és érzéseidet. A jelenlét adja azt a pár másodpercnyi teret, amelyben már választhatsz, hogyan reagálsz." },
  { id: "irigyseg", name: "Együttörülés", full: "Irigységből együttörülés", pali: "Muditá", glyph: "喜",
    short: "Mások sikere ne fájjon, hanem mutasson utat.",
    desc: "A muditá a mások örömén érzett öröm. Ez a terület arról szól, hogyan alakítható az összehasonlítás és az irigység szúrása kíváncsisággá, inspirációvá és őszinte együttörüléssé." },
  { id: "joindulat", name: "Jóindulat", full: "Jóindulat és szelíd beszéd", pali: "Mettá", glyph: "慈",
    short: "Amit gondolsz és mondasz másokról, az formál téged is.",
    desc: "A mettá szerető kedvességet jelent. Itt a csípős megjegyzések, a harag dédelgetése és a kárörömre való hajlam helyett a jó szándék tudatos gyakorlásával foglalkozunk." },
  { id: "elfogadas", name: "Elfogadás", full: "Mások elfogadása", pali: "Upekkhá", glyph: "捨",
    short: "Mások a saját útjukat járják, és ez rendben van.",
    desc: "Az upekkhá kiegyensúlyozott, nyugodt szívet jelent. Megtanulod, hogyan engedd el az ítélkezést, és hogyan láss kíváncsisággal azokra, akik másképp gondolkodnak és élnek, mint te." },
  { id: "onallosag", name: "Önállóság", full: "Önállóság és belső iránytű", pali: "Attadípa", glyph: "灯",
    short: "Légy önmagad lámpása.",
    desc: "Az önállóság a saját értékeidre épülő döntésekből, a felelősségvállalásból és abból a bátorságból áll, hogy nem vársz mások jóváhagyására ahhoz, hogy elindulj." },
  { id: "magabiztossag", name: "Magabiztosság", full: "Magabiztosság és önbecsülés", pali: "Virija", glyph: "勇",
    short: "Hétszer elesni, nyolcszor felállni.",
    desc: "A valódi magabiztosság csendes. Nem a hibátlanságból fakad, hanem abból, hogy kedves vagy magadhoz akkor is, ha hibázol, és mersz kiállni magadért." }
];

/* r: true = fordított pontozás */
CK.questions = [
  { a: "jelenlet", t: "Gyakran csak utólag veszem észre, milyen érzelem irányította a reakciómat." },
  { a: "irigyseg", t: "Ha egy kollégám sikert ér el, először inkább feszültséget érzek, mint örömöt." },
  { a: "joindulat", t: "Előfordul, hogy egy kis kárörömet érzek, ha valakinek, akit nem kedvelek, valami nem sikerül." },
  { a: "elfogadas", t: "Bosszant, ha mások másképp csinálnak dolgokat, mint ahogy szerintem kellene." },
  { a: "onallosag", t: "Döntés előtt szükségem van rá, hogy valaki más megerősítsen." },
  { a: "magabiztossag", t: "Megbeszéléseken ritkán szólalok meg, akkor sem, ha van véleményem." },
  { a: "irigyseg", t: "Gyakran hasonlítom össze magam másokkal (fizetés, kinézet, elismerés, kapcsolatok)." },
  { a: "joindulat", t: "Szoktam másokról a hátuk mögött kritikusan beszélni." },
  { a: "elfogadas", t: "Gyorsan kialakítom a véleményem az emberekről, és ritkán változtatok rajta." },
  { a: "onallosag", t: "Ha nincs pontos utasítás, nehezen kezdek bele egy feladatba." },
  { a: "magabiztossag", t: "Ha hibázom, napokig rágódom rajta, és keményen kritizálom magam." },
  { a: "jelenlet", t: "Napközben ritkán állok meg, hogy a légzésemre vagy a testemre figyeljek." },
  { a: "irigyseg", t: "Nehezen tudok szívből gratulálni annak, akinek olyasmi sikerült, amire én is vágyom." },
  { a: "joindulat", t: "Ha megbántanak, sokáig fejben tartom, és szeretném, ha a másik is megérezné." },
  { a: "elfogadas", t: "Nehezen viselem, ha valaki más értékrend szerint él, mint én." },
  { a: "onallosag", t: "Mások véleménye erősen befolyásolja, hogyan érzem magam." },
  { a: "magabiztossag", t: "Nehezen mondok nemet, akkor is, ha nem szeretnék valamit elvállalni." },
  { a: "irigyseg", t: "Néha úgy érzem, mások igazságtalanul kapnak meg olyan dolgokat, amiket én jobban megérdemelnék." },
  { a: "joindulat", t: "Feszült helyzetben hajlamos vagyok csípős, szúrós megjegyzéseket tenni." },
  { a: "elfogadas", t: "Mások hibái, szokásai sokáig foglalkoztatnak." },
  { a: "onallosag", t: "Gyakran várok arra, hogy valaki más oldja meg a problémát." },
  { a: "magabiztossag", t: "Úgy érzem, nem vagyok olyan jó, mint a többiek." },
  { a: "jelenlet", t: "Észreveszem, amikor egy negatív gondolatspirál elindul bennem.", r: true },
  { a: "irigyseg", t: "Mások sikere inspirál és motivál engem.", r: true },
  { a: "joindulat", t: "Könnyen feltételezek jó szándékot mások viselkedése mögött.", r: true },
  { a: "elfogadas", t: "Kíváncsi vagyok arra, mi áll mások számomra furcsa viselkedése mögött.", r: true },
  { a: "onallosag", t: "Szívesen vállalok felelősséget a saját döntéseimért, akkor is, ha tévedek.", r: true },
  { a: "magabiztossag", t: "Ha dicséretet kapok, el tudom fogadni anélkül, hogy lekicsinyelném.", r: true }
];

CK.scale = ["Egyáltalán nem jellemző", "Inkább nem jellemző", "Részben", "Inkább jellemző", "Nagyon jellemző"];

/* ---------------- LECKÉK ---------------- */
CK.lessons = [

/* ===== JELENLÉT ===== */
{ id: "j1", area: "jelenlet", title: "Az ég és a felhők", min: 10,
  lead: "Nem a gondolataid vagy. Te vagy az, aki észreveszi őket.",
  body: [
    "A keleti tanítások egyik legfontosabb felismerése, hogy a tudatunk és a tudatunk tartalma két különböző dolog. A gondolatok, érzések, hangulatok jönnek és mennek, mint a felhők. Az, aki észleli őket, maradandóbb, tágasabb, nyugodtabb: olyan, mint az ég.",
    "A legtöbb ember azonosul a gondolataival. Ha az jut eszébe, hogy „ez a kolléga idegesítő”, akkor <em>tényként</em> éli meg. Ha az, hogy „én ezt úgysem tudom megcsinálni”, akkor elhiszi. A meditáció egyik első lépése, hogy ezt a szoros összefonódást kicsit meglazítsuk.",
    "Amikor azt mondod magadban: „most az a gondolatom, hogy…”, máris egy lépést hátrébb léptél. A gondolat nem tűnik el, de már nem ő vezet. Te figyeled őt. Ez a kis távolság minden későbbi változás kiindulópontja, az irigység, a harag vagy az önbizalomhiány kezelésében is."
  ],
  wisdom: { t: "Mindaz, amik vagyunk, gondolataink eredménye. Elménk alkot meg minket, és amit gondolunk, azzá válunk.", s: "Dhammapada, 1. vers (szabad fordítás)" },
  practice: { title: "A STOP-szünet", steps: [
    "<strong>S – Szünet.</strong> Bármit csinálsz, állj meg egy pillanatra.",
    "<strong>T – Testbe érkezés.</strong> Vegyél egy lassú, mély lélegzetet, és érezd a talpadat a földön.",
    "<strong>O – Odafigyelés.</strong> Kérdezd meg magadtól: mit gondolok most? Mit érzek? Hol érzem a testemben?",
    "<strong>P – Folytatás.</strong> Térj vissza a tevékenységedhez, de most tudatosabban."
  ]},
  task: "Állíts be a telefonodra napi 3 emlékeztetőt (pl. 10:00, 13:00, 16:00), és mindegyiknél végezz el egy STOP-szünetet.",
  reflect: ["Milyen gondolatok térnek vissza hozzád a leggyakrabban egy átlagos munkanapon?", "Volt ma olyan pillanat, amikor egy gondolatot tényként éltél meg, pedig csak egy gondolat volt?"],
  tool: { type: "med", id: "felhok", label: "Meditáció: Felhők az égen" } },

{ id: "j2", area: "jelenlet", title: "A második nyíl", min: 9,
  lead: "A fájdalom elkerülhetetlen. Amit hozzáteszünk, az már választás.",
  body: [
    "A Szallatha-szuttában Buddha egy egyszerű képet használ. Ha valakit eltalál egy nyíl, az fáj. Ha utána egy második nyíl is eltalálja ugyanazon a helyen, az még jobban fáj. Az első nyíl az élet nehézségei: egy kritika, egy elmaradt elismerés, egy kellemetlen helyzet. A második nyíl az, amit mi magunk lövünk utána.",
    "A második nyíl ilyen mondatokból áll: „Mindig velem történik ez.” „Bezzeg neki minden sikerül.” „Biztos szándékosan csinálta.” „Én soha nem leszek elég jó.” Ezek a gondolatok megsokszorozzák az eredeti fájdalmat, és sokszor napokig, hetekig sebeznek.",
    "Az irigység, a harag és az önbizalomhiány nagyon gyakran második nyíl. Valaki más sikere önmagában nem fáj. Az a történet fáj, amit hozzáteszünk: „ő jobb nálam”, „engem senki nem vesz észre”. A jó hír az, hogy a második nyilat mi lőjük ki, tehát meg is tanulhatjuk, hogy ne lőjük ki."
  ],
  wisdom: { t: "A tanulatlan ember, ha fájdalom éri, búsul, panaszkodik, sír. Így két fájdalmat érez: a testit és a lelkit. Mintha két nyíl találta volna el.", s: "Szallatha-szutta, Szamjutta-nikája 36.6 (szabad fordítás)" },
  practice: { title: "Nyilak szétválasztása", steps: [
    "Gondolj egy mai vagy tegnapi kellemetlen helyzetre.",
    "Írd le egy mondatban, mi <em>történt</em> pontosan, tényszerűen (első nyíl).",
    "Írd le, mit <em>mondtál magadnak</em> róla utána (második nyíl).",
    "Kérdezd meg: mennyi a fájdalmamból az első, és mennyi a második nyíl?",
    "Tedd le tudatosan a második nyilat: „Ez csak egy történet, amit hozzátettem.”"
  ]},
  task: "Ma figyeld meg legalább egyszer, amikor kilövöd a második nyilat. Elég, ha észreveszed, nem kell megváltoztatnod.",
  reflect: ["Melyik a te leggyakoribb „második nyilad”? Milyen mondat ez?", "Kinek a hangján szól ez a mondat? A sajátodon, vagy valaki máséval?"],
  tool: { type: "breath", id: "hosszu", label: "Légzés: Megnyugtató kilégzés" } },

{ id: "j3", area: "jelenlet", title: "Nevezd meg, hogy megszelídítsd", min: 10,
  lead: "Ha egy érzésnek nevet adsz, már nem ő uralkodik rajtad.",
  body: [
    "Pszichológiai kutatások szerint már az is csökkenti az érzelmi reakció erejét, ha szavakba öntjük, amit érzünk. A kutatók ezt „érzelemcímkézésnek” hívják. A buddhista hagyomány évezredek óta használja ugyanezt: a meditáló csendben megnevezi, ami benne történik: „harag”, „vágy”, „félelem”.",
    "A legtöbben csak néhány durva kategóriát használunk: „rosszul vagyok”, „ideges vagyok”. Pedig az „ideges” mögött sokféle dolog állhat: csalódottság, sértettség, irigység, szégyen, kimerültség. Minél pontosabban nevezed meg, annál jobban érted, mire van valójában szükséged.",
    "Az irigységet és a rosszindulatot különösen nehéz megnevezni, mert szégyelljük őket. Pedig ezek egyszerű emberi érzések, mindenkiben megjelennek. Nem az a kérdés, hogy jelen vannak-e, hanem az, hogy mit kezdünk velük. Ami megnevezhető, az kezelhető is."
  ],
  wisdom: { t: "Amikor dühös, tudja: „dühös vagyok”. Amikor nem dühös, tudja: „nem vagyok dühös”.", s: "Szatipatthána-szutta, a tudat figyelme (szabad fordítás)" },
  practice: { title: "A szelíd figyelem négy lépése", steps: [
    "<strong>Felismerés:</strong> Állj meg, és nevezd meg: „Most irigységet érzek.” vagy „Most sértett vagyok.”",
    "<strong>Engedés:</strong> Hagyd, hogy az érzés ott legyen. Ne harcolj ellene, ne indokold. „Rendben, ez most itt van.”",
    "<strong>Vizsgálat:</strong> Hol érzed a testedben? Szorítás a mellkasban? Forróság az arcban? Milyen gondolat kíséri?",
    "<strong>Gyengédség:</strong> Tedd a kezed a szívedre, és mondd magadnak: „Ez nehéz. Rendben van, hogy ezt érzem.”"
  ]},
  note: "A módszer Tara Brach meditációtanár RAIN-gyakorlatának szabad átdolgozása.",
  task: "Este a naplóban írj le három érzést, amit ma éreztél, minél pontosabb szavakkal.",
  reflect: ["Melyik érzést nevezed meg a legnehezebben, akár csak magadban is?", "Mit tapasztaltál, amikor megnevezted?"],
  tool: { type: "page", id: "naplo", label: "Napló megnyitása" } },

{ id: "j4", area: "jelenlet", title: "A tér az inger és a válasz között", min: 8,
  lead: "Három lélegzet. Ennyi kell ahhoz, hogy reakció helyett válaszolj.",
  body: [
    "Amikor valaki valami bántót mond, vagy meghalljuk, hogy egy kolléga dicséretet kapott, a reakciónk szinte automatikus. A testünk megfeszül, és már mondjuk is a csípős megjegyzést, vagy már fut is a fejünkben a sértett belső monológ.",
    "A meditáció egyik legfontosabb gyakorlati haszna, hogy ez a tér az inger és a válasz között kitágul. Először csak fél másodperc, aztán egy, aztán három. Ebben a térben lakik a szabadságod. Itt dönthetsz úgy, hogy nem mondod ki, nem küldöd el, nem gondolod tovább.",
    "Ez nem elfojtás. Nem az a cél, hogy ne érezz semmit. Az a cél, hogy az érzés ne cselekedjen helyetted. Az érzés jöhet, te pedig eldöntöd, mit kezdesz vele."
  ],
  wisdom: { t: "Ki tud várni, amíg a sár leülepszik, és a víz kitisztul? Ki tud mozdulatlan maradni, amíg a helyes cselekvés magától meg nem születik?", s: "Lao-ce: Tao Te King, 15. vers (szabad fordítás)" },
  practice: { title: "A három lélegzet szabálya", steps: [
    "Amikor erős érzelmi reakciót érzel (düh, sértettség, irigység), mielőtt bármit mondanál vagy írnál, végy három lassú lélegzetet.",
    "Az első lélegzetnél csak vedd észre: „Valami történik bennem.”",
    "A másodiknál nevezd meg az érzést.",
    "A harmadiknál kérdezd meg: „Mit szeretnék, hogy ebből a helyzetből kisüljön?”",
    "Csak ezután válaszolj, ha még mindig szükségesnek tartod."
  ]},
  task: "Ma egyetlen e-mailt vagy üzenetet se küldj el feszült állapotban. Várj legalább 10 percet, és olvasd újra.",
  reflect: ["Mikor reagáltál utoljára úgy, hogy később megbántad?", "Mit tettél volna másképp három lélegzettel később?"],
  tool: { type: "breath", id: "doboz", label: "Légzés: Dobozlégzés" } },

{ id: "j5", area: "jelenlet", title: "Kezdő elme", min: 8,
  lead: "A kezdő elméjében sok lehetőség van, a szakértőében kevés.",
  body: [
    "A zen hagyományban a <em>sosin</em>, vagyis a „kezdő elme” azt a hozzáállást jelenti, amikor mindent először látunk: nyitottan, előítéletek nélkül, kíváncsian. Mintha még soha nem találkoztunk volna az adott helyzettel vagy emberrel.",
    "Felnőttként hajlamosak vagyunk mindent „tudni”. Tudjuk, milyen a főnök, tudjuk, milyen az a kolléga, tudjuk, hogy ez a megbeszélés unalmas lesz. Ez a tudás kényelmes, de bezár. Nem engedi, hogy az emberek meglephessenek minket, és nem engedi, hogy mi magunk változzunk.",
    "Egy régi zen történetben egy tudós felkeresett egy mestert, hogy a zenről kérdezze. A mester teát töltött neki, és amikor a csésze megtelt, tovább töltötte, amíg a tea ki nem folyt. „Te is olyan vagy, mint ez a csésze – mondta. – Tele vagy saját véleményeiddel. Hogyan mutathatnék neked bármit, ha előbb ki nem üríted a csészédet?”"
  ],
  wisdom: { t: "A tanulás útján minden nap gyarapodik valami. Az Út követésében minden nap elenged valamit az ember.", s: "Lao-ce: Tao Te King, 48. vers (szabad fordítás)" },
  practice: { title: "Üres csésze egy napra", steps: [
    "Válassz ki egy embert, akiről határozott (és talán nem túl jó) véleményed van.",
    "Holnap figyeld meg úgy, mintha először látnád. Mit csinál? Hogyan beszél? Mi okozhat neki örömet vagy nehézséget?",
    "Keress benne legalább egy dolgot, ami új, meglepő vagy szerethető.",
    "Este írd le, mit vettél észre."
  ]},
  task: "Egy ismerős helyzetben (reggeli kávé, út a munkába) figyelj meg öt olyan részletet, amit eddig sosem vettél észre.",
  reflect: ["Kiről vagy miről „tudod” már biztosan, milyen?", "Mi változna, ha kiürítenéd a csészédet vele kapcsolatban?"] },

/* ===== IRIGYSÉG → MUDITÁ ===== */
{ id: "i1", area: "irigyseg", title: "Mit súg az irigység?", min: 10,
  lead: "Az irigység hírnök. Megmutatja, mire vágysz valójában.",
  body: [
    "Az irigység az egyik legrosszabb hírű érzés, ezért szinte senki sem vallja be. Pedig mindenki érzi időnként. Az irigység önmagában nem jellemhiba. Inkább egy jelzőfény, amely azt mutatja meg, mi fontos nekünk, és mi hiányzik az életünkből.",
    "A pszichológia két fajta irigységet különböztet meg. A <strong>jóindulatú irigység</strong> így szól: „Bárcsak nekem is sikerülne ilyesmi, mit tehetnék érte?” Ez motivál és felfelé húz. A <strong>rosszindulatú irigység</strong> így: „Bárcsak neki se sikerült volna.” Ez a másikat próbálja lehúzni, és közben minket is mérgez.",
    "A különbség nem az érzésben van, hanem abban, hogy merre fordítjuk a figyelmünket. Ha az irigység felbukkanásakor azt kérdezed: „Mit mutat meg ez arról, amire én vágyom?”, akkor a mérgező energiát irányjelzővé alakítod. Ha viszont a másik hibáit kezded keresni, az irigység elhatalmasodik."
  ],
  wisdom: { t: "Ne irigyeld mások szerencséjét. Aki irigykedik, nem talál békét a meditációban.", s: "Dhammapada, 365. vers (szabad fordítás)" },
  practice: { title: "Irigység-iránytű", steps: [
    "Amikor irigységet érzel, ne szégyelld. Mondd magadban: „Most irigységet érzek, és ez emberi.”",
    "Kérdezd meg: <em>Pontosan mit</em> irigylek? Az elismerést? A szabadságot? A könnyedséget? A kapcsolatot?",
    "Kérdezd meg: Ha nekem is meglenne, mit adna nekem? (pl. biztonságot, büszkeséget, nyugalmat)",
    "Kérdezd meg: Mi az az egy kis lépés, amivel közelebb kerülhetnék ehhez a saját életemben?",
    "Ha jólesik, kívánd a másiknak: „Örülök, hogy neked sikerült.” Akkor is, ha még nem teljesen így érzed."
  ]},
  task: "Használd ma az Irigység-átalakítót legalább egyszer. Ha nem volt irigy pillanatod, gondolj egy korábbira.",
  reflect: ["Kire érzel a leggyakrabban irigységet, és pontosan mire?", "Mit árul el ez arról, ami neked igazán fontos?"],
  tool: { type: "page", id: "irigyseg-atalakito", label: "Irigység-átalakító" } },

{ id: "i2", area: "irigyseg", title: "Muditá, az elfelejtett öröm", min: 12,
  lead: "Az irigység ellenszere nem az elfojtás, hanem az együttörülés.",
  body: [
    "A buddhizmusban négy „isteni lakhelyet” (brahmavihára) tanítanak. Ezek a szív legnemesebb állapotai: a <strong>szerető kedvesség</strong> (mettá), az <strong>együttérzés</strong> (karuná), az <strong>együttörülés</strong> (muditá) és a <strong>kiegyensúlyozottság</strong> (upekkhá).",
    "A muditá a legkevésbé ismert, és sok tanító szerint a legnehezebb. Együttérezni valakivel, akinek rossz, viszonylag könnyű. Szívből örülni annak, akinek jobb, mint nekünk, az igazi kihívás. A muditá az irigység közvetlen ellenszere: ugyanarra a helyzetre (valakinek jól megy) egészen más választ ad.",
    "Patandzsali jóga-szútrái is ezt tanítják: az elme akkor lesz tiszta és nyugodt, ha a boldogok iránt barátságot, a szenvedők iránt együttérzést, az erényesek iránt örömöt, a hibázók iránt pedig nyugodt elfogadást érzünk. Ezt nem kell azonnal érezni. Gyakorolni kell, mint egy izmot.",
    "A muditá gyakorlásának van egy titka: kezdd könnyű esetekkel. Örülj egy gyerek nevetésének, egy barátod jó hírének, egy idegen kutyájának, aki boldogan fut a parkban. Ha ez megy, fokozatosan haladj a nehezebb emberek felé."
  ],
  wisdom: { t: "A boldogok iránti barátság, a szenvedők iránti együttérzés, az erényesek iránti öröm és a hibázók iránti nyugodt elfogadás által az elme kitisztul.", s: "Patandzsali: Jóga-szútra, I.33 (szabad fordítás)" },
  practice: { title: "A muditá lépcsője", steps: [
    "<strong>1. fok – Könnyű öröm:</strong> Idézd fel valakinek a boldogságát, akit szeretsz. Érezd, ahogy a szíved is felmelegszik.",
    "<strong>2. fok – Semleges öröm:</strong> Gondolj valakire, akit alig ismersz, és képzeld el, ahogy ma valami jó történik vele.",
    "<strong>3. fok – Nehéz öröm:</strong> Gondolj valakire, akire irigy vagy. Csak egy pillanatra kívánd neki: „Bárcsak megmaradna az örömöd.”",
    "Figyeld meg, mit érzel közben a testedben. Nem kell, hogy azonnal sikerüljön. Már a szándék is számít."
  ]},
  task: "Végezd el a vezetett muditá-meditációt. Ma este írj le három dolgot, aminek mások életében őszintén örültél.",
  reflect: ["Kinek a sikerének tudsz a legkönnyebben örülni? És kinek a legnehezebben?", "Mi a különbség a két ember között a te szemedben?"],
  tool: { type: "med", id: "mudita", label: "Meditáció: Együttörülés" } },

{ id: "i3", area: "irigyseg", title: "A kőfaragó meséje", min: 9,
  lead: "Ha mindig valaki más akarsz lenni, sosem érkezel meg önmagadhoz.",
  story: { title: "A kőfaragó (japán népmese)", text: [
    "Élt egyszer egy szegény kőfaragó, aki egész nap a hegyoldalban vésett. Egy nap meglátott egy gazdag kereskedőt, és felsóhajtott: „Bárcsak én is gazdag lennék!” Egy szellem meghallotta, és gazdaggá tette.",
    "Ám egyszer elhaladt mellette egy herceg hintója, és mindenki meghajolt. „Bárcsak herceg lennék!” És herceg lett. De a nyári nap tűzött, és a herceg izzadt a hintóban. „A nap erősebb nálam. Bárcsak nap lennék!” És nap lett.",
    "Ekkor egy felhő eltakarta. „Bárcsak felhő lennék!” Felhő lett, esőt hullatott, de a hegy rendíthetetlenül állt. „Bárcsak hegy lennék!” És hegy lett, a legerősebb mind közül.",
    "Ekkor érezte, hogy valaki kalapáccsal és vésővel faragja a lábát. Lenézett, és egy kőfaragót látott."
  ]},
  body: [
    "Az összehasonlítás végtelen lépcső. Mindig lesz valaki, aki szebb, okosabb, sikeresebb, szabadabb nálunk. És mindig lesz valaki, aki minket irigyel olyasmiért, amit mi természetesnek veszünk.",
    "Az összehasonlítás gyakran azért fáj, mert a saját belső világunkat (kételyeinket, fáradtságunkat, hibáinkat) hasonlítjuk össze mások külső kirakatával. A közösségi média ezt még fel is erősíti: mindenki a legszebb pillanatait mutatja, mi pedig a saját hétköznapjainkat mérjük ezekhez.",
    "A Tao Te King szerint az a gazdag, aki tudja, mi az elég. Ez nem lemondást jelent, hanem azt, hogy a mércédet magadban keresed, nem másokban. Az egyetlen igazán hasznos összehasonlítás: <em>Ki vagyok ma, ahhoz képest, aki tegnap voltam?</em>"
  ],
  wisdom: { t: "Aki másokat ismer, okos. Aki önmagát ismeri, bölcs. Aki másokat legyőz, erős. Aki önmagát legyőzi, hatalmas. Aki tudja, mi az elég, gazdag.", s: "Lao-ce: Tao Te King, 33. vers (szabad fordítás)" },
  practice: { title: "Tegnapi önmagam", steps: [
    "Írj le három területet, ahol most gyakran másokhoz méred magad.",
    "Mindegyiknél írd le, hol tartottál ezen a területen egy évvel ezelőtt.",
    "Írd le, mi az, amiben azóta fejlődtél, akármilyen kicsi is.",
    "Írd le, mit kapsz az életedtől, amit mások talán irigyelnének tőled."
  ]},
  task: "Egy hétig figyeld meg, mikor és hol hasonlítod magad másokhoz. Ha teheted, tarts egy napot közösségi média nélkül.",
  reflect: ["Melyik „kirakatot” hasonlítod leggyakrabban a saját hétköznapjaidhoz?", "Mi az, amit te természetesnek veszel, de másnak hatalmas ajándék lenne?"] },

{ id: "i4", area: "irigyseg", title: "Egy gyertya lángja", min: 9,
  lead: "A boldogság nem fogy el attól, hogy másnak is jut belőle.",
  body: [
    "Az irigység mélyén gyakran egy rejtett hit lakik: hogy a jó dolgokból kevés van. Ha neki jutott elismerés, nekem kevesebb marad. Ha ő előrelépett, nekem kisebb az esélyem. Ezt hívják hiánytudatnak.",
    "Egy ismert buddhista mondás szerint egyetlen gyertyáról ezer másik is meggyújtható, és ettől a gyertya élete nem lesz rövidebb. A boldogság nem fogy el attól, ha megosztjuk. Az öröm, a tudás, a kedvesség terjed, és sokszor visszatér hozzánk.",
    "A bőségtudat nem naivitás. Persze, az életben vannak korlátozott erőforrások. De az emberi értékek (szeretet, tisztelet, kreativitás, öröm) nem ilyenek. Ha a kollégád jól teljesít, attól a te képességeid nem lettek kisebbek. Sőt, egy erős csapatban mindenki magasabbra emelkedhet.",
    "A hála a bőségtudat legjobb gyakorlata. Kutatások szerint akik rendszeresen leírják, miért hálásak, elégedettebbek, kevésbé irigyek és jobban alszanak. A hála a figyelmet arra irányítja, ami <em>van</em>, nem arra, ami hiányzik."
  ],
  wisdom: { t: "Ezer gyertya gyújtható meg egyetlen gyertyáról, és a gyertya élete ettől nem lesz rövidebb. A boldogság sosem fogy el attól, hogy megosztják.", s: "Buddhista mondás" },
  practice: { title: "Három jó dolog", steps: [
    "Minden este írj le három dolgot, ami jól sikerült vagy amiért hálás vagy.",
    "Mindegyik mellé írd oda: <em>miért</em> történt meg? Milyen szerepem volt benne?",
    "Egy héten egyszer írj fel egy dolgot, amiért valaki másnak vagy hálás, és ha teheted, mondd is el neki."
  ]},
  task: "Kezdd el ma a „Három jó dolog” gyakorlatot a naplóban, és csináld 7 napon át.",
  reflect: ["Hol érzed az életedben, hogy „nem jut elég”?", "Mi az, amiből valójában bőven van?"],
  tool: { type: "page", id: "naplo", label: "Napló: hála" } },

{ id: "i5", area: "irigyseg", title: "Gratulálj szívből", min: 8,
  lead: "Az öröm, amit másnak adsz, a te szívedet is megnyitja.",
  body: [
    "Kutatások szerint a kapcsolatainkat nem az határozza meg leginkább, hogyan reagálunk mások bajára, hanem az, hogyan reagálunk a jó híreikre. Négyféle válasz létezik, és csak egy építi a kapcsolatot:",
    "<strong>Aktív-építő:</strong> „Ez fantasztikus! Mesélj, hogy sikerült? Mit érzel most?” – lelkes, érdeklődő.<br><strong>Passzív-építő:</strong> „Ügyes.” – kedves, de lapos.<br><strong>Aktív-romboló:</strong> „Na és nem lesz most sokkal több munkád?” – a negatívumot keresi.<br><strong>Passzív-romboló:</strong> „Amúgy hallottad, mi történt velem?” – témaváltás, figyelmen kívül hagyás.",
    "Irigység idején az aktív-romboló vagy a passzív-romboló válasz szinte magától jön. Az aktív-építő válasz viszont gyakorolható. Az izgalmas az, hogy a szív követi a viselkedést: ha szívből érdeklődsz valaki sikere iránt, az öröm egy része átragad rád is.",
    "A konfuciánus hagyomány szerint a nemes ember segít másoknak megvalósítani a jót bennük. Egy őszinte gratuláció kis lépés, de pont ilyen kis lépésekből épül fel a jellem."
  ],
  wisdom: { t: "A nemes ember segít másoknak, hogy kibontakoztassák a bennük lévő jót, és nem segíti a rosszat. A kisember éppen fordítva tesz.", s: "Konfuciusz: Beszélgetések és mondások, XII.16 (szabad fordítás)" },
  practice: { title: "Hét nap, hét gratuláció", steps: [
    "Minden nap keress valakit (kolléga, barát, családtag), akinek valami jó dolog történt, vagy aki valamit jól csinált.",
    "Mondd el neki konkrétan: „Láttam, hogy… Ez nagyon jó lett, mert…”",
    "Tegyél fel egy kérdést: „Hogy sikerült?” vagy „Mit érzel most?”",
    "Figyeld meg, mit érzel utána. Pipáld ki a 21 napos kihívásban."
  ]},
  task: "Ma gratulálj valakinek, akinek a sikere eddig inkább szúrt, mint örömet okozott. Röviden, őszintén.",
  reflect: ["Melyik válaszfajtát adod leggyakrabban mások jó híreire?", "Milyen érzés volt szívből gratulálni?"],
  tool: { type: "page", id: "kihivas", label: "21 napos kihívás" } },

/* ===== JÓINDULAT → METTÁ ===== */
{ id: "m1", area: "joindulat", title: "Amit táplálsz, az nő", min: 9,
  lead: "Az elme arra hajlik, amire gyakran gondolsz.",
  body: [
    "A Dvedhávitakka-szuttában Buddha elmondja, hogy megvilágosodása előtt két csoportra osztotta a gondolatait: azokra, amelyek ártanak (vágy, rosszakarat, kegyetlenség), és azokra, amelyek felszabadítanak (lemondás, jóakarat, ártalmatlanság). Rájött, hogy amire a szerzetes gyakran gondol, arra hajlik az elméje.",
    "Ez a modern idegtudomány nyelvén is igaz: amit gyakran gondolunk és érzünk, az megerősödik bennünk, egyre könnyebben előjön. Ha sokszor gondolunk kritikusan másokra, az elménk egyre ügyesebb lesz a hibák keresésében. Ha a jót keressük, abban leszünk egyre jobbak.",
    "A rosszindulatú gondolatok nem tesznek rossz emberré. Mindenkiben felbukkannak. A kérdés az, hogy etetjük-e őket: továbbgondoljuk, elmeséljük, felnagyítjuk-e őket, vagy észrevesszük és hagyjuk, hogy elhalványuljanak."
  ],
  wisdom: { t: "Amin a szerzetes sokat gondolkodik és elmélkedik, arra hajlik az elméje.", s: "Dvedhávitakka-szutta, Maddzshima-nikája 19 (szabad fordítás)" },
  practice: { title: "Gondolatleltár", steps: [
    "Egy napon át figyeld a gondolataidat másokról. Minden alkalommal, amikor egy kritikus vagy bántó gondolat jön, tegyél egy strigulát (papíron vagy a telefonodon).",
    "Minden alkalommal, amikor egy kedves vagy elismerő gondolat jön, tegyél egy strigulát egy másik oszlopba.",
    "Este nézd meg az arányt ítélkezés nélkül. Ez csak adat, nem ítélet.",
    "Másnap tudatosan keress három dolgot, amiért valakit elismerhetsz."
  ]},
  task: "Végezd el ma a gondolatleltárt, és jegyezd fel az eredményt a naplóba.",
  reflect: ["Milyen arányt találtál a kritikus és a kedves gondolatok között?", "Melyik emberre irányul a legtöbb kritikus gondolatod? Mit adhat ez neked?"] },

{ id: "m2", area: "joindulat", title: "Mettá, a szerető kedvesség", min: 12,
  lead: "A kedvességet gyakorolni lehet, ahogy egy hangszert is.",
  body: [
    "A mettá (szanszkritul maitrí) a szerető kedvesség meditációja. Ez az egyik legrégebbi és legtöbbet kutatott buddhista gyakorlat. Vizsgálatok szerint rendszeres gyakorlása növeli a pozitív érzelmeket, csökkenti az önkritikát és a másokkal szembeni negatív előítéleteket.",
    "A gyakorlat egyszerű: csendben jókívánságokat ismételsz, először saját magad felé, aztán egyre távolabbi emberek felé. A sorrend fontos. Magaddal kezded, mert akinek nincs kedvessége önmaga iránt, nehezen ad belőle másnak. A rosszindulat gyakran a saját belső kritikusunk kifelé fordulása.",
    "A hagyományos sorrend: <strong>1.</strong> önmagad, <strong>2.</strong> egy szeretett ember, <strong>3.</strong> egy semleges ember (pl. a pénztáros), <strong>4.</strong> egy nehéz ember, <strong>5.</strong> minden élőlény.",
    "Nem baj, ha eleinte üresnek vagy erőltetettnek érzed. A mettá a szándék gyakorlása, nem az érzésé. Az érzés idővel követi a szándékot."
  ],
  wisdom: { t: "Ahogy az anya életét is kockáztatva védi egyetlen gyermekét, úgy ápolja az ember határtalan szívét minden élőlény iránt.", s: "Karaníja-mettá-szutta (szabad fordítás)" },
  practice: { title: "A mettá mondatai", steps: [
    "<em>Legyek biztonságban. Legyek egészséges. Legyek boldog. Éljek könnyedén.</em>",
    "Ismételd ezeket lassan, a légzésed ritmusára, 2-3 percig.",
    "Aztán cseréld az alanyt: „Legyél biztonságban…” egy szeretett emberre gondolva.",
    "Majd egy semleges emberre, majd egy nehéz emberre (kezdetben ne a legnehezebbre).",
    "Végül: „Legyen minden élőlény biztonságban, egészséges, boldog.”"
  ]},
  task: "Végezd el a vezetett mettá-meditációt. Napközben, ha valaki idegesít, mondd el magadban felé egy mettá-mondatot.",
  reflect: ["Melyik szakasz volt a legnehezebb? Önmagad, vagy a nehéz ember?", "Mit érzett a tested a gyakorlat végére?"],
  tool: { type: "med", id: "metta", label: "Meditáció: Szerető kedvesség" } },

{ id: "m3", area: "joindulat", title: "A beszéd három kapuja", min: 10,
  lead: "Igaz? Szükséges? Kedves?",
  body: [
    "A nemes nyolcrétű ösvény egyik eleme a <strong>helyes beszéd</strong> (szammá vácsá): tartózkodni a hazugságtól, a megosztó beszédtől, a durva szavaktól és a hiábavaló fecsegéstől. A pletyka mindegyikkel rokon.",
    "A pletyka csábító. Közösséget teremt („mi ketten tudjuk, milyen ő valójában”), és rövid időre felemel („én legalább nem vagyok olyan”). Az ára viszont magas: rombolja a bizalmat, és aki pletykál, arról mások is tudják, hogy róluk is pletykálni fog.",
    "Egy sokfelé ismert hagyomány szerint a szavaknak három kapun kell átmenniük, mielőtt kimondjuk őket. <strong>Igaz-e?</strong> <strong>Szükséges-e?</strong> <strong>Kedves-e?</strong> Buddha egy tanításában öt ismérvet sorol fel: a megfelelő időben mondjuk-e, igaz-e, szelíden mondjuk-e, hasznos-e, és jóakaratból fakad-e.",
    "Ez nem azt jelenti, hogy soha nem mondhatsz kritikát. A kritika lehet igaz, szükséges és kedves is, ha a másik szemébe mondod, a fejlődése érdekében, tisztelettel."
  ],
  wisdom: { t: "Csak olyan szót szólj, amely nem okoz neked gyötrődést, és másnak sem árt. Az ilyen szó valóban jól szólt szó.", s: "Szubhászita-szutta, Szutta-nipáta 3.3 (szabad fordítás)" },
  practice: { title: "Pletykaböjt", steps: [
    "Vállald, hogy 7 napig nem beszélsz senkiről kritikusan, aki nincs jelen.",
    "Ha mások pletykálnak, nem kell kioktatnod őket. Elég, ha nem csatlakozol, vagy témát váltasz.",
    "Ha kicsúszik valami, ne ostorozd magad. Vedd észre, és kezdd újra.",
    "Ha valakivel tényleg problémád van, fogalmazd meg úgy, hogy neki magának is el tudnád mondani."
  ]},
  task: "Kezdd el a 7 napos pletykaböjtöt. Jelöld a 21 napos kihívásban minden nap, amikor sikerült.",
  reflect: ["Mit ad neked a pletyka? Milyen szükségletet elégít ki?", "Hogyan tudnád ezt a szükségletet másképp kielégíteni?"],
  tool: { type: "page", id: "kihivas", label: "21 napos kihívás" } },

{ id: "m4", area: "joindulat", title: "Az izzó parázs", min: 11,
  lead: "A harag dédelgetése olyan, mint parazsat szorongatni.",
  body: [
    "Egy klasszikus buddhista kép szerint aki haragot dédelget, olyan, mint aki puszta kézzel izzó parazsat ragad fel, hogy valakire rádobja. Mielőtt eldobhatná, a saját kezét égeti meg.",
    "A sértettség és a bosszúvágy természetes reakciók, amikor megbántanak. A probléma akkor kezdődik, amikor heteken, hónapokon át újra és újra lejátsszuk a jelenetet, és várjuk, hogy a másik „megfizessen”. Közben a másik talán már el is felejtette, mi pedig minden nap újra elszenvedjük.",
    "A megbocsátás nem azt jelenti, hogy helyesnek tartod, ami történt. Nem azt jelenti, hogy újra meg kell bíznod abban, aki ártott. Nem is feltétlenül kell kimondanod neki. A megbocsátás belső döntés: elengeded a parazsat, mert nem akarod tovább égetni a saját kezed.",
    "A Dhammapada talán leghíresebb verse szerint a gyűlöletet sosem csillapítja gyűlölet. Ez nem erkölcsi parancs, hanem megfigyelés: a harag haragot szül, a csípős megjegyzés csípős választ. Valakinek meg kell szakítania a láncot."
  ],
  wisdom: { t: "A gyűlöletet e világon sosem csillapítja gyűlölet. Csak a nem-gyűlölet csillapítja. Ez az örök törvény.", s: "Dhammapada, 5. vers (szabad fordítás)" },
  practice: { title: "Az el nem küldött levél", steps: [
    "Gondolj valakire, akire még mindig haragszol. Kezdd egy közepesen nehéz esettel.",
    "Írj neki levelet, amit <strong>soha nem fogsz elküldeni</strong>. Írj le mindent: mi bántott, mit éreztél, mit szerettél volna.",
    "A levél végén írd le: „Elengedem ezt a terhet, nem miattad, hanem magam miatt.”",
    "Ha jólesik, tépd szét vagy töröld ki a levelet. Közben végy néhány mély lélegzetet.",
    "Figyeld meg az elkövetkező napokban, mennyit foglalkoztat még a helyzet."
  ]},
  task: "Írd meg az el nem küldött levelet, és utána végezz egy hosszú kilégzéses légzőgyakorlatot.",
  reflect: ["Melyik parázs van még a kezedben?", "Mit nyernél, ha letennéd?"],
  tool: { type: "breath", id: "hosszu", label: "Légzés: Megnyugtató kilégzés" } },

{ id: "m5", area: "joindulat", title: "Csakúgy, mint én", min: 9,
  lead: "Mindenki, akivel találkozol, olyan harcot vív, amiről nem tudsz.",
  body: [
    "A kárörömnek és a rosszindulatnak van egy közös gyökere: a másikat különbözőnek, idegennek, „nem olyannak, mint én” látjuk. Ha valaki ellenfél vagy idegen, könnyebb örülni a kudarcának.",
    "A karuná, vagyis az együttérzés gyakorlása azzal kezdődik, hogy észrevesszük a közös emberségünket. A másik is fél néha. Ő is szeretne elismerést. Ő is hibázik, és utána rosszul érzi magát. Ő is fáradt este. A tibeti buddhizmus egyik alapgondolata, hogy minden élőlény ugyanarra vágyik: boldogságra, és arra, hogy elkerülje a szenvedést.",
    "Sántidéva, a 8. századi indiai mester szerint, ha valaki megbánt minket, gondoljunk arra, hogy ő maga is saját indulatainak foglya. Ahogy nem haragszunk a botra, amellyel megütöttek, úgy a mögötte álló indulatot is láthatjuk inkább betegségnek, mint gonoszságnak."
  ],
  wisdom: { t: "Ahogy én nem akarok szenvedni, úgy más sem. Ahogy én boldogságra vágyom, úgy minden más lény is.", s: "Sántidéva: Bódhicsarjávatára, VIII. fejezet (szabad fordítás)" },
  practice: { title: "Csakúgy, mint én", steps: [
    "Gondolj egy emberre, aki nehéz számodra. Képzeld magad elé.",
    "Ismételd lassan: „Ez az ember is szeretne boldog lenni, <em>csakúgy, mint én</em>.”",
    "„Ez az ember is érzett már magányt és csalódást, <em>csakúgy, mint én</em>.”",
    "„Ez az ember is hibázott már, és szégyellte magát, <em>csakúgy, mint én</em>.”",
    "„Ez az ember is tanul, próbálkozik, <em>csakúgy, mint én</em>.”",
    "Figyeld meg, változik-e valami a kép körül."
  ]},
  task: "Ma egy feszült helyzetben mondd el magadban: „Ő is csak boldog szeretne lenni, csakúgy, mint én.”",
  reflect: ["Mit tudhat a „nehéz ember” élete azokról a harcokról, amikről te nem tudsz?", "Hogyan változott a hozzáállásod a gyakorlat végére?"] },

/* ===== ELFOGADÁS → UPEKKHÁ ===== */
{ id: "e1", area: "elfogadas", title: "Ítélet nélküli figyelem", min: 9,
  lead: "Megfigyelni anélkül, hogy értékelnénk: ez az emberi értelem legmagasabb formája.",
  body: [
    "Az elménk folyamatosan címkéz: jó, rossz, helyes, helytelen, normális, furcsa. Ez hasznos volt a túléléshez, de a kapcsolatainkban sokszor börtönné válik. Amikor valakire ráragasztjuk, hogy „lusta”, „nagyképű” vagy „furcsa”, onnantól már csak azt látjuk, ami ezt igazolja.",
    "A zen hagyomány egyik legrégebbi szövege, a Hszin Hszin Ming úgy kezdődik, hogy a Nagy Út nem nehéz azoknak, akik nem válogatnak. Nem azt jelenti, hogy nincs véleményünk. Azt jelenti, hogy nem ragaszkodunk görcsösen a saját preferenciáinkhoz, mint az egyetlen igazsághoz.",
    "A megfigyelés és az értékelés szétválasztása egyszerűen gyakorolható. „Péter tíz percet késett” – ez megfigyelés. „Péter megbízhatatlan” – ez értékelés. Az első tény, a második egy történet, amit mi teszünk hozzá. Sokszor nem ismerjük a késés okát."
  ],
  wisdom: { t: "A Nagy Út nem nehéz azoknak, akik nem válogatnak. Ha nincs bennünk sem vonzódás, sem ellenszenv, minden tisztává és világossá válik.", s: "Szengcan: Hszin Hszin Ming (szabad fordítás)" },
  practice: { title: "Tény vagy történet?", steps: [
    "Gondolj valakire, aki zavar. Írd le három jellemzőjét, ahogy most látod.",
    "Mindegyiknél kérdezd meg: ez megfigyelés (videókamerával rögzíthető) vagy értékelés?",
    "Az értékeléseket írd át megfigyeléssé. Pl. „mindig okoskodik” → „a mai értekezleten háromszor kijavította a kollégáját”.",
    "Gondolj ki két másik lehetséges magyarázatot a viselkedésére."
  ]},
  task: "Egy napig figyeld meg, hányszor ragasztasz címkét valakire. Ha észreveszed, mondd magadban: „Ez egy címke.”",
  reflect: ["Melyik címkét használod leggyakrabban másokra?", "Használod ezt a címkét önmagadra is?"],
  tool: { type: "page", id: "itelet-atalakito", label: "Ítélet-átalakító" } },

{ id: "e2", area: "elfogadas", title: "Wabi-szabi és kincugi", min: 9,
  lead: "A tökéletlenség nem hiba. Az élet ilyen.",
  body: [
    "A <em>wabi-szabi</em> japán esztétikai és életfilozófia, amely a tökéletlen, a mulandó és a befejezetlen szépségét ünnepli. A repedezett teáscsésze, a moha a kövön, az őszi falevél: ezek nem hibásak, hanem élők, és van történetük.",
    "A <em>kincugi</em> az eltört kerámia arannyal való javításának művészete. A törés nem rejtőzik el, hanem arannyal kirajzolódik, és a tárgy története részévé válik. A javított csésze sokszor értékesebb, mint az eredeti.",
    "Amikor másokat nehezen fogadunk el, gyakran egy tökéletes ideálhoz mérjük őket: hogyan <em>kellene</em> dolgozniuk, beszélniük, élniük. A wabi-szabi szemlélet azt kérdezi: mi lenne, ha a „repedéseiket” is az egész részeként látnánk? Ugyanez fordítva is igaz: aki a saját tökéletlenségét elfogadja, az másokét is könnyebben elfogadja."
  ],
  wisdom: { t: "Ami teljes, hiányosnak tűnik, mégis használata kimeríthetetlen. A legegyenesebb görbének látszik, a legnagyobb ügyesség esetlennek.", s: "Lao-ce: Tao Te King, 45. vers (szabad fordítás)" },
  practice: { title: "Arany a repedésekben", steps: [
    "Gondolj valakire, akinek egy tulajdonsága zavar.",
    "Kérdezd meg: milyen élettörténet, félelem vagy tapasztalat alakíthatta ki ezt a tulajdonságot?",
    "Keress ugyanennek a tulajdonságnak egy pozitív oldalát (pl. a „makacs” ember kitartó, az „okoskodó” alapos).",
    "Ugyanezt csináld meg egy saját „repedéseddel” is."
  ]},
  task: "Ma keress három tökéletlen, de szép dolgot magad körül, és nézd meg őket egy percig figyelmesen.",
  reflect: ["Melyik saját tökéletlenségedet fogadod el a legnehezebben?", "Van összefüggés aközött, amit magadban nem fogadsz el, és amit másokban?"] },

{ id: "e3", area: "elfogadas", title: "A vakok és az elefánt", min: 9,
  lead: "Mindenki az igazság egy darabját tartja a kezében.",
  story: { title: "A vakok és az elefánt (Udána 6.4)", text: [
    "Egy király egyszer összehívta a város vakon született lakóit, és egy elefánt elé vezette őket. Mindegyik megérintette az állat egy részét, aztán a király megkérdezte: „Milyen az elefánt?”",
    "Aki a fejét tapintotta, azt mondta: „Olyan, mint egy korsó.” Aki a fülét: „Olyan, mint egy kosár.” Aki az agyarát: „Olyan, mint egy ekevas.” Aki az ormányát: „Olyan, mint egy rúd.” Aki a farkát: „Olyan, mint egy seprű.”",
    "Hamarosan veszekedni kezdtek, mindegyik a saját igazát bizonygatva, végül ökölre mentek. A király pedig nevetett."
  ]},
  body: [
    "Buddha ezzel a történettel azokat a vándor tanítókat jellemezte, akik mind a saját nézetük kizárólagos igazságát hirdették. A történet ma is érvényes: mindannyian csak egy szeletét látjuk a valóságnak, a saját tapasztalataink, neveltetésünk, élettörténetünk szűrőjén át.",
    "Amikor valaki másképp gondolkodik, mint mi, könnyű azt hinni, hogy téved, buta vagy rosszindulatú. Pedig lehet, hogy egyszerűen az elefánt egy másik részét tapintja. A kérdés nem az, hogy ki a hibás, hanem az: <em>mit lát ő, amit én nem?</em>"
  ],
  wisdom: { t: "Ragaszkodnak a saját nézetükhöz, és vitatkoznak egymással, akik csak egy oldalát látják a dolgoknak.", s: "Udána 6.4 (szabad fordítás)" },
  practice: { title: "Az elefánt másik oldala", steps: [
    "Gondolj egy helyzetre, amikor valakivel nem értettetek egyet.",
    "Írd le a saját nézőpontodat három mondatban.",
    "Most írd le az ő nézőpontját három mondatban, úgy, hogy ő is elfogadná, ha elolvasná.",
    "Mit lát ő, amit te nem? Mi lehet benne igaz?"
  ]},
  task: "A következő vitánál, mielőtt a saját véleményedet mondanád, foglald össze a másikét: „Ha jól értem, te azt mondod…”",
  reflect: ["Kinek a nézőpontját érted a legkevésbé az életedben?", "Mit tapasztaltál, amikor az ő szemével próbáltad nézni a helyzetet?"],
  tool: { type: "page", id: "itelet-atalakito", label: "Ítélet-átalakító" } },

{ id: "e4", area: "elfogadas", title: "Szaj Ueng lova", min: 8,
  lead: "Ki tudja, mi jó és mi rossz?",
  story: { title: "Az öreg és a ló (kínai taoista történet)", text: [
    "Egy öreg földműves lova egy nap elszökött. A szomszédok sajnálkoztak: „Milyen nagy szerencsétlenség!” Az öreg csak annyit mondott: „Ki tudja, jó-e vagy rossz?”",
    "Néhány nap múlva a ló visszatért, és egy csapat vadlovat hozott magával. „Milyen nagy szerencse!” – mondták a szomszédok. „Ki tudja?” – felelte az öreg.",
    "A fia megpróbálta betörni az egyik vadlovat, leesett, és eltörte a lábát. „Milyen nagy szerencsétlenség!” „Ki tudja?”",
    "Hamarosan háború tört ki, és a katonák minden ép fiatalembert elvittek. A sánta fiút otthon hagyták."
  ]},
  body: [
    "Ez a történet a Huainanzi nevű ókori kínai műből származik, és a taoista bölcsesség egyik alapgondolatát mutatja: a dolgokat nem tudjuk véglegesen jónak vagy rossznak ítélni. Az ítéleteink mindig egy szűk időpillanatból születnek.",
    "Ugyanez igaz az emberekre is. Az a kolléga, aki ma idegesít, holnap talán épp ő segít a bajban. Akinek a sikerét ma irigyeljük, talán olyan árat fizetett érte, amit mi nem akarnánk. Akit ma „rossz embernek” látunk, az évek múlva talán tanítónk lesz.",
    "Az elfogadás nem passzivitás. Azt jelenti, hogy laza kézzel tartjuk az ítéleteinket, és nyitva hagyjuk az ajtót a meglepetésnek."
  ],
  wisdom: { t: "A szerencse a balszerencsében rejlik, a balszerencse a szerencsében lapul. Ki tudhatja, hol a vége?", s: "Lao-ce: Tao Te King, 58. vers (szabad fordítás)" },
  practice: { title: "„Ki tudja?”", steps: [
    "Ma, valahányszor gyorsan ítélkezel egy helyzetről vagy emberről, mondd magadban: „Ki tudja?”",
    "Gondolj vissza egy régi eseményre, amit akkor kudarcnak éltél meg. Mi jó sült ki belőle később?",
    "Gondolj egy emberre, akiről később kiderült, hogy más, mint ahogy először gondoltad."
  ]},
  task: "Írd le a naplódba egy régi „szerencsétlenséged” történetét, és azt, hogy mi lett belőle.",
  reflect: ["Melyik ítéleted bizonyult később tévesnek?", "Kiről ítélkezel most túl gyorsan?"] },

{ id: "e5", area: "elfogadas", title: "Upekkhá, a nyugodt szív", min: 11,
  lead: "Elfogadni nem azt jelenti, hogy egyetértesz. Azt jelenti, hogy nem harcolsz azzal, ami van.",
  body: [
    "Az upekkhá, a kiegyensúlyozottság, a négy brahmavihára közül a legérettebb. Nem közöny vagy hidegség. Olyan, mint egy hegy, amely nyugodtan áll, akármilyen szél fúj körülötte. Olyan, mint egy nagyszülő, aki szeretettel figyeli az unokája hibáit, tudva, hogy mindenkinek a saját útját kell bejárnia.",
    "Az elfogadás egyik legnagyobb akadálya az a hit, hogy ha elfogadunk valakit, akkor egyetértünk vele, vagy hagyjuk, hogy ártson nekünk. Ez nem igaz. Elfogadhatod, hogy valaki olyan, amilyen, és közben határokat is húzhatsz.",
    "Az upekkhá azt is jelenti, hogy elismered: mások döntései az övéik. Nem a te felelősséged, hogy mindenki úgy éljen, ahogy szerinted helyes. Ez hatalmas teher alól szabadít fel."
  ],
  wisdom: { t: "Ahogy a szilárd szikla nem rendül meg a széltől, úgy a bölcs sem inog meg dicsérettől vagy gáncstól.", s: "Dhammapada, 81. vers (szabad fordítás)" },
  practice: { title: "Az upekkhá mondatai", steps: [
    "Gondolj egy emberre, akinek a viselkedését nehezen fogadod el.",
    "Mondd el magadban lassan: „Mindenki a saját tettei örököse.”",
    "„Az ő boldogsága vagy boldogtalansága az ő útjától függ, nem az én kívánságaimtól.”",
    "„Kívánom neki a jót, és elengedem a vágyat, hogy irányítsam.”",
    "Figyeld meg, mi enged el a testedben."
  ]},
  task: "Végezd el a vezetett upekkhá-meditációt, és válassz ki egy dolgot, amit ma tudatosan „elengedsz” valakivel kapcsolatban.",
  reflect: ["Kit próbálsz megváltoztatni, aki nem akar változni?", "Mi lenne a határ, amit meg tudnál húzni ehelyett?"],
  tool: { type: "med", id: "upekkha", label: "Meditáció: A nyugodt szív" } },

/* ===== ÖNÁLLÓSÁG ===== */
{ id: "o1", area: "onallosag", title: "Légy önmagad lámpása", min: 9,
  lead: "Buddha utolsó tanítása: ne másokban keresd a menedéket.",
  body: [
    "Amikor Buddha haldoklott, tanítványa, Ánanda aggódva kérdezte, ki vezeti majd őket. Buddha azt felelte: „Legyetek önmagatok lámpásai, önmagatok menedéke. Ne keressetek külső menedéket.” (Mahápariníbbána-szutta)",
    "Ez meglepő tanítás egy vallási vezetőtől. Nem azt mondta: „kövessetek engem”, hanem azt: „bízzatok a saját tapasztalatotokban”. Egy másik tanításában (Kálámá-szutta) arra biztatta az embereket, hogy ne fogadjanak el semmit csak azért, mert a hagyomány, egy tekintély vagy egy könyv mondja, hanem vizsgálják meg maguk.",
    "Az önállóság nem azt jelenti, hogy mindent egyedül kell csinálnod, és soha nem kérhetsz segítséget. Azt jelenti, hogy a döntéseid középpontja benned van. Meghallgatod mások tanácsát, de végül te döntesz, és te vállalod a döntés felelősségét."
  ],
  wisdom: { t: "Legyetek önmagatok lámpásai, legyetek önmagatok menedéke. Ne keressetek más menedéket.", s: "Mahápariníbbána-szutta, Díga-nikája 16 (szabad fordítás)" },
  practice: { title: "Döntésnapló", steps: [
    "Egy héten át minden nap hozz meg legalább egy kis döntést anélkül, hogy bárkit megkérdeznél (pl. mit eszel, hogyan oldasz meg egy kisebb feladatot, mit mondasz egy e-mailben).",
    "Írd le a döntést, és azt, milyen érzés volt egyedül meghozni.",
    "A hét végén nézd meg: hány döntésed sült el jól? Hánynál lett volna valóban szükség mások véleményére?"
  ]},
  task: "Ma hozz meg egy döntést, amit általában megkérdeznél valakitől, és ne kérj hozzá megerősítést.",
  reflect: ["Milyen típusú döntéseknél kérsz a leggyakrabban megerősítést?", "Mitől félsz, ha egyedül döntesz?"] },

{ id: "o2", area: "onallosag", title: "A saját dharmád", min: 12,
  lead: "Jobb a saját utadat tökéletlenül járni, mint másét tökéletesen.",
  body: [
    "A Bhagavad Gítá, India egyik legfontosabb szent szövege a <em>szvadharma</em>, a saját feladat, a saját út fontosságát tanítja. A szöveg szerint jobb a saját dharmánkat tökéletlenül követni, mint valaki másét tökéletesen.",
    "Sokan azért nem tudnak önállóan dönteni, mert nem tudják pontosan, mi számít nekik. Ha nincsenek tiszta belső értékeink, akkor mások értékei szerint igazodunk: a szülők, a főnök, a barátok elvárásai szerint. Ez kimerítő, mert mindenki mást vár.",
    "Az értékek a belső iránytű. Ha tudod, hogy neked a megbízhatóság, a kreativitás és a család a legfontosabb, akkor egy nehéz döntésnél nem kell mások véleményére várnod, mert megkérdezheted magadtól: <em>melyik lehetőség áll összhangban azzal, ami nekem fontos?</em>",
    "Az irigység is gyakran értékzavarból fakad: másokat olyasmiért irigylünk, ami nekünk valójában nem is fontos, csak a környezetünk szerint kellene annak lennie."
  ],
  wisdom: { t: "Jobb a saját kötelességünket tökéletlenül teljesíteni, mint másét tökéletesen. A saját utunkon járva még a hibázás is jobb, mert más útja veszéllyel teli.", s: "Bhagavad Gítá, 3.35 (szabad fordítás)" },
  practice: { title: "Értékiránytű", steps: [
    "Nyisd meg az Értékiránytű eszközt, és válaszd ki a számodra legfontosabb 5 értéket.",
    "Mindegyikhez írd le: hogyan jelenik meg ez az értékem a mindennapjaimban?",
    "Gondolj egy most előtted álló döntésre. Melyik lehetőség szolgálja leginkább az értékeidet?"
  ]},
  task: "Válaszd ki az 5 alapértékedet, és írd fel őket egy cetlire, amit látsz a munkahelyeden.",
  reflect: ["Melyik értéked él a legkevésbé az életedben most?", "Kinek az elvárásai szerint élsz, ami nem a te utad?"],
  tool: { type: "page", id: "ertekek", label: "Értékiránytű" } },

{ id: "o3", area: "onallosag", title: "Ezer mérföld, egy lépés", min: 8,
  lead: "Ne várd meg a tökéletes utasítást. Kezdd el kicsiben.",
  body: [
    "A Tao Te King egyik leghíresebb mondata szerint az ezer mérföldes utazás is egyetlen lépéssel kezdődik. A mondat előtt egy kevésbé ismert rész áll: a hatalmas fa is apró hajtásból nő ki, a kilencemeletes torony is egy kosár földdel kezdődik.",
    "Az önállóság egyik legnagyobb akadálya a halogatás és a bizonytalanság: „Nem tudom pontosan, hogyan kell, ezért inkább megvárom, amíg valaki megmondja.” Ilyenkor a feladat hatalmasnak és ködösnek tűnik. A megoldás: a legkisebb, legegyszerűbb első lépés.",
    "A taoista <em>vu-vej</em> (nem-cselekvés) nem lustaságot jelent, hanem erőlködés nélküli cselekvést, ahogy a víz is megtalálja az útját. Nem kell mindent előre tudnod. Elég, ha elindulsz, és figyeled, mit mutat az út."
  ],
  wisdom: { t: "Az ölelésnyi fa apró hajtásból nő ki. A kilencemeletes torony egy kosár földdel kezdődik. Az ezer mérföldes út a lábad alatt kezdődik.", s: "Lao-ce: Tao Te King, 64. vers (szabad fordítás)" },
  practice: { title: "A kétperces kezdés", steps: [
    "Válassz egy feladatot, amit halogatsz, mert nem tudod pontosan, hogyan kezdj bele.",
    "Kérdezd meg: mi az a lépés, ami kevesebb, mint 2 perc? (Pl. megnyitni a fájlt, leírni 3 kulcsszót, felírni egy kérdést.)",
    "Csináld meg most. Csak azt az egy lépést.",
    "Utána döntsd el: folytatod, vagy holnap jön a következő 2 perces lépés."
  ]},
  task: "Ma egy halogatott feladatnál tedd meg a kétperces első lépést anélkül, hogy bárkitől instrukciót kérnél.",
  reflect: ["Melyik feladatnál vársz arra, hogy valaki megmondja, hogyan kezdj bele?", "Mi lenne a legkisebb első lépés?"] },

{ id: "o4", area: "onallosag", title: "Dicséret és gáncs", min: 10,
  lead: "Ha mások véleménye fújja a vitorládat, mások irányítják a hajódat.",
  body: [
    "Csuang-ce, a taoista bölcs egy Szung Zsung-ce nevű férfiről írt, aki ha az egész világ dicsérte volna, nem buzdult volna fel, és ha az egész világ ócsárolta volna, nem csüggedt volna el. Tudta, hol a határ a belső és a külső között.",
    "A buddhizmus „nyolc világi szél”-ről beszél: nyereség és veszteség, hírnév és rossz hír, dicséret és gáncs, öröm és fájdalom. Ezek folyton változnak, és aki rájuk építi az önértékelését, az olyan, mint egy falevél a szélben.",
    "Ha mások véleménye erősen befolyásolja, hogyan érzed magad, érdemes megfigyelni: kinek a hangja szól benned? Gyakran egy szülő, egy tanár, egy régi főnök hangja. Ezek a belső hangok egykor talán segítettek, de most már nem a te hangod.",
    "Az önállóság egyik legfontosabb lépése, hogy megtanulod megkülönböztetni a saját belső hangodat a beléd épült idegen hangoktól."
  ],
  wisdom: { t: "Ha az egész világ dicsérte volna, nem buzdult volna fel. Ha az egész világ ócsárolta volna, nem csüggedt volna el. Tudta, hol a határ a belső és a külső között.", s: "Csuang-ce, 1. fejezet (szabad fordítás)" },
  practice: { title: "Kinek a hangja?", steps: [
    "Írd le három mondatot, amit gyakran mondasz magadnak (pl. „Ezt nem tudom egyedül.”, „Mit fognak szólni?”).",
    "Mindegyik mellé írd oda: kinek a hangján szól ez a mondat? Ki mondta neked először?",
    "Írd át mindegyiket a saját, felnőtt hangodon. Pl. „Ezt még nem csináltam, de meg tudom tanulni.”",
    "Ha legközelebb felbukkan a régi hang, mondd magadban: „Köszönöm, de most én döntök.”"
  ]},
  task: "Ma figyeld meg, hányszor gondolsz arra, mit szólnának mások egy döntésedhez.",
  reflect: ["Kinek a véleménye számít neked a legjobban? Miért?", "Hogyan éreznéd magad, ha az ő véleménye nem befolyásolna?"] },

{ id: "o5", area: "onallosag", title: "A nemes ember önmagában keres", min: 9,
  lead: "A felelősség nem teher. Ez a szabadság másik neve.",
  body: [
    "Konfuciusz szerint a nemes ember önmagában keresi a hibát, a kisember másokban. Ez a mondat elsőre szigorúnak tűnhet, de valójában felszabadító. Ha minden problémáért mások a felelősek, akkor tehetetlenek vagyunk: várnunk kell, hogy ők változzanak.",
    "Ha viszont azt kérdezzük: <em>„Mi az én részem ebben? Mit tehetek én?”</em>, akkor visszakapjuk az irányítást. Ez nem önostorozás. Nem azt jelenti, hogy mindenért mi vagyunk a hibásak. Azt jelenti, hogy a saját részünkért vállaljuk a felelősséget, mert az az egyetlen, amire valóban hatással vagyunk.",
    "Ez a gondolat az irigységre és a rosszindulatra is hat. Ha valaki más sikere mögött igazságtalanságot látunk, könnyű őt hibáztatni. Ha azt kérdezzük: „Mit tehetnék én a saját fejlődésemért?”, akkor az energiánk felénk fordul, és építővé válik."
  ],
  wisdom: { t: "A nemes ember önmagától követel, a kisember másoktól.", s: "Konfuciusz: Beszélgetések és mondások, XV.21 (szabad fordítás)" },
  practice: { title: "A befolyás köre", steps: [
    "Gondolj egy helyzetre, ami most frusztrál a munkában vagy a magánéletedben.",
    "Rajzolj (vagy írj) két kört: a belsőbe azt, amire hatással vagy, a külsőbe azt, amire nem.",
    "A külső kör dolgait tudatosan engedd el: „Ezt nem én irányítom.”",
    "A belső körből válassz egy dolgot, és tervezd meg az első lépést."
  ]},
  task: "Ma, ha valakit hibáztatnál, kérdezd meg előbb magadtól: „Mi az én részem ebben?”",
  reflect: ["Milyen helyzetben vársz arra, hogy más változzon?", "Mi az, amit te megtehetnél ebben a helyzetben?"] },

/* ===== MAGABIZTOSSÁG ===== */
{ id: "b1", area: "magabiztossag", title: "Hétszer elesni, nyolcszor felállni", min: 9,
  lead: "Nana korobi, ja oki. A magabiztosság a felállásból születik, nem a hibátlanságból.",
  body: [
    "A japán <em>Daruma</em>-baba egy kerek, súlyos aljú figura, amelyet akárhányszor lökünk fel, mindig visszaáll. Bodhidharmát, a zen buddhizmus legendás alapítóját ábrázolja, és a kitartás jelképe. Hozzá kapcsolódik a mondás: <strong>hétszer elesni, nyolcszor felállni</strong>.",
    "Sokan azt hiszik, a magabiztos emberek nem hibáznak, nem bizonytalanok, nem félnek. Ez nem igaz. A magabiztos emberek ugyanúgy hibáznak, csak nem tekintik a hibát a személyiségük ítéletének. A hiba esemény, nem identitás. „Hibáztam” és „rossz vagyok” két egészen különböző mondat.",
    "A pszichológiában ezt <em>fejlődési szemléletnek</em> nevezik: ha a képességeinket fejleszthetőnek látjuk, a kudarc tanulási lehetőséggé válik. Ha rögzítettnek tartjuk őket, minden hiba bizonyítéknak tűnik arra, hogy „nem vagyunk elég jók”."
  ],
  wisdom: { t: "Önmagad vagy a saját menedéked, ki más lehetne az? Aki önmagát jól megzabolázta, ritka menedékre lelt.", s: "Dhammapada, 160. vers (szabad fordítás)" },
  practice: { title: "Kudarc-önéletrajz", steps: [
    "Írj egy rövid listát öt dologról, ami nem sikerült az életedben.",
    "Mindegyik mellé írd le: mit tanultam belőle? Hogyan álltam fel?",
    "Írd le: melyik volt a legnagyobb ezek közül, és ma milyen távolinak tűnik?",
    "Olvasd el újra a listát, és vedd észre: minden alkalommal felálltál."
  ]},
  task: "Ma, ha hibázol, mondd magadban: „Hibáztam, és tanulok belőle” a „Rossz vagyok” helyett.",
  reflect: ["Melyik hibádon rágódtál a legtovább?", "Mit mondanál egy barátodnak, aki ugyanezt a hibát követte el?"] },

{ id: "b2", area: "magabiztossag", title: "A legkedvesebb ember", min: 11,
  lead: "Senki sem érdemli meg jobban a kedvességedet, mint te magad.",
  body: [
    "Egy buddhista történet szerint Paszénadi király és felesége egyszer azon gondolkodtak, van-e bárki, aki kedvesebb nekik saját magunknál. Arra jutottak, hogy nincs. Buddha megerősítette: ha az ember az elméjével bejárja az összes égtájat, sehol nem talál senkit, aki kedvesebb lenne neki önmagánál. Ugyanígy mindenki más is önmagát tartja a legkedvesebbnek, ezért aki szereti magát, ne ártson másnak.",
    "A modern pszichológiában ezt <strong>önegyüttérzésnek</strong> hívják. Kristin Neff kutató szerint három eleme van: <em>tudatosság</em> (észreveszem, hogy szenvedek), <em>közös emberség</em> (nem vagyok egyedül, mindenki átél ilyet), és <em>önkedvesség</em> (úgy bánok magammal, mint egy jó barátommal).",
    "A kutatások szerint az önegyüttérzés nem tesz lustává vagy elkényeztetetté. Éppen ellenkezőleg: aki kedves magához a hibái után, az gyorsabban felépül, többet tanul és kevésbé fél új dolgokba fogni. A kemény belső kritikus nem motivál, hanem megbénít.",
    "Az önegyüttérzés az irigység és a rosszindulat gyógyszere is. Aki belül éhezik a szeretetre, az kívül is szűkmarkú lesz. Aki magát elfogadja, annak nincs szüksége arra, hogy mások kisebbek legyenek nála."
  ],
  wisdom: { t: "Bejárva a tudattal minden égtájat, sehol sem találni senkit, aki kedvesebb volna az embernek önmagánál. Így mindenki önmagát tartja a legkedvesebbnek, ezért aki szereti magát, ne ártson másnak.", s: "Szamjutta-nikája 3.8 (szabad fordítás)" },
  practice: { title: "Önegyüttérző szünet", steps: [
    "Amikor rosszul érzed magad, tedd a kezed a szívedre vagy az arcodra.",
    "Mondd magadban: „Ez most egy nehéz pillanat.” (tudatosság)",
    "„A nehézség az élet része. Mások is éreznek ilyet.” (közös emberség)",
    "„Legyek kedves magamhoz. Mit mondanék most egy barátomnak?” (önkedvesség)"
  ]},
  note: "A gyakorlat Kristin Neff önegyüttérzés-kutató munkája nyomán készült.",
  task: "Végezd el a vezetett önegyüttérzés-meditációt, és ma legalább egyszer alkalmazd az önegyüttérző szünetet.",
  reflect: ["Hogyan beszélsz magadban magadhoz, amikor hibázol? Írd le szó szerint.", "Beszélnél így egy barátoddal?"],
  tool: { type: "med", id: "onegyutterzes", label: "Meditáció: Önegyüttérzés" } },

{ id: "b3", area: "magabiztossag", title: "A víz és a bambusz", min: 9,
  lead: "A legpuhább dolog legyőzi a legkeményebbet.",
  body: [
    "A Tao Te King szerint nincs a világon semmi puhább és engedékenyebb a víznél, mégis semmi sem győzi le nála jobban a keményet és az erőset. A bambusz a viharban meghajlik, de nem törik el. A tölgy merev, és a vihar kidönti.",
    "A valódi magabiztosság nem hangos, nem harsány és nem merev. Nem kell mindent tudnod, nem kell mindig igazad legyen. A magabiztos ember meri azt mondani: „Ezt nem tudom.” „Tévedtem.” „Segítenél?” Mert a belső biztonsága nem ezen múlik.",
    "A keleti harcművészetekben és a meditációban a <em>hara</em> (japánul a has, a köldök alatti terület) az erő és a nyugalom központja. Ha a figyelmed ide süllyed, a tested és a hangod is nyugodtabb lesz. A rövid, felületes, mellkasi légzés a szorongás jele. A mély, hasi légzés jelzi az idegrendszernek: biztonságban vagy."
  ],
  wisdom: { t: "Nincs a világon puhább és gyengébb a víznél, mégis semmi sem múlja felül, ha a keményet és erőset kell legyőzni.", s: "Lao-ce: Tao Te King, 78. vers (szabad fordítás)" },
  practice: { title: "Hara-légzés megszólalás előtt", steps: [
    "Megbeszélés vagy nehéz beszélgetés előtt tedd a kezed a hasadra, a köldököd alá.",
    "Lélegezz be lassan úgy, hogy a kezed emelkedjen. Lélegezz ki lassan, hosszabban.",
    "Érezd a talpadat a földön és az ülőcsontjaidat a széken.",
    "Amikor megszólalsz, beszélj egy kicsit lassabban, mint szoktál. A lassú beszéd nyugalmat és magabiztosságot sugároz."
  ]},
  task: "A következő megbeszélésen szólalj meg legalább egyszer, egy kérdéssel vagy egy rövid gondolattal. Előtte végezz három hara-légzést.",
  reflect: ["Milyen helyzetekben érzed magad merevnek, mint a tölgy?", "Hol tudnál több rugalmasságot engedni magadnak?"],
  tool: { type: "med", id: "hegy", label: "Meditáció: A hegy" } },

{ id: "b4", area: "magabiztossag", title: "Kedves nem", min: 10,
  lead: "Minden igen valami másnak a nem-je. Ha mindenre igent mondasz, magadra mondasz nemet.",
  body: [
    "Aki nehezen mond nemet, az gyakran attól fél, hogy elveszíti mások szeretetét vagy elismerését. Ezért elvállal mindent, túlterheli magát, aztán csendben haragszik, és ebből könnyen lesz sértettség, irigység vagy keserűség.",
    "A keleti tanítások szerint a határ nem fal, hanem tiszteletet fejez ki. Tiszteled a saját idődet, energiádat, értékeidet, és ezzel a másikat is tiszteled, mert őszinte vagy vele. Egy félszívvel, keserűen elvállalt feladat senkinek sem jó.",
    "A kedves nem három részből áll: <strong>elismerés</strong> („Köszönöm, hogy rám gondoltál.”), <strong>világos nem</strong> („Ezt most nem tudom vállalni.”), és ha van, <strong>alternatíva</strong> („Jövő héten tudnék segíteni.” vagy „Kérdezd meg talán Annát.”). Nem kell hosszan magyarázkodnod vagy bocsánatot kérned.",
    "Kezdd kicsiben. Egy apró nem egy kis kérésre is izomépítés."
  ],
  wisdom: { t: "Aki ismeri a mértéket, nem vall szégyent. Aki tudja, hol kell megállni, nem kerül veszélybe, és sokáig megmarad.", s: "Lao-ce: Tao Te King, 44. vers (szabad fordítás)" },
  practice: { title: "A kedves nem gyakorlása", steps: [
    "Írj le egy helyzetet, amikor igent mondtál, pedig nemet szerettél volna.",
    "Fogalmazd meg a kedves nemet a három lépés szerint (elismerés, világos nem, alternatíva).",
    "Mondd ki hangosan egyszer-kétszer, egyedül. Figyeld, hogyan hangzik.",
    "A héten mondj nemet legalább egy kis kérésre."
  ]},
  task: "Ma, mielőtt igent mondanál valamire, mondd: „Hadd gondoljam át, és visszajelzek.”",
  reflect: ["Mitől félsz, amikor nemet kellene mondanod?", "Mit nyernél, ha bátrabban húznál határokat?"] },

{ id: "b5", area: "magabiztossag", title: "Bizonyítékok gyűjteménye", min: 9,
  lead: "A belső kritikus csak a hibáidat könyveli. Itt az ideje a másik oldalnak.",
  body: [
    "Az emberi agy természeténél fogva jobban emlékszik a negatív élményekre, mint a pozitívakra. Ezt <em>negativitási torzításnak</em> nevezik. Egy kritika órákig foglalkoztat, tíz dicséret elszáll. Ezért aki önbizalomhiánnyal küzd, nem azért érzi magát kevésnek, mert az, hanem mert az elméje szelektíven gyűjti a bizonyítékokat.",
    "Ha a dicséretet lekicsinyeljük („Á, semmiség volt.”, „Szerencsém volt.”), akkor a jó élmények meg sem érkeznek. A gyakorlat egyszerű: tanuld meg elfogadni a dicséretet egy egyszerű „Köszönöm, ez jólesik” mondattal, és gyűjtsd tudatosan a sikereidet.",
    "A japán <em>ikigai</em> fogalma, „amiért érdemes reggel felkelni”, négy kör metszéspontjában van: amit szeretsz, amiben jó vagy, amire a világnak szüksége van, és amiért fizetnek. A magabiztossághoz az is kell, hogy tisztán lásd: miben vagy jó? Mit adsz te, amit más nem?"
  ],
  wisdom: { t: "Ahogy a méh összegyűjti a nektárt, és elszáll anélkül, hogy a virág színét vagy illatát bántaná, úgy járjon a bölcs is a világban.", s: "Dhammapada, 49. vers (szabad fordítás)" },
  practice: { title: "Sikerek üvegcséje", steps: [
    "Minden nap este írj le egy dolgot, amit jól csináltál, akármilyen apró is.",
    "Írd le minden dicséretet, amit kapsz, szó szerint.",
    "Ha dicséretet kapsz, gyakorold: „Köszönöm, ez nagyon jólesik.” Semmi „de”, semmi lekicsinylés.",
    "Ha rossz napod van, olvasd vissza a gyűjteményt."
  ]},
  task: "Írj le 10 dolgot, amiben jó vagy. Ha elakadsz, kérdezz meg egy barátot vagy kollégát, ő mit mondana.",
  reflect: ["Melyik volt az utolsó dicséret, amit lekicsinyeltél?", "Mi az a három erősséged, amit a legkevésbé ismersz el magadban?"],
  tool: { type: "page", id: "naplo", label: "Napló megnyitása" } }
];

/* ---------------- VEZETETT MEDITÁCIÓK ---------------- */
CK.meditations = [
  { id: "felhok", title: "Felhők az égen", area: "jelenlet", desc: "Megfigyelni a gondolatokat anélkül, hogy elsodornának.", steps: [
    [20, "Helyezkedj el kényelmesen. Ülj egyenes, de laza háttal. Ha jólesik, csukd be a szemed."],
    [30, "Vegyél három mélyebb lélegzetet. Belégzéskor érezd, ahogy kitágul a mellkasod. Kilégzéskor engedd el a vállaidat."],
    [40, "Most hagyd, hogy a légzésed a saját ritmusában folyjon. Nem kell irányítanod. Csak figyeld."],
    [45, "Képzeld el, hogy a tudatod olyan, mint a tágas, kék ég. Nyugodt, végtelen, mindent befogad."],
    [50, "A gondolataid felhők ezen az égen. Jönnek, átúsznak, és tovaszállnak. Nem kell őket elűznöd, és nem kell utánuk menned."],
    [50, "Ha egy gondolat magával ragad, az teljesen természetes. Ha észreveszed, mondd magadban szelíden: gondolat. És térj vissza az éghez."],
    [45, "Ha érzelem jelenik meg, az is csak egy felhő. Lehet sötétebb, lehet nehezebb, de az ég ettől nem lesz kisebb."],
    [45, "Te vagy az ég, nem a felhő. A felhők változnak, az ég marad."],
    [30, "Most engedd el a képet is. Pihenj a légzésben, abban a csendben, ami a gondolatok között van."],
    [25, "Lassan mélyítsd el a légzésed. Mozgasd meg az ujjaidat. Amikor készen állsz, nyisd ki a szemed."]
  ]},
  { id: "metta", title: "Szerető kedvesség", area: "joindulat", desc: "Mettá: jókívánságok magadnak, aztán egyre távolabbi embereknek.", steps: [
    [25, "Ülj le kényelmesen, és csukd be a szemed. Vegyél néhány nyugodt lélegzetet, és engedd, hogy a tested megpihenjen."],
    [30, "Tedd a kezed a szívedre, ha jólesik. Érezd a melegét. Ez a hely a kedvesség forrása."],
    [50, "Kezdjük veled. Mondd magadban lassan: Legyek biztonságban. Legyek egészséges. Legyek boldog. Éljek könnyedén."],
    [40, "Ismételd még néhányszor, a saját tempódban. Ha üresnek érzed, az is rendben van. A szándék számít."],
    [50, "Most idézz fel valakit, akit szeretsz, és aki téged is szeret. Lásd az arcát. Mondd neki: Légy biztonságban. Légy egészséges. Légy boldog. Élj könnyedén."],
    [50, "Most gondolj egy semleges emberre. Talán valaki, akit csak látásból ismersz. Neki is: Légy biztonságban. Légy egészséges. Légy boldog. Élj könnyedén."],
    [55, "Most gondolj valakire, aki nehéz számodra. Ne a legnehezebbre. Emlékezz: ő is boldog szeretne lenni, csakúgy, mint te. Légy biztonságban. Légy egészséges. Légy boldog."],
    [35, "Ha ellenállást érzel, térj vissza egy pillanatra önmagadhoz. Legyek biztonságban. Aztán próbáld újra, szelíden."],
    [50, "Most tágítsd ki a kört. Mindenki az épületben, a városban, az országban, a világon. Legyen minden élőlény biztonságban. Legyen minden élőlény boldog."],
    [30, "Pihenj ebben a tágas, meleg érzésben. Nem kell csinálnod semmit."],
    [25, "Lassan térj vissza. Vegyél egy mély lélegzetet, mozgasd meg a tested, és nyisd ki a szemed."]
  ]},
  { id: "mudita", title: "Együttörülés", area: "irigyseg", desc: "Muditá: megtanulni örülni mások örömének.", steps: [
    [25, "Ülj le kényelmesen. Csukd be a szemed, és vegyél három lassú, mély lélegzetet."],
    [40, "Idézz fel egy pillanatot, amikor nagyon boldog voltál. Egy jó hírt, egy nevetést, egy sikert. Érezd újra, hol jelenik meg ez az öröm a testedben."],
    [45, "Most gondolj egy gyerekre vagy egy állatra, aki önfeledten örül valaminek. Hagyd, hogy az ő öröme a te arcodra is mosolyt csaljon."],
    [50, "Most gondolj egy barátodra, akinek mostanában valami jó történt. Mondd neki magadban: Örülök a sikerednek. Bárcsak megmaradna az örömöd. Bárcsak még több jó érne."],
    [45, "Most gondolj valakire, akit kevésbé ismersz, és képzeld el, hogy ma valami szép dolog történik vele. Örülj vele, ahogy egy közönség tapsol a színpadon állónak."],
    [55, "Most, ha készen állsz, gondolj valakire, akinek a sikere szúrt. Csak egy pillanatra. Vedd észre, mi történik benned. Nem kell elűznöd az érzést."],
    [50, "Mondd neki szelíden, akkor is, ha még nem érzed teljesen: Az örömöd nem vesz el tőlem semmit. Bárcsak megmaradna a boldogságod."],
    [40, "Ha nehéz volt, légy kedves magadhoz. Ez az egyik legnehezebb gyakorlat. Már az is bátorság, hogy megpróbáltad."],
    [30, "Lassan engedd el a képeket. Vegyél egy mély lélegzetet, és amikor készen állsz, nyisd ki a szemed."]
  ]},
  { id: "testpasztazas", title: "Testpásztázás", area: "jelenlet", desc: "Végighaladni a testen, és észrevenni minden érzetet.", steps: [
    [25, "Ülj vagy feküdj le kényelmesen. Csukd be a szemed. Engedd, hogy a tested megtámaszkodjon."],
    [35, "Vidd a figyelmed a lábfejedre. Mit érzel? Meleget, hideget, bizsergést, nyomást? Vagy talán semmit. Az is rendben van."],
    [35, "Most haladj felfelé, a vádlidra és a térdedre. Csak figyeld, ami ott van, változtatás nélkül."],
    [35, "A combod, a csípőd. Érezd, ahogy a szék vagy a talaj megtart."],
    [40, "A hasad. Figyeld meg, ahogy a légzéssel emelkedik és süllyed. Ha feszültséget találsz, lélegezz bele."],
    [40, "A mellkasod és a hátad. Itt gyakran ülnek az érzelmeink. Csak vedd észre, mit találsz."],
    [40, "A vállaid. Sokan itt hordjuk a terheinket. Egy kilégzéssel engedd lejjebb őket."],
    [35, "A karjaid, a kezeid, az ujjaid hegye."],
    [40, "A nyakad, az állkapcsod. Engedd el az állkapcsod, hagyd, hogy a fogaid szétváljanak. A homlokod, a szemed körüli izmok."],
    [40, "Most érezd a testedet egészében, mint egyetlen, lélegző egészet. Itt vagy. Most."],
    [25, "Lassan mozgasd meg az ujjaidat. Nyújtózkodj, ha jólesik, és nyisd ki a szemed."]
  ]},
  { id: "onegyutterzes", title: "Önegyüttérzés", area: "magabiztossag", desc: "Rövid gyakorlat nehéz pillanatokra, Kristin Neff nyomán.", steps: [
    [25, "Ülj le, és vegyél néhány nyugodt lélegzetet. Gondolj egy helyzetre, ami most nehéz neked. Ne a legnehezebbre, csak egy közepesre."],
    [35, "Engedd, hogy érezd a nehézséget a testedben. Hol jelenik meg? Szorítás, súly, forróság?"],
    [35, "Mondd magadban lassan: Ez most egy nehéz pillanat. Ez fáj. Ez a tudatosság."],
    [40, "Most mondd: A nehézség az élet része. Mások is éreznek így. Nem vagyok egyedül. Ez a közös emberség."],
    [40, "Tedd a kezed a szívedre, és érezd a kezed melegét. Mondd: Legyek kedves magamhoz. Adjam meg magamnak, amire szükségem van."],
    [40, "Kérdezd meg: Mit mondanék most egy jó barátomnak, aki ugyanezt éli át? Mondd ezt magadnak, ugyanazzal a gyengédséggel."],
    [25, "Maradj még egy kicsit ebben a melegségben. Aztán vegyél egy mély lélegzetet, és nyisd ki a szemed."]
  ]},
  { id: "upekkha", title: "A nyugodt szív", area: "elfogadas", desc: "Upekkhá: kiegyensúlyozottság és elengedés.", steps: [
    [25, "Ülj le kényelmesen, egyenes háttal. Csukd be a szemed, és érkezz meg a légzésedbe."],
    [40, "Képzelj el egy mély tavat. A felszínét fodrozza a szél, de a mélyén minden csendes. Te is ilyen vagy: a felszínen hullámok, a mélyben nyugalom."],
    [45, "Gondolj egy semleges emberre. Mondd magadban: Mindenki a saját útját járja. Az ő boldogsága az ő döntésein múlik."],
    [50, "Most gondolj valakire, akit nehezen fogadsz el. Mondd: Kívánom neked a jót. És elengedem a vágyat, hogy olyan legyél, amilyennek én szeretnélek."],
    [45, "Mondd: Te is a saját tetteid örököse vagy, ahogy én is az enyéim. Nem az én dolgom, hogy irányítsalak."],
    [40, "Érezd, ahogy valami elenged a vállaidban, a mellkasodban. Nem kell mindenkit megváltoztatnod. Szabad vagy."],
    [30, "Pihenj a tó mélyén, a csendes vízben. Aztán lassan térj vissza, és nyisd ki a szemed."]
  ]},
  { id: "hegy", title: "A hegy", area: "magabiztossag", desc: "Belső stabilitás, ami nem függ az időjárástól.", steps: [
    [25, "Ülj egyenesen, méltósággal, mint aki tudja, hogy helye van a világban. Csukd be a szemed."],
    [40, "Képzelj el egy hegyet. Talán egy, amit láttál már, talán egy képzeletbelit. Lásd a csúcsát, a lejtőit, a széles, szilárd alapját."],
    [40, "Most képzeld el, hogy te vagy ez a hegy. A fejed a csúcs, a vállaid a lejtők, a medencéd és a lábad a mélyen gyökerező alap."],
    [45, "Ahogy telnek az évszakok, a hegyre eső hull, hó borítja, a nap perzseli, viharok tépik. A hegy mindezt megéli, és közben ott marad, ahol van."],
    [45, "Az életedben is jönnek viharok: kritika, kudarc, bizonytalanság. Ezek az időjárás. Te vagy a hegy."],
    [40, "Érezd a súlyodat, a stabilitásodat. Mondd magadban: Itt vagyok. Szilárdan állok. Megérdemlem a helyemet."],
    [30, "Lassan engedd el a képet, de vidd magaddal a hegy nyugalmát. Nyisd ki a szemed."]
  ]}
];

/* ---------------- LÉGZŐGYAKORLATOK ---------------- */
CK.breathing = [
  { id: "doboz", name: "Dobozlégzés", tag: "Fókusz", desc: "Egyenlő ütemű légzés négy szakaszban. Megnyugtat és összpontosít stresszes helyzet előtt.",
    phases: [["in", 4, "Belégzés"], ["hold", 4, "Tartsd bent"], ["out", 4, "Kilégzés"], ["hold0", 4, "Tartsd kint"]], rounds: 6 },
  { id: "hosszu", name: "Megnyugtató kilégzés", tag: "Indulat oldása", desc: "A kilégzés hosszabb, mint a belégzés, ez lassítja a szívverést. Ha düh, irigység vagy sértettség hulláma jön.",
    phases: [["in", 4, "Belégzés"], ["out", 7, "Hosszú kilégzés"]], rounds: 8 },
  { id: "478", name: "4–7–8 légzés", tag: "Elalvás", desc: "Mély ellazulás este vagy szorongáskor. Kezdetben legfeljebb 4 kör.",
    phases: [["in", 4, "Belégzés az orron"], ["hold", 7, "Tartsd bent"], ["out", 8, "Kilégzés a szádon"]], rounds: 4 },
  { id: "koherens", name: "Koherens légzés", tag: "Egyensúly", desc: "Percenként kb. hat lélegzet. Kiegyensúlyozza az idegrendszert, akár napi 5 percig is.",
    phases: [["in", 5, "Belégzés"], ["out", 5, "Kilégzés"]], rounds: 30 },
  { id: "nadi", name: "Váltott orrlyukas légzés", tag: "Nádí sódhana", desc: "Klasszikus jógikus légzés (pránájáma). A jobb hüvelykujjal a jobb, a gyűrűsujjal a bal orrlyukat zárod.",
    phases: [["in", 4, "Be a bal orrlyukon"], ["hold", 2, "Zárd mindkettőt"], ["out", 6, "Ki a jobb orrlyukon"], ["in", 4, "Be a jobb orrlyukon"], ["hold", 2, "Zárd mindkettőt"], ["out", 6, "Ki a bal orrlyukon"]], rounds: 6 }
];

/* ---------------- NAPI BÖLCSESSÉGEK ---------------- */
CK.wisdom = [
  ["A gyűlöletet sosem csillapítja gyűlölet. Csak a nem-gyűlölet csillapítja.", "Dhammapada 5"],
  ["Aki tudja, mi az elég, gazdag.", "Tao Te King 33"],
  ["Az ezer mérföldes út is egyetlen lépéssel kezdődik.", "Tao Te King 64"],
  ["Legyetek önmagatok lámpásai.", "Mahápariníbbána-szutta"],
  ["Hétszer elesni, nyolcszor felállni.", "Japán közmondás"],
  ["Ahogy a szikla nem rendül meg a széltől, úgy a bölcs sem inog meg dicsérettől vagy gáncstól.", "Dhammapada 81"],
  ["A nemes ember önmagától követel, a kisember másoktól.", "Konfuciusz, Beszélgetések XV.21"],
  ["Jobb a saját utadat tökéletlenül járni, mint másét tökéletesen.", "Bhagavad Gítá 3.35"],
  ["A víz a legpuhább, mégis legyőzi a legkeményebbet.", "Tao Te King 78"],
  ["Ki tud várni, amíg a sár leülepszik, és a víz kitisztul?", "Tao Te King 15"],
  ["Ezer gyertya gyújtható egyetlen lángról, és annak élete nem lesz rövidebb.", "Buddhista mondás"],
  ["Mindaz, amik vagyunk, gondolataink eredménye.", "Dhammapada 1"],
  ["Aki másokat legyőz, erős. Aki önmagát legyőzi, hatalmas.", "Tao Te King 33"],
  ["Amin sokat gondolkodsz, arra hajlik az elméd.", "Maddzshima-nikája 19"],
  ["Ki tudja, jó-e vagy rossz?", "Huainanzi, Szaj Ueng lova"],
  ["Ürítsd ki a csészédet, hogy megtölthessem.", "Zen történet"],
  ["A Nagy Út nem nehéz azoknak, akik nem válogatnak.", "Hszin Hszin Ming"],
  ["Sehol sem találni senkit, aki kedvesebb volna az embernek önmagánál.", "Szamjutta-nikája 3.8"],
  ["A nemes ember segít másoknak kibontakoztatni a bennük lévő jót.", "Konfuciusz, Beszélgetések XII.16"],
  ["Ahogy én boldogságra vágyom, úgy minden más lény is.", "Sántidéva"],
  ["Csak olyan szót szólj, amely nem okoz gyötrődést és nem árt másnak.", "Szutta-nipáta 3.3"],
  ["A tanulás útján gyarapodsz. Az Út követésében minden nap elengedsz valamit.", "Tao Te King 48"],
  ["Ha az egész világ dicsérné, nem buzdulna fel. Ha az egész világ ócsárolná, nem csüggedne el.", "Csuang-ce"],
  ["Aki ismeri a mértéket, nem vall szégyent.", "Tao Te King 44"],
  ["Ahogy a méh nektárt gyűjt, és nem bántja a virágot, úgy járjon a bölcs a világban.", "Dhammapada 49"],
  ["A szerencse a balszerencsében rejlik, a balszerencse a szerencsében lapul.", "Tao Te King 58"],
  ["Az elme kitisztul a boldogok iránti barátság és az erényesek iránti öröm által.", "Jóga-szútra I.33"],
  ["Ne irigyeld mások szerencséjét. Aki irigykedik, nem talál békét.", "Dhammapada 365"],
  ["A hegy nem harcol a viharral. Csak ott marad, ahol van.", "Zen gondolat"],
  ["Ahol vagy, ott légy egészen.", "Zen gondolat"]
];

/* ---------------- ÉRTÉKEK ---------------- */
CK.values = ["Becsületesség", "Bátorság", "Biztonság", "Barátság", "Család", "Egészség", "Együttérzés", "Elismerés", "Fejlődés", "Felelősség", "Függetlenség", "Hála", "Harmónia", "Hit", "Humor", "Igazságosság", "Kalandvágy", "Kedvesség", "Kitartás", "Kreativitás", "Megbízhatóság", "Nyugalom", "Nyitottság", "Önkifejezés", "Rend", "Segítőkészség", "Szabadság", "Szeretet", "Teljesítmény", "Tisztelet", "Tudás", "Türelem"];

/* ---------------- 21 NAPOS KIHÍVÁS: SZOKÁSOK ---------------- */
CK.habits = [
  { id: "ules", t: "5 perc csendes ülés vagy légzés", a: "jelenlet" },
  { id: "gratulacio", t: "Egy szívből jövő gratuláció vagy dicséret", a: "irigyseg" },
  { id: "pletyka", t: "Pletykamentes nap", a: "joindulat" },
  { id: "kivancsisag", t: "Ítélet helyett egy kíváncsi kérdés", a: "elfogadas" },
  { id: "dontes", t: "Egy döntés egyedül, megerősítés nélkül", a: "onallosag" },
  { id: "kedvesseg", t: "Egy kedves mondat magamnak", a: "magabiztossag" },
  { id: "hala", t: "Három dolog, amiért hálás vagyok", a: "irigyseg" }
];

CK.moods = [
  { v: 1, l: "Nehéz", c: "Viharos" },
  { v: 2, l: "Borongós", c: "Felhős" },
  { v: 3, l: "Semleges", c: "Szélcsend" },
  { v: 4, l: "Jó", c: "Napsütés" },
  { v: 5, l: "Ragyogó", c: "Tiszta ég" }
];

CK.emotions = ["nyugalom", "öröm", "hála", "remény", "büszkeség", "kíváncsiság", "fáradtság", "szorongás", "irigység", "harag", "sértettség", "csalódottság", "szomorúság", "magány", "bizonytalanság", "szégyen", "türelmetlenség", "feszültség"];
