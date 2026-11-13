/* Animated lines for the FlickerTron primer.
   Each scene: cards (id -> card name), start zones, starting HUD, then steps as deltas:
   mv: [[id, zone]] moves (appends to zone), tap/untap: [ids], hud: {key: value},
   hot: [ids] highlighted this step, bd: {id: badge} badges this step, opp: opponent status text,
   k: 'setup' | 'loop' | 'final'. Zones: lib, hand, bf, lands, stack, gy, ex, opp.
   HUD numbers are illustrative game states; the mana arithmetic follows the cards' rules text. */
const MANA_HUD = [['mana', 'mana'], ['drawn', 'cards drawn']];

const SCENES = [
{
  id: 'tron-map', group: 'Mana', title: 'Turn-three Tron with Expedition Map', src: ['pb'],
  pieces: ["Expedition Map", "Urza's Mine", "Urza's Tower", "Urza's Power Plant"],
  sub: 'Two pieces and a Map become seven mana on turn three.',
  req: ['Two different Tron pieces in hand', 'Expedition Map', 'No colour needed: the Prism pays for blue'],
  res: ['Tron online on turn 3', 'Turn 3: Prism plus a full Mulldrifter, three new cards'],
  find: 'Expedition Map (3 copies) or Crop Rotation (2). Impulse, Giant\'s Boulder and Conduit Pylons dig or filter for the missing piece.',
  hud: [['turn', 'turn'], ['mana', 'mana available'], ['drawn', 'cards drawn']],
  cards: { mine: "Urza's Mine", tower: "Urza's Tower", pp: "Urza's Power Plant", map: 'Expedition Map', prism: 'Prophetic Prism', drift: 'Mulldrifter', imp: 'Impulse', x1: 'Ghostly Flicker', x2: 'Mnemonic Wall', x3: "Moment's Peace" },
  start: { hand: ['mine', 'tower', 'map', 'prism', 'drift', 'imp'], lib: ['pp', 'x1', 'x2', 'x3'] },
  hud0: { turn: '0', mana: 0, drawn: 0 },
  steps: [
    { k: 'setup', c: 'Opening hand: Urza\'s Mine, Urza\'s Tower and Expedition Map. Two pieces plus a way to find the third is a keep.' },
    { c: 'Turn 1: play Urza\'s Mine and use it to cast Expedition Map.', mv: [['mine', 'lands'], ['map', 'bf']], tap: ['mine'], hud: { turn: '1', mana: 0 }, hot: ['map'] },
    { c: 'Turn 2: play Urza\'s Tower. Without the third piece, each land taps for just one colourless.', untap: ['mine'], mv: [['tower', 'lands']], hud: { turn: '2', mana: 2 }, bd: { mine: '+1', tower: '+1' } },
    { c: 'Pay {2}, tap and sacrifice the Map: search for Urza\'s Power Plant and put it into your hand.', tap: ['mine', 'tower'], mv: [['map', 'gy'], ['pp', 'hand']], hud: { mana: 0 }, hot: ['pp'] },
    { c: 'Turn 3: play Urza\'s Power Plant. Tron is online: Mine 2 + Power Plant 2 + Tower 3 = 7 mana.', untap: ['mine', 'tower'], mv: [['pp', 'lands']], hud: { turn: '3', mana: 7 }, hot: ['mine', 'tower', 'pp'], bd: { mine: '+2', pp: '+2', tower: '+3' } },
    { c: 'Cast Prophetic Prism with the Mine and draw a card.', tap: ['mine'], mv: [['prism', 'bf'], ['x1', 'hand']], hud: { mana: 5, drawn: 1 }, hot: ['prism'] },
    { k: 'final', c: 'Cast Mulldrifter for {4}{U}: pay {1} into the Prism for the blue. It draws two. Turn 3 ends with a flyer and three new cards.', tap: ['tower', 'pp', 'prism'], mv: [['drift', 'bf'], ['x2', 'hand'], ['x3', 'hand']], hud: { mana: 0, drawn: 3 }, hot: ['drift'] }
  ]
},
{
  id: 'crop-dodge', group: 'Mana', title: 'Crop Rotation against land destruction', src: ['pb'],
  pieces: ['Crop Rotation', "Urza's Tower", 'Cleansing Wildfire'],
  sub: 'Sacrifice the targeted land, fetch a fresh one.',
  req: ['Crop Rotation and {G} open', 'An opponent targeting an Urza land'],
  res: ['Their spell has no target and does nothing', 'Tron stays intact, and the new land enters untapped'],
  find: 'Mystical Teachings can fetch Crop Rotation at instant speed. Forest, Tangled Islet and every filter make {G}.',
  hud: [['mana', 'mana available']],
  cards: { mine: "Urza's Mine", pp: "Urza's Power Plant", tower: "Urza's Tower", forest: 'Forest', crop: 'Crop Rotation', wall: 'Mnemonic Wall', tower2: "Urza's Tower", cw: 'Cleansing Wildfire' },
  opp: ['cw'],
  start: { lands: ['mine', 'pp', 'tower', 'forest'], hand: ['crop', 'wall'], lib: ['tower2'] },
  hud0: { mana: 8 },
  steps: [
    { k: 'setup', c: 'Tron is online. The opponent is on a red deck with land destruction.' },
    { c: 'They cast Cleansing Wildfire targeting your Urza\'s Tower.', mv: [['cw', 'stack']], hot: ['cw'], bd: { tower: 'Target' }, opp: 'Casts Cleansing Wildfire' },
    { c: 'In response, cast Crop Rotation with {G} from the Forest, sacrificing the targeted Tower as the additional cost.', tap: ['forest'], mv: [['tower', 'gy'], ['crop', 'stack']], hud: { mana: 2 }, hot: ['crop'] },
    { c: 'Crop Rotation resolves: search for another Urza\'s Tower and put it onto the battlefield, untapped.', mv: [['crop', 'gy'], ['tower2', 'lands']], hud: { mana: 7 }, hot: ['tower2'], bd: { tower2: '+3' } },
    { k: 'final', c: 'Cleansing Wildfire has no legal target left, so it does nothing: no land destroyed, no basic for them, no card drawn.', mv: [['cw', 'opp']], bd: { cw: 'No target' }, opp: 'Wildfire does nothing' }
  ]
},
{
  id: 'prism-loop', group: 'Engine', title: 'Flicker loop: Wall + Prophetic Prism', src: ['pb'],
  pieces: ['Ghostly Flicker', 'Mnemonic Wall', 'Prophetic Prism'],
  sub: 'Three mana: draw a card, keep the Flicker.',
  req: ['Mnemonic Wall and Prophetic Prism in play', 'Ghostly Flicker and {2}{U}'],
  res: ['Draw a card every turn', 'Ghostly Flicker returns to hand every time'],
  find: 'Mystical Teachings finds Ghostly Flicker. Pulse of Murasa or Call Damage Control rebuys a dead Wall.',
  hud: MANA_HUD,
  cards: { wall: 'Mnemonic Wall', prism: 'Prophetic Prism', gf: 'Ghostly Flicker', mine: "Urza's Mine", pp: "Urza's Power Plant", tower: "Urza's Tower", isl: 'Island', d1: 'Impulse', d2: 'Mulldrifter' },
  start: { bf: ['wall', 'prism'], lands: ['mine', 'pp', 'tower', 'isl'], hand: ['gf'], lib: ['d1', 'd2'] },
  hud0: { mana: 8, drawn: 0 },
  steps: [
    { k: 'setup', c: 'Mnemonic Wall and Prophetic Prism in play, Ghostly Flicker in hand, Tron and an Island untapped.' },
    { c: 'Cast Ghostly Flicker targeting the Wall and the Prism: {U} from the Island, {2} from the Tower.', tap: ['isl', 'tower'], mv: [['gf', 'stack']], hud: { mana: 5 }, hot: ['wall', 'prism'] },
    { c: 'Both are exiled…', mv: [['wall', 'ex'], ['prism', 'ex']] },
    { c: '…and return to the battlefield as new objects. Ghostly Flicker goes to the graveyard.', mv: [['wall', 'bf'], ['prism', 'bf'], ['gf', 'gy']] },
    { c: 'Two enter triggers: the Prism draws a card, the Wall returns Ghostly Flicker to your hand.', mv: [['d1', 'hand'], ['gf', 'hand']], hud: { drawn: 1 }, hot: ['gf'], bd: { prism: 'Draw', wall: 'Return' } },
    { k: 'final', c: 'Three mana for a card, and the Flicker is back. It\'s an instant, so run it at the end of the opponent\'s turn.' }
  ]
},
{
  id: 'double-wall', group: 'Engine', title: 'Two Walls: Flicker plus one more spell', src: ['pb'],
  pieces: ['Ghostly Flicker', 'Mnemonic Wall', "Moment's Peace"],
  sub: 'Every Flicker returns itself and any other instant or sorcery.',
  req: ['Two Mnemonic Walls in play', 'Ghostly Flicker', 'A spell worth recasting in the graveyard'],
  res: ['Flicker plus one more spell every time', 'Flicker + Moment\'s Peace: a fog every turn for 5 mana'],
  find: 'Mystical Teachings for the Flicker; Pulse of Murasa or Call Damage Control for a second Wall.',
  hud: [['mana', 'mana available']],
  cards: { w1: 'Mnemonic Wall', w2: 'Mnemonic Wall', gf: 'Ghostly Flicker', mp: "Moment's Peace", imp: 'Impulse', mine: "Urza's Mine", pp: "Urza's Power Plant", tower: "Urza's Tower", isl: 'Island', forest: 'Forest' },
  start: { bf: ['w1', 'w2'], lands: ['mine', 'pp', 'tower', 'isl', 'forest'], hand: ['gf'], gy: ['imp', 'mp'] },
  hud0: { mana: 9 },
  steps: [
    { k: 'setup', c: 'Two Mnemonic Walls in play. Impulse and Moment\'s Peace in the graveyard, Ghostly Flicker in hand.' },
    { c: 'Cast Ghostly Flicker targeting both Walls.', tap: ['isl', 'tower'], mv: [['gf', 'stack']], hud: { mana: 6 }, hot: ['w1', 'w2'] },
    { c: 'Both Walls are exiled…', mv: [['w1', 'ex'], ['w2', 'ex']] },
    { c: '…and come back. Ghostly Flicker goes to the graveyard before their triggers go on the stack.', mv: [['w1', 'bf'], ['w2', 'bf'], ['gf', 'gy']] },
    { c: 'Two Wall triggers: one returns Ghostly Flicker, the other returns Moment\'s Peace.', mv: [['gf', 'hand'], ['mp', 'hand']], hot: ['gf', 'mp'], bd: { w1: 'Return', w2: 'Return' } },
    { k: 'final', c: 'When they attack, cast Moment\'s Peace: no combat damage this turn, and it still has flashback. Next turn, do it all again.', tap: ['forest', 'mine'], mv: [['mp', 'gy']], hud: { mana: 4 }, bd: { mp: 'Fog' }, opp: 'Combat damage prevented' }
  ]
},
{
  id: 'drifter', group: 'Engine', title: 'Evoke Mulldrifter + Ephemerate', src: ['derived'],
  pieces: ['Mulldrifter', 'Ephemerate', 'Prophetic Prism'],
  sub: 'Five mana: six cards and a 2/2 flyer.',
  req: ['Mulldrifter and Ephemerate', '{2}{U} + {W}: the Prism makes the white'],
  res: ['Draw 2 + 2 now, 2 more on rebound', 'Mulldrifter stays: the evoke sacrifice can\'t find the blinked one'],
  find: 'Mystical Teachings fetches Ephemerate. Any filter (Prism, Refractor, Boulder, Ornament, Pylons) makes {W}.',
  hud: MANA_HUD,
  cards: { drift: 'Mulldrifter', eph: 'Ephemerate', prism: 'Prophetic Prism', mine: "Urza's Mine", pp: "Urza's Power Plant", tower: "Urza's Tower", isl: 'Island', d1: 'Impulse', d2: 'Mnemonic Wall', d3: 'Ghostly Flicker', d4: 'Prohibit', d5: 'Murmuring Mystic', d6: "Moment's Peace" },
  start: { bf: ['prism'], lands: ['mine', 'pp', 'tower', 'isl'], hand: ['drift', 'eph'], lib: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'] },
  hud0: { mana: 8, drawn: 0 },
  steps: [
    { k: 'setup', c: 'Mulldrifter and Ephemerate in hand, Prophetic Prism in play.' },
    { c: 'Cast Mulldrifter for its evoke cost, {2}{U}.', tap: ['isl', 'mine'], mv: [['drift', 'stack']], hud: { mana: 5 } },
    { c: 'It enters and two triggers go on the stack: draw two, and sacrifice it (evoke).', mv: [['drift', 'bf']], bd: { drift: 'Draw 2 · Sacrifice' } },
    { c: 'Holding priority, cast Ephemerate on it. Pay {1} into the Prism for the {W}.', tap: ['prism', 'pp'], mv: [['eph', 'stack']], hud: { mana: 3 }, hot: ['drift'] },
    { c: 'Ephemerate resolves: Mulldrifter is exiled, and Ephemerate goes to exile with rebound…', mv: [['drift', 'ex'], ['eph', 'ex']] },
    { c: '…and Mulldrifter returns as a new object. Its new enter trigger draws two more. The old sacrifice trigger can\'t find it.', mv: [['drift', 'bf']], hot: ['drift'], bd: { drift: 'Draw 2', eph: 'Rebound' } },
    { c: 'Both draw triggers resolve: four cards, and Mulldrifter stays.', mv: [['d1', 'hand'], ['d2', 'hand'], ['d3', 'hand'], ['d4', 'hand']], hud: { drawn: 4 } },
    { k: 'final', c: 'Next upkeep, cast Ephemerate from exile for free. Mulldrifter blinks again and draws two: six cards for five mana.', mv: [['eph', 'gy'], ['d5', 'hand'], ['d6', 'hand']], hud: { drawn: 6 }, hot: ['drift'], bd: { drift: 'Draw 2' } }
  ]
},
{
  id: 'stonehorn', group: 'Lock & win', title: 'Stonehorn lock', src: ['pb', 'derived'],
  pieces: ['Stonehorn Dignitary', 'Mnemonic Wall', 'Ghostly Flicker'],
  sub: 'Three mana a turn and they never attack again.',
  req: ['Stonehorn Dignitary and Mnemonic Wall in play', 'Ghostly Flicker and {2}{U} every turn'],
  res: ['The opponent skips every combat phase', 'Ephemerate on Stonehorn covers two turns on its own (cast + rebound)', 'Doesn\'t stop burn or instants; exile removal on Stonehorn or the Wall breaks it'],
  find: 'Stonehorn is a main-deck 1-of. Pulse of Murasa or Call Damage Control returns it; Mystical Teachings finds the Flicker.',
  hud: [['turn', 'turn'], ['mana', 'mana available'], ['skip', 'combats skipped']],
  cards: { stone: 'Stonehorn Dignitary', wall: 'Mnemonic Wall', gf: 'Ghostly Flicker', mine: "Urza's Mine", pp: "Urza's Power Plant", tower: "Urza's Tower", isl: 'Island' },
  start: { bf: ['stone', 'wall'], lands: ['mine', 'pp', 'tower', 'isl'], hand: ['gf'] },
  hud0: { turn: '5', mana: 8, skip: 0 },
  steps: [
    { k: 'setup', c: 'Stonehorn Dignitary and Mnemonic Wall in play, Ghostly Flicker in hand.' },
    { c: 'On your turn, cast Ghostly Flicker on Stonehorn and the Wall.', tap: ['isl', 'tower'], mv: [['gf', 'stack']], hud: { mana: 5 }, hot: ['stone', 'wall'] },
    { c: 'Both are exiled…', mv: [['stone', 'ex'], ['wall', 'ex']] },
    { c: '…and return. Flicker goes to the graveyard.', mv: [['stone', 'bf'], ['wall', 'bf'], ['gf', 'gy']] },
    { c: 'Stonehorn: the opponent skips their next combat phase. Wall: Ghostly Flicker back to your hand.', mv: [['gf', 'hand']], hud: { skip: 1 }, hot: ['gf'], bd: { stone: 'Skip combat', wall: 'Return' }, opp: 'Skips next combat' },
    { c: 'Their turn has no combat phase. You untap with Ghostly Flicker in hand again.', untap: ['isl', 'tower'], hud: { turn: '6', mana: 8 }, opp: 'No combat this turn' },
    { k: 'loop', c: 'Repeat every turn for three mana. The rest goes to Mulldrifter, Impulse and counters while Mystic\'s Birds or Rolling Thunder close the game.', hud: { skip: 'every' }, opp: 'Never attacks again' }
  ]
},
{
  id: 'infinite', group: 'Lock & win', title: 'The infinite', src: ['owner'],
  pieces: ['Weather the Storm', 'Unwind', 'Mnemonic Wall', 'Energy Refractor'],
  sub: 'Unlimited mana, storm, life and Birds; Rolling Thunder for any amount.',
  req: ['Urza\'s Mine, Power Plant and three Urza\'s Towers', 'Two Mnemonic Walls and Energy Refractor in play', 'Weather the Storm, Unwind and Ghostly Flicker', 'Storm count 5 before Weather the Storm'],
  res: ['Arbitrarily large mana, storm and life', 'A Bird per spell with Murmuring Mystic out', 'Any amount of damage with Rolling Thunder in hand'],
  find: 'Mystical Teachings finds Weather, Unwind or Ghostly Flicker (all instants), and the Walls rebuy whichever is in the graveyard. Expedition Map and Crop Rotation get the extra Towers.',
  hud: [['mana', 'mana pool'], ['storm', 'storm'], ['copies', 'Weather copies'], ['birds', 'Birds'], ['life', 'life'], ['dmg', 'damage']],
  cards: { mine: "Urza's Mine", pp: "Urza's Power Plant", t1: "Urza's Tower", t2: "Urza's Tower", t3: "Urza's Tower", ref: 'Energy Refractor', w1: 'Mnemonic Wall', w2: 'Mnemonic Wall', myst: 'Murmuring Mystic', wts: 'Weather the Storm', unw: 'Unwind', gf: 'Ghostly Flicker', rt: 'Rolling Thunder', b1: 'Bird Illusion token', b2: 'Bird Illusion token', b3: 'Bird Illusion token', b4: 'Bird Illusion token' },
  start: { lands: ['mine', 'pp', 't1', 't2', 't3'], bf: ['ref', 'w1', 'w2', 'myst'], hand: ['wts', 'unw', 'gf', 'rt'] },
  hud0: { mana: 0, storm: 5, copies: 0, birds: 0, life: 20, dmg: 0 },
  steps: [
    { k: 'setup', c: 'Tron with three Towers, two Mnemonic Walls, Energy Refractor and Murmuring Mystic in play. Five spells already cast this turn: storm count 5.' },
    { c: 'Tap all five Urza lands: 2 + 2 + 3 + 3 + 3 = 13 mana in the pool. Refractor turns any {2} into one coloured mana.', tap: ['mine', 'pp', 't1', 't2', 't3'], hud: { mana: 13 }, bd: { mine: '+2', pp: '+2', t1: '+3', t2: '+3', t3: '+3' } },
    { c: 'Cast Weather the Storm: {1}, plus {2} into Refractor for the {G}. Storm copies it five times. Mystic makes a Bird.', mv: [['wts', 'stack'], ['b1', 'bf']], hud: { mana: 10, storm: 6, copies: 5, birds: 1 }, hot: ['wts'], bd: { wts: '+5 copies' } },
    { c: 'Cast Unwind ({2}, plus {2} for the {U}) targeting one of the copies. Another Bird.', mv: [['unw', 'stack'], ['b2', 'bf']], hud: { mana: 6, storm: 7, birds: 2 }, hot: ['unw'], bd: { wts: 'Copy targeted' } },
    { c: 'Unwind counters the copy and untaps the three Towers. Tap them again: +9.', mv: [['unw', 'gy']], hud: { mana: 15, copies: 4 }, hot: ['t1', 't2', 't3'], bd: { t1: '+3', t2: '+3', t3: '+3' } },
    { c: 'Cast Ghostly Flicker ({2} + {2}) on both Walls. Bird number three.', mv: [['gf', 'stack'], ['b3', 'bf']], hud: { mana: 11, storm: 8, birds: 3 }, hot: ['w1', 'w2'] },
    { c: 'The Walls blink…', mv: [['w1', 'ex'], ['w2', 'ex']] },
    { c: '…and return. Ghostly Flicker hits the graveyard first.', mv: [['w1', 'bf'], ['w2', 'bf'], ['gf', 'gy']] },
    { c: 'Wall triggers return Ghostly Flicker and Unwind to your hand.', mv: [['gf', 'hand'], ['unw', 'hand']], hot: ['gf', 'unw'], bd: { w1: 'Return', w2: 'Return' } },
    { c: 'Unwind on another copy: pay 4, untap and re-tap the Towers for 9.', mv: [['unw', 'gy'], ['b4', 'bf']], hud: { mana: 16, storm: 9, copies: 3, birds: 4 }, hot: ['t1', 't2', 't3'], bd: { t1: '+3', t2: '+3', t3: '+3' } },
    { k: 'loop', c: 'That\'s the loop. Each Flicker → Unwind pair costs 8 and makes 9: +1 mana, +2 storm, +2 Birds, and one copy used up. Two more pairs:', hud: { mana: 18, storm: 13, copies: 1, birds: 8 }, bd: { b4: '×8' } },
    { c: 'Low on copies? Flicker again, then point Unwind at the original Weather the Storm. It goes to the graveyard; the copies already made stay on the stack.', mv: [['wts', 'gy']], hud: { mana: 19, storm: 15, birds: 10 }, hot: ['wts'], bd: { b4: '×10' } },
    { c: 'Flicker the Walls: back come Ghostly Flicker and Weather the Storm. Recast Weather with storm count 16: sixteen new copies.', mv: [['wts', 'stack']], hud: { mana: 12, storm: 17, copies: 17, birds: 12 }, hot: ['wts'], bd: { wts: '+16 copies', b4: '×12' } },
    { k: 'loop', c: 'Repeat as long as you like. Each refill costs 7 and brings back more copies than the last. Mana, storm and Birds go as high as you want.', hud: { mana: '∞', storm: '∞', copies: '∞', birds: '∞' }, bd: { b4: '×∞' } },
    { k: 'final', c: 'Let the copies you didn\'t counter resolve: 3 life each. Then cast Rolling Thunder with X as big as you like ({R}{R} through the Refractor) and split the damage however you want.', mv: [['rt', 'stack']], hud: { life: '∞', dmg: '∞' }, hot: ['rt'], bd: { rt: 'X = ∞' } }
  ]
}
];
