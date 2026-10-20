// Poco a Poco — gebruikersinterface
(function(){
"use strict";
const E = window.ENGINE;
const $ = sel => document.querySelector(sel);
const view = $("#view");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let data = E.load();
let today = E.dayNum();
let cur = "home";
let practice = null;
let pendingRemote = null;
const ui = { wordQ:"", wordFilter:"all", wordCat:"all", wordOpen:null, wordLimit:80, verbQ:"", verbOpen:null, sentQ:"", sentTense:"all", sentFilter:"all", sentOpen:null, sentLimit:60, quick:null, showExport:false, showImport:false, confirmReset:false };

// ---------- opslag & synchronisatie ----------
let remoteRef=null, remoteTimer=null, writing=false, dirty=false;
function setSync(state, title){
  const d = $("#syncDot"); d.className = "sync" + (state==="synced" ? " on" : state==="busy" ? " busy" : "");
  d.title = title || (state==="synced" ? "Voortgang gesynchroniseerd tussen je apparaten" : state==="busy" ? "Bezig met opslaan…" : "Voortgang alleen op dit apparaat opgeslagen");
}
function save(){ data.updatedAt = Date.now(); E.saveLocal(data); scheduleRemote(); }
function scheduleRemote(){ if(!remoteRef) return; clearTimeout(remoteTimer); remoteTimer = setTimeout(pushRemote, 1500); }
async function pushRemote(){
  if(!remoteRef) return;
  if(writing){ dirty = true; return; }
  writing = true; setSync("busy");
  try { const payload = JSON.parse(JSON.stringify(data)); trimForRemote(payload); await remoteRef.set(payload); setSync("synced"); }
  catch(e){ console.warn("sync", e); setSync("local", "Online opslaan mislukt: " + ((e && e.message) || e)); }
  writing = false; if(dirty){ dirty = false; scheduleRemote(); }
}
function trimForRemote(p){
  let size = JSON.stringify(p).length; if(size < 240000) return;
  const keys = Object.keys(p.days).sort();
  while(size > 240000 && keys.length > 60){ delete p.days[keys.shift()]; size = JSON.stringify(p).length; }
}
function absorbRemote(r){ data = E.merge(data, r); E.migrate(data, (r && r.settings) || {}); E.saveLocal(data); }
// Binnen de Wereldtrainer: synchroniseren via de eigen opslag (/api/progress?key=poco).
const API_SYNC = "/api/progress?key=poco";
function takeRemote(r){
  if(!r || (r.updatedAt||0) <= (data.updatedAt||0)) return;
  if(cur==="practice") pendingRemote = r; else { absorbRemote(r); render(); }
}
async function initApiSync(){
  try {
    const res = await fetch(API_SYNC, { cache:"no-store" });
    if(!res.ok) return;
    const j = await res.json();
    if(!j || !j.configured) return;
    remoteRef = { set: async p => {
      const w = await fetch(API_SYNC, { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify(p) });
      if(!w.ok) throw new Error("HTTP " + w.status);
    } };
    if(j.data){ if(cur==="practice") pendingRemote = j.data; else { absorbRemote(j.data); render(); } }
    setSync("synced"); scheduleRemote();
    document.addEventListener("visibilitychange", async () => {
      if(document.visibilityState !== "visible") return;
      try { const r = await fetch(API_SYNC, { cache:"no-store" }); const k = await r.json(); if(k && k.data) takeRemote(k.data); } catch(e){}
    });
  } catch(e){ console.warn("initApiSync", e); }
}
async function initSync(){
  try {
    if(!window.claude || typeof window.claude.use !== "function") return initApiSync();
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if(!db || !user) return;
    const uid = await user.id(); if(!uid) return;
    remoteRef = db.doc("data/users/" + uid + "/progress");
    const snap = await remoteRef.get();
    if(snap.exists){ if(cur==="practice") pendingRemote = snap.data(); else { absorbRemote(snap.data()); render(); } }
    setSync("synced"); scheduleRemote();
    remoteRef.onSnapshot(s => {
      if(!s.exists || s.metadata.hasPendingWrites) return;
      const r = s.data(); if((r.updatedAt||0) <= (data.updatedAt||0)) return;
      if(cur==="practice") pendingRemote = r; else { absorbRemote(r); render(); }
    }, e => console.warn("snapshot", e));
  } catch(e){ console.warn("initSync", e); }
}

// ---------- hulpfuncties ----------
const DAYS_ES = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DAY_LETTERS = ["D","L","M","X","J","V","S"];
function spanishDate(d = new Date()){ return `${DAYS_ES[d.getDay()]}, ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`; }
function greeting(){ const h = new Date().getHours(); return h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches"; }
const fmtMin = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
const shortNl = w => w.nlParts.slice(0,2).join(" / ");
const todayKey = () => E.dayKey(today);
function recordDay(){ const k = todayKey(); const d = data.days[k] || { min:0, sec:0, n:0, ok:0 }; data.days[k] = d; return d; }
function statusOf(id){ return E.status(data.items[id]); }
function dueText(st){ if(!st || st.b===0) return "nog niet geleerd"; const diff = st.d - today; return diff <= 0 ? "vandaag aan de beurt" : diff===1 ? "morgen weer" : `over ${diff} dagen weer`; }
function wordCore(w){ return E.stripAcc(w.es).replace(/^(el\/la|el|la|los|las|un|una) /,"").replace(/^¿|\?$/g,"").trim(); }
const exampleCache = {};
function exampleFor(w){
  if(w.id in exampleCache) return exampleCache[w.id];
  const core = wordCore(w); let found = null;
  if(core.length >= 3){ const re = new RegExp("(^|[^a-zñ])" + core.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + "($|[^a-zñ])"); found = E.sentences.find(s => re.test(E.stripAcc(s.es))) || null; }
  exampleCache[w.id] = found; return found;
}
function highlight(sentence, w){
  const core = wordCore(w); const words = sentence.split(" ");
  return words.map(x => E.stripAcc(x).replace(/[^a-zñ]/g,"")===core.replace(/[^a-zñ ]/g,"") ? `<b>${esc(x)}</b>` : esc(x)).join(" ");
}
function clozeHtml(s, inner){ const i = s.raw.indexOf("["), j = s.raw.indexOf("]"); if(i<0||j<0) return esc(s.es); return esc(s.raw.slice(0,i)) + inner + esc(s.raw.slice(j+1)); }
function insertAtCursor(input, text){
  const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? s;
  input.value = input.value.slice(0,s) + text + input.value.slice(e); input.setSelectionRange(s+text.length, s+text.length); input.focus();
}
const ACCENTS = ["á","é","í","ó","ú","ñ","ü","¿","¡"];
const accentBar = () => `<div class="accents" aria-label="Speciale tekens">${ACCENTS.map(a => `<button type="button" data-action="accent" data-nofocus data-ch="${a}" tabindex="-1">${a}</button>`).join("")}</div>`;
// uitspraak via de spraaksynthese van het apparaat (Spaanse stem uit Spanje als die er is)
const SPK_ICON = `<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
const speechOK = () => "speechSynthesis" in window && typeof SpeechSynthesisUtterance!=="undefined";
const canSpeak = () => speechOK() && data.settings.speech!=="off";
const spk = (text, cls="") => canSpeak() && text ? `<button type="button" class="spk ${cls}" data-action="speak" data-nofocus data-text="${esc(text)}" aria-label="Spreek uit">${SPK_ICON}</button>` : "";
function pickVoice(){ try { const vs = speechSynthesis.getVoices(); return vs.find(v => /^es[-_]ES/i.test(v.lang) && /Mónica|Monica|Marisol|Jorge|Google español$/i.test(v.name)) || vs.find(v => /^es[-_]ES/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null; } catch(e){ return null; } }
function speak(text){
  if(!canSpeak() || !text) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(text)); u.lang = "es-ES"; const v = pickVoice(); if(v) u.voice = v; u.rate = 0.88; speechSynthesis.speak(u); } catch(e){}
}
function autoSpeak(text, key){ if(data.settings.speech!=="auto" || !text) return; if(practice && practice.spokenKey===key) return; if(practice) practice.spokenKey = key; speak(text); }
if(speechOK()){ try { speechSynthesis.getVoices(); speechSynthesis.addEventListener("voiceschanged", () => speechSynthesis.getVoices()); } catch(e){} }
const flame = `<svg viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 1-5 2 1 2 3 2 3s2-4 2-9z"/></svg>`;

// ---------- weergave ----------
function render(){
  document.body.classList.toggle("practicing", cur==="practice");
  document.querySelectorAll("#tabs button").forEach(b => b.classList.toggle("active", b.dataset.view===cur));
  $("#streakTop").innerHTML = `${flame}<span class="num">${E.streak(data.days, today)}</span><span class="mini">racha</span>`;
  ({ home:renderHome, practice:renderPractice, words:renderWords, verbs:renderVerbs, sentences:renderSentences, progress:renderProgress, settings:renderSettings }[cur] || renderHome)();
}

// ----- Vandaag -----
function planCounts(tasks){
  const c = { rev:0, words:0, verbs:0, sents:0, drill:0 };
  tasks.forEach(t => { if(t.t==="intro") c.words++; else if(t.t==="vintro") c.verbs++; else if(t.t==="sintro") c.sents++; else if(t.drill) c.drill++; else if(!t.fresh && !t.extra) c.rev++; });
  return c;
}
function renderHome(){
  if(E.ensureDrill(data, today)) save();
  const s = data.session && data.session.day===today ? data.session : null;
  const stats = E.stats(data);
  const dayRec = data.days[todayKey()];
  let hero;
  if(s && s.done){
    hero = `<div class="eyebrow">Dagelijkse quiz</div><h2>Quiz klaar voor vandaag</h2>
      <p class="ink2">Je hebt ${Math.round(s.elapsed/60)} minuten geoefend, ${s.answered} vragen beantwoord en ${s.answered ? Math.round(100*s.correct/s.answered) : 0}% goed. Morgen staan je herhalingen weer klaar.</p>
      <div class="row"><button class="btn ghost" data-action="extraFromHome">Extra oefenen</button></div>`;
  } else if(s){
    const pc = planCounts(s.tasks);
    hero = `<div class="eyebrow">Dagelijkse quiz</div><h2>Je bent bezig met de quiz</h2>
      <p class="ink2">${s.idx} van ${s.tasks.length} oefeningen gedaan · ${fmtMin(s.elapsed)} van ${data.settings.minutes} min</p>
      <div class="bar"><i style="width:${Math.round(100*s.idx/Math.max(1,s.tasks.length))}%"></i></div>
      <div class="mini">${pc.rev} herhalingen · ${pc.words} nieuwe woorden · ${pc.verbs} werkwoordsvormen · ${pc.sents} nieuwe zinnen · ${pc.drill} zinnen vervoegen</div>
      <button class="btn big" data-action="start">Ga verder</button>`;
  } else {
    const plan = E.buildSession(data, today), pc = planCounts(plan.tasks), est = Math.round(E.estimate(plan.tasks)/60);
    const firstDay = Object.keys(data.items).length===0;
    hero = `<div class="eyebrow">Dagelijkse quiz</div><h2>${firstDay ? "Je eerste quiz" : "Vandaag in de quiz"}</h2>
      <div class="stack" style="gap:6px">
        <div class="row between"><span>Herhalingen</span><b class="num">${pc.rev}</b></div>
        <div class="row between"><span>Nieuwe woorden</span><b class="num">${pc.words}</b></div>
        <div class="row between"><span>Werkwoordsvormen</span><b class="num">${pc.verbs}</b></div>
        <div class="row between"><span>Nieuwe zinnen</span><b class="num">${pc.sents}</b></div>
        <div class="row between"><span>Vervoegen in zinnen</span><b class="num">${pc.drill}</b></div>
      </div>
      <p class="mini">Ongeveer ${est} minuten. Klaar je oefeningen eerder, dan vult de app aan tot je ${data.settings.minutes} minuten.</p>
      <button class="btn big" data-action="start">Begin de quiz</button>
      ${firstDay ? `<p class="hint">Ken je al veel basiswoorden? Doe eerst de <button class="linkish" data-action="goQuick">snelle check</button>, dan slaat de app die over.</p>` : ""}`;
  }
  // kaart: woorden van de dag
  const nDaily = data.settings.dailyWords ?? 30, dw = data.daily && data.daily.day===today ? data.daily : null;
  let dailyCard = "";
  if(nDaily > 0){
    if(dw && dw.done){
      const fast = dw.ids.filter(id => dw.prog[id] && dw.prog[id].w===0 && !dw.prog[id].known).length;
      dailyCard = `<div class="eyebrow">Palabras de hoy</div><h2>${dw.ids.length} woorden geleerd</h2><p class="ink2">${fast} had je meteen goed. Morgen komen ze terug in de quiz.</p><div class="row"><button class="btn ghost" data-action="startDailyWords">Bekijk de lijst</button></div>`;
    } else if(dw){
      const dn = E.dailyDone(dw);
      dailyCard = `<div class="eyebrow">Palabras de hoy</div><h2>Woorden van vandaag</h2><p class="ink2">${dn} van ${dw.ids.length} woorden geleerd · ${fmtMin(dw.elapsed)}</p><div class="bar gold"><i style="width:${Math.round(100*dn/Math.max(1,dw.ids.length))}%"></i></div><button class="btn big" data-action="startDailyWords">Ga verder</button>`;
    } else {
      if(!data.daily || data.daily.day!==today){ data.daily = E.buildDaily(data, today); save(); }
      const preview = data.daily.ids.map(id => E.item(id)).filter(Boolean);
      const cats = preview.map(w => E.catName(w.cat)).filter((c,i,arr) => arr.indexOf(c)===i);
      const catTxt = cats.length > 4 ? cats.slice(0,4).join(", ") + ` en ${cats.length-4} andere categorieën` : cats.join(", ");
      const random = (data.settings.dailyPick||"random")==="random";
      dailyCard = preview.length ? `<div class="eyebrow">Palabras de hoy</div><h2>${preview.length} nieuwe woorden</h2><p class="ink2">${random ? "Willekeurig gekozen uit" : "Uit"} ${catTxt}. Je leert ze in blokjes van zes en herhaalt elk woord tot je het twee keer op rij goed hebt, daarna volgt een eindronde. Ongeveer ${preview.length} minuten.</p><div class="chips">${preview.slice(0,8).map(w => `<span class="chip" style="font-weight:500">${esc(w.es)}</span>`).join("")}${preview.length>8 ? `<span class="chip" style="font-weight:500">+${preview.length-8}</span>` : ""}</div><button class="btn big" data-action="startDailyWords">Begin met de woorden</button>${random ? `<div class="row" style="justify-content:center"><button class="linkish" data-action="reshuffleDaily">Andere woorden kiezen</button></div>` : ""}` : `<div class="eyebrow">Palabras de hoy</div><h2>Alle woorden gezien</h2><p class="ink2">Er zijn geen nieuwe woorden meer. De quiz blijft alles herhalen.</p>`;
    }
  }
  const w = stats.byKind.word, v = stats.byKind.vt, z = stats.byKind.sent;
  const hard = Object.keys(data.items).filter(id => E.item(id) && data.items[id].w >= 2).sort((a,b) => (data.items[b].w - data.items[b].c) - (data.items[a].w - data.items[a].c)).slice(0,5);
  view.innerHTML = `
    <div><div class="eyebrow">${esc(spanishDate())}</div><h1>${greeting()}</h1></div>
    <section class="card hero stack">${hero}</section>
    ${dailyCard ? `<section class="card stack" style="border-color:var(--saffron-soft);background:linear-gradient(180deg,var(--saffron-soft),var(--surface) 70%)">${dailyCard}</section>` : ""}
    <section class="grid4">
      <div class="tile"><b class="num">${w.bekend + w.beheerst}</b><span>woorden bekend</span></div>
      <div class="tile"><b class="num">${w.leren}</b><span>woorden aan het leren</span></div>
      <div class="tile"><b class="num">${v.bekend + v.beheerst}</b><span>werkwoordsvormen bekend</span></div>
      <div class="tile"><b class="num">${z.bekend + z.beheerst}</b><span>zinnen bekend</span></div>
    </section>
    <section class="card stack">
      <div class="row between"><h3>Laatste 14 dagen</h3><span class="mini num">vandaag ${dayRec ? Math.floor((dayRec.sec||dayRec.min*60)/60) : 0} min</span></div>
      ${chart(14)}
    </section>
    <section class="card stack">
      <h3>Lastige woorden</h3>
      ${hard.length ? `<div class="list">${hard.map(id => itemRow(id)).join("")}</div>` : `<p class="hint">Zodra je woorden vaker fout hebt, komen ze hier te staan en herhaalt de app ze extra.</p>`}
    </section>`;
}
function itemRow(id){
  const it = E.item(id), st = data.items[id];
  const label = it.kind==="word" ? it.es : it.kind==="vt" ? `${it.verb.inf} · ${E.tense(it.tense).name}` : it.es;
  const sub = it.kind==="word" ? it.nl : it.kind==="vt" ? it.verb.nl : it.nl;
  return `<div class="item"><div class="grow"><div class="es">${esc(label)}</div><div class="nl">${esc(sub)}</div></div><span class="mini num">${st ? `${st.c} goed · ${st.w} fout` : ""}</span><span class="pill ${E.status(st)}">${E.statusName[E.status(st)]}</span></div>`;
}
function chart(nDays){
  const target = data.settings.minutes;
  const vals = []; for(let i=nDays-1;i>=0;i--){ const k = E.dayKey(today-i), d = data.days[k]; vals.push({ k, day: today-i, min: d ? Math.floor((d.sec ?? d.min*60)/60) : 0 }); }
  const max = Math.max(target*1.25, ...vals.map(v=>v.min), 10);
  const W = 560, H = 150, padL = 34, padR = 8, padT = 12, padB = 24, ih = H-padT-padB, iw = W-padL-padR, bw = iw/nDays;
  const y = m => padT + ih - (m/max)*ih;
  const bars = vals.map((v,i) => {
    const x = padL + i*bw + bw*0.22, w = bw*0.56, top = y(v.min), h = Math.max(0, padT+ih-top), r = Math.min(4, h/2);
    const path = h<=0 ? "" : `M${x},${padT+ih} v${-(h-r)} q0,${-r} ${r},${-r} h${w-2*r} q${r},0 ${r},${r} v${h-r} z`;
    const label = new Date(v.day*86400000).getUTCDay();
    return `<g><title>${v.k}: ${v.min} min</title>${path ? `<path class="${v.min>=target?"hit":""} ${v.day===today?"today":""}" d="${path}"/>` : ""}<text x="${x+w/2}" y="${H-7}" text-anchor="middle">${DAY_LETTERS[label]}</text>${v.day===today && v.min>0 ? `<text x="${x+w/2}" y="${top-4}" text-anchor="middle">${v.min}</text>` : ""}</g>`;
  }).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Minuten geoefend per dag, laatste ${nDays} dagen">
    <line class="grid" x1="${padL}" x2="${W-padR}" y1="${padT+ih}" y2="${padT+ih}"/>
    <line class="target" x1="${padL}" x2="${W-padR}" y1="${y(target)}" y2="${y(target)}"/>
    <text x="${padL-6}" y="${y(target)+4}" text-anchor="end">${target}</text>
    <text x="${padL-6}" y="${padT+ih+4}" text-anchor="end">0</text>
    <style>.chart path{fill:var(--accent)} .chart path.hit{fill:var(--saffron)} .chart path.today{stroke:var(--ink);stroke-width:1}</style>
    ${bars}</svg>`;
}

// ----- Oefenen -----
let timer = null;
function startTimer(){ stopTimer(); timer = setInterval(tick, 1000); }
function stopTimer(){ clearInterval(timer); timer = null; }
function tick(){
  if(document.visibilityState!=="visible" || cur!=="practice" || !practice) return;
  const s = sess(); if(!s || s.done || practice.phase==="summary") return;
  s.elapsed++; const d = recordDay(); d.sec = (d.sec||0)+1; d.min = Math.floor(d.sec/60);
  const el = $("#ptime"); if(el) el.textContent = fmtMin(s.elapsed);
  if(s.elapsed % 20 === 0) save();
  if(!practice.adhoc && practice.kind!=="daily" && s.elapsed >= data.settings.minutes*60 && !s.goalShown){ s.goalShown = true; save(); const typing = view.querySelector("input:not([disabled])"); if(!typing || !typing.value) renderPractice(); }
}
function sess(){ return practice && (practice.adhoc || (practice.kind==="daily" ? data.daily : data.session)); }
function startDailyWords(){
  today = E.dayNum();
  if(!data.daily || data.daily.day!==today){ data.daily = E.buildDaily(data, today); if(!data.daily.done) E.dailyNextChunk(data.daily, data.settings); save(); }
  else if(!data.daily.done && data.daily.idx >= data.daily.tasks.length){ if(!E.dailyAdvance(data.daily, data.settings)) data.daily.done = true; save(); }
  practice = { kind:"daily", adhoc:null, phase: data.daily.done ? "summary" : "ask" };
  cur = "practice"; render(); startTimer();
}
function startDaily(){
  today = E.dayNum();
  if(!data.session || data.session.day!==today){ data.session = E.buildSession(data, today); save(); }
  else if(E.ensureDrill(data, today)) save();
  practice = { adhoc:null, phase: data.session.done ? "summary" : "ask" };
  cur = "practice"; render(); startTimer();
}
function startAdhoc(tasks, title){
  practice = { adhoc:{ day:today, tasks, idx:0, elapsed:0, answered:0, correct:0, wrong:0, newIds:[], retried:{}, done:false, title }, phase:"ask" };
  cur = "practice"; render(); startTimer();
}
function quitPractice(){
  stopTimer(); practice = null; save();
  if(pendingRemote){ absorbRemote(pendingRemote); pendingRemote = null; }
}
function resetTaskState(){ Object.assign(practice, { phase:"ask", result:null, options:null, persons:null, pool:null, built:null, chosen:null, given:null, drill:null }); }
function next(){
  const s = sess(); s.idx++; resetTaskState();
  if(s.idx >= s.tasks.length){
    if(practice.kind==="daily"){ if(!E.dailyAdvance(s, data.settings)){ s.done = true; practice.phase = "summary"; } }
    else { s.done = true; practice.phase = "summary"; }
  }
  save(); renderPractice();
}
function grade(result){
  const s = sess(), t = s.tasks[s.idx], id = t.id;
  practice.phase = "feedback"; practice.result = result; practice.graduated = false;
  const d = recordDay(); d.n++;
  if(practice.kind==="daily"){
    const r = E.dailyGrade(data, s, t, result, today); practice.graduated = r.done;
    if(result!=="wrong") d.ok++;
    save(); return renderPractice();
  }
  data.items[id] = E.applyResult(data.items[id], result, today);
  s.answered++;
  if(result==="wrong"){ s.wrong++; if(!s.retried[id]){ s.retried[id] = 1; const copy = Object.assign({}, t); delete copy.fresh; copy.retry = 1; s.tasks.splice(Math.min(s.tasks.length, s.idx+5), 0, copy); } }
  else { s.correct++; d.ok++; }
  save(); renderPractice();
}
function skipFreshTasks(s, id){ for(let i=s.tasks.length-1;i>s.idx;i--){ if(s.tasks[i].id===id && s.tasks[i].fresh) s.tasks.splice(i,1); } }

function renderPractice(){
  const s = sess(); if(!s){ cur = "home"; return render(); }
  if(practice.phase==="summary" || s.idx >= s.tasks.length){ s.done = true; practice.phase = "summary"; return renderSummary(s); }
  const t = s.tasks[s.idx], it = E.item(t.id);
  if(!it){ s.idx++; return renderPractice(); }
  const isDaily = practice.kind==="daily";
  const doneN = isDaily ? E.dailyDone(s) : 0;
  const pct = isDaily ? (s.ids.length ? doneN/s.ids.length : 0) : s.idx/s.tasks.length;
  const counter = isDaily ? `${doneN}/${s.ids.length} geleerd` : `${s.idx+1}/${s.tasks.length}`;
  const head = `<div class="practice-top"><button class="btn sm ghost" data-action="quit">Stop</button><div class="bar ${isDaily ? "gold" : ""}"><i style="width:${Math.round(100*pct)}%"></i></div><span class="mini num" id="ptime">${fmtMin(s.elapsed)}</span><span class="mini num">${counter}</span></div>`;
  const banner = (s.goalShown && !s.goalDismissed && !practice.adhoc && !isDaily) ? `<div class="banner"><span>¡Muy bien! Je ${data.settings.minutes} minuten zijn vol. Nog ${s.tasks.length - s.idx} oefeningen over.</span><span class="row" style="margin-left:auto;gap:8px"><button class="btn sm ghost" data-action="dismissGoal">Doorgaan</button><button class="btn sm" data-action="finishNow">Afronden</button></span></div>` : "";
  const body = ({ intro:viewIntro, mc:viewMC, type:viewType, vintro:viewVIntro, vdrill:viewVDrill, sintro:viewSIntro, scramble:viewScramble, cloze:viewCloze, vcloze:viewVCloze, smc:viewSMC }[t.t])(it, t);
  view.innerHTML = head + banner + `<section class="pcard fade" data-task="${t.t}">${body}</section>`;
  focusPractice(t);
  // uitspraak: bij kennismaking en zodra het Spaans zichtbaar is (als vraag, of als antwoord in de feedback)
  let say = null;
  if(t.t==="intro" || t.t==="sintro") say = it.es; else if(t.t==="vintro") say = it.verb.inf;
  else if(practice.phase==="ask"){ if(((t.t==="mc" || t.t==="type") && t.dir==="es") || t.t==="smc") say = it.es; }
  else if(it.kind==="word" || it.kind==="sent") say = it.es;
  if(say) autoSpeak(say, s.idx + ":" + (practice.adhoc ? "a" : practice.kind||"q"));
}
const TYPING = { type:1, cloze:1, vcloze:1, vdrill:1 };
function focusPractice(t){
  if(TYPING[t.t]){
    const inputs = Array.from(view.querySelectorAll(".pcard input"));
    const target = practice.phase==="ask" ? (inputs.find(i => !i.value) || inputs[0]) : inputs[0];
    if(target){ try { target.focus({ preventScroll: practice.phase==="feedback" }); } catch(e){ target.focus(); } if(practice.phase==="feedback"){ try { target.setSelectionRange(target.value.length, target.value.length); } catch(e){} } }
  } else if(practice.phase==="feedback"){ const b = view.querySelector("[data-action=next]"); if(b) b.focus(); }
}
function feedbackBlock(correct, extraHtml=""){
  const r = practice.result;
  const title = r==="ok" ? "¡Correcto!" : r==="almost" ? "Bijna goed" : "Helaas";
  const note = r==="almost" ? (practice.note || "Let op de accenten of het lidwoord.") : r==="wrong" ? "Het juiste antwoord:" : "";
  const grad = practice.kind==="daily" && practice.graduated ? `<span>✓ Dit woord zit erin voor vandaag. Morgen komt het terug in de quiz.</span>` : "";
  return `<div class="feedback ${r}"><b>${title}</b>${note ? `<span>${esc(note)}</span>` : ""}${(r!=="ok" || extraHtml) && correct ? `<span class="corr">${correct}</span>` : ""}${extraHtml}${grad}</div>
    <div class="actions"><button class="btn big" data-action="next">Volgende <span class="kbd">Enter</span></button></div>`;
}
function viewIntro(it){
  const gender = /^el /.test(it.es) ? "mannelijk (el)" : /^la /.test(it.es) ? "vrouwelijk (la)" : /^los /.test(it.es) ? "mannelijk meervoud" : /^las /.test(it.es) ? "vrouwelijk meervoud" : /^el\/la /.test(it.es) ? "mannelijk of vrouwelijk" : null;
  const typeName = { n:"zelfstandig naamwoord", a:"bijvoeglijk naamwoord", o:"woord of uitdrukking" }[it.type];
  const ex = exampleFor(it);
  const s0 = sess(), t0 = s0 && s0.tasks[s0.idx];
  return `<div class="eyebrow">${t0 && t0.daily ? "Woord van de dag" : "Nieuw woord"} · ${esc(E.catName(it.cat))}</div>
    <div class="word">${esc(it.es)} ${spk(it.es)}</div>
    <div class="prompt">${esc(it.nl)}</div>
    <div class="mini">${typeName}${gender ? " · " + gender : ""}</div>
    ${ex ? `<div class="sub"><span class="eyebrow" style="display:block;margin-bottom:4px">Voorbeeld</span>${highlight(ex.es, it)}<br><span class="mini">${esc(ex.nl)}</span></div>` : ""}
    <div class="actions"><button class="btn outline" data-action="knowAlready">Ken ik al</button><button class="btn" data-action="introNext">Volgende</button></div>`;
}
// Was het antwoord goed, dan blijft die knop aanklikbaar: nog een tik brengt je meteen naar de volgende vraag.
function choices(it, optText){
  const fb = practice.phase==="feedback";
  return `<div class="choices">${practice.options.map((o,i) => {
    const right = o.id===it.id;
    const cls = fb ? (right ? "right" : (practice.chosen===i ? "wrong" : "")) : "";
    const again = fb && right && practice.result==="ok";
    return `<button class="choice ${cls}${again ? " again" : ""}" data-action="${again ? "next" : "choose"}" data-i="${i}" ${fb && !again ? "disabled" : ""}${again ? ` title="Volgende vraag"` : ""}><span class="k">${i+1}</span><span>${esc(optText(o))}</span>${again ? `<span class="go" aria-hidden="true">›</span>` : ""}</button>`;
  }).join("")}</div>`;
}
function viewMC(it, t){
  if(!practice.options) practice.options = E.shuffle([it, ...E.distractors(it, 3)]);
  const es = t.dir==="es";
  const optText = o => es ? shortNl(o) : o.es;
  const fb = practice.phase==="feedback";
  return `<div class="eyebrow">${es ? "Wat betekent dit?" : "Hoe zeg je dit in het Spaans?"}</div>
    <div class="${es ? "word" : "prompt"}">${esc(es ? it.es : it.nl)}${es ? " " + spk(it.es) : ""}</div>
    ${choices(it, optText)}
    ${fb ? feedbackBlock(`${esc(it.es)} — ${esc(it.nl)} ${spk(it.es, "sm")}`) : `<p class="hint">Kies met de toetsen 1 tot 4.</p>`}`;
}
function viewType(it, t){
  const fb = practice.phase==="feedback", toEs = (t && t.dir)!=="es";
  const s1 = sess(), t1 = s1 && s1.tasks[s1.idx];
  const cls = fb ? "fb " + (practice.result==="ok" ? "ok" : practice.result==="almost" ? "almost" : "bad") : "";
  if(toEs){
    const hint = it.type==="n" ? "Zelfstandig naamwoord: typ het met lidwoord (el / la)." : it.type==="a" ? "Bijvoeglijk naamwoord, mannelijke vorm." : "";
    return `<div class="eyebrow">${t1 && t1.final ? "Eindronde · " : ""}Vertaal naar het Spaans · ${esc(E.catName(it.cat))}</div>
      <div class="prompt">${esc(it.nl)}</div>
      ${hint ? `<div class="mini">${hint}</div>` : ""}
      <form class="ansform" action="#"><input class="answer ${cls}" id="ans" lang="es" enterkeyhint="go" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Typ hier…" value="${esc(practice.given||"")}"></form>
      ${fb ? feedbackBlock(`${esc(it.es)} ${spk(it.es, "sm")}`) : accentBar() + `<div class="actions"><button class="btn big" type="button" data-action="check">Controleer <span class="kbd">Enter</span></button></div>`}`;
  }
  return `<div class="eyebrow">${t1 && t1.final ? "Eindronde · " : ""}Vertaal naar het Nederlands · ${esc(E.catName(it.cat))}</div>
    <div class="word">${esc(it.es)} ${spk(it.es)}</div>
    <form class="ansform" action="#"><input class="answer ${cls}" id="ans" lang="nl" enterkeyhint="go" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="In het Nederlands…" value="${esc(practice.given||"")}"></form>
    ${fb ? feedbackBlock(esc(it.nl)) : `<div class="actions"><button class="btn big" type="button" data-action="check">Controleer <span class="kbd">Enter</span></button></div>`}`;
}
function conjTable(v, tenseId, opts={}){
  const forms = v.forms[tenseId], reg = E.conjugate({ inf:v.inf, o:{ refl:v.refl } })[tenseId];
  const cell = i => `<div><span class="p">${esc(E.PERSONS[i])}</span><span class="f ${forms[i]!==reg[i] ? "irr" : ""}" ${canSpeak() ? `data-action="speak" data-nofocus data-text="${esc(forms[i])}" title="Spreek uit"` : ""}>${esc(forms[i])}</span></div>`;
  return `<div class="conj"><div class="stack" style="gap:0">${[0,1,2].map(cell).join("")}</div><div class="stack" style="gap:0">${[3,4,5].map(cell).join("")}</div></div>`;
}
function viewVIntro(it){
  const v = it.verb, tn = E.tense(it.tense);
  const known = E.TENSES.filter(t => t.id!==it.tense && statusOf(`vt:${v.inf}:${t.id}`)!=="nieuw").map(t=>t.name);
  return `<div class="eyebrow">${known.length ? "Nieuwe tijd" : "Nieuw werkwoord"} · ${esc(tn.name)}</div>
    <div class="word">${esc(v.inf)} ${spk(v.inf)}</div>
    <div class="prompt">${esc(v.nl)}${v.refl ? ' <span class="mini">(wederkerend)</span>' : ""}${v.irregular ? ' <span class="pill leren">onregelmatig</span>' : ' <span class="pill bekend">regelmatig</span>'}</div>
    <div class="sub"><b>${esc(tn.name)}</b> — ${esc(tn.nl)}. ${esc(tn.uitleg)}</div>
    ${conjTable(v, it.tense)}
    ${it.tense==="perfecto" ? `<div class="mini">Participio: <b>${esc(v.forms.participio)}</b> · Gerundio: <b>${esc(v.forms.gerundio)}</b></div>` : ""}
    <p class="hint">Blauwe vormen wijken af van het regelmatige patroon.</p>
    <div class="actions"><button class="btn outline" data-action="knowAlready">Ken ik al</button><button class="btn" data-action="introNext">Volgende</button></div>`;
}
function viewVDrill(it){
  const v = it.verb, tn = E.tense(it.tense), forms = v.forms[it.tense];
  if(!practice.persons) practice.persons = E.shuffle([0,1,2,3,4,5]).slice(0,3).sort((a,b)=>a-b);
  const fb = practice.phase==="feedback", d = practice.drill || {};
  return `<div class="eyebrow">Vervoeg · ${esc(tn.name)} <span class="muted">(${esc(tn.nl)})</span></div>
    <div class="word">${esc(v.inf)} ${spk(v.inf)}</div>
    <div class="sub">${esc(v.nl)}${v.refl ? " · wederkerend: typ ook me / te / se …" : ""}${it.tense==="perfecto" ? " · gebruik haber + participio" : ""}</div>
    <div class="drill">${practice.persons.map(p => `<form class="ansform" action="#"><label><span>${esc(E.PERSONS[p])}</span><input data-p="${p}" lang="es" enterkeyhint="next" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" class="${fb ? "fb " + (d[p]==="ok" ? "ok" : d[p]==="almost" ? "almost" : "bad") : ""}" value="${esc((practice.given||{})[p]||"")}"></label></form>`).join("")}</div>
    ${fb ? feedbackBlock("", `<div style="color:var(--ink);margin-top:6px">${conjTable(v, it.tense)}</div>`) : accentBar() + `<div class="actions"><button class="btn big" data-action="checkDrill">Controleer <span class="kbd">Enter</span></button></div>`}`;
}
function viewSIntro(it){
  return `<div class="eyebrow">Nieuwe zin · niveau ${it.lvl}</div>
    <div class="cloze">${clozeHtml(it, `<b style="color:var(--accent)">${esc(it.cloze)}</b>`)} ${spk(it.es)}</div>
    <div class="prompt">${esc(it.nl)}</div>
    ${it.isVerb ? `<div class="mini">Werkwoord: <b>${esc(it.verb.inf)}</b> (${esc(it.verb.nl)}) · ${esc(E.tenseLabel(it.tense))}</div>` : it.verb ? `<div class="mini">Werkwoord: <b>${esc(it.verb.inf)}</b> (${esc(it.verb.nl)}) · ${esc(E.tenseLabel(null))}</div>` : ""}
    <p class="hint">Lees de zin een paar keer hardop. Straks vul je hem zelf aan.</p>
    <div class="actions"><button class="btn outline" data-action="knowAlready">Ken ik al</button><button class="btn" data-action="introNext">Volgende</button></div>`;
}
function viewScramble(it){
  if(!practice.pool){ practice.pool = E.shuffle(it.words.map((w,i) => ({ w, i }))); practice.built = []; }
  const fb = practice.phase==="feedback", usedIdx = new Set(practice.built.map(b=>b.i));
  return `<div class="eyebrow">Zet de woorden in de juiste volgorde</div>
    <div class="prompt">${esc(it.nl)}</div>
    <div class="build">${practice.built.length ? practice.built.map((b,k) => `<button class="chip word" data-action="unbuild" data-k="${k}" ${fb?"disabled":""}>${esc(b.w)}</button>`).join("") : `<span class="mini">Tik op de woorden hieronder…</span>`}</div>
    <div class="chips">${practice.pool.map(p => `<button class="chip word ${usedIdx.has(p.i) ? "used" : ""}" data-action="build" data-i="${p.i}" ${usedIdx.has(p.i)||fb ? "disabled" : ""}>${esc(p.w)}</button>`).join("")}</div>
    ${fb ? feedbackBlock(`${esc(it.es)} ${spk(it.es, "sm")}`) : `<div class="actions"><button class="btn outline" data-action="clearBuild">Wis</button><button class="btn" data-action="checkBuild" ${practice.built.length===it.words.length ? "" : "disabled"}>Controleer</button></div>`}`;
}
function viewCloze(it){
  const fb = practice.phase==="feedback";
  const blank = `<u>${"·".repeat(Math.max(3, it.cloze.length))}</u>`;
  return `<div class="eyebrow">Vul het ontbrekende woord in</div>
    <div class="cloze">${clozeHtml(it, fb ? `<b style="color:var(--accent)">${esc(it.cloze)}</b>` : blank)}</div>
    <div class="sub">${esc(it.nl)}</div>
    <div class="mini">Begint met <b>${esc(it.cloze[0])}</b> · ${it.cloze.length} letters</div>
    <form class="ansform" action="#"><input class="answer ${fb ? "fb " + (practice.result==="ok" ? "ok" : practice.result==="almost" ? "almost" : "bad") : ""}" id="ans" lang="es" enterkeyhint="go" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Het ontbrekende woord" value="${esc(practice.given||"")}"></form>
    ${fb ? feedbackBlock(`${esc(it.cloze)} ${spk(it.es, "sm")}`) : accentBar() + `<div class="actions"><button class="btn big" type="button" data-action="check">Controleer <span class="kbd">Enter</span></button></div>`}`;
}
function viewVCloze(it){
  const fb = practice.phase==="feedback", v = it.verb, tn = E.tense(it.tense);
  const blank = `<u>${"·".repeat(Math.max(3, Math.min(10, it.cloze.length)))}</u>`;
  const t0 = sess().tasks[sess().idx];
  return `<div class="eyebrow">${t0 && t0.drill ? "Zinnen vervoegen · " : "Vervoeg in de zin · "}${esc(tn.name)} <span class="muted">(${esc(tn.nl)})</span></div>
    <div class="cloze">${clozeHtml(it, fb ? `<b style="color:var(--accent)">${esc(it.cloze)}</b>` : blank)}</div>
    <div class="sub">${esc(it.nl)}</div>
    <div class="mini">Werkwoord: <b>${esc(v.inf)}</b> (${esc(v.nl)})${v.refl ? " · wederkerend" : ""}${it.tense==="perfecto" ? " · haber + participio" : ""}</div>
    <form class="ansform" action="#"><input class="answer ${fb ? "fb " + (practice.result==="ok" ? "ok" : practice.result==="almost" ? "almost" : "bad") : ""}" id="ans" lang="es" enterkeyhint="go" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="De juiste vorm van ${esc(v.inf)}" value="${esc(practice.given||"")}"></form>
    ${fb ? feedbackBlock(`${esc(it.cloze)} ${spk(it.es, "sm")}`, `<div style="color:var(--ink);margin-top:6px">${conjTable(v, it.tense)}</div>`) : accentBar() + `<div class="actions"><button class="btn big" type="button" data-action="check">Controleer <span class="kbd">Enter</span></button></div>`}`;
}
function viewSMC(it){
  if(!practice.options) practice.options = E.shuffle([it, ...E.distractors(it, 3)]);
  const fb = practice.phase==="feedback";
  return `<div class="eyebrow">Wat betekent deze zin?</div>
    <div class="cloze">${esc(it.es)} ${spk(it.es)}</div>
    ${choices(it, o => o.nl)}
    ${fb ? feedbackBlock(esc(it.nl)) : `<p class="hint">Kies met de toetsen 1 tot 4.</p>`}`;
}
function renderDailySummary(s){
  const words = s.ids.map(id => ({ it:E.item(id), p:s.prog[id]||{c:0,w:0} })).filter(x => x.it);
  const fast = words.filter(x => x.p.w===0 && !x.p.known).length, hard = words.filter(x => x.p.w>=3).length;
  const pill = p => p.known ? ["beheerst","kende ik al"] : p.w===0 ? ["bekend","meteen goed"] : p.w>=3 ? ["leren","lastig"] : ["nieuw",`${p.w}× fout`];
  view.innerHTML = `<section class="pcard fade" style="min-height:0">
    <div class="eyebrow">Palabras de hoy</div>
    <h1>${words.length ? "¡Muy bien!" : "Alles gezien"}</h1>
    ${words.length ? `<div class="grid4"><div class="tile"><b class="num">${words.length}</b><span>woorden geleerd</span></div><div class="tile"><b class="num">${fast}</b><span>meteen goed</span></div><div class="tile"><b class="num">${hard}</b><span>lastig</span></div><div class="tile"><b class="num">${Math.floor(s.elapsed/60)}</b><span>minuten</span></div></div>
    <p class="ink2">Deze woorden komen terug in je dagelijkse quiz: woorden die je meteen goed had over drie dagen, de rest morgen. Lastige woorden herhaalt de app vaker.</p>
    <div class="list">${words.map(x => { const [cls,txt] = pill(x.p); return `<div class="item">${spk(x.it.es, "sm")}<div class="grow"><div class="es">${esc(x.it.es)}</div><div class="nl">${esc(x.it.nl)}</div></div><span class="pill ${cls}">${txt}</span></div>`; }).join("")}</div>` : `<p class="ink2">Er zijn geen nieuwe woorden meer: je hebt de hele woordenlijst al gezien.</p>`}
    <div class="actions"><button class="btn big" data-action="quit">Terug naar vandaag</button></div></section>`;
}
function renderSummary(s){
  if(practice.kind==="daily") return renderDailySummary(s);
  const tgt = data.settings.minutes*60, remaining = tgt - s.elapsed, pct = s.answered ? Math.round(100*s.correct/s.answered) : 0;
  const learned = (s.newIds||[]).filter(id => data.items[id]).map(id => E.item(id)).filter(Boolean);
  view.innerHTML = `
    <section class="pcard fade" style="min-height:0">
      <div class="eyebrow">${practice.adhoc ? esc(practice.adhoc.title||"Extra oefening") : "Sesión de hoy"}</div>
      <h1>${pct >= 80 ? "¡Bien hecho!" : pct >= 60 ? "¡Buen trabajo!" : "¡Sigue así!"}</h1>
      <div class="grid4">
        <div class="tile"><b class="num">${Math.floor(s.elapsed/60)}</b><span>minuten</span></div>
        <div class="tile"><b class="num">${s.answered}</b><span>vragen</span></div>
        <div class="tile"><b class="num">${pct}%</b><span>goed</span></div>
        <div class="tile"><b class="num">${learned.length}</b><span>nieuw geleerd</span></div>
      </div>
      ${learned.length ? `<div><div class="eyebrow" style="margin-bottom:6px">Vandaag nieuw</div><div class="list">${learned.map(it => `<div class="item"><div class="grow"><div class="es" ${it.kind==="sent" ? 'style="font-size:17px"' : ""}>${esc(it.kind==="vt" ? it.verb.inf + " · " + E.tense(it.tense).name : it.es)}</div><div class="nl">${esc(it.kind==="vt" ? it.verb.nl : it.nl)}</div></div></div>`).join("")}</div></div>` : ""}
      ${!practice.adhoc && remaining > 120 ? (practice.noExtra ? `<p class="hint">Alles wat je kent is al geoefend. Morgen staan er weer nieuwe woorden klaar.</p>` : `<button class="btn big ghost" data-action="addExtra">Nog ${Math.round(remaining/60)} minuten extra oefenen</button>`) : ""}
      ${!practice.adhoc && remaining <= 120 ? `<p class="ink2">Je halve uur zit erop. Tot morgen — ¡hasta mañana!</p>` : ""}
      <div class="actions"><button class="btn big" data-action="quit">Terug naar vandaag</button></div>
    </section>`;
}
function addExtra(){
  const s = data.session;
  const extra = E.extraTasks(data, today, s.tasks, Math.max(180, data.settings.minutes*60 - s.elapsed));
  if(!extra.length){ practice.noExtra = true; return renderSummary(s); }
  s.tasks.push(...extra); s.done = false; s.extraAdded = (s.extraAdded||0)+1; s.goalDismissed = true;
  resetTaskState(); save(); renderPractice();
}
function checkTyped(){
  const s = sess(), t = s.tasks[s.idx], it = E.item(t.id), input = $("#ans"); if(!input) return;
  const given = input.value; if(!given.trim()){ input.focus(); return; }
  practice.given = given; practice.note = null;
  let r;
  const isCloze = t.t==="cloze" || t.t==="vcloze";
  const toNl = t.t==="type" && t.dir==="es";
  if(isCloze) r = E.checkAnswer(given, [it.cloze], { reflexive: !!(it.verb && it.verb.refl) });
  else if(toNl) r = E.checkDutch(given, it.nl);
  else r = E.checkAnswer(given, [it.es], { articles:true });
  if(r==="almost" && toNl) practice.note = "Bijna goed, kleine typfout.";
  else if(r==="almost"){ const g = E.norm(given), target = E.norm(isCloze ? it.cloze : it.es); practice.note = E.stripAcc(g)===E.stripAcc(target) ? "Goed, maar let op de accenten." : isCloze ? "Goed, maar vergeet me / te / se niet." : "Goed, maar vergeet het lidwoord niet."; }
  grade(r);
}
function checkDrill(){
  const s = sess(), t = s.tasks[s.idx], it = E.item(t.id), forms = it.verb.forms[it.tense];
  const inputs = Array.from(view.querySelectorAll(".drill input")); if(inputs.some(i => !i.value.trim())){ (inputs.find(i=>!i.value.trim())).focus(); return; }
  practice.given = {}; practice.drill = {};
  let ok=0, almost=0;
  inputs.forEach(i => { const p = +i.dataset.p; practice.given[p] = i.value; const r = E.checkAnswer(i.value, [forms[p]], { reflexive: it.verb.refl }); practice.drill[p] = r; if(r==="ok") ok++; else if(r==="almost") almost++; });
  const total = inputs.length;
  practice.note = almost ? "Let op de accenten of het wederkerend voornaamwoord." : null;
  grade(ok===total ? "ok" : (ok+almost===total || ok>=total-1) ? "almost" : "wrong");
}

// ----- Woorden -----
function renderWords(){
  if(ui.quick) return renderQuick();
  const unseen = E.words.filter(w => !data.items[w.id] && w.lvl<=2).length;
  view.innerHTML = `
    <div class="row between"><h2>Woorden</h2><span class="mini num">${E.words.length} woorden</span></div>
    <input class="search" id="wordQ" placeholder="Zoek Spaans of Nederlands…" value="${esc(ui.wordQ)}" autocomplete="off">
    <div class="row">
      <select class="search" id="wordCat" style="flex:1"><option value="all">Alle categorieën</option>${E.categories.map(([id,name]) => `<option value="${id}" ${ui.wordCat===id?"selected":""}>${esc(name)}</option>`).join("")}</select>
    </div>
    <div class="chips" id="wordChips"></div>
    ${unseen ? `<section class="card row between"><div><b>Snelle check</b><div class="mini">${unseen} woorden van niveau 1–2 nog niet gezien. Geef snel aan wat je al kent.</div></div><button class="btn sm" data-action="goQuick">Start</button></section>` : ""}
    <section class="card" style="padding:6px 16px"><div class="list" id="wordList"></div></section>`;
  renderWordList();
}
function renderWordList(){
  const q = E.stripAcc(ui.wordQ);
  const base = E.words.filter(w => (ui.wordCat==="all" || w.cats.includes(ui.wordCat)) && (!q || E.stripAcc(w.es).includes(q) || E.stripAcc(w.nl).includes(q)));
  const counts = { all: base.length, nieuw:0, leren:0, bekend:0, beheerst:0 };
  base.forEach(w => counts[statusOf(w.id)]++);
  const list = base.filter(w => ui.wordFilter==="all" || statusOf(w.id)===ui.wordFilter);
  $("#wordChips").innerHTML = ["all","nieuw","leren","bekend","beheerst"].map(f => `<button class="chip ${ui.wordFilter===f?"active":""}" data-action="wordFilter" data-f="${f}">${f==="all" ? "Alle" : E.statusName[f]} <span class="num">${counts[f]}</span></button>`).join("");
  const shown = list.slice(0, ui.wordLimit);
  $("#wordList").innerHTML = (shown.map(w => {
    const st = data.items[w.id], s = E.status(st), open = ui.wordOpen===w.id;
    return `<button class="item" data-action="openWord" data-id="${esc(w.id)}"><div class="grow"><div class="es">${esc(w.es)}</div><div class="nl">${esc(w.nl)}</div></div><span class="pill ${s}">${E.statusName[s]}</span></button>
      ${open ? `<div class="detail stack"><div class="row between"><span>${spk(w.es, "sm")} ${esc(E.catName(w.cat))} · niveau ${w.lvl}</span><span class="num">${st ? `${st.c} goed · ${st.w} fout` : "nog niet geoefend"}</span></div><div class="mini">${dueText(st)}${st && st.b ? ` · stap ${st.b} van ${E.MAXBOX}` : ""}</div><div class="row"><button class="btn sm ghost" data-action="markKnown" data-id="${esc(w.id)}">Markeer als bekend</button><button class="btn sm outline" data-action="relearn" data-id="${esc(w.id)}">Opnieuw leren</button></div></div>` : ""}`;
  }).join("") || `<div class="empty">Geen woorden gevonden.</div>`) + (list.length > ui.wordLimit ? `<div class="row" style="justify-content:center;padding:12px"><button class="btn sm ghost" data-action="moreWords">Toon meer (${list.length - ui.wordLimit} over)</button></div>` : "");
}
function renderQuick(){
  const qk = ui.quick;
  if(qk.i >= qk.ids.length){
    view.innerHTML = `<section class="pcard fade" style="min-height:0"><div class="eyebrow">Snelle check</div><h2>Klaar</h2><p class="ink2">Je hebt ${qk.known} woorden als bekend gemarkeerd. Die herhaalt de app af en toe om te controleren of je ze echt kent.</p><div class="actions"><button class="btn big" data-action="quickStop">Terug</button></div></section>`;
    return;
  }
  const w = E.item(qk.ids[qk.i]);
  view.innerHTML = `
    <div class="practice-top"><button class="btn sm ghost" data-action="quickStop">Stop</button><div class="bar"><i style="width:${Math.round(100*qk.i/qk.ids.length)}%"></i></div><span class="mini num">${qk.i+1}/${qk.ids.length}</span></div>
    <section class="pcard fade">
      <div class="eyebrow">Ken je dit woord? · ${esc(E.catName(w.cat))}</div>
      <div class="word">${esc(w.es)}</div>
      <div class="prompt">${esc(w.nl)}</div>
      <p class="hint">Wees eerlijk: alleen "ken ik" als je het zelf actief zou gebruiken.</p>
      <div class="actions"><button class="btn outline" data-action="quickNo">Nog niet</button><button class="btn" data-action="quickYes">Ken ik</button></div>
    </section>`;
}

// ----- Werkwoorden -----
function renderVerbs(){
  const q = E.stripAcc(ui.verbQ);
  const list = E.verbs.filter(v => !q || E.stripAcc(v.inf).includes(q) || E.stripAcc(v.nl).includes(q));
  view.innerHTML = `
    <div class="row between"><h2>Werkwoorden</h2><span class="mini num">${E.verbs.length} werkwoorden · ${E.TENSES.length} tijden</span></div>
    <input class="search" id="verbQ" placeholder="Zoek een werkwoord…" value="${esc(ui.verbQ)}" autocomplete="off">
    <div class="row mini" style="gap:14px"><span><span class="dot leren"></span> aan het leren</span><span><span class="dot bekend"></span> bekend</span><span><span class="dot beheerst"></span> beheerst</span></div>
    <section class="card" style="padding:6px 16px"><div class="list" id="verbList">${list.map(v => verbRow(v)).join("") || `<div class="empty">Geen werkwoord gevonden.</div>`}</div></section>`;
}
function verbRow(v){
  const dots = E.TENSES.map(t => `<span class="dot ${statusOf(`vt:${v.inf}:${t.id}`)}" title="${esc(t.name)}"></span>`).join("");
  const open = ui.verbOpen===v.id;
  return `<button class="item" data-action="openVerb" data-id="${esc(v.id)}"><div class="grow"><div class="es">${esc(v.inf)}</div><div class="nl">${esc(v.nl)}</div></div><span class="row" style="gap:4px">${dots}</span></button>
    ${open ? verbDetail(v) : ""}`;
}
function verbDetail(v){
  const reg = E.conjugate({ inf:v.inf, o:{ refl:v.refl } });
  const rows = [0,1,2,3,4,5].map(p => `<tr><td class="muted">${esc(E.PERSONS_SHORT[p])}</td>${E.TENSES.map(t => `<td style="${v.forms[t.id][p]!==reg[t.id][p] ? "color:var(--accent);font-weight:700;" : ""}${canSpeak() ? "cursor:pointer" : ""}" ${canSpeak() ? `data-action="speak" data-nofocus data-text="${esc(v.forms[t.id][p])}" title="Spreek uit"` : ""}>${esc(v.forms[t.id][p])}</td>`).join("")}</tr>`).join("");
  const practiced = E.TENSES.filter(t => statusOf(`vt:${v.inf}:${t.id}`)!=="nieuw");
  const exs = E.sentencesForVerb(v.inf);
  return `<div class="detail stack">
    <div class="row between"><span>${spk(v.inf, "sm")} ${v.irregular ? '<span class="pill leren">onregelmatig</span>' : '<span class="pill bekend">regelmatig</span>'}${v.refl ? ' <span class="pill nieuw">wederkerend</span>' : ""}</span><span class="mini">participio <b>${esc(v.forms.participio)}</b> · gerundio <b>${esc(v.forms.gerundio)}</b></span></div>
    <div class="scroll-x"><table class="table"><thead><tr><th></th>${E.TENSES.map(t => `<th>${esc(t.name)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>
    <div class="row"><button class="btn sm" data-action="drillVerb" data-id="${esc(v.id)}">Oefen ${practiced.length ? practiced.map(t=>t.name.toLowerCase()).slice(0,2).join(" en ") + (practiced.length>2 ? " en meer" : "") : "presente"}</button>${exs.length ? `<button class="btn sm ghost" data-action="drillVerbSents" data-id="${esc(v.id)}">Oefen in zinnen (${exs.length})</button>` : ""}</div>
    ${exs.length ? `<div class="stack" style="gap:6px"><div class="eyebrow">In zinnen</div>${exs.slice(0,8).map(z => `<div style="font-size:14px"><span class="mini" style="display:inline-block;min-width:150px">${esc(E.tenseLabel(z.tense))}</span>${clozeHtml(z, `<b>${esc(z.cloze)}</b>`)} <span class="muted">— ${esc(z.nl)}</span></div>`).join("")}${exs.length>8 ? `<div class="mini">en nog ${exs.length-8} zinnen op het tabblad Zinnen</div>` : ""}</div>` : ""}
  </div>`;
}

// ----- Zinnen -----
function renderSentences(){
  view.innerHTML = `
    <div class="row between"><h2>Zinnen</h2><span class="mini num">${E.sentences.length} zinnen</span></div>
    <section class="card stack">
      <div><b>Werkwoorden in zinnen oefenen</b><div class="mini">Kies een tijd. Je krijgt zinnen waarin je steeds de juiste werkwoordsvorm invult. Zinnen die je al kent komen eerst.</div></div>
      <div class="chips">${E.TENSES.map(t => `<button class="chip" data-action="drillTense" data-t="${t.id}">${esc(t.name)}</button>`).join("")}<button class="chip" data-action="drillTense" data-t="mix">Alle tijden gemengd</button></div>
    </section>
    <input class="search" id="sentQ" placeholder="Zoek in Spaans of Nederlands…" value="${esc(ui.sentQ)}" autocomplete="off">
    <div class="chips" id="sentTenseChips"></div>
    <div class="chips" id="sentChips"></div>
    <section class="card" style="padding:6px 16px"><div class="list" id="sentList"></div></section>`;
  renderSentList();
}
function renderSentList(){
  const q = E.stripAcc(ui.sentQ);
  const base = E.sentences.filter(s => !q || E.stripAcc(s.es).includes(q) || E.stripAcc(s.nl).includes(q));
  const tenseOf = s => s.tense || (s.verb ? "otros" : "geen");
  const tCounts = { all: base.length }; base.forEach(s => { const k = tenseOf(s); tCounts[k] = (tCounts[k]||0)+1; });
  const byTense = base.filter(s => ui.sentTense==="all" || tenseOf(s)===ui.sentTense);
  const counts = { all: byTense.length, nieuw:0, leren:0, bekend:0, beheerst:0 }; byTense.forEach(s => counts[statusOf(s.id)]++);
  const list = byTense.filter(s => ui.sentFilter==="all" || statusOf(s.id)===ui.sentFilter);
  const tenseChips = [["all","Alle tijden"], ...E.TENSES.map(t => [t.id, t.name]), ["otros", E.TENSE_OTHER.name], ["geen","Zonder werkwoordfocus"]];
  $("#sentTenseChips").innerHTML = tenseChips.map(([id,name]) => `<button class="chip ${ui.sentTense===id?"active":""}" data-action="sentTense" data-t="${id}">${esc(name)} <span class="num">${tCounts[id]||0}</span></button>`).join("");
  $("#sentChips").innerHTML = ["all","nieuw","leren","bekend","beheerst"].map(f => `<button class="chip ${ui.sentFilter===f?"active":""}" data-action="sentFilter" data-f="${f}">${f==="all" ? "Alle" : E.statusName[f]} <span class="num">${counts[f]}</span></button>`).join("");
  const shown = list.slice(0, ui.sentLimit);
  $("#sentList").innerHTML = (shown.map(s => {
    const st = data.items[s.id], status = E.status(st), open = ui.sentOpen===s.id;
    return `<button class="item" data-action="openSent" data-id="${esc(s.id)}"><div class="grow"><div class="es" style="font-size:17px">${clozeHtml(s, `<b style="color:var(--accent)">${esc(s.cloze)}</b>`)}</div><div class="nl">${esc(s.nl)}</div></div><span class="pill ${status}">${E.statusName[status]}</span></button>
      ${open ? `<div class="detail stack"><div class="row between"><span>${spk(s.es, "sm")} ${s.verb ? `<b>${esc(s.verb.inf)}</b> (${esc(s.verb.nl)}) · ${esc(E.tenseLabel(s.tense))}` : "Zin zonder werkwoordfocus"} · niveau ${s.lvl}</span><span class="num">${st ? `${st.c} goed · ${st.w} fout` : "nog niet geoefend"}</span></div><div class="mini">${dueText(st)}</div><div class="row"><button class="btn sm" data-action="drillSent" data-id="${esc(s.id)}">Oefen deze zin</button><button class="btn sm ghost" data-action="markKnownSent" data-id="${esc(s.id)}">Markeer als bekend</button><button class="btn sm outline" data-action="relearnSent" data-id="${esc(s.id)}">Opnieuw leren</button></div></div>` : ""}`;
  }).join("") || `<div class="empty">Geen zinnen gevonden.</div>`) + (list.length > ui.sentLimit ? `<div class="row" style="justify-content:center;padding:12px"><button class="btn sm ghost" data-action="moreSents">Toon meer (${list.length - ui.sentLimit} over)</button></div>` : "");
}
function tenseDrillTasks(tenseId, limit=15){
  let pool = E.sentences.filter(s => s.isVerb && (tenseId==="mix" || s.tense===tenseId));
  const seen = pool.filter(s => data.items[s.id]).sort((a,b) => (data.items[a.id].d - data.items[b.id].d) || Math.random()-0.5);
  const unseen = E.shuffle(pool.filter(s => !data.items[s.id]).sort((a,b) => a.lvl-b.lvl).slice(0, 40));
  return [...seen, ...unseen].slice(0, limit).map(s => ({ t:"vcloze", id:s.id }));
}

// ----- Voortgang -----
function stackBar(c){
  const total = c.nieuw + c.leren + c.bekend + c.beheerst || 1;
  const seg = (n, cls) => n ? `<i style="width:${100*n/total}%;background:var(--${cls})" title="${E.statusName[cls==='saffron'?'leren':cls==='accent'?'bekend':cls==='ok'?'beheerst':'nieuw']}: ${n}"></i>` : "";
  return `<div class="bar" style="display:flex;gap:2px;height:12px">${seg(c.beheerst,"ok")}${seg(c.bekend,"accent")}${seg(c.leren,"saffron")}${seg(c.nieuw,"line")}</div>`;
}
function renderProgress(){
  const st = E.stats(data), days = Object.values(data.days);
  const totalMin = days.reduce((a,d) => a + Math.floor((d.sec ?? d.min*60)/60), 0), totalAns = days.reduce((a,d)=>a+(d.n||0),0), totalOk = days.reduce((a,d)=>a+(d.ok||0),0);
  const kinds = [["Woorden", st.byKind.word],["Werkwoordsvormen", st.byKind.vt],["Zinnen", st.byKind.sent]];
  const cats = E.categories.map(([id,name]) => { const ws = E.words.filter(w => w.cats.includes(id)); const known = ws.filter(w => E.isKnown(data.items[w.id])).length; const started = ws.filter(w => data.items[w.id]).length; return { id, name, total: ws.length, known, started }; });
  const hard = Object.keys(data.items).filter(id => E.item(id) && data.items[id].w >= 2).sort((a,b) => (data.items[b].w - data.items[b].c) - (data.items[a].w - data.items[a].c)).slice(0,10);
  view.innerHTML = `
    <h2>Voortgang</h2>
    <section class="grid4">
      <div class="tile"><b class="num">${E.streak(data.days, today)}</b><span>dagen op rij</span></div>
      <div class="tile"><b class="num">${days.filter(d => (d.sec ?? d.min*60) >= 60).length}</b><span>dagen geoefend</span></div>
      <div class="tile"><b class="num">${totalMin}</b><span>minuten totaal</span></div>
      <div class="tile"><b class="num">${totalAns ? Math.round(100*totalOk/totalAns) : 0}%</b><span>goed beantwoord</span></div>
    </section>
    <section class="card stack">
      <h3>Wat je kent</h3>
      ${kinds.map(([name,c]) => `<div class="stack" style="gap:4px"><div class="row between"><span>${name}</span><span class="mini num">${c.bekend + c.beheerst} bekend · ${c.leren} aan het leren · ${c.nieuw} nieuw</span></div>${stackBar(c)}</div>`).join("")}
      <div class="row mini" style="gap:14px"><span><span class="dot beheerst"></span> beheerst</span><span><span class="dot bekend"></span> bekend</span><span><span class="dot leren"></span> aan het leren</span><span><span class="dot"></span> nieuw</span></div>
      <p class="hint">Een woord telt als bekend zodra je het meerdere dagen achter elkaar goed had en de herhaling minstens een week vooruit staat. Beheerst betekent: herhaling pas over een maand of later.</p>
    </section>
    <section class="card stack"><h3>Laatste 30 dagen</h3>${chart(30)}</section>
    <section class="card stack">
      <h3>Per categorie</h3>
      <div class="cats">${cats.map(c => `<div class="row"><span class="name">${esc(c.name)}</span><div class="bar" style="display:flex;gap:2px"><i style="width:${100*c.known/c.total}%"></i><i style="width:${100*(c.started-c.known)/c.total}%;background:var(--saffron)"></i></div><span class="n num">${c.known}/${c.total}</span></div>`).join("")}</div>
    </section>
    <section class="card stack">
      <h3>Lastigste items</h3>
      ${hard.length ? `<div class="list">${hard.map(id => itemRow(id)).join("")}</div>` : `<p class="hint">Nog geen woorden die je vaker fout had.</p>`}
    </section>`;
}

// ----- Instellingen -----
function renderSettings(){
  const s = data.settings;
  const opt = (vals, cur, fmt = v=>v) => vals.map(v => `<option value="${v}" ${String(cur)===String(v) ? "selected" : ""}>${fmt(v)}</option>`).join("");
  view.innerHTML = `
    <h2>Instellingen</h2>
    <section class="card">
      <div class="setrow"><div><b>Dagelijkse oefentijd</b><div class="mini">De sessie wordt hierop afgestemd.</div></div><select data-setting="minutes">${opt([10,15,20,30,45,60], s.minutes, v=>v+" min")}</select></div>
      <div class="setrow"><div><b>Woorden van de dag</b><div class="mini">Nieuwe woorden die je apart van de quiz leert, met herhaling tot je ze kent.</div></div><select data-setting="dailyWords">${opt([0,10,15,20,25,30,40], s.dailyWords ?? 30)}</select></div>
      <div class="setrow"><div><b>Woorden van de dag kiezen</b><div class="mini">Willekeurig uit alle niveaus, of op volgorde van niveau en categorie.</div></div><select data-setting="dailyPick">${opt(["random","order"], s.dailyPick||"random", v => ({random:"Willekeurig", order:"Op volgorde"})[v])}</select></div>
      <div class="setrow"><div><b>Extra nieuwe woorden in de quiz</b><div class="mini">Normaal 0: nieuwe woorden leer je via Woorden van de dag, de quiz herhaalt ze.</div></div><select data-setting="newWords">${opt([0,3,5,8,10,12,15], s.newWords)}</select></div>
      <div class="setrow"><div><b>Nieuwe werkwoordsvormen per dag</b><div class="mini">Een werkwoord in één tijd, bijvoorbeeld <i>tener</i> in het presente.</div></div><select data-setting="newVerbs">${opt([0,1,2,3,4], s.newVerbs)}</select></div>
      <div class="setrow"><div><b>Nieuwe zinnen per dag</b><div class="mini">Zinnen bij de werkwoordsvormen van die dag gaan voor.</div></div><select data-setting="newSentences">${opt([0,1,2,3,4,5,6,8,10], s.newSentences)}</select></div>
      <div class="setrow"><div><b>Vervoegen in zinnen per dag</b><div class="mini">Invulzinnen met werkwoordsvormen die je al aan het leren bent.</div></div><select data-setting="dailySentences">${opt([0,4,6,8,10,12,15,20], s.dailySentences ?? 8)}</select></div>
      <div class="setrow"><div><b>Antwoorden geven</b><div class="mini">Mix: eerst meerkeuze, daarna zelf typen.</div></div><select data-setting="mode">${opt(["mix","type","mc"], s.mode, v => ({mix:"Mix", type:"Altijd typen", mc:"Altijd meerkeuze"})[v])}</select></div>
      <div class="setrow"><div><b>Overhoorrichting</b><div class="mini">Beide: Spaans → Nederlands én Nederlands → Spaans, afwisselend.</div></div><select data-setting="direction">${opt(["both","nl2es","es2nl"], s.direction||"both", v => ({both:"Beide richtingen", nl2es:"Nederlands → Spaans", es2nl:"Spaans → Nederlands"})[v])}</select></div>
      <div class="setrow"><div><b>Uitspraak</b><div class="mini">${speechOK() ? "Spaanse stem van je apparaat. Tik op de luidspreker om een woord of zin te horen." : "Je browser ondersteunt geen spraak."}</div></div><select data-setting="speech" ${speechOK() ? "" : "disabled"}>${opt(["button","auto","off"], s.speech||"button", v => ({button:"Alleen via knop", auto:"Automatisch voorlezen", off:"Uit"})[v])}</select></div>
    </section>
    <section class="card stack">
      <h3>Opslag</h3>
      <p class="ink2">${remoteRef ? "Je voortgang wordt gesynchroniseerd tussen je apparaten via je Claude-account." : "Je voortgang staat in deze browser. Open de app via de gedeelde link terwijl je ingelogd bent om te synchroniseren tussen apparaten."}</p>
      <div class="row"><button class="btn sm ghost" data-action="toggleExport">${ui.showExport ? "Verberg" : "Exporteer voortgang"}</button><button class="btn sm ghost" data-action="toggleImport">${ui.showImport ? "Verberg" : "Importeer voortgang"}</button></div>
      ${ui.showExport ? `<textarea class="io" readonly id="exportBox">${esc(JSON.stringify(data))}</textarea><p class="hint">Kopieer deze tekst en plak hem op een ander apparaat bij Importeer.</p>` : ""}
      ${ui.showImport ? `<textarea class="io" id="importBox" placeholder="Plak hier de geëxporteerde tekst…"></textarea><div class="row"><button class="btn sm" data-action="doImport">Samenvoegen</button></div>` : ""}
    </section>
    <section class="card stack">
      <h3>Opnieuw beginnen</h3>
      <p class="hint">Wist alle voortgang, instellingen en statistieken op dit apparaat en in de synchronisatie.</p>
      <div class="row"><button class="btn sm danger" data-action="reset">${ui.confirmReset ? "Zeker? Alles wissen" : "Alle voortgang wissen"}</button>${ui.confirmReset ? `<button class="btn sm ghost" data-action="cancelReset">Annuleren</button>` : ""}</div>
    </section>
    <p class="mini" style="text-align:center">Poco a Poco · ${E.words.length} woorden · ${E.verbs.length} werkwoorden · ${E.sentences.length} zinnen · Spaans uit Spanje</p>`;
}

// ---------- gebeurtenissen ----------
document.addEventListener("click", e => {
  const b = e.target.closest("[data-action]"); if(!b) return;
  const a = b.dataset.action, s = sess();
  const actions = {
    start(){ startDaily(); },
    startDailyWords(){ startDailyWords(); },
    reshuffleDaily(){ if(data.daily && data.daily.day===today && data.daily.answered>0) return; data.daily = E.buildDaily(data, today); save(); render(); },
    extraFromHome(){ startDaily(); addExtra(); },
    quit(){ quitPractice(); cur = "home"; render(); },
    dismissGoal(){ s.goalDismissed = true; renderPractice(); },
    finishNow(){ s.done = true; practice.phase = "summary"; save(); renderPractice(); },
    next(){ next(); },
    introNext(){ const t = s.tasks[s.idx]; if(practice.kind!=="daily") data.items[t.id] = E.introduce(data.items[t.id], today); next(); },
    knowAlready(){ const t = s.tasks[s.idx]; if(practice.kind==="daily") E.dailyKnown(data, s, t.id, today); else { data.items[t.id] = E.markKnown(data.items[t.id], today); skipFreshTasks(s, t.id); } next(); },
    choose(){ if(practice.phase!=="ask") return; const i = +b.dataset.i, t = s.tasks[s.idx]; practice.chosen = i; grade(practice.options[i].id===t.id ? "ok" : "wrong"); },
    check(){ checkTyped(); },
    checkDrill(){ checkDrill(); },
    accent(){ insertAccent(b); },
    speak(){ speak(b.dataset.text); },
    build(){ const i = +b.dataset.i, it = E.item(s.tasks[s.idx].id); practice.built.push({ w: it.words[i], i }); renderPractice(); },
    unbuild(){ practice.built.splice(+b.dataset.k, 1); renderPractice(); },
    clearBuild(){ practice.built = []; renderPractice(); },
    checkBuild(){ const it = E.item(s.tasks[s.idx].id); grade(practice.built.map(x=>x.w).join(" ")===it.es ? "ok" : "wrong"); },
    addExtra(){ addExtra(); },
    goQuick(){ cur = "words"; ui.quick = { ids: E.words.slice().sort((a,b)=>a.lvl-b.lvl).filter(w => !data.items[w.id] && w.lvl<=2).map(w=>w.id), i:0, known:0 }; render(); },
    quickYes(){ const id = ui.quick.ids[ui.quick.i]; data.items[id] = E.markKnown(data.items[id], today); ui.quick.known++; ui.quick.i++; save(); renderQuick(); },
    quickNo(){ ui.quick.i++; renderQuick(); },
    quickStop(){ ui.quick = null; render(); },
    wordFilter(){ ui.wordFilter = b.dataset.f; ui.wordLimit = 80; renderWordList(); },
    openWord(){ ui.wordOpen = ui.wordOpen===b.dataset.id ? null : b.dataset.id; renderWordList(); },
    moreWords(){ ui.wordLimit += 120; renderWordList(); },
    markKnown(){ data.items[b.dataset.id] = E.markKnown(data.items[b.dataset.id], today); save(); renderWordList(); },
    relearn(){ data.items[b.dataset.id] = E.resetItem(data.items[b.dataset.id], today); save(); renderWordList(); },
    openVerb(){ ui.verbOpen = ui.verbOpen===b.dataset.id ? null : b.dataset.id; renderVerbs(); },
    drillVerbSents(){ const v = E.verbById[b.dataset.id]; const zs = E.shuffle(E.sentencesForVerb(v.inf).filter(z => z.isVerb)).slice(0, 10); if(zs.length) startAdhoc(zs.map(z => ({ t:"vcloze", id:z.id })), `Oefening · ${v.inf} in zinnen`); },
    drillTense(){ const tasks = tenseDrillTasks(b.dataset.t); if(!tasks.length) return; startAdhoc(tasks, `Oefening · ${b.dataset.t==="mix" ? "alle tijden" : E.tense(b.dataset.t).name}`); },
    drillSent(){ const s = E.item(b.dataset.id); const tasks = [s.isVerb ? { t:"vcloze", id:s.id } : { t:"cloze", id:s.id }]; if(s.words.length <= 10) tasks.unshift({ t:"scramble", id:s.id }); startAdhoc(tasks, "Oefening · zin"); },
    sentTense(){ ui.sentTense = b.dataset.t; ui.sentLimit = 60; renderSentList(); },
    sentFilter(){ ui.sentFilter = b.dataset.f; ui.sentLimit = 60; renderSentList(); },
    openSent(){ ui.sentOpen = ui.sentOpen===b.dataset.id ? null : b.dataset.id; renderSentList(); },
    moreSents(){ ui.sentLimit += 100; renderSentList(); },
    markKnownSent(){ data.items[b.dataset.id] = E.markKnown(data.items[b.dataset.id], today); save(); renderSentList(); },
    relearnSent(){ data.items[b.dataset.id] = E.resetItem(data.items[b.dataset.id], today); save(); renderSentList(); },
    drillVerb(){ const v = E.verbById[b.dataset.id]; let tenses = E.TENSES.filter(t => statusOf(`vt:${v.inf}:${t.id}`)!=="nieuw"); if(!tenses.length) tenses = [E.TENSES[0]]; startAdhoc(tenses.map(t => ({ t:"vdrill", id:`vt:${v.inf}:${t.id}` })), `Oefening · ${v.inf}`); },
    toggleExport(){ ui.showExport = !ui.showExport; renderSettings(); },
    toggleImport(){ ui.showImport = !ui.showImport; renderSettings(); },
    doImport(){ try { const r = JSON.parse($("#importBox").value); if(!r || typeof r!=="object" || !r.items) throw new Error("geen geldige export"); absorbRemote(r); save(); ui.showImport = false; renderSettings(); } catch(err){ alert("Importeren mislukt: " + err.message); } },
    reset(){ if(!ui.confirmReset){ ui.confirmReset = true; return renderSettings(); } data = { settings: Object.assign({}, data.settings), items:{}, days:{}, session:null, updatedAt:0 }; ui.confirmReset = false; save(); render(); },
    cancelReset(){ ui.confirmReset = false; renderSettings(); },
  };
  if(actions[a]) actions[a]();
});
document.addEventListener("beforeinput", e => { if(cur==="practice" && practice && practice.phase==="feedback" && e.target.closest && e.target.closest(".pcard")) e.preventDefault(); });
document.addEventListener("mousedown", e => { if(e.target.closest && e.target.closest("[data-nofocus]")) e.preventDefault(); });
document.addEventListener("touchend", e => { const b = e.target.closest && e.target.closest("[data-nofocus]"); if(b){ e.preventDefault(); b.click(); } }, { passive:false });
function insertAccent(b){ const inp = practice && practice.lastInput && view.contains(practice.lastInput) ? practice.lastInput : view.querySelector(".pcard input"); if(inp) insertAtCursor(inp, b.dataset.ch); }
document.addEventListener("focusin", e => {
  if(practice && e.target.matches && e.target.matches("input")){ practice.lastInput = e.target; setTimeout(() => { try { e.target.scrollIntoView({ block:"center", behavior:"smooth" }); } catch(err){} }, 250); }
});
document.addEventListener("input", e => {
  if(e.target.id==="wordQ"){ ui.wordQ = e.target.value; ui.wordLimit = 80; renderWordList(); }
  if(e.target.id==="sentQ"){ ui.sentQ = e.target.value; ui.sentLimit = 60; renderSentList(); }
  if(e.target.id==="verbQ"){ ui.verbQ = e.target.value; const q = E.stripAcc(ui.verbQ); $("#verbList").innerHTML = E.verbs.filter(v => !q || E.stripAcc(v.inf).includes(q) || E.stripAcc(v.nl).includes(q)).map(verbRow).join("") || `<div class="empty">Geen werkwoord gevonden.</div>`; }
});
document.addEventListener("change", e => {
  if(e.target.id==="wordCat"){ ui.wordCat = e.target.value; ui.wordLimit = 80; renderWordList(); }
  const key = e.target.dataset && e.target.dataset.setting;
  if(key){ const v = e.target.value; data.settings[key] = /^-?\d+$/.test(v) ? +v : v; if(data.session && data.session.day===today && !data.session.done && data.session.idx===0) data.session = null; if((key==="dailyWords" || key==="dailyPick") && data.daily && data.daily.day===today && !data.daily.done && data.daily.answered===0) data.daily = null; save(); renderSettings(); }
});
function handleEnter(){
  const s = sess(); if(!s || practice.phase==="summary") return;
  const t = s.tasks[s.idx]; if(!t) return;
  if(practice.phase==="feedback") return next();
  if(t.t==="type" || t.t==="cloze" || t.t==="vcloze") return checkTyped();
  if(t.t==="vdrill"){ const inputs = Array.from(view.querySelectorAll(".drill input")); const i = inputs.indexOf(document.activeElement); if(i>=0 && i<inputs.length-1 && !inputs[i+1].value) return inputs[i+1].focus(); return checkDrill(); }
  if(t.t==="scramble" && practice.built && practice.built.length===E.item(t.id).words.length){ const b = document.querySelector("[data-action=checkBuild]"); if(b) b.click(); }
}
document.addEventListener("submit", e => { if(e.target.classList && e.target.classList.contains("ansform")){ e.preventDefault(); if(cur==="practice" && practice) handleEnter(); } });
document.addEventListener("keydown", e => {
  if(cur!=="practice" || !practice) return;
  const s = sess(); if(!s || practice.phase==="summary") return;
  const t = s.tasks[s.idx]; if(!t) return;
  const onButton = e.target.tagName==="BUTTON" && e.target.dataset.action!=="next";
  if((e.key==="Enter" || e.keyCode===13) && !onButton){ e.preventDefault(); return handleEnter(); }
  if(practice.phase==="ask" && (t.t==="mc" || t.t==="smc") && /^[1-4]$/.test(e.key) && !(e.target.matches && e.target.matches("input"))){ const i = +e.key-1; if(practice.options[i]){ practice.chosen = i; grade(practice.options[i].id===t.id ? "ok" : "wrong"); } }
});
$("#tabs").addEventListener("click", e => {
  const b = e.target.closest("button[data-view]"); if(!b) return;
  if(cur==="practice") quitPractice();
  ui.quick = null; cur = b.dataset.view; render(); window.scrollTo(0,0);
});
document.addEventListener("visibilitychange", () => { if(document.visibilityState==="visible"){ const t = E.dayNum(); if(t!==today){ today = t; if(cur!=="practice") render(); } } });

// ---------- start ----------
setSync("local");
render();
initSync();
})();
