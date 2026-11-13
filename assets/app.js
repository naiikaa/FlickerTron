/* FlickerTron primer: rendering and interaction. Data: assets/data.js (cards, lists), assets/lines.js (scenes). */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = matchMedia('(hover: none)').matches;
const SYMS = new Set(['W', 'U', 'B', 'R', 'G', 'C', 'X', 'T', ...Array.from({ length: 14 }, (_, i) => String(i))]);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ms = t => String(t).replace(/\{([^}]+)\}/g, (m, s) => SYMS.has(s) ? `<img class="ms" src="assets/symbols/${s}.svg" alt="{${s}}">` : m);
const mention = (n, label) => `<span class="mention" data-card="${esc(n)}" tabindex="0">${esc(label || n)}</span>`;
/* [[Card]] or [[Card|label]] -> hover mention; {X} -> mana symbol */
const rich = t => ms(String(t).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, n, l) => mention(n, l)));
const rec = n => IMG[n];
const src = n => (rec(n) || {}).img || '';
const art = n => (rec(n) || {}).art || src(n);
const isLand = n => /\bLand\b/.test((rec(n) || {}).type || '');
const minus = '\u2212';

function tile(n, { qty, sign, note, faded, cls = '' } = {}) {
  const q = qty == null ? '' : `<span class="qty ${sign || ''}">${sign === 'plus' ? '+' : sign === 'minus' ? minus : '×'}${qty}</span>`;
  const cap = note ? `<figcaption><b>${esc(n)}</b>${rich(note)}</figcaption>` : '';
  return `<figure class="ct ${faded ? 'faded' : ''} ${cls}" data-card="${esc(n)}"><img loading="lazy" src="${src(n)}" alt="${esc(n)}" width="488" height="680">${q}${cap}</figure>`;
}

/* ---------- card notes (rules-text based) ---------- */
const NOTES = {
  "Urza's Mine": 'Tron piece. Taps for {C}, or {C}{C} with Power Plant and Tower in play.',
  "Urza's Power Plant": 'Tron piece. Taps for {C}, or {C}{C} with Mine and Tower in play.',
  "Urza's Tower": 'Tron piece. Taps for {C}, or {C}{C}{C} with Mine and Power Plant. Three of them fuel the infinite.',
  'Island': 'Blue without a filter for Impulse, Prohibit and Hydroblast.',
  'Forest': 'Green for Crop Rotation and the fogs. [[Generous Ent]] forestcycles for it.',
  'Tangled Islet': 'Forest Island: found by both Lórien Revealed\'s islandcycling and Generous Ent\'s forestcycling.',
  'Remote Isle': 'Blue source that cycles for {2} once you have enough lands.',
  'Conduit Pylons': 'Surveils 1 when it enters, taps for {C} or filters for {1}.',
  'Bojuka Bog': 'Exiles a graveyard on entry. Expedition Map finds it, and Pulse or Call Damage Control returns it for another use.',
  'Expedition Map': '{2}, tap, sacrifice: any land to hand. The missing Tron piece or Bojuka Bog.',
  'Crop Rotation': 'Instant: sacrifice a land, put any land onto the battlefield untapped.',
  'Prophetic Prism': 'Replaces itself and turns {1} into any colour. Blinked with a Wall, it draws every turn.',
  'Energy Refractor': '{2}: any colour, as often as you can pay. The infinite pays its {U} and {G} here.',
  "Giant's Boulder": 'Scry 2 on entry, {1}: any colour, and {7}, sacrifice: destroy any permanent.',
  "Bonder's Ornament": 'Taps for any colour for free. With spare mana, {4}, tap: draw a card.',
  'Mnemonic Wall': 'Returns an instant or sorcery each time it enters. The heart of every loop.',
  'Ghostly Flicker': 'Blinks two artifacts, creatures or lands. With a Wall it comes back to hand.',
  'Ephemerate': 'Blinks a creature now and again next upkeep: Mulldrifter draws four, Stonehorn skips two combats.',
  'Mulldrifter': 'Two cards on every entry and a flying clock. Evoke for {2}{U} early.',
  'Call Damage Control': 'Returns up to two of artifact, creature, enchantment and land from your graveyard: a Wall and a Tron land.',
  'Pulse of Murasa': 'Returns a creature or land card from a graveyard and gains 6 life.',
  'Impulse': 'Top four, keep one. Finds Tron early and answers late.',
  'Lórien Revealed': 'Draws three late. Early, islandcycle for {1} to find Island or Tangled Islet.',
  'Mystical Teachings': 'Finds any instant: Flicker, a fog, Unwind, Weather. Flashback {5}{B} finds another.',
  'Generous Ent': 'Forestcycling {1} early. Late, a 5/7 reach blocker plus a Food for 3 life.',
  "Moment's Peace": 'Fog now, fog again with flashback. A Wall can return it before you flash it back.',
  'Weather the Storm': 'Storm life gain. In the infinite, its copies are what Unwind counters.',
  'Prohibit': 'Counters a spell with mana value 2 or less, or 4 or less kicked.',
  'Unwind': 'Counters a noncreature spell and untaps three lands. Three Towers make that +9 mana.',
  'Cast Down': 'Two-mana instant removal for any nonlegendary creature.',
  'Breath Weapon': '2 damage to each non-Dragon creature, your Birds and Mulldrifter included.',
  'Stonehorn Dignitary': 'The opponent skips their next combat phase. Blinked every turn, they never attack.',
  'Murmuring Mystic': 'A 1/1 flying Bird for every instant or sorcery you cast. The main win condition.',
  'Rolling Thunder': 'X damage divided any way: a sweeper for small creatures, a Tron finisher, unlimited after the infinite.',
  'Hydroblast': 'For {U}: counter a red spell or destroy a red permanent.',
  'Pyroblast': 'For {R}: counter a blue spell or destroy a blue permanent.',
  'Ancient Grudge': 'Destroy an artifact, then another with flashback {G}.',
  'Vandalblast': 'Destroy an artifact you don\'t control; overload {4}{R} destroys all of them.',
  'Tangle': 'A fog that also keeps every attacker tapped through its next untap step.',
  'Mystic Remora': 'Opponents\' noncreature spells draw you a card unless they pay {4}.',
  'Dinrova Horror': 'Bounces a permanent and makes its owner discard. Blinked, it does it every turn.',
  /* PauperBrews-only cards (comparison section) */
  'Focus the Mind': 'Draw three, discard one; {2} cheaper after another spell.',
  'Heritage Reclamation': 'Destroys an artifact or enchantment, or exiles a graveyard card and draws.',
  'Cave of Temptation': 'Colourless land that filters for {1} and can sacrifice for two +1/+1 counters.',
  'Molten Tributary': 'Island Mountain that enters tapped: blue or red.',
  'Red Elemental Blast': 'Counter a blue spell or destroy a blue permanent.',
  'Blue Elemental Blast': 'Counter a red spell or destroy a red permanent.',
  'Lightning Bolt': '3 damage to any target.',
  'Envelop': 'Counters a sorcery.',
  'Remove Soul': 'Counters a creature spell.',
  'Scattershot': 'Storm: 1 damage to a creature per copy.'
};

/* ---------- zoom ---------- */
const zoom = $('#zoom'), zimg = zoom.appendChild(new Image());
let zoomFor = null;
function showZoom(name, x, y) {
  if (!rec(name)) return;
  if (zoomFor !== name) { zimg.src = src(name); zimg.alt = name; zoomFor = name; }
  zoom.classList.add('show');
  placeZoom(x, y);
}
function placeZoom(x, y) {
  const w = 300, h = w * 680 / 488, pad = 24;
  let left = x + pad; if (left + w > innerWidth - 8) left = x - w - pad;
  let top = Math.min(Math.max(8, y - h / 2), innerHeight - h - 8);
  zoom.style.transform = `translate(${Math.max(8, left)}px,${top}px)`;
}
function hideZoom() { zoom.classList.remove('show', 'center'); zoom.style.transform = ''; zoomFor = null; }
if (!TOUCH) {
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-card]');
    if (t && e.pointerType === 'mouse') showZoom(t.dataset.card, e.clientX, e.clientY);
  });
  document.addEventListener('pointermove', e => { if (zoom.classList.contains('show') && !zoom.classList.contains('center')) placeZoom(e.clientX, e.clientY); });
  document.addEventListener('pointerout', e => { const t = e.target.closest('[data-card]'); if (t && !t.contains(e.relatedTarget)) hideZoom(); });
}
document.addEventListener('focusin', e => {
  const t = e.target.closest('.mention');
  if (t) { const r = t.getBoundingClientRect(); showZoom(t.dataset.card, r.right, r.top + r.height / 2); }
});
document.addEventListener('focusout', e => { if (e.target.closest('.mention')) hideZoom(); });
document.addEventListener('click', e => {
  if (zoom.classList.contains('center')) { hideZoom(); return; }
  if (!TOUCH) return;
  const t = e.target.closest('.ct,.mention,.sc,tr[data-card]');
  if (!t) return;
  zoomFor = null; showZoom(t.dataset.card, 0, 0); zoom.classList.add('center'); zoom.style.transform = '';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { hideZoom(); closeRail(); } });

/* ---------- rail ---------- */
const railLinks = $$('#railList a');
const sections = railLinks.map(a => document.getElementById(a.getAttribute('href').slice(1)));
function spy() {
  const y = innerHeight * 0.35;
  let cur = 0;
  sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= y) cur = i; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = sections.length - 1;
  railLinks.forEach((a, i) => {
    const li = a.parentElement;
    li.classList.toggle('on', i === cur); li.classList.toggle('done', i < cur);
    if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
  });
  const lamp = railLinks[cur].querySelector('.lamp'), wire = $('.rail .wire');
  const h = lamp.getBoundingClientRect().top + 7 - wire.getBoundingClientRect().top;
  $('#railCurrent').style.transform = `scaleY(${Math.min(1, Math.max(0, h) / wire.offsetHeight)})`;
  $('#tbSec').textContent = cur ? railLinks[cur].textContent.trim() : '';
}
addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true });
addEventListener('resize', spy);
function closeRail() { document.body.classList.remove('rail-open'); $('#railBtn').setAttribute('aria-expanded', 'false'); }
$('#railBtn').onclick = () => { const o = document.body.classList.toggle('rail-open'); $('#railBtn').setAttribute('aria-expanded', String(o)); };
$('#scrim').onclick = closeRail;
railLinks.forEach(a => a.addEventListener('click', closeRail));

/* ---------- power plant (Tron calculator) ---------- */
const PLANT = { mine: false, pp: false, tower: 0, lastTower: 1 };
let shownTotal = 0, countRaf = 0, wasTron = false;
(function gaugeTicks() {
  const MAJ = { 0: '', 3: '', 7: 'TRON', 10: '', 13: '3 TOWERS' };
  let h = '';
  for (let v = 0; v <= 13; v++) {
    const a = Math.PI * (1 - v / 13), c = Math.cos(a), s = Math.sin(a), maj = v in MAJ, r2 = maj ? 124 : 132;
    const P = (r, dy = 0) => `x="${(170 + r * c).toFixed(1)}" y="${(170 - r * s + dy).toFixed(1)}"`;
    h += `<line class="tk${maj ? ' maj' : ''}" x1="${(170 + 140 * c).toFixed(1)}" y1="${(170 - 140 * s).toFixed(1)}" x2="${(170 + r2 * c).toFixed(1)}" y2="${(170 - r2 * s).toFixed(1)}"/>`;
    if (maj) h += `<text ${P(106, 5)}>${v}</text>` + (MAJ[v] ? `<text class="sub" ${v === 13 ? P(100, 22) : P(86, 4)}>${MAJ[v]}</text>` : '');
  }
  $('#gTicks').innerHTML = h;
})();
function tronMath() {
  const tron = PLANT.mine && PLANT.pp && PLANT.tower > 0;
  const m = PLANT.mine ? (tron ? 2 : 1) : 0, p = PLANT.pp ? (tron ? 2 : 1) : 0, t = PLANT.tower * (tron ? 3 : 1);
  return { tron, m, p, t, total: m + p + t };
}
function countTo(n) {
  cancelAnimationFrame(countRaf);
  const el = $('#mTotal'), from = shownTotal;
  if (REDUCED || from === n) { el.textContent = shownTotal = n; return; }
  const t0 = performance.now(), dur = 520;
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
    shownTotal = Math.round(from + (n - from) * e); el.textContent = shownTotal;
    if (k < 1) countRaf = requestAnimationFrame(step);
  };
  countRaf = requestAnimationFrame(step);
}
function renderPlant() {
  const r = tronMath();
  const on = { Mine: PLANT.mine, PP: PLANT.pp, Tower: PLANT.tower > 0 };
  const out = { Mine: r.m, PP: r.p, Tower: r.t };
  for (const k of ['Mine', 'PP', 'Tower']) {
    $('#w' + k).classList.toggle('live', on[k]); $('#f' + k).classList.toggle('live', on[k]);
    const o = $('#o' + k); o.textContent = on[k] ? '+' + out[k] : '+0'; o.classList.toggle('live', on[k]);
  }
  const any = r.total > 0;
  $('#wBus').classList.toggle('live', any); $('#fBus').classList.toggle('live', any); $('#nBus').classList.toggle('live', any);
  $$('.land').forEach(b => {
    const l = b.dataset.l, live = l === 'tower' ? PLANT.tower > 0 : PLANT[l];
    b.classList.toggle('off', !live); b.setAttribute('aria-pressed', String(live));
  });
  $$('.land[data-l=tower] .ghost').forEach(g => {
    const n = +g.dataset.g, vis = PLANT.tower > n;
    g.style.opacity = vis ? 1 : 0; g.style.transform = vis ? `translate(${n * 14}px,${-n * 12}px)` : 'none';
  });
  $$('.towers button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.t === PLANT.tower)));
  $('#meter').classList.toggle('cold', !any);
  const g = Math.min(r.total, 13);
  $('#gNeedle').style.transform = `rotate(${-90 + 180 * g / 13}deg)`;
  $('#gFill').style.strokeDasharray = `${g} 13`;
  $('#top').classList.toggle('tron', r.tron);
  if (r.tron && !wasTron && !REDUCED) { const sp = $('#spark'); sp.classList.remove('strike'); sp.getBBox(); sp.classList.add('strike'); }
  wasTron = r.tron;
  countTo(r.total);
  const parts = [PLANT.mine && r.m, PLANT.pp && r.p, ...Array(PLANT.tower).fill(r.tron ? 3 : 1)].filter(Boolean);
  $('#mEq').textContent = any ? parts.join(' + ') + (parts.length > 1 ? ' = ' + r.total : '') : 'no Urza lands';
  let s;
  if (!any) s = 'Tap a land to put it into play.';
  else if (!r.tron) s = 'Without all three pieces, every Urza land taps for one colourless.';
  else if (PLANT.tower === 1) s = 'Tron is online: seven mana from three lands, on turn three at the earliest.';
  else if (PLANT.tower === 2) s = 'A second Tower adds three more: ten mana.';
  else s = 'Three Towers: thirteen mana, and Unwind untapping them is worth nine. That powers <a href="#lines" data-scene="infinite">the infinite</a>.';
  $('#mStatus').innerHTML = s;
}
$$('.land').forEach(b => b.addEventListener('click', () => {
  const l = b.dataset.l;
  if (l === 'tower') { if (PLANT.tower) { PLANT.lastTower = PLANT.tower; PLANT.tower = 0; } else PLANT.tower = PLANT.lastTower; }
  else PLANT[l] = !PLANT[l];
  renderPlant();
}));
$$('.towers button').forEach(b => b.addEventListener('click', () => { PLANT.tower = PLANT.lastTower = +b.dataset.t; renderPlant(); }));
function plantIntro() {
  if (REDUCED) { Object.assign(PLANT, { mine: true, pp: true, tower: 1 }); renderPlant(); return; }
  renderPlant();
  setTimeout(() => { PLANT.mine = true; renderPlant(); }, 450);
  setTimeout(() => { PLANT.pp = true; renderPlant(); }, 1000);
  setTimeout(() => { PLANT.tower = 1; renderPlant(); }, 1550);
}

/* ---------- game plan ---------- */
const PLAN = [
  { t: 'Assemble', h: 'Turns 1–3', cards: ['Expedition Map', 'Crop Rotation', 'Prophetic Prism', 'Impulse'], p: 'Find the missing Urza land with Expedition Map or Crop Rotation while Prophetic Prism and Impulse replace themselves and fix your colours.' },
  { t: 'Survive', h: 'Turns 2–5', cards: ["Moment's Peace", 'Prohibit', 'Cast Down', 'Breath Weapon'], p: 'Fogs and Breath Weapon blunt creature decks, Prohibit counters cheap threats and Cast Down kills the one that matters.' },
  { t: 'Grind', h: 'Tron online', cards: ['Mnemonic Wall', 'Ghostly Flicker', 'Mulldrifter', 'Mystical Teachings'], p: 'Seven mana a turn: Ghostly Flicker on Mnemonic Wall rebuys your best spell every turn while Mulldrifter and Prism blinks bury them in cards.' },
  { t: 'Close', h: 'Once it\'s safe', cards: ['Murmuring Mystic', 'Stonehorn Dignitary', 'Rolling Thunder', 'Weather the Storm'], p: 'Mystic turns every spell into a flying Bird, Stonehorn plus a Wall loop takes away their combat, and Rolling Thunder finishes. With three Towers, the infinite ends it on the spot.' }
];
$('#phases').innerHTML = PLAN.map(ph => `<div class="phase"><h3>${ph.t}<small>${ph.h}</small></h3><div class="fan">${ph.cards.map((c, i) => {
  const n = ph.cards.length, off = i - (n - 1) / 2;
  return tile(c).replace('class="ct ', `style="transform:translateX(${14 + i * 40}px) rotate(${off * 5}deg);z-index:${i}" class="ct `);
}).join('')}</div><p>${rich(ph.p)}</p></div>`).join('');

/* ---------- finding Tron ---------- */
const FINDERS = [
  ['Expedition Map', '{2}, tap, sacrifice', 'Any land to your hand: the missing Tron piece, Bojuka Bog or a coloured land.'],
  ['Crop Rotation', '{G}, sacrifice a land · instant', 'Any land straight onto the battlefield, untapped. Turns a spare land into the third piece, or dodges land destruction.'],
  ['Impulse', '{1}{U} · instant', 'Look at the top four and keep one.'],
  ["Giant's Boulder", '{1} · scry 2', 'Sets up your next two draws, then filters colour for {1}.'],
  ['Pulse of Murasa', '{2}{G} · instant', 'Returns a land or creature card from a graveyard, plus 6 life. Rebuys a destroyed Urza land.'],
  ['Call Damage Control', '{1}{G} · sorcery', 'Returns a land and a creature (or artifact) from your graveyard: an Urza land and a Wall.'],
  ['Lórien Revealed', 'islandcycling {1}', 'Finds Island or Tangled Islet early. Late, it draws three.'],
  ['Generous Ent', 'forestcycling {1}', 'Finds Forest or Tangled Islet: green for Crop Rotation.'],
  ['Conduit Pylons', 'land · surveil 1', 'Bins a dead top card when it enters, taps for {C} or filters for {1}.'],
  ['Remote Isle', 'land · cycling {2}', 'Blue source early, a fresh card once you have the lands you need.']
];
$('#finders').innerHTML = FINDERS.map(([n, cost, t]) => `<div class="frow">${tile(n, { qty: MAIN[n] })}<div><h3>${esc(n)}</h3><div class="cost">${ms(cost)}</div><p class="ann">${rich(t)}</p></div></div>`).join('');
const FILTERS = [
  ['Prophetic Prism', '{1}, tap', 'Draws a card when it enters. Once per turn.'],
  ['Energy Refractor', '{2}', 'No tap: use it as often as you can pay. The infinite runs through it.'],
  ["Giant's Boulder", '{1}, tap', 'Scry 2 on entry. Late: {7}, tap, sacrifice to destroy any permanent.'],
  ["Bonder's Ornament", 'tap', 'Free. Late: {4}, tap to draw a card.'],
  ['Conduit Pylons', '{1}, tap', 'A land, so it costs no spell slot.']
];
$('#filters').innerHTML = `<thead><tr><th>Card</th><th>Copies</th><th>One coloured mana</th><th>Also</th></tr></thead><tbody>${FILTERS.map(([n, c, t]) => `<tr><td>${mention(n)}</td><td class="n">${MAIN[n]}</td><td>${ms(c)}</td><td>${rich(t)}</td></tr>`).join('')}</tbody>`;
const PIPS = [
  ['U', '<b>Base colour.</b> Ghostly Flicker, Mnemonic Wall, Mulldrifter, Impulse and the counters. Island ×2, Remote Isle and Tangled Islet tap for it.'],
  ['G', '[[Crop Rotation]], [[Moment\'s Peace]], [[Weather the Storm]], [[Pulse of Murasa]], [[Call Damage Control]] and [[Generous Ent]]. Forest and Tangled Islet tap for it.'],
  ['W', '[[Ephemerate]] and [[Stonehorn Dignitary]]. Filters only.'],
  ['B', '[[Cast Down]] and [[Mystical Teachings]]\' flashback. [[Bojuka Bog]] taps for it.'],
  ['R', '[[Breath Weapon]] and [[Rolling Thunder]] <span class="nw">({R}{R})</span>, plus Pyroblast, Ancient Grudge and Vandalblast after sideboarding. Filters only.']
];
$('#pips').innerHTML = PIPS.map(([c, t]) => `<div>${ms('{' + c + '}')}<span>${rich(t)}</span></div>`).join('');

/* ---------- sample hand ---------- */
const TRON = ["Urza's Mine", "Urza's Power Plant", "Urza's Tower"];
const FINDER = new Set(['Expedition Map', 'Crop Rotation']);
const LIB60 = Object.entries(MAIN).flatMap(([n, c]) => Array(c).fill(n));
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
function judge(cards) {
  const pieces = TRON.filter(t => cards.includes(t));
  const finders = cards.filter(c => FINDER.has(c)).length;
  const lands = cards.filter(isLand).length;
  const v = pieces.length === 3 ? 'tron' : pieces.length === 2 && finders ? 'two' : 'mull';
  return { pieces, finders, lands, v };
}
const SH = { hand: [], mulls: 0, bottom: new Set() };
const shRow = $('#shRow');
shRow.innerHTML = Array.from({ length: 7 }, () => '<div class="slot"><div class="back"></div><div class="role">&nbsp;</div></div>').join('');
function drawHand(reset) {
  if (reset) SH.mulls = 0;
  SH.hand = shuffle(LIB60).slice(0, 7); SH.bottom = new Set();
  renderHand(true);
}
function renderHand(deal) {
  const need = SH.mulls, picking = SH.bottom.size < need;
  shRow.innerHTML = SH.hand.map((n, i) => {
    const b = SH.bottom.has(i), tron = TRON.includes(n), f = FINDER.has(n);
    const role = b ? 'Bottom' : tron ? 'Tron piece' : f ? 'Finder' : isLand(n) ? 'Land' : '';
    const cls = b ? 'bottom' : tron || f ? 'tron' : '';
    return `<button class="slot ${need ? 'pick' : ''} ${b ? 'bottomed' : ''} ${deal ? 'deal' : ''}" data-i="${i}" data-card="${esc(n)}" ${need ? `aria-pressed="${b}"` : 'tabindex="-1"'} aria-label="${esc(n)}${need ? (b ? ', on the bottom' : '') : ''}"><img src="${src(n)}" alt="" style="animation-delay:${deal ? i * 70 : 0}ms"><div class="role ${cls}">${role || '&nbsp;'}</div></button>`;
  }).join('');
  const kept = SH.hand.filter((_, i) => !SH.bottom.has(i));
  const j = judge(kept);
  $$('#shLamps span').forEach(s => s.classList.toggle('lit', j.pieces.includes(s.dataset.t)));
  $('#shFind').classList.toggle('ok', j.finders > 0); $('#shFind .num').textContent = j.finders;
  $('#shLands').classList.toggle('ok', j.lands >= 2); $('#shLands .num').textContent = j.lands;
  const vd = $('#shVerdict');
  let text, cls;
  if (picking) { cls = ''; text = `<b>Mulligan to ${7 - need}</b> &nbsp;Tap ${need - SH.bottom.size} more card${need - SH.bottom.size > 1 ? 's' : ''} to put on the bottom.`; }
  else if (j.v === 'tron') { cls = 'keep'; text = '<b>Keep</b> &nbsp;All three Tron pieces.'; }
  else if (j.v === 'two') { cls = 'keep'; text = `<b>Keep</b> &nbsp;Two pieces and ${j.finders > 1 ? 'two ways' : 'a way'} to find the third.`; }
  else { cls = 'mull'; text = `<b>Mulligan</b> &nbsp;${j.pieces.length === 2 ? 'Two pieces but no Expedition Map or Crop Rotation.' : j.pieces.length === 1 ? 'Only one Tron piece.' : 'No Tron pieces.'} The guide says mulligan hard for Tron.`; }
  vd.className = 'verdict ' + cls;
  vd.innerHTML = `<svg class="i"><use href="#i-${cls === 'mull' ? 'x' : cls === 'keep' ? 'check' : 'node'}"/></svg><span>${text}</span>`;
  $('#shMull').disabled = SH.mulls >= 5;
}
shRow.addEventListener('click', e => {
  const b = e.target.closest('.slot.pick'); if (!b) return;
  e.stopPropagation();
  const i = +b.dataset.i;
  if (SH.bottom.has(i)) SH.bottom.delete(i); else if (SH.bottom.size < SH.mulls) SH.bottom.add(i);
  renderHand(false);
});
$('#shDraw').onclick = () => drawHand(true);
$('#shMull').onclick = () => { SH.mulls++; drawHand(false); };
(function odds() {
  const N = 20000; let k = 0;
  for (let i = 0; i < N; i++) if (judge(shuffle(LIB60).slice(0, 7)).v !== 'mull') k++;
  const p = k / N, two = 1 - (1 - p) ** 2, three = 1 - (1 - p) ** 3;
  $('#shOdds').innerHTML = `Over ${N.toLocaleString('en')} simulated shuffles of this 60, <b>${Math.round(p * 100)}%</b> of opening sevens meet the keep rule. Every London mulligan draws a fresh seven, so you find a keep by your first mulligan ${Math.round(two * 100)}% of the time and by your second ${Math.round(three * 100)}%.`;
})();

/* ---------- lines player ---------- */
const LAYOUTS = {
  wide: { w: 1180, h: 672, cw: 100, ch: 140, z: {
    opp: { x: 0, y: 0, w: 1180, h: 52, kind: 'opp', label: 'Opponent' },
    lib: { x: 0, y: 80, w: 132, h: 172, kind: 'pile', label: 'Library' },
    gy: { x: 0, y: 280, w: 132, h: 360, kind: 'col', label: 'Graveyard' },
    bf: { x: 156, y: 80, w: 840, h: 172, kind: 'row', label: 'Battlefield' },
    lands: { x: 156, y: 280, w: 840, h: 160, kind: 'row', label: 'Lands', s: .86 },
    hand: { x: 156, y: 468, w: 840, h: 172, kind: 'row', label: 'Hand' },
    stack: { x: 1020, y: 80, w: 160, h: 360, kind: 'col', label: 'Stack' },
    ex: { x: 1020, y: 468, w: 160, h: 172, kind: 'fan', label: 'Exile' } } },
  tall: { w: 600, h: 962, cw: 84, ch: 118, z: {
    opp: { x: 0, y: 0, w: 600, h: 48, kind: 'opp', label: 'Opponent' },
    bf: { x: 0, y: 74, w: 600, h: 150, kind: 'row', label: 'Battlefield' },
    lands: { x: 0, y: 248, w: 600, h: 136, kind: 'row', label: 'Lands', s: .86 },
    stack: { x: 0, y: 408, w: 600, h: 150, kind: 'row', label: 'Stack' },
    hand: { x: 0, y: 582, w: 600, h: 150, kind: 'row', label: 'Hand' },
    lib: { x: 0, y: 768, w: 128, h: 162, kind: 'pile', label: 'Library' },
    gy: { x: 146, y: 768, w: 292, h: 162, kind: 'row', label: 'Graveyard' },
    ex: { x: 456, y: 768, w: 144, h: 162, kind: 'fan', label: 'Exile' } } }
};
const ZONES = ['lib', 'hand', 'bf', 'lands', 'stack', 'gy', 'ex', 'opp'];
const stage = $('#stage'), stageWrap = $('#stageWrap');
let L = null, scene = null, states = [], cur = 0, playing = false, timer = 0, speed = 1, elById = {}, prevVis = {};

function buildStates(sc) {
  const z = {}; ZONES.forEach(k => z[k] = (sc.start[k] || []).slice());
  let tapped = new Set(), hud = Object.assign({}, sc.hud0);
  const out = [];
  for (const st of sc.steps) {
    for (const [id, to] of st.mv || []) { ZONES.forEach(k => { const i = z[k].indexOf(id); if (i >= 0) z[k].splice(i, 1); }); z[to].push(id); }
    (st.tap || []).forEach(id => tapped.add(id)); (st.untap || []).forEach(id => tapped.delete(id));
    ZONES.forEach(k => { if (k !== 'lands' && k !== 'bf') z[k].forEach(id => tapped.delete(id)); });
    const prev = out.length ? out[out.length - 1].hud : hud;
    hud = Object.assign({}, hud, st.hud || {});
    out.push({ z: Object.fromEntries(ZONES.map(k => [k, z[k].slice()])), tapped: new Set(tapped), hud, changed: Object.keys(st.hud || {}).filter(k => String(st.hud[k]) !== String(prev[k])), st });
  }
  return out;
}
function slot(zone, i, n) {
  const zd = L.z[zone], s = zd.s || 1, cw = L.cw * s, ch = L.ch * s, pad = 14;
  let x = zd.x + pad, y = zd.y + (zd.h - ch) / 2;
  if (zd.kind === 'row') {
    const step = n > 1 ? Math.min(Math.max(cw, ch) + 12, (zd.w - pad * 2 - cw) / (n - 1)) : 0;
    x = zd.x + pad + (Math.max(ch - cw, 0) / 2) * (zone === 'lands' ? 1 : 0) + i * step;
  } else if (zd.kind === 'col') {
    const step = n > 1 ? Math.min(46, (zd.h - pad * 2 - ch) / (n - 1)) : 0;
    x = zd.x + (zd.w - cw) / 2; y = zd.y + pad + i * step;
  } else if (zd.kind === 'pile') {
    x = zd.x + (zd.w - cw) / 2 + Math.min(i, 5) * 2; y = zd.y + (zd.h - ch) / 2 - Math.min(i, 5) * 2;
  } else if (zd.kind === 'fan') {
    const step = n > 1 ? Math.min(30, (zd.w - pad * 2 - cw) / (n - 1)) : 0;
    x = zd.x + pad + i * step;
  } else if (zd.kind === 'opp') {
    const s2 = .3; return { x: zd.x + zd.w - 70 - i * 44, y: zd.y + (zd.h - L.ch * s2) / 2, s: s2 };
  }
  return { x, y, s };
}
function buildStage() {
  stage.innerHTML = ''; elById = {}; prevVis = {};
  stage.style.width = L.w + 'px'; stage.style.height = L.h + 'px';
  for (const [k, zd] of Object.entries(L.z)) {
    const d = document.createElement('div');
    d.className = 'zn ' + k + (k === 'opp' && !scene.opp && !scene.steps.some(s => s.opp) ? ' idle' : '');
    Object.assign(d.style, { left: zd.x + 'px', top: zd.y + 'px', width: zd.w + 'px', height: zd.h + 'px' });
    d.innerHTML = `<b>${zd.label}</b>` + (k === 'opp' ? '<span class="ost" id="ost"></span>' : '');
    stage.appendChild(d);
  }
  for (const [id, n] of Object.entries(scene.cards)) {
    const e = document.createElement('div');
    e.className = 'sc' + ((scene.opp || []).includes(id) ? ' opp' : '');
    e.dataset.card = n; e.style.width = L.cw + 'px'; e.style.height = L.ch + 'px'; e.style.opacity = 0;
    e.innerHTML = `<div class="face"><img src="${src(n)}" alt="${esc(n)}" draggable="false"><div class="back"></div></div><span class="bdg"></span>`;
    stage.appendChild(e); elById[id] = e;
  }
  fitStage();
}
function fitStage() {
  const want = stageWrap.clientWidth < 700 ? LAYOUTS.tall : LAYOUTS.wide;
  if (want !== L) { L = want; if (scene) { buildStage(); render(cur, true); } return; }
  const k = stageWrap.clientWidth / L.w;
  stage.style.transform = `scale(${k})`; stageWrap.style.height = L.h * k + 12 + 'px';
}
function render(i, instant) {
  cur = i; const S = states[i], st = S.st;
  const where = {};
  ZONES.forEach(k => S.z[k].forEach((id, j) => where[id] = { k, j, n: S.z[k].length }));
  for (const [id, e] of Object.entries(elById)) {
    const w = where[id];
    if (!w) { e.style.opacity = 0; prevVis[id] = false; continue; }
    const p = slot(w.k, w.j, w.n);
    const spawn = !prevVis[id] && w.k !== 'lib' && !instant && i > 0 && !Object.values(states[i - 1].z).some(a => a.includes(id));
    if (spawn || instant) { e.style.transition = 'none'; }
    e.style.transform = `translate(${p.x}px,${p.y}px) scale(${p.s})`;
    e.style.zIndex = (w.k === 'stack' || w.k === 'ex' ? 300 : w.k === 'hand' ? 200 : 100) + w.j;
    if (spawn || instant) { e.offsetWidth; e.style.transition = ''; }
    e.style.opacity = 1; prevVis[id] = true;
    e.classList.toggle('down', w.k === 'lib');
    e.classList.toggle('tap', S.tapped.has(id));
    e.classList.toggle('hot', (st.hot || []).includes(id));
    const b = e.querySelector('.bdg'), bt = (st.bd || {})[id];
    b.textContent = bt || ''; b.classList.toggle('show', !!bt);
  }
  const ost = $('#ost'); if (ost) { ost.textContent = st.opp || ''; ost.classList.toggle('hot', !!st.opp); }
  $('#hud').innerHTML = scene.hud.map(([k, label]) => {
    const v = S.hud[k];
    const bar = k === 'mana' ? `<span class="bar"><b style="width:${v === '∞' ? 100 : Math.min(100, (+v || 0) / scene.manaMax * 100)}%"></b></span>` : '';
    return `<div class="rd ${S.changed.includes(k) ? 'chg' : ''}"><span class="num">${v == null ? '–' : v}</span><span class="unit">${label}</span>${bar}</div>`;
  }).join('');
  const plate = $('#plate'), kind = st.k || '';
  plate.className = 'plate ' + kind;
  plate.textContent = kind === 'setup' ? 'Setup' : kind === 'loop' ? 'Loop' : `Step ${i}/${states.length - 1}`;
  $('#caption').innerHTML = rich(st.c);
  $$('#ticks button').forEach((t, j) => { t.classList.toggle('now', j === i); t.classList.toggle('done', j < i); t.setAttribute('aria-current', j === i ? 'step' : 'false'); });
  $('#cPrev').disabled = i === 0; $('#cNext').disabled = i === states.length - 1;
}
function setPlaying(p) {
  playing = p; clearTimeout(timer);
  const b = $('#cPlay');
  b.querySelector('use').setAttribute('href', p ? '#i-pause' : '#i-play');
  b.querySelector('span').textContent = p ? 'Pause' : cur === states.length - 1 ? 'Replay' : 'Play';
  if (p) tick();
}
function tick() {
  timer = setTimeout(() => {
    if (cur < states.length - 1) { render(cur + 1); if (cur === states.length - 1) setPlaying(false); else tick(); }
    else setPlaying(false);
  }, 2700 / speed);
}
function go(i) { if (i < 0 || i >= states.length) return; setPlaying(false); render(i); }
function load(id, autoplay) {
  scene = SCENES.find(s => s.id === id) || SCENES[0];
  states = buildStates(scene);
  scene.manaMax = Math.max(1, ...states.map(s => +s.hud.mana).filter(Number.isFinite));
  $$('.citem').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === scene.id)));
  $('#ctitle').textContent = scene.title;
  const TAGS = { owner: 'Owner', pb: 'PauperBrews', derived: 'Derived' };
  $('#csrc').innerHTML = scene.src.map(s => `<span class="tag ${s}">${TAGS[s]}</span>`).join('');
  $('#creq').innerHTML = scene.req.map(t => `<li>${rich(t)}</li>`).join('');
  $('#cres').innerHTML = scene.res.map(t => `<li>${rich(t)}</li>`).join('');
  $('#cfind').innerHTML = rich(scene.find);
  $('#ticks').innerHTML = scene.steps.map((st, j) => `<button class="${st.k || ''}" aria-label="Step ${j}"></button>`).join('');
  $$('#ticks button').forEach((b, j) => b.onclick = () => go(j));
  setPlaying(false);
  if (!L) L = stageWrap.clientWidth < 700 ? LAYOUTS.tall : LAYOUTS.wide;
  buildStage(); render(0, true);
  if (autoplay) setTimeout(() => setPlaying(true), 400);
}
(function picker() {
  const groups = {};
  SCENES.forEach(s => (groups[s.group] = groups[s.group] || []).push(s));
  $('#pick').innerHTML = Object.entries(groups).map(([g, list]) => `<div class="grp" role="group" aria-label="${g}"><h3>${g}</h3>${list.map(s =>
    `<button class="citem" data-id="${s.id}" aria-pressed="false"><span class="thumbs">${s.pieces.slice(0, 4).map(n => `<img src="${art(n)}" alt="">`).join('')}</span><span><span class="tt">${esc(s.title)}</span><span class="st">${esc(s.sub)}</span></span></button>`).join('')}</div>`).join('');
  $$('.citem').forEach(b => b.onclick = () => load(b.dataset.id));
})();
$('#cPlay').onclick = () => { if (!playing && cur === states.length - 1) render(0); setPlaying(!playing); };
$('#cPrev').onclick = () => go(cur - 1);
$('#cNext').onclick = () => go(cur + 1);
$('#cRestart').onclick = () => go(0);
$('#cSpeed').onchange = e => { speed = +e.target.value; stage.style.setProperty('--spd', speed); if (playing) { clearTimeout(timer); tick(); } };
let linesVisible = false;
new IntersectionObserver(es => es.forEach(e => linesVisible = e.isIntersecting), { threshold: 0.25 }).observe(stageWrap);
document.addEventListener('keydown', e => {
  if (!linesVisible || e.altKey || e.ctrlKey || e.metaKey) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (['input', 'select', 'textarea'].includes(tag)) return;
  if (e.key === ' ' && !['button', 'a'].includes(tag)) { e.preventDefault(); $('#cPlay').click(); }
  else if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-scene]'); if (!a) return;
  load(a.dataset.scene, !REDUCED);
});
let rz = 0; addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(fitStage); });

/* ---------- card roles ---------- */
const ROLES = [
  { id: 'tron', name: 'Tron & lands', d: '19 lands: twelve Urza pieces, blue and green sources, Bojuka Bog for graveyards.', cards: ["Urza's Mine", "Urza's Power Plant", "Urza's Tower", 'Island', 'Forest', 'Tangled Islet', 'Remote Isle', 'Conduit Pylons', 'Bojuka Bog'] },
  { id: 'fix', name: 'Find & fix', d: 'Cards that find the missing piece or turn colourless mana into the colours your spells need.', cards: ['Expedition Map', 'Crop Rotation', 'Prophetic Prism', 'Energy Refractor', "Giant's Boulder", "Bonder's Ornament"] },
  { id: 'engine', name: 'Engine', d: 'Blink and recursion: everything that makes one card do its job again and again.', cards: ['Mnemonic Wall', 'Ghostly Flicker', 'Ephemerate', 'Mulldrifter', 'Call Damage Control', 'Pulse of Murasa'] },
  { id: 'flow', name: 'Card flow', d: 'Digging for Tron early and for the right answer late.', cards: ['Impulse', 'Lórien Revealed', 'Mystical Teachings', 'Generous Ent'] },
  { id: 'defence', name: 'Defence', d: 'Fogs, counters and removal that keep you alive until the engine takes over. Weather the Storm and Unwind are also infinite pieces.', cards: ["Moment's Peace", 'Weather the Storm', 'Prohibit', 'Unwind', 'Cast Down', 'Breath Weapon', 'Stonehorn Dignitary'] },
  { id: 'win', name: 'Win conditions', d: 'Mystic\'s Birds are the usual win. Rolling Thunder finishes, or deals unlimited damage after the infinite. Mulldrifter beats down when nothing else is needed.', cards: ['Murmuring Mystic', 'Rolling Thunder'] }
];
(function checkRoles() {
  const listed = new Set(ROLES.flatMap(r => r.cards));
  const missing = Object.keys(MAIN).filter(n => !listed.has(n));
  if (missing.length) console.warn('Main-deck cards without a role:', missing);
})();
function showRole(id) {
  const r = ROLES.find(x => x.id === id);
  $$('#rtabs button').forEach(b => { const on = b.dataset.id === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
  const total = r.cards.reduce((a, n) => a + MAIN[n], 0);
  $('#rdesc').innerHTML = `${rich(r.d)} <b>${total} card${total > 1 ? 's' : ''}.</b>`;
  $('#rgrid').innerHTML = r.cards.map(n => tile(n, { qty: MAIN[n], note: NOTES[n] })).join('');
}
$('#rtabs').innerHTML = ROLES.map(r => `<button role="tab" data-id="${r.id}" aria-selected="false">${r.name}</button>`).join('');
$$('#rtabs button').forEach(b => b.onclick = () => showRole(b.dataset.id));
tabKeys('#rtabs');
showRole('engine');

function tabKeys(sel) {
  $(sel).addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const bs = $$(sel + ' button'), i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
    n.focus(); n.click(); e.preventDefault();
  });
}

/* ---------- vs PauperBrews ---------- */
(function diff() {
  const delta = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].map(n => [n, (a[n] || 0) - (b[n] || 0)]).filter(([, d]) => d);
  const dm = delta(MAIN, PB_MAIN), ds = delta(SIDE, PB_SIDE);
  const block = (title, list) => {
    const add = list.filter(([, d]) => d > 0).sort((a, b) => b[1] - a[1]), cut = list.filter(([, d]) => d < 0).sort((a, b) => a[1] - b[1]);
    const row = ([n, d]) => `<tr class="${d < 0 ? 'cut' : 'add'}" data-card="${esc(n)}"><td class="d">${d > 0 ? '+' : minus}${Math.abs(d)}</td><td><span class="nm">${esc(n)}</span><span class="nt">${rich(NOTES[n] || '')}</span></td></tr>`;
    const sum = a => a.reduce((t, [, d]) => t + Math.abs(d), 0);
    return `<div><h3>${title}<span class="num">+${sum(add)}</span><span class="num cut">${minus}${sum(cut)}</span></h3><table class="rev"><tbody>${add.map(row).join('')}${cut.map(row).join('')}</tbody></table></div>`;
  };
  $('#diff').innerHTML = block('Main deck', dm) + block('Sideboard', ds);
})();

/* ---------- sideboard ---------- */
const MATCHUPS = [
  { id: 'red', name: 'Mono-Red', in: { Hydroblast: 3, 'Weather the Storm': 2, 'Breath Weapon': 1 }, out: { "Bonder's Ornament": 1, 'Lórien Revealed': 1, 'Call Damage Control': 1, 'Mystical Teachings': 1, "Giant's Boulder": 1, Impulse: 1 },
    plan: ['Survive first, the engine wins later.', 'Hydroblast answers a burn spell or a red creature for one mana. With three Weather the Storm, casting one after two other spells gains 9. Prohibit counters almost every burn spell, and Moment\'s Peace and Stonehorn cover the creature turns.', 'Cut the slow draw and the spare fixing; keep every land. Generous Ent stays as a 5/7 reach blocker with a Food.'] },
  { id: 'affinity', name: 'Grixis Affinity', in: { Pyroblast: 3, 'Ancient Grudge': 1, Vandalblast: 1, 'Dinrova Horror': 1 }, out: { 'Weather the Storm': 1, "Moment's Peace": 1, 'Lórien Revealed': 1, 'Generous Ent': 1, 'Call Damage Control': 1, "Bonder's Ornament": 1 },
    plan: ['Their engine is artifacts and blue cards, and you have answers for both.', 'Vandalblast overloaded for {4}{R} destroys every artifact they control; Ancient Grudge hits twice. Pyroblast counters their blue spells and kills blue threats. Dinrova Horror on a Flicker loop bounces a permanent and strips a card every turn (PauperBrews brings it in here too).', 'Breath Weapon and Rolling Thunder stay for their small creatures.'] },
  { id: 'faeries', name: 'Dimir Faeries', in: { Pyroblast: 3, 'Mystic Remora': 1, 'Breath Weapon': 1 }, out: { "Moment's Peace": 2, 'Generous Ent': 1, "Bonder's Ornament": 1, 'Lórien Revealed': 1 },
    plan: ['Small flyers backed by counterspells: win the counter war, then sweep.', 'Pyroblast counters their counters and kills their blue creatures. Two Breath Weapons kill the x/1 and x/2 faeries. Mystic Remora early punishes every cantrip.', 'Fogs are weak against a tempo clock. Unwind counters their noncreature spells and refunds your mana.'] },
  { id: 'terror', name: 'Dimir Terror', in: { Pyroblast: 3, 'Mystic Remora': 1 }, out: { 'Breath Weapon': 1, "Bonder's Ornament": 1, 'Generous Ent': 1, "Moment's Peace": 1 },
    plan: ['Pyroblast is non-negotiable here (PauperBrews).', 'Bojuka Bog slows their delve threats: find it with Expedition Map, sacrifice it to Crop Rotation, and bring it back with Pulse of Murasa or Call Damage Control for another graveyard wipe. Stonehorn buys turns.', 'Cast Down kills Tolarian Terror if you can also pay its ward {2}. Breath Weapon doesn\'t touch a 5/5.'] },
  { id: 'wide', name: 'Elves & go-wide', in: { 'Breath Weapon': 1, Tangle: 1, "Moment's Peace": 1 }, out: { "Bonder's Ornament": 1, 'Lórien Revealed': 1, 'Call Damage Control': 1 },
    plan: ['Clear the board, then take combat away.', 'Two Breath Weapons and Rolling Thunder handle a wide board. Tangle and three Moment\'s Peace buy turns (Tangle keeps their attackers tapped too). A Stonehorn loop ends their combat steps for good.', 'Blasts and Remora stay in the sideboard.'] },
  { id: 'mirror', name: 'Blue control & mirror', in: { Pyroblast: 3, 'Mystic Remora': 1, 'Dinrova Horror': 1, Vandalblast: 1 }, out: { 'Breath Weapon': 1, "Moment's Peace": 2, 'Stonehorn Dignitary': 1, 'Generous Ent': 1, 'Cast Down': 1 },
    plan: ['Long games decided by card advantage and counters.', 'Pyroblast wins counter wars and kills their Walls and Mulldrifters. Mystic Remora on turn one taxes every cantrip. Dinrova Horror with Ghostly Flicker and a Wall bounces and discards every turn.', 'In the mirror, Vandalblast overloaded hits their Prisms, Maps and Refractors, and Bojuka Bog empties the graveyard their Walls feed on.'] }
];
(function checkMatchups() {
  for (const m of MATCHUPS) {
    const i = Object.values(m.in).reduce((a, b) => a + b, 0), o = Object.values(m.out).reduce((a, b) => a + b, 0);
    if (i !== o) console.warn(m.name, 'in/out mismatch', i, o);
    for (const [n, c] of Object.entries(m.in)) if ((SIDE[n] || 0) < c) console.warn(m.name, 'not enough in sideboard:', n);
    for (const [n, c] of Object.entries(m.out)) if ((MAIN[n] || 0) < c) console.warn(m.name, 'not enough in main:', n);
  }
})();
function showMatchup(id) {
  const m = MATCHUPS.find(x => x.id === id);
  $$('#mtabs button').forEach(b => { const on = b.dataset.id === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
  const n = Object.values(m.in).reduce((a, b) => a + b, 0);
  const grid = (o, sign) => `<div class="cardgrid">${Object.entries(o).map(([c, q]) => tile(c, { qty: q, sign, faded: sign === 'minus' })).join('')}</div>`;
  $('#mu').innerHTML = `<div class="io"><div><h3 class="sum in">In <span class="num">+${n}</span></h3>${grid(m.in, 'plus')}</div><div><h3 class="sum out">Out <span class="num">${minus}${n}</span></h3>${grid(m.out, 'minus')}</div></div><div class="plan">${m.plan.map(p => `<p>${rich(p)}</p>`).join('')}</div>`;
}
$('#mtabs').innerHTML = MATCHUPS.map(m => `<button role="tab" data-id="${m.id}" aria-selected="false">${m.name}</button>`).join('');
$$('#mtabs button').forEach(b => b.onclick = () => showMatchup(b.dataset.id));
tabKeys('#mtabs');
showMatchup('red');
$('#sgrid').innerHTML = Object.entries(SIDE).map(([n, q]) => tile(n, { qty: q, note: NOTES[n] })).join('');

/* ---------- decklist ---------- */
const GROUPS = [['Creatures', /Creature/], ['Instants', /Instant/], ['Sorceries', /Sorcery/], ['Artifacts', /Artifact/], ['Lands', /Land/]];
(function decklist() {
  const g = {}; GROUPS.forEach(([k]) => g[k] = []);
  for (const n of Object.keys(MAIN)) { const t = rec(n).type; const k = (GROUPS.find(([, re]) => re.test(t)) || GROUPS[4])[0]; g[k].push(n); }
  const byCmc = (a, b) => rec(a).cmc - rec(b).cmc || a.localeCompare(b);
  let no = 0;
  const row = (n, q) => `<tr data-card="${esc(n)}"><td class="no">${String(++no).padStart(2, '0')}</td><td class="q">${q}</td><td class="p">${esc(n)}</td><td class="t">${esc(rec(n).type.split(' — ')[0])}</td><td class="c">${ms(rec(n).cost || '')}</td></tr>`;
  const head = '<thead><tr><th class="no">No.</th><th>Qty</th><th>Part</th><th class="t">Type</th><th class="c"></th></tr></thead>';
  const grp = (title, names, counts) => `<tr class="grp"><td colspan="5">${title}<span>${names.reduce((a, n) => a + counts[n], 0)}</span></td></tr>` + names.sort(byCmc).map(n => row(n, counts[n])).join('');
  $('#decklist').innerHTML =
    `<table class="parts"><caption>Main deck<span class="num">60</span></caption>${head}<tbody>${GROUPS.map(([k]) => grp(k, g[k], MAIN)).join('')}</tbody></table>` +
    `<table class="parts"><caption>Sideboard<span class="num">15</span></caption>${head}<tbody>${Object.keys(SIDE).sort(byCmc).map(n => row(n, SIDE[n])).join('')}</tbody></table>`;
  const text = Object.entries(MAIN).map(([n, c]) => `${c} ${n}`).join('\n') + '\n\n' + Object.entries(SIDE).map(([n, c]) => `${c} ${n}`).join('\n') + '\n';
  $('#copyList').onclick = async () => {
    const msg = $('#copyMsg');
    try { await navigator.clipboard.writeText(text); msg.textContent = 'Copied 60 + 15'; }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); msg.textContent = ok ? 'Copied 60 + 15' : 'Copy blocked: use Moxfield';
    }
    setTimeout(() => msg.textContent = '', 3200);
  };
})();

/* ---------- boot ---------- */
load(SCENES[0].id);
plantIntro();
spy();
