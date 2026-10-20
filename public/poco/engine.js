// Poco a Poco — leer-engine: data-voorbereiding, vervoegingen, spaced repetition, sessie-opbouw en opslag
(function(){
"use strict";
const S = window.SPAANS;
const E = window.ENGINE = {};

// ---------- hulpfuncties ----------
const norm = s => (s||"").toLowerCase().trim().replace(/\s+/g," ");
const stripAcc = s => norm(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[¿¡?!.,;:]/g,"").trim();
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pick = (a,n) => shuffle(a).slice(0,n);
E.norm = norm; E.stripAcc = stripAcc; E.shuffle = shuffle;

E.dayNum = (d = new Date()) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
E.dayKey = (n) => { const d = new Date(n*86400000); return d.toISOString().slice(0,10); };

// ---------- data ----------
const catName = {}; S.categories.forEach(([id,name]) => catName[id]=name);
E.catName = id => catName[id] || id;
E.categories = S.categories;

// Woorden: dubbele Spaanse woorden samenvoegen (betekenissen combineren, eerste categorie behouden)
const wordMap = new Map();
S.words.forEach(([es,nl,cat,lvl,typ]) => {
  const key = es;
  if(wordMap.has(key)){
    const w = wordMap.get(key);
    nl.split(" / ").forEach(p => { if(!w.nlParts.includes(p)) w.nlParts.push(p); });
    if(!w.cats.includes(cat)) w.cats.push(cat);
    return;
  }
  const isNoun = /^(el|la|los|las|el\/la) /.test(es);
  wordMap.set(key, { id:"w:"+es, kind:"word", es, nlParts: nl.split(" / "), cat, cats:[cat], lvl, type: typ || (isNoun ? "n" : "o") });
});
E.words = Array.from(wordMap.values()).map(w => { w.nl = w.nlParts.join(" / "); return w; });

// Werkwoorden
E.PERSONS = ["yo","tú","él / ella / usted","nosotros/as","vosotros/as","ellos / ellas / ustedes"];
E.PERSONS_SHORT = ["yo","tú","él/ella","nosotros","vosotros","ellos"];
E.TENSES = [
  { id:"presente",    name:"Presente",              nl:"tegenwoordige tijd",          uitleg:"Wat nu gebeurt of gewoonlijk gebeurt: hablo = ik spreek." },
  { id:"indefinido",  name:"Pretérito indefinido",  nl:"verleden tijd (afgerond)",    uitleg:"Een afgeronde gebeurtenis in het verleden: ayer hablé = gisteren sprak ik." },
  { id:"perfecto",    name:"Pretérito perfecto",    nl:"voltooid tegenwoordige tijd", uitleg:"Recent verleden met band met nu: hoy he hablado = vandaag heb ik gesproken." },
  { id:"imperfecto",  name:"Pretérito imperfecto",  nl:"verleden tijd (duur/gewoonte)", uitleg:"Gewoontes, achtergrond en duur in het verleden: antes hablaba = vroeger sprak ik." },
  { id:"futuro",      name:"Futuro simple",         nl:"toekomende tijd",             uitleg:"Wat zal gebeuren: mañana hablaré = morgen zal ik spreken." },
  { id:"condicional", name:"Condicional",           nl:"voorwaardelijke wijs",        uitleg:"Wat zou gebeuren: hablaría = ik zou spreken." },
];
const tenseById = {}; E.TENSES.forEach(t => tenseById[t.id]=t);
E.tense = id => tenseById[id];

const REFL = ["me","te","se","nos","os","se"];
function changeStem(st, type){
  const [from,to] = type.split(">");
  const i = st.lastIndexOf(from);
  return i<0 ? st : st.slice(0,i)+to+st.slice(i+from.length);
}
const END = {
  presente:   { ar:["o","as","a","amos","áis","an"], er:["o","es","e","emos","éis","en"], ir:["o","es","e","imos","ís","en"] },
  indefinido: { ar:["é","aste","ó","amos","asteis","aron"], er:["í","iste","ió","imos","isteis","ieron"], ir:["í","iste","ió","imos","isteis","ieron"] },
  imperfecto: { ar:["aba","abas","aba","ábamos","abais","aban"], er:["ía","ías","ía","íamos","íais","ían"], ir:["ía","ías","ía","íamos","íais","ían"] },
  futuro:     ["é","ás","á","emos","éis","án"],
  condicional:["ía","ías","ía","íamos","íais","ían"],
};
function conjugate(v){
  const o = v.o || {};
  const refl = !!o.refl;
  const base = refl ? v.inf.slice(0,-2) : v.inf;           // levantarse → levantar
  const plain = base.replace("í","i");                       // oír → oir, reír → reir
  const end = plain.slice(-2);                               // ar / er / ir
  const stem = base.slice(0,-2);
  const sc = o.sc;
  const irSC = end==="ir" && sc ? (sc.startsWith("e") ? "e>i" : "o>u") : null;
  const yRule = /uir$/.test(plain) && !/guir$/.test(plain);  // construir → construyo
  const iyRule = /eer$|aer$|oír$/.test(base);                // leer → leyó, leído
  const wrap = (forms, override) => (refl && !override) ? forms.map((f,i) => REFL[i]+" "+f) : forms;

  // presente
  let pres;
  if(o.pres) pres = o.pres.slice();
  else {
    pres = END.presente[end].map(e => stem+e);
    let yoStem = stem;
    if(sc){ yoStem = changeStem(stem, sc); [0,1,2,5].forEach(i => pres[i] = yoStem + END.presente[end][i]); }
    if(yRule){ [0,1,2,5].forEach(i => pres[i] = stem+"y"+END.presente[end][i]); }
    if(o.yo) pres[0] = o.yo;
    else if(/[aeiou]cer$|[aeiou]cir$/.test(plain)) pres[0] = yoStem.slice(0,-1)+"zco";
    else if(/ger$|gir$/.test(plain)) pres[0] = yoStem.slice(0,-1)+"jo";
    else if(/guir$/.test(plain)) pres[0] = yoStem.slice(0,-2)+"go";
  }
  // indefinido
  let ind;
  if(o.indef) ind = o.indef.slice();
  else if(o.ind){ const st=o.ind, j=/j$/.test(st); ind=[st+"e",st+"iste",st+"o",st+"imos",st+"isteis",st+(j?"eron":"ieron")]; }
  else {
    ind = END.indefinido[end].map(e => stem+e);
    if(irSC){ const cs = changeStem(stem, irSC); ind[2]=cs+"ió"; ind[5]=cs+"ieron"; }
    if(end==="ar"){
      if(/car$/.test(plain)) ind[0]=stem.slice(0,-1)+"qué";
      else if(/gar$/.test(plain)) ind[0]=stem.slice(0,-1)+"gué";
      else if(/zar$/.test(plain)) ind[0]=stem.slice(0,-1)+"cé";
    }
    if(iyRule) ind = [stem+"í",stem+"íste",stem+"yó",stem+"ímos",stem+"ísteis",stem+"yeron"];
    else if(yRule){ ind[2]=stem+"yó"; ind[5]=stem+"yeron"; }
  }
  // imperfecto
  const imp = o.imp ? o.imp.slice() : END.imperfecto[end].map(e => stem+e);
  // futuro & condicional
  const fb = o.fut || plain;
  const fut = END.futuro.map(e => fb+e);
  const cond = END.condicional.map(e => fb+e);
  // participio & gerundio
  let part = o.part || (end==="ar" ? stem+"ado" : (iyRule ? stem+"ído" : stem+"ido"));
  let ger = o.ger || (end==="ar" ? stem+"ando" : (iyRule||yRule ? stem+"yendo" : (irSC ? changeStem(stem,irSC)+"iendo" : stem+"iendo")));
  if(refl && !/se$/.test(ger)) ger = ger.replace(/ando$/,"ándose").replace(/iendo$/,"iéndose").replace(/yendo$/,"yéndose");
  const HABER = ["he","has","ha","hemos","habéis","han"];
  const perf = HABER.map((h,i) => (refl ? REFL[i]+" " : "") + h + " " + part);
  return {
    presente: wrap(pres, o.pres), indefinido: wrap(ind, o.indef), imperfecto: wrap(imp, o.imp),
    futuro: wrap(fut), condicional: wrap(cond), perfecto: perf, participio: part, gerundio: ger,
  };
}
E.verbs = S.verbs.map(([inf,nl,lvl,o]) => {
  const v = { id:"v:"+inf, kind:"verb", inf, nl, lvl, o: o||{} };
  v.refl = !!v.o.refl;
  v.irregular = !!(o && (o.pres||o.indef||o.ind||o.imp||o.fut||o.yo||o.part||o.sc));
  v.forms = conjugate(v);
  return v;
});
E.verbById = {}; E.verbs.forEach(v => E.verbById[v.id]=v);
E.conjugate = conjugate;

// Werkwoord-items: werkwoord × tijd, in leervolgorde (presente eerst, andere tijden volgen geleidelijk)
const TENSE_OFFSET = { presente:0, indefinido:6, perfecto:12, imperfecto:18, futuro:24, condicional:30 };
E.verbItems = [];
E.verbs.forEach((v,i) => {
  E.TENSES.forEach(t => {
    const off = TENSE_OFFSET[t.id];
    if(i >= off){ const src = E.verbs[i-off]; E.verbItems.push({ id:"vt:"+src.inf+":"+t.id, kind:"vt", verb:src, tense:t.id, order:E.verbItems.length }); }
  });
});
// resterende combinaties (laatste werkwoorden in latere tijden)
E.verbs.forEach((v,i) => E.TENSES.forEach(t => {
  const id = "vt:"+v.inf+":"+t.id;
  if(!E.verbItems.some(x => x.id===id)) E.verbItems.push({ id, kind:"vt", verb:v, tense:t.id, order:E.verbItems.length });
}));

// Zinnen: [raw, nl, lvl, infinitief?, tijd?]; oudere zinnen zonder werkwoordinfo worden automatisch getagd als de vorm eenduidig is
const formIndex = {};
E.verbs.forEach(v => E.TENSES.forEach(t => v.forms[t.id].forEach(f => { const k = norm(f); (formIndex[k] = formIndex[k] || []).push({ inf:v.inf, tense:t.id }); })));
E.sentences = S.sentences.map((row,i) => {
  const [raw,nl,lvl,inf,tense] = row;
  const m = raw.match(/\[([^\]]+)\]/);
  const es = raw.replace(/\[([^\]]+)\]/,"$1");
  const s = { id:"s:"+i, kind:"sent", es, nl, lvl, cloze: m ? m[1] : null, raw, words: es.split(" "), verb: inf ? (E.verbById["v:"+inf] || null) : null, tense: tense || null };
  if(row.length < 4 && s.cloze){
    const hits = formIndex[norm(s.cloze)];
    if(hits && hits.length && hits.every(h => h.inf===hits[0].inf && h.tense===hits[0].tense)){
      let inf = hits[0].inf;
      if(/(^|\s)(me|te|se|nos|os)\s*$/.test(raw.slice(0, raw.indexOf("["))) && E.verbById["v:"+inf+"se"]) inf = inf+"se";
      s.verb = E.verbById["v:"+inf]; s.tense = hits[0].tense;
    }
  }
  s.isVerb = !!(s.verb && s.tense);
  return s;
});
E.sentencesForVerb = inf => E.sentences.filter(s => s.verb && s.verb.inf===inf);
E.TENSE_OTHER = { id:"otros", name:"Gebiedende wijs & subjuntivo", nl:"overige vormen" };
E.tenseLabel = t => t ? E.tense(t).name : E.TENSE_OTHER.name;
E.sentTask = (s, fresh) => { const t = s.words.length > 10 ? (s.isVerb ? { t:"vcloze", id:s.id } : { t:"cloze", id:s.id }) : { t:"scramble", id:s.id }; if(fresh) t.fresh = 1; return t; };

E.items = {}; [...E.words, ...E.verbItems, ...E.sentences].forEach(it => E.items[it.id]=it);
E.item = id => E.items[id];

// ---------- spaced repetition ----------
// box 0 = nieuw, 1 = net geïntroduceerd (vandaag nog vragen), daarna intervallen in dagen
const LADDER = [0, 0, 1, 3, 7, 14, 30, 60, 120, 240];
E.LADDER = LADDER;
E.MAXBOX = LADDER.length-1;
E.status = st => !st || st.b===0 ? "nieuw" : st.b<=3 ? "leren" : st.b<=5 ? "bekend" : "beheerst";
E.statusName = { nieuw:"Nieuw", leren:"Aan het leren", bekend:"Bekend", beheerst:"Beheerst" };
E.isKnown = st => !!st && st.b>=4;

E.introduce = (st, today) => Object.assign(st||{c:0,w:0,s:0}, { b:1, d:today, i:today, l:today });
// gemak: woorden die je (bijna) nooit fout hebt komen later terug, woorden met veel fouten eerder
E.ease = st => { if(!st) return 1; if(st.w===0 && st.c>=2) return 1.3; if(st.w>=3 && st.w>=st.c) return 0.6; if(st.w>=2) return 0.8; return 1; };
E.interval = st => { const base = LADDER[st.b]; return base<=0 ? base : Math.max(1, Math.round(base * E.ease(st))); };
E.applyResult = (st, result, today) => {
  st = st || { b:1, d:today, i:today, c:0, w:0, s:0 };
  st.l = today;
  if(result==="ok"){ st.c++; st.s++; st.b = Math.min(E.MAXBOX, Math.max(st.b,1)+1); st.d = today + E.interval(st); }
  else if(result==="almost"){ st.c++; st.b = Math.max(st.b,1); st.d = today + Math.max(1, Math.round(E.interval(st)/2)); }
  else { st.w++; st.s=0; st.b = Math.max(1, Math.ceil(st.b/2)-1); st.d = today; }
  return st;
};
E.markKnown = (st, today) => Object.assign(st||{c:0,w:0,s:0}, { b:4, d: today+5, i: (st&&st.i)||today, l: today, known:1 });
E.resetItem = (st, today) => Object.assign(st||{c:0,w:0,s:0}, { b:1, d: today, l: today });

// ---------- overhoorrichting ----------
// dirs(settings) → [eerste richting (herkennen), tweede richting (produceren)]
E.dirs = settings => { const d = (settings && settings.direction) || "both"; return d==="nl2es" ? ["nl","nl"] : d==="es2nl" ? ["es","es"] : ["es","nl"]; };
E.dirFor = settings => { const d = (settings && settings.direction) || "both"; return d==="nl2es" ? "nl" : d==="es2nl" ? "es" : (Math.random()<0.5 ? "nl" : "es"); };

// ---------- antwoorden controleren ----------
// Geeft "ok", "almost" (alleen accenten/lidwoord/wederkerend voornaamwoord anders) of "wrong"
E.checkAnswer = (given, accepted, opts={}) => {
  const clean = x => norm(x).replace(/[¿¡?!.,;:]/g,"").trim();
  const g = clean(given);
  if(!g) return "wrong";
  const exact = [], lenient = [];
  accepted.forEach(a => {
    const n = clean(a); exact.push(n);
    const paren = n.replace(/\s*\([^)]*\)/g,"").trim(); if(paren && paren!==n) exact.push(paren);
    if(opts.articles){ const m = n.match(/^(el\/la|el|la|los|las|un|una) (.+)$/); if(m){ lenient.push(m[2]); if(m[1]==="el/la"){ exact.push("el "+m[2]); exact.push("la "+m[2]); } } }
    if(opts.reflexive){ const m = n.match(/^(me|te|se|nos|os) (.+)$/); if(m) lenient.push(m[2]); }
  });
  if(exact.some(c => c===g)) return "ok";
  const gs = stripAcc(g);
  if(lenient.some(c => c===g) || exact.some(c => stripAcc(c)===gs) || lenient.some(c => stripAcc(c)===gs)) return "almost";
  return "wrong";
};
const lev = (a,b) => { if(a===b) return 0; const m=a.length, n=b.length; if(!m) return n; if(!n) return m; let prev = Array.from({length:n+1},(_,i)=>i); for(let i=1;i<=m;i++){ const cur=[i]; for(let j=1;j<=n;j++){ cur[j] = Math.min(prev[j]+1, cur[j-1]+1, prev[j-1] + (a[i-1]===b[j-1]?0:1)); } prev=cur; } return prev[n]; };
E.checkDutch = (given, nl) => {
  const art = x => x.replace(/^(de|het|een) /,"").trim();
  const g = stripAcc(String(given).replace(/\s*\([^)]*\)/g,"")), ga = art(g);
  if(!g) return "wrong";
  const cands = [];
  E.nlAccepted(nl).forEach(p => { const n = stripAcc(p); cands.push(n, art(n)); n.split(/,\s*/).forEach(x => { if(x) cands.push(stripAcc(x), art(stripAcc(x))); }); });
  if(cands.some(c => c===g || c===ga)) return "ok";
  if(cands.some(c => c.length>=4 && (lev(c,g)<=1 || lev(c,ga)<=1))) return "almost";
  return "wrong";
};
E.nlAccepted = nl => nl.split(" / ").map(p => p.replace(/\s*\([^)]*\)/g,"").trim()).filter(Boolean);

// ---------- meerkeuze-afleiders ----------
E.distractors = (item, n=3) => {
  let pool;
  if(item.kind==="word"){
    pool = E.words.filter(w => w.id!==item.id && w.type===item.type && w.nl!==item.nl);
    const same = pool.filter(w => w.cat===item.cat);
    pool = same.length>=n*2 ? same : pool;
  } else if(item.kind==="sent"){
    pool = E.sentences.filter(s => s.id!==item.id);
    const same = pool.filter(s => s.lvl===item.lvl); pool = same.length>=n ? same : pool;
  } else pool = [];
  return pick(pool, n);
};

// ---------- sessie opbouwen ----------
E.EST = { intro:22, mc:11, type:16, vintro:45, vdrill:40, sintro:22, scramble:32, cloze:22, vcloze:20, smc:12 };
E.estimate = tasks => tasks.reduce((a,t) => a + (E.EST[t.t]||15), 0);

function reviewTask(item, st, settings){
  const mode = settings.mode || "mix";
  if(item.kind==="vt") return { t:"vdrill", id:item.id };
  if(item.kind==="sent"){
    const long = item.words.length > 10;
    if(st.b<=2 && !long) return { t:"scramble", id:item.id };
    const r = Math.random(), fill = item.isVerb ? "vcloze" : "cloze";
    return r<0.65 ? { t:fill, id:item.id } : r<0.85 ? (long ? { t:fill, id:item.id } : { t:"scramble", id:item.id }) : { t:"smc", id:item.id };
  }
  // woord
  const both = (settings.direction||"both")==="both";
  if(mode==="mc") return { t:"mc", id:item.id, dir: E.dirFor(settings) };
  if(mode==="type") return { t:"type", id:item.id, dir: E.dirFor(settings) };
  if(st.b<=2) return { t:"mc", id:item.id, dir: (st.b<=1 && both) ? "es" : E.dirFor(settings) };
  return Math.random()<0.75 ? { t:"type", id:item.id, dir: E.dirFor(settings) } : { t:"mc", id:item.id, dir: E.dirFor(settings) };
}

E.ensureDrill = (data, today) => {
  const s = data.session; if(!s || s.day!==today || s.done || s.tasks.some(t => t.drill)) return false;
  const drill = E.sentenceDrill(data, today, s.tasks, data.settings.dailySentences ?? 8);
  if(!drill.length) return false;
  s.tasks.splice(Math.min(s.tasks.length, s.idx+1), 0, ...drill);
  return true;
};
E.buildSession = (data, today) => {
  const settings = data.settings, items = data.items;
  const target = (settings.minutes||30)*60;
  const st = id => items[id];
  // 1. herhalingen die vandaag (of eerder) aan de beurt zijn
  let due = Object.keys(items).filter(id => E.items[id] && items[id].b>=1 && items[id].d<=today);
  due.sort((a,b) => (items[a].d - items[b].d) || Math.random()-0.5);
  const maxRev = Math.max(20, Math.round(target/14));
  due = due.slice(0, maxRev);
  const heavy = due.length > maxRev*0.7;
  const nWords = Math.max(0, Math.round((settings.newWords ?? 8) * (heavy?0.5:1)));
  const nVerbs = Math.max(0, Math.round((settings.newVerbs ?? 2) * (heavy?0.5:1)));
  const nSents = Math.max(0, Math.round((settings.newSentences ?? 3) * (heavy?0.5:1)));
  // 2. nieuwe items in leervolgorde
  const orderWords = E.words.slice().sort((a,b) => a.lvl-b.lvl || S.categories.findIndex(c=>c[0]===a.cat) - S.categories.findIndex(c=>c[0]===b.cat));
  const newWords = orderWords.filter(w => !st(w.id)).slice(0, nWords);
  const newVerbs = E.verbItems.filter(v => !st(v.id)).slice(0, nVerbs);
  const verbSents = [];
  newVerbs.forEach(v => { const z = E.sentences.find(x => x.isVerb && x.verb.inf===v.verb.inf && x.tense===v.tense && !st(x.id) && !verbSents.includes(x)); if(z) verbSents.push(z); });
  const newSents = [...verbSents, ...E.sentences.slice().sort((a,b)=>a.lvl-b.lvl).filter(s => !st(s.id) && !verbSents.includes(s))].slice(0, nSents);
  // 3. taken samenstellen
  const revTasks = due.map(id => reviewTask(E.items[id], items[id], settings));
  const half = Math.ceil(revTasks.length/2);
  const tasks = [];
  tasks.push(...revTasks.slice(0, half));
  newWords.forEach(w => tasks.push({ t:"intro", id:w.id }));
  const [dA, dB] = E.dirs(settings);
  shuffle(newWords).forEach(w => tasks.push({ t:"mc", id:w.id, dir:dA, fresh:1 }));
  newVerbs.forEach(v => { tasks.push({ t:"vintro", id:v.id }); tasks.push({ t:"vdrill", id:v.id, fresh:1 }); });
  newSents.forEach(s => tasks.push({ t:"sintro", id:s.id }));
  shuffle(newSents).forEach(s => tasks.push(E.sentTask(s, true)));
  const drill = E.sentenceDrill(data, today, tasks, settings.dailySentences ?? 8);
  tasks.push(...drill.slice(0, Math.ceil(drill.length/2)));
  tasks.push(...revTasks.slice(half));
  tasks.push(...drill.slice(Math.ceil(drill.length/2)));
  shuffle(newWords).forEach(w => tasks.push({ t: settings.mode==="mc" ? "mc" : "type", id:w.id, dir:dB, fresh:1 }));
  newVerbs.forEach(v => tasks.push({ t:"vdrill", id:v.id, fresh:1 }));
  // 4. rustige dag? vul aan met meer nieuwe woorden, werkwoordsvormen en zinnen (maximaal het dubbele van de instelling)
  const moreWords = orderWords.filter(w => !st(w.id) && !newWords.includes(w)).slice(0, nWords);
  const moreVerbs = E.verbItems.filter(v => !st(v.id) && !newVerbs.includes(v)).slice(0, Math.max(1,nVerbs));
  const moreSents = E.sentences.slice().sort((a,b)=>a.lvl-b.lvl).filter(s => !st(s.id) && !newSents.includes(s)).slice(0, nSents);
  const addedW = [], addedV = [], addedS = [];
  while(E.estimate(tasks) < target*0.75 && (moreWords.length || moreVerbs.length || moreSents.length)){
    const batchW = moreWords.splice(0, 4), v = moreVerbs.shift(), z = moreSents.shift();
    batchW.forEach(w => tasks.push({ t:"intro", id:w.id }));
    if(v){ tasks.push({ t:"vintro", id:v.id }); tasks.push({ t:"vdrill", id:v.id, fresh:1 }); addedV.push(v); }
    if(z){ tasks.push({ t:"sintro", id:z.id }); addedS.push(z); }
    shuffle(batchW).forEach(w => tasks.push({ t:"mc", id:w.id, dir:dA, fresh:1 }));
    if(z) tasks.push(E.sentTask(z, true));
    shuffle(batchW).forEach(w => tasks.push({ t: settings.mode==="mc" ? "mc" : "type", id:w.id, dir:dB, fresh:1 }));
    addedW.push(...batchW);
  }
  // 5. daarna aanvullen tot de streeftijd met herhalingen en zinnen
  tasks.push(...E.extraTasks(data, today, tasks, target - E.estimate(tasks)));
  newWords.push(...addedW); newVerbs.push(...addedV); newSents.push(...addedS);
  return { day: today, tasks, idx:0, elapsed:0, answered:0, correct:0, wrong:0, newIds: [...newWords, ...newVerbs, ...newSents].map(x=>x.id), retried:{}, done:false, extraAdded:0 };
};

// Dagelijks zinnenblok: vervoegen in context met werkwoordsvormen die al geleerd worden
E.sentenceDrill = (data, today, existing, n) => {
  if(n<=0) return [];
  const items = data.items, used = new Set(existing.map(t=>t.id));
  const vtKnown = s => !!items["vt:"+s.verb.inf+":"+s.tense];
  const cands = E.sentences.filter(s => s.isVerb && !used.has(s.id));
  const learnedVerb = cands.filter(vtKnown);
  // 1. zinnen bij geleerde werkwoordsvormen die niet vandaag al aan de beurt zijn: onbekende eerst, dan de minst recent geziene
  const fresh = shuffle(learnedVerb.filter(s => !items[s.id]));
  const seen = learnedVerb.filter(s => items[s.id] && items[s.id].d > today).sort((a,b) => (items[a.id].l||0) - (items[b.id].l||0) || Math.random()-0.5);
  // 2. aanvulling: onbekende presente-zinnen van laag niveau
  const fill = shuffle(cands.filter(s => !vtKnown(s) && !items[s.id] && s.tense==="presente").sort((a,b)=>a.lvl-b.lvl).slice(0, 30));
  const pickd = [...fresh, ...seen, ...fill].filter((s,i,a)=>a.indexOf(s)===i).slice(0, n);
  return pickd.map(s => ({ t:"vcloze", id:s.id, drill:1 }));
};

// Extra oefentaken: bijna-aan-de-beurt, zwakke woorden, daarna opfrissen van bekende woorden
E.extraTasks = (data, today, existing, seconds) => {
  const out = []; if(seconds<=0) return out;
  const items = data.items, used = new Set(existing.map(t=>t.id));
  const cand = Object.keys(items).filter(id => E.items[id] && items[id].b>=2 && !used.has(id));
  const soon = cand.filter(id => items[id].d <= today+3);
  const weak = cand.filter(id => items[id].w >= Math.max(2, items[id].c) );
  const known = cand.filter(id => items[id].b>=4);
  const order = [...shuffle(soon), ...shuffle(weak), ...shuffle(known)].filter((id,i,a)=>a.indexOf(id)===i);
  let est = 0;
  for(const id of order){ if(est>=seconds) break; const t = reviewTask(E.items[id], items[id], data.settings); t.extra=1; out.push(t); est += E.EST[t.t]||15; }
  if(est < seconds){
    const more = E.sentenceDrill(data, today, [...existing, ...out], Math.min(10, Math.ceil((seconds-est)/E.EST.vcloze)));
    more.forEach(t => { t.extra=1; out.push(t); });
  }
  return out;
};

// ---------- woorden van de dag ----------
// 30 nieuwe woorden per dag, in blokjes van 6: kennismaken → meerkeuze → typen; een woord is klaar na 2× goed op rij
// (3× als het eerder fout was) en minstens één keer getypt. Daarna een eindronde met alle woorden. Klaar → in de herhaling van morgen.
E.wordOrder = () => E.words.slice().sort((a,b) => a.lvl-b.lvl || S.categories.findIndex(c=>c[0]===a.cat) - S.categories.findIndex(c=>c[0]===b.cat));
// keuze: "random" = willekeurig uit alle nog niet geleerde woorden (standaard), "order" = op volgorde van niveau en categorie
E.buildDaily = (data, today) => {
  const n = data.settings.dailyWords ?? 30;
  const unseen = ((data.settings.dailyPick||"random")==="order" ? E.wordOrder() : shuffle(E.words)).filter(w => !data.items[w.id]);
  const ids = unseen.slice(0, n).map(w => w.id);
  return { day: today, ids, prog:{}, tasks:[], idx:0, chunk:0, chunkSize:6, elapsed:0, answered:0, correct:0, wrong:0, done: ids.length===0, final:false };
};
E.dailyNextChunk = (d, settings) => {
  const start = d.chunk * d.chunkSize, ids = d.ids.slice(start, start + d.chunkSize);
  if(!ids.length) return false;
  d.chunk++;
  ids.forEach(id => { d.prog[id] = d.prog[id] || { c:0, w:0, s:0, typed:0, done:0 }; });
  const [dA, dB] = E.dirs(settings);
  const typeT = settings.mode==="mc" ? { t:"mc", dir:dB } : { t:"type", dir:dB };
  d.tasks.push(...ids.map(id => ({ t:"intro", id, daily:1 })));
  d.tasks.push(...shuffle(ids).map(id => ({ t:"mc", id, dir:dA, daily:1 })));
  d.tasks.push(...shuffle(ids).map(id => Object.assign({ id, daily:1 }, typeT)));
  return true;
};
E.dailyTaskFor = (p, settings) => {
  const [dA, dB] = E.dirs(settings), alt = ((p.c+p.w) % 2===0) ? dB : dA;   // afwisselend beide richtingen
  if(settings.mode==="type") return { t:"type", dir:alt };
  if(p.s===0) return { t:"mc", dir:dA };
  if(settings.mode==="mc") return { t:"mc", dir:alt };
  return { t:"type", dir:alt };
};
E.dailyGrade = (data, d, task, result, today) => {
  const id = task.id, p = d.prog[id] = d.prog[id] || { c:0, w:0, s:0, typed:0, done:0 };
  const ok = result!=="wrong";
  d.answered++;
  if(task.final){
    const st = data.items[id];
    if(st){ st.l = today; if(ok){ st.c++; st.s++; } else { st.w++; st.s = 0; st.b = 1; st.d = today+1; } }
    if(ok){ d.correct++; p.finalOk = 1; }
    else { d.wrong++; p.finalWrong = (p.finalWrong||0)+1; if(!task.retry) d.tasks.splice(Math.min(d.tasks.length, d.idx+3), 0, Object.assign({}, task, { retry:1 })); }
    return { done:false };
  }
  if(ok){ p.c++; p.s++; d.correct++; if(task.t==="type") p.typed++; } else { p.w++; p.s = 0; d.wrong++; }
  const need = p.w>0 ? 3 : 2, typedOk = data.settings.mode==="mc" || p.typed>0;
  if(p.s >= need && typedOk){
    p.done = 1;
    const b = p.w===0 ? 3 : p.w<=2 ? 2 : 1;
    data.items[id] = { b, d: today + (b>=3 ? LADDER[b] : 1), c:p.c, w:p.w, s:p.s, i:today, l:today };
    return { done:true };
  }
  const gap = ok ? 4 : 2, pos = Math.min(d.tasks.length, d.idx + 1 + gap + Math.floor(Math.random()*2));
  d.tasks.splice(pos, 0, Object.assign({ id, daily:1 }, E.dailyTaskFor(p, data.settings)));
  return { done:false };
};
E.dailyAdvance = (d, settings) => {
  if(d.idx < d.tasks.length) return true;
  const pending = d.ids.filter(id => d.prog[id] && !d.prog[id].done);
  if(pending.length){ pending.forEach(id => d.tasks.push(Object.assign({ id, daily:1 }, E.dailyTaskFor(d.prog[id], settings)))); return true; }
  if(E.dailyNextChunk(d, settings)) return true;
  if(!d.final && d.ids.length){ const [dA, dB] = E.dirs(settings); d.final = true; d.tasks.push(...shuffle(d.ids).map((id,i) => Object.assign({ id, daily:1, final:1, dir: i%2===0 ? dB : dA }, settings.mode==="mc" ? { t:"mc" } : { t:"type" }))); return true; }
  d.done = true; return false;
};
E.dailyKnown = (data, d, id, today) => {
  const p = d.prog[id] = d.prog[id] || { c:0, w:0, s:0, typed:0, done:0 }; p.done = 1; p.known = 1;
  data.items[id] = E.markKnown(data.items[id], today);
  for(let i=d.tasks.length-1; i>d.idx; i--) if(d.tasks[i].id===id) d.tasks.splice(i,1);
};
E.dailyDone = d => d.ids.filter(id => d.prog[id] && d.prog[id].done).length;

// ---------- voortgang & statistiek ----------
E.stats = data => {
  const c = { nieuw:0, leren:0, bekend:0, beheerst:0 }, byKind = { word:{...c}, vt:{...c}, sent:{...c} };
  Object.values(E.items).forEach(it => { const s = E.status(data.items[it.id]); c[s]++; byKind[it.kind][s]++; });
  const dueToday = Object.keys(data.items).filter(id => E.items[id] && data.items[id].b>=1 && data.items[id].d <= E.dayNum()).length;
  return { total:c, byKind, dueToday };
};
E.streak = (days, today) => {
  let n = 0, d = today;
  if(!days[E.dayKey(d)]) d--; // vandaag nog niet geoefend telt niet tegen
  while(days[E.dayKey(d)] && days[E.dayKey(d)].min>=1){ n++; d--; }
  return n;
};

// ---------- opslag (lokaal + gesynchroniseerd) ----------
const LS_KEY = "pocoapoco.v1";
const DEFAULTS = { settings:{ minutes:30, newWords:0, newVerbs:2, newSentences:5, dailySentences:8, dailyWords:30, dailyPick:"random", mode:"mix", speech:"button", direction:"both" }, items:{}, days:{}, session:null, daily:null, updatedAt:0 };
E.load = () => { try { const raw = localStorage.getItem(LS_KEY); if(raw){ const d = JSON.parse(raw); const out = Object.assign({}, DEFAULTS, d, { settings: Object.assign({}, DEFAULTS.settings, d.settings||{}) }); E.migrate(out, d.settings||{}); return out; } } catch(e){} return JSON.parse(JSON.stringify(DEFAULTS)); };
// oudere opslag (zonder dagelijks zinnenblok): zinnen standaard ruimer aanzetten; `stored` zijn de ruwe opgeslagen instellingen
E.migrate = (d, stored) => {
  if(!d.settings) d.settings = {};
  if(!stored || stored.dailySentences===undefined){ d.settings.dailySentences = d.settings.dailySentences ?? 8; if((d.settings.newSentences||0) < 5) d.settings.newSentences = 5; }
  // nieuwe woorden leer je via "Woorden van de dag"; de quiz herhaalt
  if(!stored || stored.dailyWords===undefined){ d.settings.dailyWords = 30; d.settings.newWords = 0; }
  // uitspraak klinkt alleen op verzoek: oudere opslag stond standaard op automatisch
  if(stored && stored.speechManual===undefined && d.settings.speech==="auto") d.settings.speech = "button";
  d.settings.speechManual = 1;
  return d;
};
E.saveLocal = data => { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch(e){} };
E.merge = (a, b) => {
  // a = lokaal, b = extern; per item de recentste status; dagen samenvoegen; sessie van dezelfde dag: de verste
  const out = JSON.parse(JSON.stringify(a));
  Object.keys(b.items||{}).forEach(id => { const x = out.items[id], y = b.items[id]; if(!x || (y.l||0) > (x.l||0) || ((y.l||0)===(x.l||0) && (y.b||0) > (x.b||0))) out.items[id] = y; });
  Object.keys(b.days||{}).forEach(k => { const x = out.days[k], y = b.days[k]; out.days[k] = !x ? y : { min: Math.max(x.min||0,y.min||0), sec: Math.max(x.sec||0,y.sec||0), n: Math.max(x.n||0,y.n||0), ok: Math.max(x.ok||0,y.ok||0) }; });
  if(b.session && (!out.session || b.session.day > out.session.day || (b.session.day===out.session.day && (b.session.idx||0) > (out.session.idx||0)))) out.session = b.session;
  if(b.daily && (!out.daily || b.daily.day > out.daily.day || (b.daily.day===out.daily.day && (b.daily.answered||0) > (out.daily.answered||0)))) out.daily = b.daily;
  if((b.updatedAt||0) > (out.updatedAt||0)) out.settings = Object.assign({}, out.settings, b.settings||{});
  out.updatedAt = Math.max(a.updatedAt||0, b.updatedAt||0);
  return out;
};
})();
